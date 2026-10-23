import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Database,
  Layers,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';

export const DataQuality: React.FC = () => {
  const { recordsList, openRecordDetail } = useApp();

  const discrepancyRecords = recordsList.filter(r => r.metadata_inconsistencies.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-rose-600 font-semibold text-xs tracking-wider uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>Governance & Methodology</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Data Quality, Semantics & Trust Reference
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Complete documentation of counting methodology, state definitions, metadata discrepancies, and boundary rules required for manager trust.
        </p>
      </div>

      {/* Discrepancy Registry */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Active Source-Label Inconsistency Registry ({discrepancyRecords.length} records)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real detected upstream anomalies</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Upstream systems (telephony dialers, call recorders, meeting bots) frequently produce classification errors or conflicting database states. Rather than silently overwriting source data, the inbox surfaces these discrepancies directly to the manager:
        </p>

        <div className="space-y-3">
          {discrepancyRecords.map(r => (
            <div
              key={`${r.source_type}__${r.source_id}`}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-indigo-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[11px]">
                    {r.record_ref}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {r.source_type === 'call' ? `Call to ${(r.payload as any).to_number || 'Contact'}` : (r.payload as any).title}
                  </span>
                </div>
                <ul className="text-amber-800 list-disc list-inside space-y-0.5 pl-1">
                  {r.metadata_inconsistencies.map((issue, idx) => (
                    <li key={idx} className="font-medium">{issue}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => openRecordDetail(r.record_ref)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold shrink-0 text-xs flex items-center"
              >
                <span>Inspect Record</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Methodology Rules Grid */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center">
          <Scale className="w-5 h-5 text-indigo-600 mr-2" />
          Methodology & Semantic Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Rule 1 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              1. Record Identity & Counting
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Record identity is strictly defined as the tuple <code>(source_type, source_id)</code>. Record references (e.g., C01, M07), company names, phone numbers, or array indices are convenience labels and must never be used as primary keys. Total records after both delivery batches remain exactly 44.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              2. Transcript Coverage Denominator
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Conversation coverage is defined as records with usable conversational text divided by all 44 selected records. Missing text is never treated as proof that a conversation never happened; it is cataloged as unavailable evidence requiring metadata-only intake review.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              3. Revision Hierarchy & Merging
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Initial delivery is Revision 1; update delivery is Revision 2. A newer revision replaces the entire source payload and transcript payload. Partial merges are forbidden. Revision 1 arriving after Revision 2 is strictly ignored.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              4. Preservation of Human Overrides
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Automated suggested routes are derived from source text, but manager manual overrides are preserved across subsequent source updates. A newer source batch may refresh underlying analysis, but will never silently delete an explicit manager routing decision.
            </p>
          </div>

          {/* Rule 5 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              5. Distinct Meaning of Falsy States
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <code>null</code> (withheld or unsupplied), <code>false</code> (negative state), <code>0</code> (numeric zero), <code>[]</code> (empty array), and missing text are maintained as distinct computational states. For example, withheld summaries in the delivery fixture are not treated as system failures.
            </p>
          </div>

          {/* Rule 6 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
              6. Selected Sample Limitation
            </h3>
            <p className="text-slate-600 leading-relaxed">
              This extract is a deliberately selected sample of 44 interactions, not a statistically representative cross-section of team performance. Meeting organizers are not assumed to be sales reps or attendees without transcript evidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
