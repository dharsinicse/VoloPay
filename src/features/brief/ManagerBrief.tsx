import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Calendar,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserCheck,
  ExternalLink
} from 'lucide-react';

export const ManagerBrief: React.FC = () => {
  const { recordsList, openRecordDetail } = useApp();

  const total = recordsList.length;
  const withTx = recordsList.filter(r => r.usable_transcript).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Document Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Official Intelligence Report
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Manager Daily Intelligence Brief
              </h1>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <div><strong>21 August 2026</strong></div>
            <div>Asia/Kolkata (UTC+05:30)</div>
          </div>
        </div>

        {/* Dataset Scope Note */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Selected Sample</span>
            <strong className="text-base text-slate-900 font-mono">{total} records</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Usable Text</span>
            <strong className="text-base text-emerald-600 font-mono">{withTx} conversations</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Coverage</span>
            <strong className="text-base text-indigo-600 font-mono">{total > 0 ? ((withTx / total) * 100).toFixed(1) : 0}%</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Assessment Batch</span>
            <strong className="text-base text-slate-800 font-mono">SpendNest 2026</strong>
          </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed italic">
          * Note: This brief is grounded exclusively on the 44 selected interaction records. Missing transcripts are treated as unavailable evidence, never as proof that conversations did not occur.
        </p>
      </div>

      {/* Section 1: Executive Overview */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center">
          <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
          1. Operational Overview & Activity Summary
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed">
          On 21 August 2026, 44 discrete interactions were recorded: <strong>30 phone calls</strong> across 5 representatives (Arun, Leela, Meera, Kiran, Dev) and <strong>14 scheduled meetings</strong> organized across 9 calendar accounts. Across these, <strong>18 conversations</strong> contain usable verbal text (10 phone calls and 8 meetings, including M07 in the update delivery). The remaining 26 records represent metadata-only intake (voicemails, bot cancellations, or unattended sessions).
        </p>
      </section>

      {/* Section 2: Three Primary Evidence-Backed Findings */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
            2. Three Primary Evidence-Backed Findings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key empirical discoveries impacting manager decision-making, each linked to verbatim source citations.
          </p>
        </div>

        {/* Finding 1 */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                Finding 1
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Automated Telephony Classification Failures vs. Conversational Reality
              </h3>
            </div>
            <button
              onClick={() => openRecordDetail('C04')}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center"
            >
              <span>Inspect C04</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block mb-1">1. What Was Observed:</strong>
              <p className="text-slate-600 leading-relaxed">
                In record <code className="font-mono text-slate-900 font-bold">C04</code>, the upstream telephony system stamped <code className="bg-slate-100 px-1">is_connected: false</code> and <code className="bg-slate-100 px-1">is_conversation: false</code>. In reality, Arun left a detailed, actionable voicemail explaining that earlier proposal materials went to the wrong email address and had now been resent. In <code className="font-mono text-slate-900 font-bold">C06</code>, the caller states <em>"Ravi here"</em>, while the metadata attributes the call to Meera.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block mb-1">2. Why It Matters:</strong>
              <p className="text-slate-600 leading-relaxed">
                Relying uncritically on stored telephony tags causes sales managers to discard genuine customer communications, misattribute staff performance, and miscalculate rep connection rates.
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-indigo-100 text-xs space-y-1">
            <span className="font-bold text-indigo-900">3. Supporting Passage & Citation:</span>
            <p className="italic text-slate-700 font-serif">
              "My understanding is that our information first went to the wrong email address. We subsequently used the corrected address you gave us, and I hope you have now had a chance to see it. Please call me back to let me know where things stand." — <strong className="font-sans text-indigo-700">C04 Transcript</strong>
            </p>
          </div>

          <div className="text-xs text-slate-700">
            <strong>4. Practical Action Influenced:</strong> Created the "Metadata Inconsistencies" detection badge in the Inbox, surfaced discrepancies on the Data Quality screen, and prevented telephony connection flags from filtering out valid voicemail follow-ups.
          </div>
        </div>

        {/* Finding 2 */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                Finding 2
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Structural Deal Blocker: Revolving Credit Line vs. Prepaid Balance (M03)
              </h3>
            </div>
            <button
              onClick={() => openRecordDetail('M03')}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center"
            >
              <span>Inspect M03</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block mb-1">1. What Was Observed:</strong>
              <p className="text-slate-600 leading-relaxed">
                In meeting <code className="font-mono text-slate-900 font-bold">M03</code> with Asterloom Systems, finance stakeholders rejected SpendNest's prepaid/collateral funding requirement, stating their cash flow strictly mandates a 30-day corporate credit limit. Customer B firmly halted the sales meeting cadence until internal CFO review.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block mb-1">2. Why It Matters:</strong>
              <p className="text-slate-600 leading-relaxed">
                This is a critical architectural blocker, not a standard objection. Treating this as a normal evaluating opportunity creates false pipeline optimism and wastes sales capacity.
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-indigo-100 text-xs space-y-1">
            <span className="font-bold text-indigo-900">3. Supporting Passage & Citation:</span>
            <p className="italic text-slate-700 font-serif">
              "We cannot have funds tied up in a prepaid balance before transactions occur. Our cash flow requires a 30-day credit cycle, similar to standard corporate cards." (Turn 9) and "Send the details first. We need time with the CFO and will tell you if another call is needed. Let us make that decision internally before scheduling more." (Turn 36) — <strong className="font-sans text-indigo-700">M03 Turns 9 & 36</strong>
            </p>
          </div>

          <div className="text-xs text-slate-700">
            <strong>4. Practical Action Influenced:</strong> Co-routed M03 to Product/Technical Requirement and Deal Follow-up; instructed account team to pause outbound calling and prepare a written underwriting/credit options memo for the CFO.
          </div>
        </div>

        {/* Finding 3 */}
        <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="bg-rose-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">
                Finding 3
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Severe Live Platform Defects Triage at Willowfield Trust (M07)
              </h3>
            </div>
            <button
              onClick={() => openRecordDetail('M07')}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center"
            >
              <span>Inspect M07</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block mb-1">1. What Was Observed:</strong>
              <p className="text-slate-600 leading-relaxed">
                In meeting <code className="font-mono text-slate-900 font-bold">M07</code> (supplied in update batch 02), Customer A demonstrated 4 active production bugs: payment description edit not saving, file upload failing on Recreate Payment path, reimbursements stuck in Processing, and modal amount contamination (INR 18,200) across records.
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200">
              <strong className="text-slate-800 block mb-1">2. Why It Matters:</strong>
              <p className="text-slate-600 leading-relaxed">
                The amount leakage bug presents extreme financial reconciliation risk, and stuck reimbursements directly affect client employee compensation. Team member A committed to a 1–2 hour SLA.
              </p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-indigo-100 text-xs space-y-1">
            <span className="font-bold text-indigo-900">3. Supporting Passage & Citation:</span>
            <p className="italic text-slate-700 font-serif">
              "The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again before it shows the right information." (Turn 22) and "The payments appear to have been released but are stuck showing Processing... I expect an update or resolution in an hour or two" (Turn 19) — <strong className="font-sans text-indigo-700">M07 Turns 19 & 22</strong>
            </p>
          </div>

          <div className="text-xs text-slate-700">
            <strong>4. Practical Action Influenced:</strong> Serves as the primary demonstration case for manager manual routing override; prioritized in the Follow-up Queue under Critical Escalations with 1–2 hour response SLA.
          </div>
        </div>
      </section>

      {/* Section 3: Deliberately Rejected Decision */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-rose-700">
          <XCircle className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900">
            3. Deliberately Rejected Decision & Trade-Off
          </h2>
        </div>

        <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-4 text-xs space-y-3">
          <div>
            <strong className="text-rose-950 font-semibold block mb-0.5">The Rejected Alternative:</strong>
            <p className="text-slate-700 leading-relaxed">
              We considered implementing automated single-route assignment driven by keyword heuristics (e.g., tagging any call containing "API", "corporate cards", or "send a presentation" as a qualified "Deal / Opportunity Follow-up").
            </p>
          </div>

          <div>
            <strong className="text-rose-950 font-semibold block mb-0.5">Why It Was Rejected:</strong>
            <p className="text-slate-700 leading-relaxed">
              In actual sales practice, prospects routinely use polite brush-offs such as <em>"send me your presentation"</em> (e.g. C05) to exit unsolicited cold calls while having zero purchase intention. In C03, developer API access was explicitly described as <em>"not essential enough for us to spend much on"</em>. Keyword classification produces devastating false pipeline inflation.
            </p>
          </div>

          <div>
            <strong className="text-rose-950 font-semibold block mb-0.5">The Trade-Off Accepted:</strong>
            <p className="text-slate-700 leading-relaxed">
              We mandated a multi-destination taxonomy with explicit "Human Review Required" states. This trade-off requires manager effort to verify ambiguous calls, but guarantees that dashboard pipeline numbers represent genuine evaluated intent rather than keyword noise.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Coaching & Risk Matrix */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center">
          <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
          4. Priority Sales Coaching & Account Risk Directives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-purple-200 rounded-xl p-4 bg-purple-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900">Coaching Directive: Boundary Adherence</span>
              <button onClick={() => openRecordDetail('C09')} className="text-indigo-600 underline">C09</button>
            </div>
            <p className="text-slate-700 leading-relaxed">
              In <code className="font-mono font-bold">C09</code>, prospect Vedant provided the LinkedIn profile of business head Mr. Rishabh, but stated firmly: <em>"No, please don't use my name."</em> Rep Meera must be coached to conduct strictly independent cold outreach without name-dropping Vedant. In <code className="font-mono font-bold">C10</code>, Aniket explicitly refused follow-up calls (<em>"No. I said I will contact you"</em>); outbound calling must cease.
            </p>
          </div>

          <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900">Partnership Momentum: Harborpath (M01)</span>
              <button onClick={() => openRecordDetail('M01')} className="text-indigo-600 underline">M01</button>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Harborpath Advisory agreed to onboarding terms (USD 260 activation + $195–390 spend bonus). Immediate priority: dispatch the onboarding memorandum, shared tracking sheet, and unique referral URL to enable self-service promotion on their portal.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Uncertainties */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center">
          <HelpCircle className="w-4 h-4 text-slate-400 mr-2" />
          5. Evidence Gaps & Stated Uncertainties
        </h2>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li><strong>Staff Identities:</strong> Meeting organizers are email accounts (e.g. <code className="bg-slate-100 px-1">team08@example.com</code>); their exact job titles, reporting lines, and whether they attended are unverified.</li>
          <li><strong>Company Matches:</strong> Companies sharing similar names (e.g., Cedarwave in M04 vs M13) are kept as independent interactions rather than assumed identical accounts without verified CRM ID links.</li>
          <li><strong>Omitted Interval Timestamps:</strong> Transcript timecodes locate selected conversational snippets; intervals between turns are not evidence of silence.</li>
        </ul>
      </section>
    </div>
  );
};
