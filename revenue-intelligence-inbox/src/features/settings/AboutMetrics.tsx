import React from 'react';
import { HelpCircle, Calculator, Cpu, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export const AboutMetrics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
          <HelpCircle className="w-4 h-4" />
          <span>System Transparency & Mathematical Traceability</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Metric Definitions, Denominators & System Architecture
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Traceable mathematical calculations, boundary conditions, and architectural boundaries governing the SpendNest Revenue Intelligence Inbox.
        </p>
      </div>

      {/* Metric Definitions & Formulas */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Headline Metric Formulations & Denominators
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          {/* Metric 1 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 text-sm">Total Unique Source Records (Count: 44)</strong>
              <span className="font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">COUNT = 44</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Calculation:</strong> Distinct count of tuples <code>(source_type, source_id)</code> across all applied deliveries.
            </p>
            <p className="text-slate-500 text-[11px]">
              <strong>Denominator:</strong> Entire active dataset. Applying update delivery <code>02_update.json</code> updates the existing M07 record and never increments this number to 45.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 text-sm">Transcript Coverage (17/44 initially, 18/44 after update)</strong>
              <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">38.6% → 40.9%</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Calculation:</strong> <code>(usable_transcripts_count / total_unique_records) * 100</code>.
            </p>
            <p className="text-slate-500 text-[11px]">
              <strong>Denominator:</strong> All 44 selected records. Usable transcript is strictly defined as a non-blank call transcript string or a meeting with at least one non-blank turn.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 text-sm">Source-Reported Call Connection Rate</strong>
              <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Traceable Formula</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Calculation:</strong> Calls with <code>is_connected === true</code> divided by calls with non-null <code>is_connected</code>.
            </p>
            <p className="text-slate-500 text-[11px]">
              <strong>Denominator:</strong> Calls with non-null boolean connection values. Excludes unclassified calls and explicitly reports the denominator to prevent distorted connection statistics.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900 text-sm">Routing Distribution & Multi-Destination Semantics</strong>
              <span className="font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Multi-Route Capable</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Calculation:</strong> Sum of category assignments across all active records.
            </p>
            <p className="text-slate-500 text-[11px]">
              <strong>Accounting Rule:</strong> Because conversations may require more than one operational outcome (e.g., C03 is both Deal Follow-up and Technical Requirement), total route assignments may exceed the 44 record count.
            </p>
          </div>
        </div>
      </section>

      {/* Pre-generated vs Runtime Dynamic Architecture */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Pre-Generated vs. Dynamic Runtime Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-700 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Pre-Generated Content (AI-Assisted Grounding)</span>
            </div>
            <ul className="text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed text-[11px]">
              <li>Grounded conversation summaries, objections, commitments, and citations for all 18 transcripts.</li>
              <li>Dual-revision analysis states for M07 (rev 1 metadata intake vs rev 2 defect triage).</li>
              <li>Intake status templates for the 26 metadata-only records.</li>
              <li>Executive Manager Brief core narrative for 21 August 2026.</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold">
              <Layers className="w-4 h-4" />
              <span>Dynamic Runtime Computations (In-Browser)</span>
            </div>
            <ul className="text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed text-[11px]">
              <li>Ingestion engine: data contract validation, tuple deduplication, and revision replacement.</li>
              <li>Manual routing override management with state persistence in IndexedDB.</li>
              <li>Live mathematical metrics calculation, connection rates, and filter aggregations.</li>
              <li>Universal search and text scanning across transcripts, turns, and metadata.</li>
              <li>Dynamic client-side generation of ZIP archives and manifests.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
