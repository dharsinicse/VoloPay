import JSZip from 'jszip';
import { StoredRecord, ExportManifest, ExportManifestItem, ImportAuditEntry } from '../types';

export class ExportService {
  /**
   * Map routing taxonomy category to export folder name
   */
  static getRouteFolderName(route: string): string {
    switch (route) {
      case 'Sales Coaching': return 'sales_coaching';
      case 'Deal / Opportunity Follow-up': return 'deal_followups';
      case 'Customer Follow-up': return 'customer_followups';
      case 'Internal / Vendor Coordination': return 'internal_vendor';
      case 'Product / Technical Requirement': return 'technical_requirements';
      case 'Relationship / Partnership': return 'relationship_partnership';
      case 'No Action / Low Priority': return 'no_action';
      case 'Human Review Required': return 'human_review';
      default: return 'other_routes';
    }
  }

  /**
   * Generate markdown file content for a record assigned to a specific route
   */
  static generateRouteMarkdown(record: StoredRecord, route: string): string {
    const p = record.payload as any;
    const a = record.analysis;
    const r = record.routing;

    const titleOrTarget = record.source_type === 'call'
      ? `Call with ${p.to_number || 'Unknown'} (Rep: ${p.rep_name || 'Unassigned'})`
      : `${p.title} (Organizer: ${p.organizer_email || 'Unassigned'})`;

    let md = `# Revenue Intelligence Record: ${record.record_ref}\n\n`;
    md += `**Route Category:** ${route}\n`;
    md += `**Record Title:** ${titleOrTarget}\n`;
    md += `**Source Type:** ${record.source_type}\n`;
    md += `**Source ID:** \`${record.source_id}\`\n`;
    md += `**Applied Revision:** Revision ${record.applied_revision}\n`;
    md += `**Review State:** ${r.reviewStatus.toUpperCase()}\n`;
    md += `**Manual Route Override:** ${r.isManualOverride ? 'YES (Human Verified)' : 'NO (Automated Suggestion)'}\n`;
    if (r.manualCorrectionNote) {
      md += `**Manager Correction Note:** ${r.manualCorrectionNote}\n`;
    }
    md += `**Analysis Freshness:** ${a.isStaleOrPendingReview ? 'STALE / PENDING REVIEW' : `CURRENT (Grounded on Rev ${a.freshnessRevision})`}\n`;
    md += `**Activity Date & Time:** ${record.local_date_kolkata} ${record.local_time_kolkata} Asia/Kolkata\n\n`;

    md += `## 1. Summary\n${a.summary}\n\n`;
    md += `## 2. Why It Matters\n${a.whyItMatters}\n\n`;

    if (a.keyPoints && a.keyPoints.length > 0) {
      md += `## 3. Key Observations\n`;
      a.keyPoints.forEach(pt => md += `- ${pt}\n`);
      md += `\n`;
    }

    if (a.objectionsOrRisks && a.objectionsOrRisks.length > 0) {
      md += `## 4. Risks & Objections\n`;
      a.objectionsOrRisks.forEach(risk => md += `- ⚠️ ${risk}\n`);
      md += `\n`;
    }

    if (a.opportunities && a.opportunities.length > 0) {
      md += `## 5. Commercial Opportunities\n`;
      a.opportunities.forEach(opp => md += `- 💡 ${opp}\n`);
      md += `\n`;
    }

    if (a.commitments && a.commitments.length > 0) {
      md += `## 6. Explicit Commitments\n`;
      a.commitments.forEach(c => md += `- 🤝 ${c}\n`);
      md += `\n`;
    }

    md += `## 7. Recommended Next Action\n`;
    md += `**Action:** ${a.recommendedAction || 'None required'}\n`;
    md += `**Owner:** ${a.actionOwner || 'Unassigned / Not established in source'}\n\n`;

    if (a.uncertainties && a.uncertainties.length > 0) {
      md += `## 8. Uncertainties & Missing Evidence\n`;
      a.uncertainties.forEach(u => md += `- ❓ ${u}\n`);
      md += `\n`;
    }

    if (a.evidencePassages && a.evidencePassages.length > 0) {
      md += `## 9. Supporting Evidence Passages\n`;
      a.evidencePassages.forEach(ep => {
        md += `> "${ep.quote}"\n`;
        md += `> — *Citation: ${ep.citation}${ep.speaker ? ` (${ep.speaker})` : ''}* | **Significance:** ${ep.significance}\n\n`;
      });
    }

    if (record.metadata_inconsistencies && record.metadata_inconsistencies.length > 0) {
      md += `## 10. Source Metadata Inconsistencies\n`;
      record.metadata_inconsistencies.forEach(inc => md += `- ⚠️ ${inc}\n`);
      md += `\n`;
    }

    return md;
  }

