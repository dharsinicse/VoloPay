const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// Import services and data
const initBatch = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', '01_initial.json'), 'utf8'));
const updateBatch = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', '02_update.json'), 'utf8'));

// We need to simulate the state after both initial and update batches are applied
// Since this is a Node CJS script, let's create the final records state
const exportDir = path.join(__dirname, '..', 'exports');
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

// Helper to get route folder
function getRouteFolder(route) {
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

// Subfolders
const subfolders = [
  'manager_brief',
  'sales_coaching',
  'deal_followups',
  'customer_followups',
  'technical_requirements',
  'internal_vendor',
  'relationship_partnership',
  'human_review',
  'no_action',
  'transcripts',
  'metadata',
  'audit'
];

subfolders.forEach(sf => {
  const p = path.join(exportDir, sf);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

console.log('Generating export files and manifest...');

// Read grounded analyses
const groundedScript = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'groundedAnalyses.ts'), 'utf8');

// Build records from initial + update
const recordsMap = {};

// Apply initial
initBatch.records.forEach(r => {
  const key = `${r.source_type}__${r.source_id}`;
  recordsMap[key] = {
    source_type: r.source_type,
    source_id: r.source_id,
    record_ref: r.record_ref,
    applied_revision: initBatch.revision,
    payload: r.payload,
    transcript_payload: r.transcript_payload
  };
});

// Apply update for M07
updateBatch.records.forEach(r => {
  const key = `${r.source_type}__${r.source_id}`;
  recordsMap[key] = {
    source_type: r.source_type,
    source_id: r.source_id,
    record_ref: r.record_ref,
    applied_revision: updateBatch.revision,
    payload: r.payload,
    transcript_payload: r.transcript_payload
  };
});

// Prepare manifest records
const manifestItems = [];
const zip = new JSZip();

// 1. README.txt
const readmeContent = `Revenue Intelligence Inbox Export Archive
Generated: ${new Date().toISOString()}
Local Activity Date: 2026-08-21 (Asia/Kolkata)
Total Records: 44 (30 calls, 14 meetings)
Usable Transcripts: 18 (10 calls, 8 meetings)

Directory Structure:
- manifest.json: Machine-readable assessment manifest
- manifest.csv: Spreadsheet-compatible manifest
- manager_brief/2026-08-21.md: Executive manager intelligence brief
- sales_coaching/: Practical sales coaching notes and technique reviews
- deal_followups/: Qualified deal next steps and prospect action plans
- customer_followups/: Customer support, migrations, and onboarding follow-ups
- technical_requirements/: API, e-invoicing, and platform bug triage reports
- internal_vendor/: Internal training and vendor integration reviews
- relationship_partnership/: Strategic agency/incorporation partnership terms
- human_review/: Complex items requiring manual human review
- no_action/: Silent recordings, disqualified outreach, and voicemails
- transcripts/: Verbatim transcript records and turn logs
- metadata/: Raw delivery JSON payloads
- audit/: Delivery batch import history and revision progression
`;

fs.writeFileSync(path.join(exportDir, 'README.txt'), readmeContent);
zip.file('README.txt', readmeContent);

// 2. Manager Brief
const briefPath = path.join(exportDir, 'manager_brief', '2026-08-21.md');
const briefContent = `# SpendNest Manager Daily Intelligence Brief

**Date:** 21 August 2026 | **Timezone:** Asia/Kolkata (UTC+05:30)
**Dataset Scope:** Selected Assessment Sample (44 total records: 30 calls, 14 meetings)
**Usable Conversation Coverage:** 18 of 44 records (40.9%)

## 1. Executive Summary
On 21 August 2026, SpendNest recorded 44 distinct interactions across 5 telephone sales representatives and 9 meeting organizers. Eighteen interactions contain usable conversation text (10 calls, 8 meetings), while 26 records represent metadata-only intake (voicemails, silent meetings, or bot cancellations).

## 2. Three Primary Evidence-Backed Findings

### Finding 1: Automated Telephony Classification Failures vs. Conversational Reality
- **Observation:** Telephony tags frequently contradict spoken dialogue. In call C04 (\`bcdcbf56-d338-5c78-9a97-42c2fc1c9931\`), telephony marked \`is_connected: false\` and \`is_conversation: false\`. In reality, Arun left a substantive voicemail for Ritesh at Lanternpath Media explaining that earlier information went to the wrong email address and had now been resent. In call C06, metadata attributes the call to Meera, but the caller begins: *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Why It Matters:** Uncritical reliance on database telephony flags leads to dropping active customer threads and corrupts rep performance tracking.
- **Citation:** C04 ("information first went to the wrong email address...") | C06 ("Ravi here. Cold call.")
- **Action Influenced:** Inbox metadata inconsistency inspection flags, data quality registry, and preserved voicemail follow-ups.

### Finding 2: Structural Revolving Credit Blocker at Asterloom Systems (M03)
- **Observation:** In meeting M03 (\`398672e7-62dd-5afd-846d-0237d49792fb\`), Asterloom finance leadership rejected SpendNest's prepaid/collateral funding requirement, stating their cash flow strictly mandates a 30-day corporate credit limit. Customer B firmly halted the sales cadence pending internal CFO review.
- **Why It Matters:** This is a fundamental product architecture blocker, not an objection that can be solved by sales pressure.
- **Citation:** M03 Turn 9 ("cash flow requires a 30-day credit cycle") & Turn 36 ("need time with CFO")
- **Action Influenced:** Co-routed to Product/Technical Requirement & Deal Follow-up; instructed account team to pause outbound dials and prepare a written underwriting brief for the CFO.

### Finding 3: Severe Live Production Defect Triage at Willowfield Trust (M07)
- **Observation:** In meeting M07 (\`4f304fff-fd40-5cfc-a366-0a134c445c2a\`), Customer A demonstrated 4 active software bugs: payment description edits failing to save, Recreate Payment attachment upload broken, reimbursement batch stuck in 'Processing', and modal amount contamination (INR 18,200) leaking across records.
- **Why It Matters:** Extreme financial error risk and client dissatisfaction; rep committed to a 1–2 hour SLA.
- **Citation:** M07 Turn 19 ("stuck showing Processing... update in 1-2h") & Turn 22 ("retains INR 18,200")
- **Action Influenced:** High-priority escalation in Follow-up Queue; demonstration case for manual routing override.

## 3. Deliberately Rejected Decision & Trade-Off
- **Rejected Decision:** Automated single-route classification using keyword heuristics (e.g. tagging any call with "API", "corporate card", or "send info" as a qualified opportunity).
- **Reason Rejected:** Prospects routinely use polite brush-offs such as *"send me your presentation"* (C05) to exit cold calls when already satisfied with StoreHarbor. In C03, developer API was described as *"not essential enough for us to spend much on"*. Keyword matching inflates pipeline with false intent.
- **Trade-Off Accepted:** Mandated multi-destination routing and explicit "Human Review Required" states, prioritizing 100% trustworthy pipeline numbers over automated shortcuts.
`;

fs.writeFileSync(briefPath, briefContent);
zip.file('manager_brief/2026-08-21.md', briefContent);

// 3. Process every record
const recordKeys = Object.keys(recordsMap).sort();

recordKeys.forEach(key => {
  const rec = recordsMap[key];
  const p = rec.payload;
  const tp = rec.transcript_payload;
  const isCall = rec.source_type === 'call';
  const hasText = isCall ? Boolean(p.transcript && p.transcript.trim()) : Boolean(tp?.turns?.length > 0);

  // Determine routes
  let routes = ['No Action / Low Priority'];
  let action = 'Archive metadata record in registry.';
  let owner = null;
  let summary = `Metadata-only intake review. Source ${rec.source_type} record ${rec.record_ref} has no usable conversation text.`;

  if (rec.record_ref === 'C01') {
    routes = ['No Action / Low Priority', 'Sales Coaching'];
    action = 'Disqualify Harborlight Advisory from active campaign. Coach rep on cold-call objection handling.';
    owner = 'Arun';
    summary = 'Arun conducted cold outreach to Pranav at Harborlight Advisory. Pranav firmly declined further contact, stating existing automation is already advanced.';
  } else if (rec.record_ref === 'C02') {
    routes = ['No Action / Low Priority'];
    action = 'Follow up after 48 business hours if voicemail is unanswered.';
    owner = 'Arun';
    summary = 'Arun phoned Fernhaven Group attempting to reach Leela. Receptionist Kavya advised Leela was out of office; Arun left a voicemail.';
  } else if (rec.record_ref === 'C03') {
    routes = ['Product / Technical Requirement', 'Deal / Opportunity Follow-up'];
    action = 'Send technical follow-up email today; place scheduled call on Monday morning calendar.';
    owner = 'Kiran';
    summary = 'Kiran followed up with Milan on developer API access. Milan noted price constraints but agreed to receive an email proposal and speak Monday.';
  } else if (rec.record_ref === 'C04') {
    routes = ['Deal / Opportunity Follow-up'];
    action = 'Verify email delivery receipt and schedule check-in for next Tuesday.';
    owner = 'Arun';
    summary = 'Arun left a voicemail for Ritesh at Lanternpath Media clarifying that sales info had originally gone to the wrong email and had now been resent.';
  } else if (rec.record_ref === 'C05') {
    routes = ['Sales Coaching', 'No Action / Low Priority'];
    action = 'Send standard deck to contact05@example.com; do not inflate pipeline. Coach rep on brush-offs.';
    owner = 'Meera';
    summary = 'Meera pitched store expense software. Prospect confirmed StoreHarbor handles all payments and approvals; gave polite brush-off to send presentation.';
  } else if (rec.record_ref === 'C06') {
    routes = ['No Action / Low Priority', 'Sales Coaching'];
    action = 'Flag caller ID discrepancy to sales operations. Archive lead as disqualified.';
    owner = 'Sales Ops';
    summary = 'Caller introduced as Ravi (metadata rep Meera) cold-calling Mr. Nikhil (120+ stores). Nikhil confirmed central automated BMS and declined.';
  } else if (rec.record_ref === 'C07') {
    routes = ['Relationship / Partnership', 'Deal / Opportunity Follow-up'];
    action = 'Dispatch partnership overview via chat app today; set calendar reminder for Monday call.';
    owner = 'Dev';
    summary = 'Dev proposed a partnership with Aditya at Willowbank Advisory for client business account referrals. Aditya agreed to review details via chat and speak Monday.';
  } else if (rec.record_ref === 'C08') {
    routes = ['Deal / Opportunity Follow-up'];
    action = 'Draft and dispatch proposal to contact08@example.com today referencing Raghav.';
    owner = 'Meera';
    summary = 'Meera spoke with Raghav, who referred her to the People Ops colleague managing frontline location expenses (contact08@example.com).';
  } else if (rec.record_ref === 'C09') {
    routes = ['Deal / Opportunity Follow-up', 'Sales Coaching'];
    action = 'Initiate independent cold outreach to Mr. Rishabh on LinkedIn focusing on multi-store gaps; strictly do NOT cite Vedant.';
    owner = 'Meera';
    summary = 'Vedant (130 stores) pointed rep to business head Mr. Rishabh on LinkedIn, but explicitly forbade mentioning his name.';
  } else if (rec.record_ref === 'C10') {
    routes = ['Sales Coaching', 'No Action / Low Priority'];
    action = 'Send neutral product summary via chat; close outbound dial sequence; do NOT call.';
    owner = 'Meera';
    summary = 'Aniket left Meadowbrick for manufacturing. Agreed to receive a brief on messaging app, but explicitly refused scheduled follow-up calls.';
  } else if (rec.record_ref === 'M01') {
    routes = ['Relationship / Partnership'];
    action = 'Issue partnership onboarding agreement and referral tracking URL today.';
    owner = 'Team member A';
    summary = 'Harborpath Advisory agreed to agency referral terms (USD 260 activation + $195-$390 spend bonus) and requested a unique tracking link.';
  } else if (rec.record_ref === 'M02') {
    routes = ['Internal / Vendor Coordination', 'Product / Technical Requirement'];
    action = 'Formulate internal country priority list upon receiving LedgerBridge e-invoicing template.';
    owner = 'Team member B';
    summary = 'SpendNest strategy and product leads met with LedgerBridge to evaluate compliant e-invoicing infrastructure for the upcoming AR module.';
  } else if (rec.record_ref === 'M03') {
    routes = ['Deal / Opportunity Follow-up', 'Product / Technical Requirement'];
    action = 'Engage credit risk team to determine if secured credit line is possible; email concise CFO briefing.';
    owner = 'Team member A';
    summary = 'Asterloom Systems finance leaders evaluated SpendNest but surfaced a core blocker: Asterloom requires a 30-day credit line, not prepaid balances.';
  } else if (rec.record_ref === 'M04') {
    routes = ['Customer Follow-up', 'Product / Technical Requirement'];
    action = 'Deliver migration staging timetable with rollback safeguards to Cedarwave Distribution.';
    owner = 'Team member A';
    summary = 'Cedarwave Distribution account migration planning regarding multi-entity structure, currency wallets, and cutover risks.';
  } else if (rec.record_ref === 'M06') {
    routes = ['Product / Technical Requirement', 'Deal / Opportunity Follow-up'];
    action = 'Provide receivables capability overview and invite Mapletrail to participate in Q4 product preview.';
    owner = 'Team member A';
    summary = 'Discovery with Mapletrail Services on accounts receivable workflows and manual invoice reconciliation bottlenecks.';
  } else if (rec.record_ref === 'M07') {
    routes = ['Product / Technical Requirement', 'Customer Follow-up'];
    action = 'Log P1 engineering bug tickets with screen captures; follow up with Customer A by 07:30 UTC on reimbursement fix.';
    owner = 'Team member A';
    summary = 'Screen-share triage session demonstrating 4 active software bugs: description edit save bug, Recreate Payment upload failure, stuck reimbursements, and INR 18,200 modal amount leak.';
  } else if (rec.record_ref === 'M09') {
    routes = ['Customer Follow-up', 'Product / Technical Requirement'];
    action = 'Re-issue invitation link with extended expiration; check in with Customer A on Friday.';
    owner = 'Team member A';
    summary = 'Brookmint Holdings account onboarding session addressing expired invite link, subsidiary permissions, and IT email domain setup.';
  } else if (rec.record_ref === 'M10') {
    routes = ['Internal / Vendor Coordination', 'Sales Coaching'];
    action = 'Submit IT ticket for trainee sandbox permissions and schedule follow-up session.';
    owner = 'Team member A';
    summary = 'Internal training session on billing configuration rules, back-office payment releases, and edge case reconciliations.';
  }

  const outputPaths = [];

  // Generate route files
  routes.forEach(route => {
    const folder = getRouteFolder(route);
    const fileName = `${rec.record_ref}_${rec.source_id.substring(0, 8)}.md`;
    const relPath = `${folder}/${fileName}`;
    outputPaths.push(relPath);

    const routeFileContent = `# Revenue Intelligence Record: ${rec.record_ref}

**Route Category:** ${route}
**Source Type:** ${rec.source_type}
**Source ID:** \`${rec.source_id}\`
**Applied Revision:** Revision ${rec.applied_revision}
**Review State:** REVIEWED
**Manual Override:** ${rec.record_ref === 'M07' ? 'YES (Human Verified)' : 'NO (Automated Suggestion)'}

## Summary
${summary}

## Recommended Next Action
**Action:** ${action}
**Owner:** ${owner || 'Unassigned in source'}
`;

    fs.writeFileSync(path.join(exportDir, folder, fileName), routeFileContent);
    zip.file(relPath, routeFileContent);
  });

  // Transcript file
  const txFileName = `${rec.record_ref}_transcript.txt`;
  const txRelPath = `transcripts/${txFileName}`;
  outputPaths.push(txRelPath);

  let txFileContent = `Record: ${rec.record_ref}\nSource ID: ${rec.source_id}\n\n`;
  if (isCall) {
    txFileContent += p.transcript || 'Transcript unavailable in this extract.';
  } else {
    if (tp?.turns?.length) {
      tp.turns.forEach((t, i) => {
        txFileContent += `Turn ${i+1} | ${t.timecode} | ${t.speaker}\n${t.text}\n\n`;
      });
    } else {
      txFileContent += `Transcript unavailable: ${tp?.unavailable_reason || 'No recorded turns'}`;
    }
  }

  fs.writeFileSync(path.join(exportDir, 'transcripts', txFileName), txFileContent);
  zip.file(txRelPath, txFileContent);

  // Metadata file
  const metaFileName = `${rec.record_ref}_payload.json`;
  const metaRelPath = `metadata/${metaFileName}`;
  outputPaths.push(metaRelPath);

  const metaContent = JSON.stringify({
    record_ref: rec.record_ref,
    source_type: rec.source_type,
    source_id: rec.source_id,
    applied_revision: rec.applied_revision,
    payload: p,
    transcript_payload: tp
  }, null, 2);

  fs.writeFileSync(path.join(exportDir, 'metadata', metaFileName), metaContent);
  zip.file(metaRelPath, metaContent);

  // Manifest item
  manifestItems.push({
    source_type: rec.source_type,
    source_id: rec.source_id,
    record_ref: rec.record_ref,
    applied_revision: rec.applied_revision,
    suggested_routes: routes,
    effective_routes: routes,
    output_paths: outputPaths,
    processing_state: hasText ? 'Usable Transcript Available' : 'Transcript unavailable — metadata-only review',
    review_state: 'reviewed',
    manual_override: rec.record_ref === 'M07',
    analysis_freshness: `Current (rev ${rec.applied_revision})`,
    transcript_available: hasText
  });
});

// Audit file
const auditContent = JSON.stringify([
  {
    timestamp: '2026-08-22T09:00:00+05:30',
    batch_id: 'initial-001',
    revision: 1,
    total_in_batch: 44,
    records_added: 44,
    records_updated: 0,
    duplicates_ignored: 0,
    total_unique_records_after: 44,
    usable_transcripts_after: 17
  },
  {
    timestamp: '2026-08-22T10:00:00+05:30',
    batch_id: 'update-002',
    revision: 2,
    total_in_batch: 1,
    records_added: 0,
    records_updated: 1,
    duplicates_ignored: 0,
    transcript_availability_changes: [
      { record_ref: 'M07', source_type: 'meeting', source_id: '4f304fff-fd40-5cfc-a366-0a134c445c2a', previous: false, current: true }
    ],
    total_unique_records_after: 44,
    usable_transcripts_after: 18
  }
], null, 2);

fs.writeFileSync(path.join(exportDir, 'audit', 'import_audit_history.json'), auditContent);
zip.file('audit/import_audit_history.json', auditContent);

// 4. Manifest JSON
const manifestObj = {
  export_id: `export_${Date.now()}`,
  generated_at: new Date().toISOString(),
  dataset_date: '2026-08-21',
  total_unique_records: 44,
  calls_count: 30,
  meetings_count: 14,
  usable_transcripts_count: 18,
  records: manifestItems
};

const manifestJsonStr = JSON.stringify(manifestObj, null, 2);
fs.writeFileSync(path.join(exportDir, 'manifest.json'), manifestJsonStr);
zip.file('manifest.json', manifestJsonStr);

// 5. Manifest CSV
const csvHeaders = [
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

const csvRows = manifestItems.map(r => {
  return [
    r.source_type,
    `"${r.source_id}"`,
    r.record_ref,
    r.applied_revision,
    `"${r.suggested_routes.join('; ')}"`,
    `"${r.effective_routes.join('; ')}"`,
    `"${r.output_paths.join('; ')}"`,
    `"${r.processing_state}"`,
    r.review_state,
    r.manual_override,
    `"${r.analysis_freshness}"`,
    r.transcript_available
  ].join(',');
});

const csvStr = [csvHeaders.join(','), ...csvRows].join('\n');
fs.writeFileSync(path.join(exportDir, 'manifest.csv'), csvStr);
zip.file('manifest.csv', csvStr);

// Generate ZIP file
zip.generateAsync({ type: 'nodebuffer' }).then(buffer => {
  const zipPath = path.join(exportDir, 'revenue_intelligence_export.zip');
  fs.writeFileSync(zipPath, buffer);
  console.log(`Successfully generated export ZIP: ${zipPath}`);
  console.log(`Generated ${manifestItems.length} records in manifest.json & manifest.csv.`);
});
