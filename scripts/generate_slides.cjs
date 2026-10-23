const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'Antigravity / Lead Engineer';
pres.title = 'SpendNest Revenue Intelligence Inbox — Findings & Architecture';

// Color Palette
const COLORS = {
  bgDark: '0F172A', // Slate 900
  bgLight: 'F8FAFC', // Slate 50
  cardBg: 'FFFFFF',
  primary: '4F46E5', // Indigo 600
  primaryDark: '312E81', // Indigo 900
  textDark: '1E293B', // Slate 800
  textMuted: '64748B', // Slate 500
  accentGreen: '059669', // Emerald 600
  accentAmber: 'D97706', // Amber 600
  accentRose: 'E11D48', // Rose 600
  border: 'E2E8F0'
};

// ==========================================
// SLIDE 1: Manager Problem & Three Findings
// ==========================================
let slide1 = pres.addSlide();
slide1.background = { color: COLORS.bgLight };

// Header
slide1.addText('SPENDNEST REVENUE INTELLIGENCE', {
  x: 0.8, y: 0.5, w: 10, h: 0.3,
  fontSize: 10, bold: true, color: COLORS.primary, fontFace: 'Calibri'
});
slide1.addText('Manager Problem & Three Evidence-Backed Findings', {
  x: 0.8, y: 0.8, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Calibri'
});
slide1.addText('Context: 21 August 2026 (Asia/Kolkata) • 44 Interactions Sample • 18 Usable Transcripts', {
  x: 0.8, y: 1.3, w: 11.5, h: 0.3,
  fontSize: 11, color: COLORS.textMuted, fontFace: 'Calibri'
});