  /**
   * Generate raw transcript or turns text
   */
  static generateTranscriptFile(record: StoredRecord): string {
    const p = record.payload as any;
    const tp = record.transcript_payload;

    let out = `# Transcript Record: ${record.record_ref}\n`;
    out += `Source Type: ${record.source_type}\n`;
    out += `Source ID: ${record.source_id}\n`;
    out += `Date: ${record.local_date_kolkata} ${record.local_time_kolkata} Asia/Kolkata\n`;
    out += `Transcript Usable: ${record.usable_transcript}\n\n`;

    if (record.source_type === 'call') {
      if (p.transcript && p.transcript.trim().length > 0) {
        out += `## Call Transcript (Rep: ${p.rep_name || 'Unknown'}, Target: ${p.to_number || 'Unknown'})\n\n`;
        out += p.transcript;
      } else {
        out += `## Call Transcript Unavailable\n\n`;
        out += `Reason: Call transcript was not captured or was omitted from this extract.\n`;
        out += `Telephony outcome: ${p.observed_outcome || 'unknown'}, duration: ${p.duration_seconds}s.\n`;
      }
    } else {
      if (tp?.turns && tp.turns.length > 0) {
        out += `## Meeting Transcript: ${p.title} (${tp.turns.length} turns)\n\n`;
        tp.turns.forEach((turn: any, index: number) => {
          out += `**Turn ${index + 1} | ${turn.timecode || '00:00:00'} | ${turn.speaker}**\n\n`;
          out += `${turn.text}\n\n`;
        });
      } else {
        out += `## Meeting Transcript Unavailable\n\n`;
        out += `Reason: ${tp?.unavailable_reason || 'No transcript turns recorded'}\n`;
        out += `Recording Status: ${p.recording_status}, Has Transcript Flag: ${p.has_transcript}\n`;
      }
    }

    return out;
  }

