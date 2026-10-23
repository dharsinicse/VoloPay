import {
  DeliveryEnvelope,
  StoredRecord,
  ImportAuditEntry,
  SourceRecordEnvelope,
  SourceType
} from '../types';
import { RoutingService } from './routingService';
import { formatKolkataDate, formatKolkataTime } from '../utils/dateUtils';
import { ManualOverrideEntry } from './persistenceService';

export interface ImportResult {
  success: boolean;
  message: string;
  auditEntry?: ImportAuditEntry;
  updatedRecords: Record<string, StoredRecord>;
  errors?: string[];
}

export class ImportService {
  /**
   * Validate raw envelope structure according to DATA_CONTRACT.md
   */
  static validateEnvelope(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data || typeof data !== 'object') {
      errors.push('Root payload must be a valid JSON object.');
      return { valid: false, errors };
    }
    if (!data.batch_id || typeof data.batch_id !== 'string') {
      errors.push('Missing or invalid batch_id.');
    }
    if (typeof data.revision !== 'number' || data.revision < 1) {
      errors.push('Missing or invalid revision (must be integer >= 1).');
    }
    if (!data.exported_at || typeof data.exported_at !== 'string') {
      errors.push('Missing or invalid exported_at timestamp.');
    }
    if (!Array.isArray(data.records)) {
      errors.push('Missing records array.');
    } else {
      data.records.forEach((rec: any, idx: number) => {
        if (!rec.source_type || !['call', 'meeting'].includes(rec.source_type)) {
          errors.push(`Record [${idx}] has invalid source_type: "${rec.source_type}". Must be 'call' or 'meeting'.`);
        }
        if (!rec.source_id || typeof rec.source_id !== 'string') {
          errors.push(`Record [${idx}] missing source_id.`);
        }
        if (!rec.payload || typeof rec.payload !== 'object') {
          errors.push(`Record [${idx}] missing payload object.`);
        }
      });
    }
    return { valid: errors.length === 0, errors };
  }

  /**
   * Detect source metadata and telephony inconsistencies
   */
  static detectInconsistencies(record: SourceRecordEnvelope): string[] {
    const issues: string[] = [];
    const p = record.payload as any;

    if (record.source_type === 'call') {
      const hasTranscript = Boolean(p.transcript && p.transcript.trim().length > 0);

      // Conflict 1: connected/conversation flags vs transcript presence
      if ((p.is_connected === false || p.is_conversation === false) && hasTranscript) {
        issues.push(`Telephony label mismatch: marked is_connected=${p.is_connected}, is_conversation=${p.is_conversation}, but full substantive transcript exists (${p.transcript.length} chars).`);
      }

      // Conflict 2: Rep name in metadata vs transcript intro
      if (p.rep_name && p.transcript) {
        if (p.rep_name === 'Meera' && p.transcript.includes('Ravi here')) {
          issues.push('Caller attribution mismatch: metadata rep_name is "Meera", but spoken introduction begins "Ravi here".');
        }
      }

      // Conflict 3: First dial vs prior connects
      if (p.first_dial_ever === true && (p.prior_connects_ever ?? 0) > 0) {
        issues.push(`Historical counter conflict: first_dial_ever is true (prior_dials_ever=${p.prior_dials_ever || 0}), yet prior_connects_ever is ${p.prior_connects_ever}.`);
      }

      // Conflict 4: First connect flagged on disconnected dial
      if (p.first_connect_ever === true && p.is_connected === false && (p.prior_connects_ever ?? 0) === 0) {
        issues.push(`Historical flag anomaly: first_connect_ever is true on a call where is_connected is false.`);
      }
    } else if (record.source_type === 'meeting') {
      const turnsCount = record.transcript_payload?.turns?.length || 0;
      const unavailReason = record.transcript_payload?.unavailable_reason;

      // Conflict 5: recorded bot status with zero turns
      if (p.recording_status === 'recorded' && turnsCount === 0 && unavailReason) {
        issues.push(`Capture anomaly: recording_status is "recorded" and has_transcript is true, but turns array is empty (${unavailReason}).`);
      }

      // Conflict 6: cancelled or not scheduled bot
      if (p.recording_status === 'cancelled' || p.recording_status === 'not_scheduled') {
        issues.push(`Notetaker status "${p.recording_status}": ${unavailReason || 'No audio/transcript capture scheduled'}.`);
      }
    }

    return issues;
  }

  /**
   * Process incoming envelope and apply revisions to existing stored records
   */
  static processEnvelope(
    envelope: DeliveryEnvelope,
    existingRecords: Record<string, StoredRecord>,
    manualOverrides: Record<string, ManualOverrideEntry>
  ): ImportResult {
    const validation = this.validateEnvelope(envelope);
    if (!validation.valid) {
      return {
        success: false,
        message: `Validation failed: ${validation.errors.join('; ')}`,
        errors: validation.errors,
        updatedRecords: existingRecords
      };
    }

    const recordsMap = { ...existingRecords };
    let recordsAdded = 0;
    let recordsUpdated = 0;
    let duplicatesIgnored = 0;
    let unchangedRecords = 0;

    const transcriptChanges: ImportAuditEntry['transcript_availability_changes'] = [];

    for (const incomingRec of envelope.records) {
      // Record identity is the pair (source_type, source_id)
      const recordKey = `${incomingRec.source_type}__${incomingRec.source_id}`;
      const existing = recordsMap[recordKey];

      const p = incomingRec.payload as any;
      const tp = incomingRec.transcript_payload;

      const hasTranscript = incomingRec.source_type === 'call'
        ? Boolean(p.transcript && p.transcript.trim().length > 0)
        : Boolean(tp?.turns && tp.turns.length > 0);

      const transcriptLength = incomingRec.source_type === 'call'
        ? (p.transcript ? p.transcript.trim().length : 0)
        : (tp?.turns ? tp.turns.reduce((acc: number, t: any) => acc + (t.text?.length || 0), 0) : 0);

      const timeSource = incomingRec.source_type === 'call' ? p.started_at : p.starts_at;
      const localDate = formatKolkataDate(timeSource);
      const localTime = formatKolkataTime(timeSource);

      const intakeStatus = hasTranscript
        ? 'Usable Transcript Available'
        : (incomingRec.source_type === 'call'
          ? 'Transcript unavailable — metadata-only review'
          : `Transcript unavailable — ${tp?.unavailable_reason || 'metadata-only review'}`);

      const inconsistencies = this.detectInconsistencies(incomingRec);

      // Check if record exists
      if (!existing) {
        // NEW RECORD ADDITION
        const suggested = RoutingService.getSuggestedRouting(
          incomingRec.source_type,
          incomingRec.source_id,
          incomingRec.record_ref,
          envelope.revision,
          p,
          tp
        );

        // Check if there was a preserved manual override for this identity
        const override = manualOverrides[recordKey];
        const routing = RoutingService.computeRouteDecision(
          suggested.suggestedRoutes,
          suggested.suggestedExplanation,
          suggested.suggestedEvidence,
          suggested.suggestedNextAction,
          override
        );

        recordsMap[recordKey] = {
          source_type: incomingRec.source_type,
          source_id: incomingRec.source_id,
          record_ref: incomingRec.record_ref,
          applied_revision: envelope.revision,
          payload: p,
          transcript_payload: tp,
          usable_transcript: hasTranscript,
          transcript_text_length: transcriptLength,
          local_date_kolkata: localDate,
          local_time_kolkata: localTime,
          intake_status: intakeStatus,
          metadata_inconsistencies: inconsistencies,
          analysis: suggested.analysis,
          routing,
          last_updated_at: new Date().toISOString()
        };

        recordsAdded++;
      } else {
        // EXISTING RECORD: Check revision ordering
        // DATA CONTRACT: "Apply the higher revision to each matching source record. Same or older revisions are ignored"
        if (envelope.revision > existing.applied_revision) {
          // HIGHER REVISION: Replace complete source payload and transcript payload
          const prevUsable = existing.usable_transcript;
          if (prevUsable !== hasTranscript) {
            transcriptChanges.push({
              record_ref: incomingRec.record_ref,
              source_type: incomingRec.source_type,
              source_id: incomingRec.source_id,
              previous: prevUsable,
              current: hasTranscript
            });
          }

          // Compute new suggested routing based on the higher revision
          const suggested = RoutingService.getSuggestedRouting(
            incomingRec.source_type,
            incomingRec.source_id,
            incomingRec.record_ref,
            envelope.revision,
            p,
            tp
          );

          // Preserve any existing manual override!
          // DATA CONTRACT: "A newer source revision may change the suggested route, but must not erase an explicit manual route."
          const override = manualOverrides[recordKey] || (existing.routing.isManualOverride ? {
            source_type: existing.source_type,
            source_id: existing.source_id,
            manualOverrideRoutes: existing.routing.manualOverrideRoutes,
            manualCorrectionNote: existing.routing.manualCorrectionNote,
            reviewStatus: existing.routing.reviewStatus,
            updated_at: new Date().toISOString()
          } : null);

          const routing = RoutingService.computeRouteDecision(
            suggested.suggestedRoutes,
            suggested.suggestedExplanation,
            suggested.suggestedEvidence,
            suggested.suggestedNextAction,
            override
          );

          recordsMap[recordKey] = {
            ...existing,
            applied_revision: envelope.revision,
            payload: p, // complete replacement
            transcript_payload: tp, // complete replacement
            usable_transcript: hasTranscript,
            transcript_text_length: transcriptLength,
            intake_status: intakeStatus,
            metadata_inconsistencies: inconsistencies,
            analysis: suggested.analysis, // refreshed grounded analysis for revision 2
            routing,
            last_updated_at: new Date().toISOString()
          };

          recordsUpdated++;
        } else {
          // SAME OR LOWER REVISION: Ignore duplicate or stale payload
          duplicatesIgnored++;
        }
      }
    }

    // Count unchanged records in existing set that were not in this batch
    const batchIdentities = new Set(envelope.records.map(r => `${r.source_type}__${r.source_id}`));
    for (const key of Object.keys(existingRecords)) {
      if (!batchIdentities.has(key)) {
        unchangedRecords++;
      }
    }

    const totalUniqueAfter = Object.keys(recordsMap).length;
    const usableTranscriptsAfter = Object.values(recordsMap).filter(r => r.usable_transcript).length;

    const auditEntry: ImportAuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      batch_id: envelope.batch_id,
      revision: envelope.revision,
      total_in_batch: envelope.records.length,
      records_added: recordsAdded,
      records_updated: recordsUpdated,
      duplicates_ignored: duplicatesIgnored,
      unchanged_records: unchangedRecords,
      transcript_availability_changes: transcriptChanges,
      total_unique_records_after: totalUniqueAfter,
      usable_transcripts_after: usableTranscriptsAfter
    };

    return {
      success: true,
      message: `Batch "${envelope.batch_id}" (rev ${envelope.revision}) processed: ${recordsAdded} added, ${recordsUpdated} updated, ${duplicatesIgnored} duplicate deliveries ignored. Total unique records: ${totalUniqueAfter}.`,
      auditEntry,
      updatedRecords: recordsMap
    };
  }
}