// Card 1: What the Inbox Solves
slide1.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide1.addText('What the Inbox Solves', {
  x: 1.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 14, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide1.addText([
  { text: 'The Manager Dilemma:\n', options: { bold: true, color: COLORS.textDark } },
  { text: 'A sales manager receives fragmented calls, bot notes, and late transcripts across multiple systems. Telephony metadata tags often contradict spoken reality.\n\n', options: { color: COLORS.textDark } },
  { text: 'Core Solution:\n', options: { bold: true, color: COLORS.textDark } },
  { text: '• One connected manager workspace answering: What happened? What needs attention? What should I do next?\n', options: { color: COLORS.textDark } },
  { text: '• Evidence grounding: no fabricated revenue, accounts, or outcomes.\n', options: { color: COLORS.textDark } },
  { text: '• Preserves human judgment while providing automated baseline routing.', options: { color: COLORS.textDark } }
], {
  x: 1.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10.5, fontFace: 'Calibri', lineSpacing: 14
});

// Card 2: Three Evidence-Backed Findings
slide1.addShape(pres.ShapeType.rect, {
  x: 4.7, y: 1.8, w: 7.7, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide1.addText('Three Critical Findings & Manager Impact', {
  x: 4.9, y: 2.0, w: 7.3, h: 0.35,
  fontSize: 14, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});

slide1.addText([
  { text: '1. Upstream Telephony Label Conflicts (C04 & C06)\n', options: { bold: true, color: COLORS.primary } },
  { text: '• Observation: C04 marked is_connected=false and outcome=voicemail, yet Arun left a substantive email-correction message. In C06, metadata rep is Meera but spoken caller is Ravi.\n', options: { color: COLORS.textDark } },
  { text: '• Citation: C04 ("information first went to the wrong email address...") | C06 ("Ravi here. Cold call.")\n', options: { color: COLORS.textMuted, italic: true } },
  { text: '• Why It Matters: Telephony tags cannot be trusted as ground truth for customer touchpoints.\n\n', options: { color: COLORS.textDark } },

  { text: '2. Structural Revolving Credit Blocker (M03 - Asterloom Systems)\n', options: { bold: true, color: COLORS.accentAmber } },
  { text: '• Observation: Finance team requires a 30-day revolving credit line; SpendNest strictly requires prepaid deposits. Customer B halted follow-up meetings pending CFO review.\n', options: { color: COLORS.textDark } },
  { text: '• Citation: M03 Turn 9 ("cash flow requires a 30-day credit cycle") & Turn 36 ("need time with CFO")\n', options: { color: COLORS.textMuted, italic: true } },
  { text: '• Why It Matters: Prevents pipeline delusion; requires underwriting intervention over AE dials.\n\n', options: { color: COLORS.textDark } },

  { text: '3. Severe Live Production Defect Triage (M07 - Willowfield Trust)\n', options: { bold: true, color: COLORS.accentRose } },
  { text: '• Observation: Customer demonstrated 4 bugs: description save failure, broken Recreate Payment upload, stuck reimbursements, and INR 18,200 modal amount leak. Team promised 1-2h SLA.\n', options: { color: COLORS.textDark } },
  { text: '• Citation: M07 Turn 19 ("stuck showing Processing... update in 1-2h") & Turn 22 ("retains INR 18,200")\n', options: { color: COLORS.textMuted, italic: true } },
  { text: '• Why It Matters: High churn & financial error risk; prioritized in urgent Follow-up Queue.', options: { color: COLORS.textDark } }
], {
  x: 4.9, y: 2.45, w: 7.3, h: 4.0,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 13
});


// ==========================================
// SLIDE 2: Product & Interface Decisions
// ==========================================
let slide2 = pres.addSlide();
slide2.background = { color: COLORS.bgLight };

slide2.addText('PRODUCT DESIGN & WORKSPACE ARCHITECTURE', {
  x: 0.8, y: 0.5, w: 10, h: 0.3,
  fontSize: 10, bold: true, color: COLORS.primary, fontFace: 'Calibri'
});
slide2.addText('Interface Decisions: Purposeful B2B Manager Workspace', {
  x: 0.8, y: 0.8, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Calibri'
});
slide2.addText('Built for high-signal triage: Light neutral canvas, dark typography, restrained indigo accents', {
  x: 0.8, y: 1.3, w: 11.5, h: 0.3,
  fontSize: 11, color: COLORS.textMuted, fontFace: 'Calibri'
});

// 3 Pillars
// Column 1: Dashboard
slide2.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide2.addText('1. Manager Dashboard', {
  x: 1.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide2.addText([
  { text: 'Questions Answered:\n', options: { bold: true } },
  { text: '• What happened today across calls and meetings?\n• What requires urgent operational attention?\n• Which rep or organizer owns the next step?\n\n' },
  { text: 'Key UX Mechanics:\n', options: { bold: true } },
  { text: '• Compact KPI cards with clickable drill-downs.\n• Interactive Recharts taxonomy bars.\n• Calls vs Meetings separated cleanly.\n• Meeting organizers never conflated with sales representatives without evidence.' }
], {
  x: 1.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 14, color: COLORS.textDark
});

// Column 2: Inbox & Drawer
slide2.addShape(pres.ShapeType.rect, {
  x: 4.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide2.addText('2. Inbox & Detail Drawer', {
  x: 5.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide2.addText([
  { text: 'All 44 Records Cataloged:\n', options: { bold: true } },
  { text: '• Every record visible, including 26 metadata-only intake items (B01-B20, silent mtgs).\n• Multi-dimensional filters: Type, Route, Review State, Transcript, and Overrides.\n\n' },
  { text: 'Dual-Column Inspection:\n', options: { bold: true } },
  { text: '• Left: Verbatim searchable text with 1-based turn numbers and exact quotes.\n• Right: Grounded analysis, risks, commitments, action owners, and manual override engine.' }
], {
  x: 5.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 14, color: COLORS.textDark
});

// Column 3: What Was Excluded
slide2.addShape(pres.ShapeType.rect, {
  x: 8.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide2.addText('3. What Was Excluded & Why', {
  x: 9.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.accentRose, fontFace: 'Calibri'
});
slide2.addText([
  { text: 'Deliberate Omissions:\n', options: { bold: true } },
  { text: '• Fake Pipeline Dollar Totals: No deal table exists in the source. Fabricating $450k revenue totals deceives managers.\n\n' },
  { text: '• Artificial Talk-Time Ratios: Upstream talk-time cannot be mapped to speaker turns without corrupting data.\n\n' },
  { text: '• Date Range Pickers: All 44 interactions occurred on 21 August 2026; date filters add cognitive friction.\n\n' },
  { text: '• Generic AI Summaries: Silent records receive metadata intake, not fabricated summaries.' }
], {
  x: 9.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 14, color: COLORS.textDark
});


// ==========================================
// SLIDE 3: Routing & Difficult Case (M07)
// ==========================================
let slide3 = pres.addSlide();
slide3.background = { color: COLORS.bgLight };

slide3.addText('ROUTING TAXONOMY & HUMAN OVERRIDE', {
  x: 0.8, y: 0.5, w: 10, h: 0.3,
  fontSize: 10, bold: true, color: COLORS.primary, fontFace: 'Calibri'
});
slide3.addText('Routing Taxonomy & The Difficult Case (M07)', {
  x: 0.8, y: 0.8, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Calibri'
});
slide3.addText('8-Category Evidence-Sensitive Taxonomy • Separation of Automated vs Manual Decisions', {
  x: 0.8, y: 1.3, w: 11.5, h: 0.3,
  fontSize: 11, color: COLORS.textMuted, fontFace: 'Calibri'
});

// Left: Taxonomy List
slide3.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 4.8, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide3.addText('Eight-Category Routing Taxonomy', {
  x: 1.0, y: 2.0, w: 4.4, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide3.addText([
  { text: '1. Sales Coaching: ', options: { bold: true, color: COLORS.primary } },
  { text: 'Cold call techniques, boundaries (C01, C06, C09, C10).\n' },
  { text: '2. Deal Follow-up: ', options: { bold: true, color: COLORS.primary } },
  { text: 'Evaluating buyers, warm referrals (C03, C04, C08, M03).\n' },
  { text: '3. Customer Follow-up: ', options: { bold: true, color: COLORS.accentGreen } },
  { text: 'Account migrations, user setup (M04, M07, M09).\n' },
  { text: '4. Internal / Vendor: ', options: { bold: true, color: COLORS.accentAmber } },
  { text: 'LedgerBridge e-invoicing, billing training (M02, M10).\n' },
  { text: '5. Product / Technical: ', options: { bold: true, color: COLORS.primary } },
  { text: 'API integrations, production bugs (C03, M02, M03, M07).\n' },
  { text: '6. Relationship / Partnership: ', options: { bold: true, color: COLORS.primary } },
  { text: 'Overseas incorporation referrals (C07, M01).\n' },
  { text: '7. No Action / Low Priority: ', options: { bold: true, color: COLORS.textMuted } },
  { text: 'Silent recordings, un-transcribed calls (B01-B20, M05).\n' },
  { text: '8. Human Review Required: ', options: { bold: true, color: COLORS.accentRose } },
  { text: 'Ambiguous outcomes or initial M07 state.' }
], {
  x: 1.0, y: 2.45, w: 4.4, h: 4.0,
  fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});

// Right: M07 Demonstration Case
slide3.addShape(pres.ShapeType.rect, {
  x: 5.9, y: 1.8, w: 6.5, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide3.addText('Demonstration Case: Willowfield Trust (M07)', {
  x: 6.1, y: 2.0, w: 6.1, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.accentRose, fontFace: 'Calibri'
});
slide3.addText([
  { text: 'The Dilemma (Pre-Update Delivery):\n', options: { bold: true, color: COLORS.textDark } },
  { text: '• In 01_initial.json, M07 arrives with recording_status="recorded" but turns=[]. A manager reviewing metadata must decide how to handle it before update-002 arrives.\n\n' },
  { text: 'Competing Interpretations (Upon Update Delivery):\n', options: { bold: true, color: COLORS.textDark } },
  { text: '• Option A (Product/Technical Requirement): 4 live software defects triaged (INR 18,200 modal bug, stuck payments).\n' },
  { text: '• Option B (Customer Follow-up): Client satisfaction critical; rep gave 1-2 hour SLA on reimbursements.\n' },
  { text: '• Option C (Sales Coaching): Rep triage process evaluation.\n\n' },
  { text: 'Accepted Decision & Result:\n', options: { bold: true, color: COLORS.primary } },
  { text: '• Co-routed to Product/Technical Requirement + Customer Follow-up.\n' },
  { text: '• Replay Contract Test: Manager manually overrides M07 before update; 02_update.json is imported; manual route is strictly preserved across refresh!' }
], {
  x: 6.1, y: 2.45, w: 6.1, h: 4.0,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});


// ==========================================
// SLIDE 4: Validation & Replay Evidence
// ==========================================
let slide4 = pres.addSlide();
slide4.background = { color: COLORS.bgLight };

slide4.addText('EMPIRICAL VALIDATION & DATA CONTRACT REPLAY', {
  x: 0.8, y: 0.5, w: 10, h: 0.3,
  fontSize: 10, bold: true, color: COLORS.primary, fontFace: 'Calibri'
});
slide4.addText('Validation, Verified Calculations & Replay Results', {
  x: 0.8, y: 0.8, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Calibri'
});
slide4.addText('Mathematical Traceability • Replay Contract Results • Vitest Automated Suite Passing', {
  x: 0.8, y: 1.3, w: 11.5, h: 0.3,
  fontSize: 11, color: COLORS.textMuted, fontFace: 'Calibri'
});

// Card 1: Verified Metric
slide4.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide4.addText('1. Verified Metric & Calculation', {
  x: 1.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide4.addText([
  { text: 'Transcript Coverage Denominator:\n', options: { bold: true } },
  { text: '• Initial Batch: 17 usable texts / 44 selected records = 38.6%\n' },
  { text: '• Post-Update Batch: 18 usable texts / 44 selected records = 40.9%\n\n' },
  { text: 'Telephony Connection Rate:\n', options: { bold: true } },
  { text: '• Verified Formula: connected calls (10) / calls with non-null is_connected (30) = 33.3% connection rate.\n\n' },
  { text: 'Multi-Route Assignments:\n', options: { bold: true } },
  { text: '• Total assigned route labels: 54 across 44 records (accounting for multi-destination records).' }
], {
  x: 1.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 14, color: COLORS.textDark
});

// Card 2: Analytical Finding
slide4.addShape(pres.ShapeType.rect, {
  x: 4.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide4.addText('2. Verified Finding & Passage', {
  x: 5.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide4.addText([
  { text: 'M01 Partnership Economics:\n', options: { bold: true } },
  { text: '• Verified commercial model with Harborpath Advisory.\n\n' },
  { text: 'Exact Source Citations:\n', options: { bold: true } },
  { text: '• Turn 9: "The activation payment is USD 260 when a referred company gets its account approved... USD 195–390 bonus."\n' },
  { text: '• Turn 12: Partner A confirms "let us get the partner onboarding started."\n' },
  { text: '• Turn 21: Team member A commits to provide a unique referral link rather than manual introductions.\n\n' },
  { text: 'Result: Fully verified commercial flow without speculation.' }
], {
  x: 5.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});

// Card 3: Replay Results
slide4.addShape(pres.ShapeType.rect, {
  x: 8.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide4.addText('3. Replay Test Suite Results', {
  x: 9.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.accentGreen, fontFace: 'Calibri'
});
slide4.addText([
  { text: '6-Step Mandatory Sequence:\n', options: { bold: true } },
  { text: '✓ Step 1: 01_initial imported (44 recs, 17 tx).\n' },
  { text: '✓ Step 2: 01_initial re-imported (0 added, 44 duplicates ignored, count stays 44).\n' },
  { text: '✓ Step 3: M07 manual route assigned & saved.\n' },
  { text: '✓ Step 4: 02_update applied (M07 updated to rev 2 with 27 turns; manual route preserved).\n' },
  { text: '✓ Step 5: 01_initial re-imported (rev 1 does NOT overwrite rev 2).\n' },
  { text: '✓ Step 6: Reload verifies IndexedDB persistence.\n\n' },
  { text: 'Vitest: 7/7 automated tests passing.', options: { bold: true, color: COLORS.accentGreen } }
], {
  x: 9.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 9.5, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});


// ==========================================
// SLIDE 5: Trade-Offs, AI & Roadmap
// ==========================================
let slide5 = pres.addSlide();
slide5.background = { color: COLORS.bgLight };

slide5.addText('ENGINEERING TRADE-OFFS & ROADMAP', {
  x: 0.8, y: 0.5, w: 10, h: 0.3,
  fontSize: 10, bold: true, color: COLORS.primary, fontFace: 'Calibri'
});
slide5.addText('Trade-Offs, AI Usage, Limitations & Next Steps', {
  x: 0.8, y: 0.8, w: 11.5, h: 0.5,
  fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Calibri'
});
slide5.addText('Honest Reflection • Architecture Boundaries • Time Investment', {
  x: 0.8, y: 1.3, w: 11.5, h: 0.3,
  fontSize: 11, color: COLORS.textMuted, fontFace: 'Calibri'
});

// Card 1: Pre-gen vs Dynamic
slide5.addShape(pres.ShapeType.rect, {
  x: 0.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide5.addText('Pre-Gen vs Dynamic Runtime', {
  x: 1.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide5.addText([
  { text: 'Pre-Generated (AI-Assisted):\n', options: { bold: true } },
  { text: '• Deep factual analysis, objections, commitments, and exact quotes for all 18 conversations.\n• Revision 1 and 2 states for M07.\n• Daily executive brief narrative.\n\n' },
  { text: 'Dynamic Runtime Operations:\n', options: { bold: true } },
  { text: '• Ingestion engine & revision checking.\n• Manual override manager & IndexedDB.\n• Live multi-metric calculations.\n• Full-text scanning across turns.\n• Client-side ZIP & manifest packaging.' }
], {
  x: 1.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});

// Card 2: Rejected Decision
slide5.addShape(pres.ShapeType.rect, {
  x: 4.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide5.addText('Rejected Decision & Trade-Off', {
  x: 5.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.accentRose, fontFace: 'Calibri'
});
slide5.addText([
  { text: 'The Alternative Considered:\n', options: { bold: true } },
  { text: '• Keyword-based automated deal scoring (marking any call mentioning "cards", "API", or "send info" as high-probability pipeline).\n\n' },
  { text: 'Why Rejected:\n', options: { bold: true } },
  { text: '• In C05, prospect asked for a presentation purely as a polite brush-off (already automated with StoreHarbor). In C03, API was non-essential. Automated keyword scoring leads to false pipeline numbers.\n\n' },
  { text: 'Trade-off:\n', options: { bold: true } },
  { text: '• Requires manager review, but ensures 100% trustworthy pipeline metrics.' }
], {
  x: 5.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});

// Card 3: Limitations & Time Spent
slide5.addShape(pres.ShapeType.rect, {
  x: 8.8, y: 1.8, w: 3.6, h: 4.8,
  fill: { color: COLORS.cardBg }, line: { color: COLORS.border, width: 1 }
});
slide5.addText('Limitations & Time Spent', {
  x: 9.0, y: 2.0, w: 3.2, h: 0.35,
  fontSize: 13, bold: true, color: COLORS.primaryDark, fontFace: 'Calibri'
});
slide5.addText([
  { text: 'Known Limitations:\n', options: { bold: true } },
  { text: '• No live CRM database or staff directory: Organizers and reps cannot be cross-matched.\n• Single-day sample: Trends over time cannot be computed without more date batches.\n\n' },
  { text: 'Next Engineering Priorities:\n', options: { bold: true } },
  { text: '• Live LLM webhook integration for real-time streaming audio transcription.\n• Bi-directional CRM webhook synchronization.\n\n' },
  { text: 'Approximate Time Spent:\n', options: { bold: true } },
  { text: '• Total: ~7.5 hours (Planning, data grounding, frontend engineering, testing, exports, deck).' }
], {
  x: 9.0, y: 2.45, w: 3.2, h: 3.9,
  fontSize: 10, fontFace: 'Calibri', lineSpacing: 13, color: COLORS.textDark
});

// Ensure slides directory exists and save PPTX
const slidesDir = path.join(__dirname, '..', 'slides');
if (!fs.existsSync(slidesDir)) {
  fs.mkdirSync(slidesDir, { recursive: true });
}

const outputPath = path.join(slidesDir, 'revenue_intelligence_findings.pptx');
pres.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`Successfully generated 5-slide PPTX: ${outputPath}`);
  })
  .catch(err => {
    console.error('Error generating PPTX:', err);
  });