  /**
   * Generate Manager Brief Markdown for 21 August 2026
   */
  static generateManagerBrief(records: StoredRecord[]): string {
    const totalRecords = records.length;
    const calls = records.filter(r => r.source_type === 'call');
    const meetings = records.filter(r => r.source_type === 'meeting');
    const withTx = records.filter(r => r.usable_transcript).length;

    let brief = `# SpendNest Manager Daily Intelligence Brief\n\n`;
    brief += `**Date:** 21 August 2026 | **Timezone:** Asia/Kolkata (UTC+05:30)\n`;
    brief += `**Dataset Scope:** Selected Assessment Sample (Not a full-team representative performance evaluation)\n`;
    brief += `**Total Records Processed:** ${totalRecords} (Calls: ${calls.length}, Meetings: ${meetings.length})\n`;
    brief += `**Usable Conversation Coverage:** ${withTx} of ${totalRecords} records (${Math.round((withTx / totalRecords) * 1000) / 10}%)\n\n`;

    brief += `## 1. Executive Summary & Key Highlights\n`;
    brief += `Across the 44 selected interactions on 21 August 2026, 18 records contained usable conversational text (10 calls, 8 meetings), while 26 records represent metadata-only intake (voicemails, silent recordings, or un-transcribed calls). Activity is concentrated across commercial partnership exploration, accounts payable/migration friction, and technical customer support.\n\n`;

    brief += `## 2. Three Primary Evidence-Backed Findings\n\n`;

    brief += `### Finding 1: Telephony Classification Discrepancies vs. Conversational Reality\n`;
    brief += `- **Observation:** Telephony system automated labels disagree with actual transcript contents in critical ways. In call \`C04\` (\`bcdcbf56-d338-5c78-9a97-42c2fc1c9931\`), the upstream telephony metadata recorded \`is_connected: false\` and \`is_conversation: false\`. However, inspection of the transcript reveals Arun left a detailed, substantive voicemail for Ritesh at Lanternpath Media clarifying that sales information had originally been dispatched to the wrong email address, had now been re-sent to the correct address, and requested a callback. Furthermore, in call \`C06\`, the metadata states \`rep_name: Meera\`, but the caller's spoken words explicitly begin: *"Good evening. Ravi here. I'll say at the start that this is a cold call."*\n`;
    brief += `- **Why It Matters:** Relying purely on raw database telephony tags results in missing substantive outbound customer communications and corrupts sales rep attribution metrics.\n`;
    brief += `- **Citation:** C04 quote: *"My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us..."* | C06 quote: *"Good evening. Ravi here. I'll say at the start that this is a cold call."*\n`;
    brief += `- **Action Influenced:** Built metadata discrepancy inspection badges into the inbox, surfaced caller identity conflicts in data quality, and prevented telephony connection flags from discarding valid voicemails.\n\n`;

    brief += `### Finding 2: Structural Revolving Credit Blocker at Asterloom Systems\n`;
    brief += `- **Observation:** In meeting \`M03\` (\`398672e7-62dd-5afd-846d-0237d49792fb\`), Asterloom Systems finance leadership (Customer A & B) surfaced a fundamental blocker: Asterloom requires a 30-day revolving credit line for working capital, whereas SpendNest's corporate card offering operates exclusively on pre-funded debit balances and cash collateral. In addition, severe price resistance emerged around transaction fee percentages and foreign exchange conversions. Customer B explicitly declined to schedule follow-up sales calls until an internal review with their CFO takes place.\n`;
    brief += `- **Why It Matters:** A major potential pipeline opportunity will be lost if treated as a standard sales deal. The blocker is structural product-market fit (credit vs debit).\n`;
    brief += `- **Citation:** M03 Turn 9: *"We cannot have funds tied up in a prepaid balance before transactions occur. Our cash flow requires a 30-day credit cycle, similar to standard corporate cards."* | M03 Turn 36: *"Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more."*\n`;
    brief += `- **Action Influenced:** Routed to Deal Follow-up and Product/Technical Requirement; flagged deal risk status; prevented AE from repeatedly calling the customer and instructed them to prepare a CFO underwriting brief instead.\n\n`;

    brief += `### Finding 3: Severe Production Platform Bugs at Willowfield Trust (M07)\n`;
    brief += `- **Observation:** In meeting \`M07\` (\`4f304fff-fd40-5cfc-a366-0a134c445c2a\`), supplied in the late update delivery, Customer A demonstrated four distinct software defects in live production: (1) payment description edits fail to save and revert to stale text; (2) file attachments cannot be uploaded via the Recreate Payment path; (3) reimbursement batches are stuck in 'Processing' and cannot be selected; and (4) 'Mark as paid' dialog leaks state, displaying the previous transaction's amount (INR 18,200) on subsequent records.\n`;
    brief += `- **Why It Matters:** Critical operational and financial error risk for a live client. Team member A promised an engineering update within 1–2 hours.\n`;
    brief += `- **Citation:** M07 Turn 19: *"The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two..."* | M07 Turn 22: *"The amount from the previous item appears in the next one [INR 18,200]. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information."*\n`;
    brief += `- **Action Influenced:** Demonstration case for human override and engineering escalation; assigned urgent priority in the follow-up queue with explicit 1–2 hour SLA.\n\n`;

    brief += `## 3. Deliberately Rejected Decision & Trade-Off\n`;
    brief += `- **Rejected Alternative:** Automatically classifying conversations into single commercial pipeline categories based on positive conversational keywords (e.g., words like "API", "corporate cards", or polite requests to "send a presentation").\n`;
    brief += `- **Reason Rejected:** In calls like C05, the prospect requested a presentation (*"What I suggest is that you send me your presentation"*) purely as a polite brush-off because their store operations are already fully automated with StoreHarbor. In C03, developer API was discussed, but the prospect emphasized it was not important enough to spend money on. Automatic keyword matching creates severe false pipeline inflation.\n`;
    brief += `- **Trade-off Accepted:** Multi-destination routing and explicit "Human Review Required" states were mandated. While this requires deliberate manager review, it preserves zero-tolerance for false pipeline metrics.\n\n`;

    brief += `## 4. Priority Coaching & Operational Follow-ups\n`;
    brief += `- **M01 (Harborpath Advisory):** Send formal partnership memorandum, unique referral URL, and commission tier schedule ($260 activation + $195-$390 spend bonus).\n`;
    brief += `- **M02 (LedgerBridge):** Strategy team to evaluate incoming e-invoicing country scoping template for AR roadmap.\n`;
    brief += `- **M04 (Cedarwave Distribution):** Multi-entity customer migration risk; deliver staging checklist.\n`;
    brief += `- **C09 (Vedant):** Coaching directive: outreach to business head Mr. Rishabh on LinkedIn must strictly NOT reference Vedant's name, respecting his explicit boundary.\n`;
    brief += `- **C10 (Aniket):** Coaching directive: prospect declined follow-up calls; send passive messaging brief and do not schedule outbound dial.\n`;

    return brief;
  }

