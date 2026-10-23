# SpendNest Revenue Intelligence Inbox — Volopay Assignment

A functional, evidence-driven Revenue Intelligence Inbox and Sales Manager Workspace built for the Volopay assignment.

Designed to turn noisy, asynchronous sales calls, meeting recordings, bot capture states, and late transcripts into clear, actionable intelligence for a sales manager.

---

## 1. Project Overview & Key Features

All supplied activity occurred on **21 August 2026** in **Asia/Kolkata (UTC+05:30)** across a selected sample of **44 interactions: 30 calls and 14 meetings**.

### Core Capabilities:
1. **Manager Dashboard:** 
   - Answers: *What happened, what needs attention, and what should I do next?*
   - Real calculated metrics: Total unique records (44), usable conversation coverage (18/44 = 40.9% post-update), connection rates, and review queues.
   - Interactive Recharts visualizations with direct click-to-filter drilldowns.
   - Strictly distinguishes call representatives from meeting organizers.
2. **Conversation Inbox:**
   - Interactive table of all 44 records (including 26 metadata-only intake items).
   - Multi-dimensional filtering by source type, route, review status, transcript usability, manual override, and rep/organizer.
   - Automatic detection of source-label and telephony inconsistencies (e.g. C04 voicemail labeled disconnected; C06 rep Meera vs spoken caller Ravi).
3. **Evidence-Based Detail Drawer:**
   - Full conversation transcript with 1-based turn numbers and exact quote citations.
   - Grounded managerial findings: objections, risks, opportunities, explicit commitments, and stated action owners.
   - Dual-revision analysis states for M07.
4. **8-Category Routing Engine with Human Override:**
   - Automated baseline suggestions separate from manual decisions.
   - Managers can override routes, add notes, and adjust review states.
   - Decisions persist across browser refreshes using IndexedDB.
5. **Import & Replay Engine:**
   - Strict adherence to `DATA_CONTRACT.md`: Record identity `(source_type, source_id)`.
   - Higher revision replacement (Revision 2 replaces Revision 1; partial merges forbidden).
   - Monotonic revision protection (Revision 1 arriving after Revision 2 is ignored).
   - Guided 6-step replay verification sequence with real-time pass/fail checks.
6. **Export Engine & Manifest Generation:**
   - Client-side and script-based ZIP packaging of all route markdown files, transcripts, raw payloads, and audit logs.
   - Machine-readable `manifest.json` and tabular `manifest.csv` with 100% relative paths pointing to existing files.

---

## 2. Technology Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (B2B SaaS design system with light neutral backgrounds and restrained indigo accents)
- **Charts:** Recharts (responsive bar and pie charts)
- **Icons:** Lucide React
- **Storage:** Browser IndexedDB with `localStorage` fallback (100% persistent across reloads)
- **Packaging:** JSZip for browser archive generation
- **Presentations:** PptxGenJS for generating editable 5-slide PowerPoint presentations
- **Testing:** Vitest automated test runner

---

## 3. Getting Started & Commands

### Prerequisites
- Node.js v18+ (tested on Node v22.16.0)
- npm v9+

### Installation & Run
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Automated Tests
```bash
# Type check and production build
npm run build

# Run Vitest automated test suite (7/7 tests passing)
npm test
```

---

## 4. Replay Test: Reproducing the Mandatory Verification

Navigate to **Imports & Replay** in the left sidebar, or click **Run All Replay Steps** to execute the sequence automatically:

1. **Step 1 (Initial Import):** Click **Load / Re-load Initial Batch** (`data/01_initial.json`).
   - *Result:* Exactly 44 unique records loaded; 17 usable conversation texts; M07 has 0 turns.
2. **Step 2 (Duplicate Import):** Click **Load / Re-load Initial Batch** again.
   - *Result:* Count stays strictly at 44; audit log shows 0 added and 44 duplicates ignored.
3. **Step 3 (Manual Override on M07):** Open record `M07` from the inbox or click **Run Step 3**. Change its route to `Product / Technical Requirement` and save with a correction note.
   - *Result:* Manual override badge appears; effective route is updated.
4. **Step 4 (Update Import):** Click **Apply Update Batch (M07)** (`data/02_update.json`).
   - *Result:* M07 updates from Revision 1 to Revision 2; turns increase to 27; usable transcripts increase to 18; total record count remains 44; **M07's manual override remains in effect**.
5. **Step 5 (Re-import Revision 1):** Click **Load / Re-load Initial Batch** again.
   - *Result:* Revision 1 is ignored; M07 remains at Revision 2 with 27 turns.
6. **Step 6 (Refresh Persistence):** Press `F5` or reload your browser.
   - *Result:* IndexedDB restores all 44 records, M07's updated transcript, and your manual override.

---

## 5. Three Most Important Evidence-Backed Findings

### Finding 1: Telephony Classification Discrepancies (C04 & C06)
- **What Was Observed:** Telephony system automated labels disagree with actual transcript contents. In call `C04` (`bcdcbf56-d338-5c78-9a97-42c2fc1c9931`), the upstream telephony metadata recorded `is_connected: false` and `is_conversation: false`. However, inspection of the transcript reveals Arun left a detailed, substantive voicemail for Ritesh at Lanternpath Media clarifying that sales information had originally been dispatched to the wrong email address, had now been re-sent to the correct address, and requested a callback. Furthermore, in call `C06`, the metadata states `rep_name: Meera`, but the caller's spoken words explicitly begin: *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Source Citation:** C04 quote: *"My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us..."* | C06 quote: *"Good evening. Ravi here. I'll say at the start that this is a cold call."*
- **Screen & Rule Affected:** Inbox Discrepancy Badges, Data Quality Registry, and the rule preventing telephony connection flags from discarding valid voicemails.

