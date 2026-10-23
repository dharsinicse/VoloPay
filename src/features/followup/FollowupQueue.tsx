import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROUTE_COLORS } from '../../services/routingService';
import {
  ListTodo,
  Clock,
  User,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Phone,
  Video,
  Sparkles,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const FollowupQueue: React.FC = () => {
  const { recordsList, openRecordDetail, setReviewStatus } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'commercial' | 'coaching'>('all');

  // Filter conversations with usable transcripts and recommended actions
  const actionableRecords = recordsList.filter(
    r => r.usable_transcript && r.analysis.recommendedAction && r.analysis.recommendedAction.length > 0
  );

  // Group by priority category
  const categorizedTasks = actionableRecords.map(r => {
    let priority: 'critical' | 'commercial' | 'coaching' = 'commercial';
    let urgency = 'Standard';

    if (r.record_ref === 'M07') {
      priority = 'critical';
      urgency = 'Urgent: 1–2 Hour SLA (Turn 19)';
    } else if (r.record_ref === 'M03' || r.record_ref === 'M04') {
      priority = 'critical';
      urgency = 'High Priority Deal/Retention';
    } else if (r.record_ref === 'C06' || r.record_ref === 'C09' || r.record_ref === 'C10' || r.record_ref === 'C01') {
      priority = 'coaching';
      urgency = 'Manager Coaching Directive';
    }

    return {
      record: r,
      priority,
      urgency
    };
  });

  const displayedTasks = categorizedTasks.filter(t => {
    if (filterType === 'all') return true;
    return t.priority === filterType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
            <ListTodo className="w-4 h-4" />
            <span>Execution Management</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manager Follow-up Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evidence-backed actionable commitments extracted from conversations on 21 August 2026.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Actionable ({categorizedTasks.length})
          </button>
          <button
            onClick={() => setFilterType('critical')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'critical' ? 'bg-white text-rose-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🚨 Critical Escalations
          </button>
          <button
            onClick={() => setFilterType('commercial')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'commercial' ? 'bg-white text-blue-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💼 Commercial Deals
          </button>
          <button
            onClick={() => setFilterType('coaching')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              filterType === 'coaching' ? 'bg-white text-purple-700 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Coaching Directives
          </button>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedTasks.map(({ record, priority, urgency }) => {
          const p = record.payload as any;
          const a = record.analysis;
          const isCall = record.source_type === 'call';

          return (
            <div
              key={`${record.source_type}__${record.source_id}`}
              className={`bg-white rounded-xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                priority === 'critical'
                  ? 'border-rose-200 hover:border-rose-400 bg-rose-50/10'
                  : priority === 'coaching'
                  ? 'border-purple-200 hover:border-purple-400'
                  : 'border-slate-200 hover:border-indigo-400'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {record.record_ref}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      priority === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : priority === 'coaching'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {urgency}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {record.local_time_kolkata}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {isCall ? `Call to ${p.to_number || 'Target Contact'}` : p.title}
                </h3>

                {/* Stated Action */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-2 text-xs text-slate-800 leading-relaxed font-medium">
                  {a.recommendedAction}
                </div>

                {/* Action Owner & Evidence Quote */}
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Assigned Owner:</span>
                    <strong className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px]">
                      {a.actionOwner || 'Unassigned in source'}
                    </strong>
                  </div>

                  {a.evidencePassages && a.evidencePassages[0] && (
                    <div className="text-[11px] text-slate-600 bg-white border border-slate-100 p-2 rounded italic">
                      "{a.evidencePassages[0].quote.substring(0, 140)}..."
                      <span className="block not-italic text-[10px] text-indigo-600 font-semibold mt-0.5">
                        — {a.evidencePassages[0].citation}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    record.routing.reviewStatus === 'reviewed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    Status: {record.routing.reviewStatus}
                  </span>
                </div>

                <button
                  onClick={() => openRecordDetail(record.record_ref)}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center group"
                >
                  <span>Open Full Record</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