  /**
   * Build complete manifest object
   */
  static generateManifest(records: StoredRecord[]): ExportManifest {
    const totalRecords = records.length;
    const calls = records.filter(r => r.source_type === 'call').length;
    const meetings = records.filter(r => r.source_type === 'meeting').length;
    const usableTranscripts = records.filter(r => r.usable_transcript).length;

    const items: ExportManifestItem[] = records.map(rec => {
      const paths: string[] = [];

      // Add route output paths
      rec.routing.effectiveRoutes.forEach(route => {
        const folder = this.getRouteFolderName(route);
        paths.push(`${folder}/${rec.record_ref}_${rec.source_id.substring(0, 8)}.md`);
      });

      // Add transcript path
      paths.push(`transcripts/${rec.record_ref}_transcript.txt`);

      // Add raw metadata path
      paths.push(`metadata/${rec.record_ref}_payload.json`);

      const freshness = rec.analysis.isStaleOrPendingReview
        ? 'Stale / Pending Review'
        : `Current (rev ${rec.analysis.freshnessRevision})`;

      return {
        source_type: rec.source_type,
        source_id: rec.source_id,
        record_ref: rec.record_ref,
        applied_revision: rec.applied_revision,
        suggested_routes: rec.routing.suggestedRoutes,
        effective_routes: rec.routing.effectiveRoutes,
        output_paths: paths,
        processing_state: rec.intake_status,
        review_state: rec.routing.reviewStatus,
        manual_override: rec.routing.isManualOverride,
        analysis_freshness: freshness,
        transcript_available: rec.usable_transcript
      };
    });

    return {
      export_id: `export_${Date.now()}`,
      generated_at: new Date().toISOString(),
      dataset_date: '2026-08-21',
      total_unique_records: totalRecords,
      calls_count: calls,
      meetings_count: meetings,
      usable_transcripts_count: usableTranscripts,
      records: items
    };
  }

  /**
   * Convert manifest to CSV format
   */
  static manifestToCsv(manifest: ExportManifest): string {
    const headers = [
      'source_type',
      'source_id',
      'record_ref',
      'applied_revision',
      'suggested_routes',
      'effective_routes',
      'output_paths',
      'processing_state',
      'review_state',
      'manual_override',
      'analysis_freshness',
      'transcript_available'
    ];

    const rows = manifest.records.map(r => {
      return [
        r.source_type,
        `"${r.source_id}"`,
        r.record_ref,
        r.applied_revision,
        `"${r.suggested_routes.join('; ')}"`,
        `"${r.effective_routes.join('; ')}"`,
        `"${r.output_paths.join('; ')}"`,
        `"${r.processing_state.replace(/"/g, '""')}"`,
        r.review_state,
        r.manual_override,
        `"${r.analysis_freshness}"`,
        r.transcript_available
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Build complete ZIP archive with all files and manifest
   */
  static async buildExportZip(records: StoredRecord[], audits: ImportAuditEntry[]): Promise<Blob> {
    const zip = new JSZip();

    // 1. Root README.txt
    const readme = `Revenue Intelligence Inbox Export Archive
Generated: ${new Date().toISOString()}
Local Activity Date: 2026-08-21 (Asia/Kolkata)
Total Records: ${records.length}
Usable Transcripts: ${records.filter(r => r.usable_transcript).length}

Directory Structure:
- manifest.json: Complete machine-readable assessment manifest
- manifest.csv: Tabular CSV representation of current manifest
- manager_brief/2026-08-21.md: Executive manager brief
- sales_coaching/: Records and coaching analysis
- deal_followups/: Opportunities and deal next steps
- customer_followups/: Customer support and onboarding follow-ups
- technical_requirements/: Technical and product requirements
- internal_vendor/: Vendor coordination and internal enablement
- relationship_partnership/: Strategic agency/partnership evaluations
- human_review/: Items requiring human review
- no_action/: Unqualified leads, voicemails, and low priority records
- transcripts/: Full transcripts and turn text
- metadata/: Raw source JSON payloads
- audit/: Complete import audit log history
`;
    zip.file('README.txt', readme);

    // 2. Manager Brief
    const briefMd = this.generateManagerBrief(records);
    zip.file('manager_brief/2026-08-21.md', briefMd);

    // 3. Populate route markdown files
    records.forEach(rec => {
      rec.routing.effectiveRoutes.forEach(route => {
        const folder = this.getRouteFolderName(route);
        const fileName = `${rec.record_ref}_${rec.source_id.substring(0, 8)}.md`;
        const content = this.generateRouteMarkdown(rec, route);
        zip.file(`${folder}/${fileName}`, content);
      });

      // 4. Populate transcripts
      const txContent = this.generateTranscriptFile(rec);
      zip.file(`transcripts/${rec.record_ref}_transcript.txt`, txContent);

      // 5. Populate metadata
      const metaContent = JSON.stringify({
        record_ref: rec.record_ref,
        source_type: rec.source_type,
        source_id: rec.source_id,
        applied_revision: rec.applied_revision,
        payload: rec.payload,
        transcript_payload: rec.transcript_payload
      }, null, 2);
      zip.file(`metadata/${rec.record_ref}_payload.json`, metaContent);
    });

    // 6. Audit logs
    zip.file('audit/import_audit_history.json', JSON.stringify(audits, null, 2));

    // 7. Generate Manifest
    const manifest = this.generateManifest(records);
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    zip.file('manifest.csv', this.manifestToCsv(manifest));

    return await zip.generateAsync({ type: 'blob' });
  }

  /**
   * Helper to trigger browser download of a blob
   */
  static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