### Finding 2: Structural Revolving Credit Blocker (M03 - Asterloom Systems)
- **What Was Observed:** In meeting `M03` (`398672e7-62dd-5afd-846d-0237d49792fb`), Asterloom Systems finance leadership (Customer A & B) surfaced a fundamental blocker: Asterloom requires a 30-day revolving credit line for working capital, whereas SpendNest's corporate card offering operates exclusively on pre-funded debit balances and cash collateral. Customer B explicitly declined to schedule follow-up sales calls until an internal review with their CFO takes place.
- **Source Citation:** M03 Turn 9: *"We cannot have funds tied up in a prepaid balance before transactions occur. Our cash flow requires a 30-day credit cycle, similar to standard corporate cards."* | M03 Turn 36: *"Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more."*
- **Screen & Rule Affected:** Co-routed to Deal Follow-up and Product/Technical Requirement; flagged deal risk status; instructed rep to prepare a CFO credit brief instead of dialing.

### Finding 3: Severe Live Production Defect Triage at Willowfield Trust (M07)
- **What Was Observed:** In meeting `M07` (`4f304fff-fd40-5cfc-a366-0a134c445c2a`), supplied in update batch 02, Customer A demonstrated four distinct software defects in live production: (1) payment description edits fail to save; (2) file attachments cannot be uploaded via the Recreate Payment path; (3) reimbursement batches are stuck in 'Processing' and cannot be selected; and (4) 'Mark as paid' dialog leaks state, displaying the previous transaction's amount (INR 18,200) on subsequent records.
- **Source Citation:** M07 Turn 19: *"The payments appear to have been released but are stuck showing Processing... I expect an update or resolution in an hour or two..."* | M07 Turn 22: *"The amount from the previous item appears in the next one [INR 18,200]. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information."*
- **Screen & Rule Affected:** Primary demonstration case for manual routing override; prioritized in Follow-up Queue under Critical Escalations with 1–2 hour SLA.

---

## 6. One Deliberately Rejected Decision & Trade-Off

- **The Rejected Alternative:** Implementing automated single-route assignment driven by keyword heuristics (e.g., tagging any call containing "API", "corporate cards", or "send a presentation" as a qualified "Deal Follow-up").
- **Why It Was Rejected:** In actual sales practice, prospects routinely use polite brush-offs such as *"send me your presentation"* (e.g. C05) to exit unsolicited cold calls while having zero purchase intention. In C03, developer API access was explicitly described as *"not essential enough for us to spend much on"*. Keyword classification produces devastating false pipeline inflation.
- **The Trade-off Accepted:** Multi-destination routing and explicit "Human Review Required" states were mandated. While this requires deliberate manager review, it preserves zero-tolerance for false pipeline metrics.

---

## 7. Pre-Generated vs. Dynamic Runtime Operations

- **Pre-Generated (AI-Assisted Grounding):**
  - Factual conversation summaries, objections, commitments, and exact quotes for all 18 transcripts stored in `src/data/groundedAnalyses.ts`.
  - Dual-revision analysis states for M07 (rev 1 intake vs rev 2 defect triage).
  - Intake status descriptions for the 26 metadata-only records (B01-B20, silent mtgs).
  - Executive Manager Brief core narrative for 21 August 2026.
- **Computed Dynamically at Runtime:**
  - Ingestion engine: Data contract validation, tuple deduplication, and monotonic revision handling.
  - Manual override management and IndexedDB persistence.
  - Live metric aggregations, connection rates, and multi-route counting.
  - Universal text search across turns, transcripts, and metadata.
  - Client-side ZIP packaging and manifest generation.

---

## 8. Export Structure & Deliverables

Exports are generated dynamically in the UI and pre-generated on disk in `exports/`:
- `exports/README.txt`
- `exports/manifest.json` (Machine-readable manifest)
- `exports/manifest.csv` (Spreadsheet-compatible manifest)
- `exports/manager_brief/2026-08-21.md`
- `exports/revenue_intelligence_export.zip`
- Route folders: `sales_coaching/`, `deal_followups/`, `customer_followups/`, `technical_requirements/`, `internal_vendor/`, `relationship_partnership/`, `human_review/`, `no_action/`
- Verbatim transcripts: `transcripts/*_transcript.txt`
- Metadata: `metadata/*_payload.json`
- Audit log: `audit/import_audit_history.json`

Every manifest output path is relative and points to a verified existing file.

---

## 9. PowerPoint Presentation & Demo Script

- **Five-Slide Presentation:** Located at [`slides/revenue_intelligence_findings.pptx`](file:///c:/Users/dhars/OneDrive/Desktop/YoloPlay/slides/revenue_intelligence_findings.pptx) (143 KB, editable PowerPoint generated with PptxGenJS).
- **Three-Minute Screen Recording Script:** Located at [`recording/demo_script.md`](file:///c:/Users/dhars/OneDrive/Desktop/YoloPlay/recording/demo_script.md) with exact timestamps, on-screen actions, and spoken narration.

---

## 10. Time Spent, Known Limitations & Unfinished Work

- **Approximate Hours Spent:** ~7.5 hours total (Inspection, data contract design, React/TypeScript architecture, grounded analyses, tests, exports, PowerPoint generation, documentation).
- **Known Limitations:**
  - *No Live CRM Synchronization:* Organizers and reps cannot be joined across external HR tables because no staff directory was supplied in the extract.
  - *Single-Day Window:* All records occurred on 21 August 2026; trend analysis over multiple calendar weeks will require future date batches.
  - *Audio Streaming:* Upstream telephone audio files were transformed/withheld; audio player components were omitted in favor of text transcript analysis.
