# 3-Minute Screen Recording Script & Narration Plan

**Title:** SpendNest Revenue Intelligence Inbox — Manager Workflow & Replay Verification  
**Target Duration:** Exactly 3 minutes (180 seconds)  
**Format:** Single continuous take with spoken narration  
**Dataset Date:** 21 August 2026 (Asia/Kolkata)

---

## Timed Screen-by-Screen Execution Plan

| Timestamp | Screen / View | On-Screen Action | Key Spoken Message |
|---|---|---|---|
| **0:00 – 0:35** | **Dashboard** | Start on Overview page. Click "Calls" filter toggle, hover over "Coverage (40.9%)", click the "Deal Follow-up" bar chart segment. | Explain manager problem; highlight traceable coverage denominator (18/44) and rep activity separation. |
| **0:35 – 1:25** | **Conversation Detail** | Open `M03` (Asterloom) from the inbox. Point to Turn 9 and Turn 36 citations. Transition to `M07` (Willowfield Trust) to explain the difficult triage decision. | Discuss structural revolving credit risk vs prepaid debit; explain why M07 required multi-destination routing and human judgment. |
| **1:25 – 2:35** | **Import Engine & Replay** | Navigate to "Imports & Replay". Click "Run Step 1" (initial batch), "Run Step 2" (duplicate batch), set manual override on M07, click "Run Step 4" (update batch), then "Run Step 5" (re-import initial). | Live verification of the assessment data contract: zero duplicates, revision replacement, and preserved manual overrides. |
| **2:35 – 3:00** | **Exports & Conclusion** | Navigate to "Exports & Manifest". Click "Download Complete ZIP" and show manifest structure. Conclude. | Highlight zero empty files, relative paths in manifest, and summarize core design principles. |

---

## Verbatim Spoken Narration Script

### [0:00 – 0:35] Dashboard Overview
> *"Hello! Welcome to the SpendNest Revenue Intelligence Inbox, designed for sales managers reviewing activity from August 21st, 2026 in Asia/Kolkata.*
>
> *As a manager, I'm bombarded with fragmented calls, meeting notes, and contradictory system labels. This first screen immediately answers: What happened, what needs attention, and what should I do next?*
>
> *Across our selected sample of 44 interactions—30 calls and 14 meetings—our headline metrics are strictly grounded. Notice our conversation coverage: exactly 18 usable transcripts out of 44 records, giving 40.9% coverage. The denominator is clearly defined as all selected records, not just meetings with bots.*
>
> *Our filters are fully interactive: clicking 'Calls' isolates our 30 phone interactions, and clicking any routing category—like Deal Follow-up—drills down directly to the underlying conversations without losing context."*

### [0:35 – 1:25] Conversation Analysis & Difficult Routing
> *"Let's open a conversation to see our evidence-based intelligence in action.*
>
> *Opening record M03, Asterloom Systems. Rather than a generic summary, the manager sees a critical structural deal blocker: Asterloom requires a 30-day revolving credit line, whereas SpendNest operates on prepaid debit collateral. Looking at Turn 9, Customer A explicitly says: 'Our cash flow requires a 30-day credit cycle.' In Turn 36, Customer B halts further sales calls pending internal CFO review. We immediately co-routed this to Deal Follow-up and Technical Requirement, instructing the rep to pause calls and prepare a CFO underwriting brief.*
>
> *Now consider our difficult demonstration case: M07, Willowfield Trust. In the initial delivery, M07 has zero turns. In the update delivery, the transcript arrives showing 4 critical production bugs—including an amount leak where the previous payment of 18,200 rupees contaminates subsequent records. It requires genuine managerial judgment to balance engineering bug escalation against customer retention with a 1-to-2 hour SLA."*

### [1:25 – 2:35] The Duplicate & Update Replay Test
> *"Now let's demonstrate the mandatory import replay test on our Imports & Replay screen.*
>
> *First, we import 01_initial.json. We get exactly 44 unique source records and 17 usable transcripts.*
>
> *Next, we import the initial batch a second time. Look at the audit log: exactly zero records added, 44 duplicate deliveries ignored, and the count remains 44.*
>
> *Now, we manually override M07's routing, setting it to 'Product / Technical Requirement' with our manager justification note, and save.*
>
> *Next, we import 02_update.json. Notice what happens: the total unique record count stays strictly at 44—no extra record is created. Usable transcripts increases from 17 to 18 as M07's 27 turns arrive, and critically: M07's manual override remains in full effect.*
>
> *Finally, we re-import the initial batch—revision 1. Because our engine enforces monotonic revision ordering, revision 1 is safely ignored and cannot overwrite revision 2. Even after a hard browser refresh, all 44 records and our manual overrides persist in IndexedDB."*

### [2:35 – 3:00] Exports & Conclusion
> *"Lastly, on our Exports screen, managers can generate actual deliverables from the live state.*
>
> *Clicking 'Download Complete ZIP' generates a packaged archive containing the Manager Brief, markdown analysis files organized across our 8 taxonomy folders, verbatim transcripts, raw payloads, and both JSON and CSV manifests.*
>
> *Every single path in the manifest is relative and points to a real, substantive file. In summary: this is a fully functional, evidence-driven revenue intelligence system that respects human judgment and guarantees data contract integrity. Thank you!"*

---

## Recording Checklist for the Reviewer
- [ ] Screen resolution set to 1920x1080 (16:9).
- [ ] Microphone tested; background noise minimized.
- [ ] App running on localhost or deployed URL.
- [ ] Initial state loaded or clean reset ready.
- [ ] Recording tool (OBS Studio, Loom, or Windows Game Bar Win+Alt+R) active.
- [ ] Continuous single take of ~3 minutes following the timeline above.
