import { describe, it, expect } from 'vitest';
import { ImportService } from '../src/services/importService';
import { RoutingService } from '../src/services/routingService';
import { AnalysisService } from '../src/services/analysisService';
import { ExportService } from '../src/services/exportService';
import { DeliveryEnvelope, StoredRecord } from '../src/types';

import initialBatchData from '../data/01_initial.json';
import updateBatchData from '../data/02_update.json';

describe('DATA_CONTRACT: Ingestion, Identity, Revision & Override Verification', () => {
  it('1. Identity: Records are strictly identified by (source_type, source_id)', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const result = ImportService.processEnvelope(initialBatch, {}, {});

    expect(result.success).toBe(true);
    const records = Object.values(result.updatedRecords);
    expect(records.length).toBe(44);

    // Verify exactly 30 calls and 14 meetings
    const calls = records.filter(r => r.source_type === 'call');
    const meetings = records.filter(r => r.source_type === 'meeting');
    expect(calls.length).toBe(30);
    expect(meetings.length).toBe(14);

    // Ensure all keys follow source_type__source_id
    Object.keys(result.updatedRecords).forEach(key => {
      expect(key).toMatch(/^(call|meeting)__[0-9a-f-]+$/);
    });
  });

  it('2. Initial Batch Coverage: Exactly 17 usable conversation texts in batch 01', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const result = ImportService.processEnvelope(initialBatch, {}, {});

    const metrics = AnalysisService.computeMetrics(Object.values(result.updatedRecords));
    expect(metrics.totalRecords).toBe(44);
    expect(metrics.usableTranscriptsCount).toBe(17);
    expect(metrics.transcriptCoveragePercent).toBe(38.6);

    // M07 in batch 01 must have 0 turns
    const m07 = result.updatedRecords['meeting__4f304fff-fd40-5cfc-a366-0a134c445c2a'];
    expect(m07).toBeDefined();
    expect(m07.usable_transcript).toBe(false);
    expect(m07.applied_revision).toBe(1);
    expect(m07.transcript_payload?.turns.length).toBe(0);
  });

  it('3. Duplicate Deliveries: Re-importing batch 01 does not inflate counts', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const firstRun = ImportService.processEnvelope(initialBatch, {}, {});
    expect(Object.keys(firstRun.updatedRecords).length).toBe(44);

    // Import the exact same batch again
    const secondRun = ImportService.processEnvelope(initialBatch, firstRun.updatedRecords, {});
    expect(secondRun.success).toBe(true);
    expect(Object.keys(secondRun.updatedRecords).length).toBe(44);
    expect(secondRun.auditEntry?.records_added).toBe(0);
    expect(secondRun.auditEntry?.duplicates_ignored).toBe(44);
  });

  it('4. Shuffled Order: Re-importing batch 01 with shuffled records preserves exactly 44 records', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const firstRun = ImportService.processEnvelope(initialBatch, {}, {});

    // Shuffle records array
    const shuffledRecords = [...initialBatch.records].reverse();
    const shuffledEnvelope: DeliveryEnvelope = {
      ...initialBatch,
      records: shuffledRecords
    };

    const shuffledRun = ImportService.processEnvelope(shuffledEnvelope, firstRun.updatedRecords, {});
    expect(Object.keys(shuffledRun.updatedRecords).length).toBe(44);
    expect(shuffledRun.auditEntry?.duplicates_ignored).toBe(44);
  });

  it('5. Manual Override & Update Batch Replay: M07 override survives update to revision 2', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const updateBatch = updateBatchData as DeliveryEnvelope;

    // Step A: Import initial
    const step1 = ImportService.processEnvelope(initialBatch, {}, {});
    const m07Key = 'meeting__4f304fff-fd40-5cfc-a366-0a134c445c2a';

    // Step B: Set manual override on M07 before update arrives
    const manualOverrides = {
      [m07Key]: {
        source_type: 'meeting',
        source_id: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
        manualOverrideRoutes: ['Product / Technical Requirement'] as any[],
        manualCorrectionNote: 'Manual triage route selected by manager before update batch arrives.',
        reviewStatus: 'reviewed' as const,
        updated_at: new Date().toISOString()
      }
    };

    // Apply override to step1 records
    const m07Rec = step1.updatedRecords[m07Key];
    step1.updatedRecords[m07Key] = {
      ...m07Rec,
      routing: RoutingService.computeRouteDecision(
        m07Rec.routing.suggestedRoutes,
        m07Rec.routing.suggestedExplanation,
        m07Rec.routing.suggestedEvidence,
        m07Rec.routing.suggestedNextAction,
        manualOverrides[m07Key]
      )
    };

    // Step C: Apply 02_update.json
    const step2 = ImportService.processEnvelope(updateBatch, step1.updatedRecords, manualOverrides);

    // Checks:
    // Total records stays 44 (NOT 45!)
    expect(Object.keys(step2.updatedRecords).length).toBe(44);
    // Usable transcripts increases from 17 to 18
    const updatedMetrics = AnalysisService.computeMetrics(Object.values(step2.updatedRecords));
    expect(updatedMetrics.usableTranscriptsCount).toBe(18);

    // M07 is updated to revision 2 with 27 turns
    const m07Updated = step2.updatedRecords[m07Key];
    expect(m07Updated.applied_revision).toBe(2);
    expect(m07Updated.usable_transcript).toBe(true);
    expect(m07Updated.transcript_payload?.turns.length).toBe(27);

    // M07 manual override remains strictly in effect!
    expect(m07Updated.routing.isManualOverride).toBe(true);
    expect(m07Updated.routing.effectiveRoutes).toEqual(['Product / Technical Requirement']);
    expect(m07Updated.routing.manualCorrectionNote).toContain('Manual triage route selected by manager');
  });

  it('6. Revision Monotonicity: Revision 1 arriving after Revision 2 is ignored', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const updateBatch = updateBatchData as DeliveryEnvelope;

    // Load initial then update
    const step1 = ImportService.processEnvelope(initialBatch, {}, {});
    const step2 = ImportService.processEnvelope(updateBatch, step1.updatedRecords, {});

    const m07Key = 'meeting__4f304fff-fd40-5cfc-a366-0a134c445c2a';
    expect(step2.updatedRecords[m07Key].applied_revision).toBe(2);

    // Now re-import initial batch (rev 1) again
    const step3 = ImportService.processEnvelope(initialBatch, step2.updatedRecords, {});
    expect(step3.success).toBe(true);

    // M07 must NOT be downgraded to rev 1
    const m07AfterReplay = step3.updatedRecords[m07Key];
    expect(m07AfterReplay.applied_revision).toBe(2);
    expect(m07AfterReplay.transcript_payload?.turns.length).toBe(27);
    expect(m07AfterReplay.usable_transcript).toBe(true);
  });

  it('7. Export Manifest Integrity: All manifest output paths are valid and relative', () => {
    const initialBatch = initialBatchData as DeliveryEnvelope;
    const updateBatch = updateBatchData as DeliveryEnvelope;
    const state = ImportService.processEnvelope(updateBatch, ImportService.processEnvelope(initialBatch, {}, {}).updatedRecords, {});

    const records = Object.values(state.updatedRecords);
    const manifest = ExportService.generateManifest(records);

    expect(manifest.total_unique_records).toBe(44);
    expect(manifest.usable_transcripts_count).toBe(18);
    expect(manifest.records.length).toBe(44);

    manifest.records.forEach(item => {
      expect(item.output_paths.length).toBeGreaterThanOrEqual(3); // at least 1 route + transcript + metadata
      item.output_paths.forEach(p => {
        expect(p).not.toMatch(/^(\/|[a-zA-Z]:)/); // must be relative, not absolute
        expect(p).toMatch(/\.(md|txt|json)$/);
      });
    });

    const csv = ExportService.manifestToCsv(manifest);
    expect(csv).toContain('source_type,source_id,record_ref,applied_revision');
    expect(csv.split('\n').length).toBe(45); // 1 header + 44 rows
  });
});
