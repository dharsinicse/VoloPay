import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RouteCategory, ReviewState } from '../../types';
import { ALL_ROUTE_CATEGORIES, ROUTE_COLORS } from '../../services/routingService';
import { formatDuration } from '../../utils/dateUtils';
import {
  X,
  Phone,
  Video,
  Clock,
  User,
  Building,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  FileQuestion,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Tag
} from 'lucide-react';

export const ConversationDetail: React.FC = () => {
  const {
    activeRecord,
    activeRecordKey,
    closeRecordDetail,
    applyManualOverride,
    resetToSuggested,
    setReviewStatus
  } = useApp();

  const [selectedRoutes, setSelectedRoutes] = useState<RouteCategory[]>([]);
  const [correctionNote, setCorrectionNote] = useState<string>('');
  const [currentReviewState, setCurrentReviewState] = useState<ReviewState>('unreviewed');
  const [textSearch, setTextSearch] = useState<string>('');
  const [highlightedTurn, setHighlightedTurn] = useState<number | null>(null);
  const [isEditingRoutes, setIsEditingRoutes] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  useEffect(() => {
    if (activeRecord) {
      setSelectedRoutes([...activeRecord.routing.effectiveRoutes]);
      setCorrectionNote(activeRecord.routing.manualCorrectionNote || '');
      setCurrentReviewState(activeRecord.routing.reviewStatus);
      setIsEditingRoutes(false);
      setTextSearch('');
      setHighlightedTurn(null);
    }
  }, [activeRecordKey, activeRecord?.applied_revision]);

  if (!activeRecord || !activeRecordKey) return null;

  const p = activeRecord.payload as any;
  const tp = activeRecord.transcript_payload;
  const a = activeRecord.analysis;
  const r = activeRecord.routing;

  const isCall = activeRecord.source_type === 'call';
  const displayTitle = isCall
    ? `Phone Call to ${p.to_number || 'Target Contact'} (Rep: ${p.rep_name || 'Unassigned'})`
    : p.title;

  const handleSaveOverride = async () => {
    if (selectedRoutes.length === 0) {
      alert('Please select at least one route category.');
      return;
    }
    await applyManualOverride(
      activeRecordKey,
      selectedRoutes,
      correctionNote.trim() ? correctionNote.trim() : null,
      currentReviewState
    );
    setIsEditingRoutes(false);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 2500);
  };

  const handleResetToSuggested = async () => {
    await resetToSuggested(activeRecordKey);
    setSelectedRoutes([...activeRecord.routing.suggestedRoutes]);
    setCorrectionNote('');
    setIsEditingRoutes(false);
  };

  const handleToggleRoute = (cat: RouteCategory) => {
    if (selectedRoutes.includes(cat)) {
      if (selectedRoutes.length === 1) {
        alert('Record must have at least one route assigned.');
        return;
      }
      setSelectedRoutes(selectedRoutes.filter(c => c !== cat));
    } else {
      setSelectedRoutes([...selectedRoutes, cat]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded">
              {activeRecord.record_ref}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              {isCall ? (
                <span className="flex items-center text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  <Phone className="w-3 h-3 mr-1" /> Call
                </span>
              ) : (
                <span className="flex items-center text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  <Video className="w-3 h-3 mr-1" /> Meeting
                </span>
              )}
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                Rev {activeRecord.applied_revision}
              </span>
              <span>•</span>
              <span>{activeRecord.local_date_kolkata} {activeRecord.local_time_kolkata} Asia/Kolkata</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {saveSuccessMessage && (
              <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded font-medium flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Saved
              </span>
            )}
            <button
              onClick={closeRecordDetail}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Metadata Strip */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{displayTitle}</h2>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
              <span>Source ID: <code className="font-mono text-slate-700">{activeRecord.source_id}</code></span>
              {isCall ? (
                <>
                  <span>•</span>
                  <span>Rep: <strong className="text-slate-800">{p.rep_name || 'N/A'}</strong> ({p.rep_email || 'No email'})</span>
                  <span>•</span>
                  <span>Duration: <strong>{formatDuration(p.duration_seconds)}</strong> (talk: {formatDuration(p.talk_time_seconds || 0)})</span>
                  <span>•</span>
                  <span>Telephony outcome: <span className="font-medium text-slate-700">{p.observed_outcome || 'N/A'}</span></span>
                </>
              ) : (
                <>
                  <span>•</span>
                  <span>Organizer: <strong className="text-slate-800">{p.organizer_email || 'N/A'}</strong></span>
                  <span>•</span>
                  <span>Scheduled: <strong>{formatDuration(p.duration_seconds)}</strong></span>
                  <span>•</span>
                  <span>Recording status: <span className="font-medium text-slate-700">{p.recording_status}</span></span>
                </>
              )}
            </div>
          </div>

          {/* Quick Review Status Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Review State:</span>
            <select
              value={currentReviewState}
              onChange={(e) => {
                const newStatus = e.target.value as ReviewState;
                setCurrentReviewState(newStatus);
                setReviewStatus(activeRecordKey, newStatus);
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:ring-indigo-500 focus:outline-none"
            >
              <option value="unreviewed">⏳ Unreviewed</option>
              <option value="reviewed">✅ Reviewed</option>
              <option value="needs_clarification">⚠️ Needs Clarification</option>
            </select>
          </div>
        </div>

        {/* Metadata Inconsistencies Warning Banner */}
        {activeRecord.metadata_inconsistencies.length > 0 && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Detected Source Metadata Inconsistencies:</span>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                {activeRecord.metadata_inconsistencies.map((issue, idx) => (
                  <li key={idx} className="font-medium">{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Difficult Case Banner for M07 */}
        {activeRecord.record_ref === 'M07' && (
          <div className="px-6 py-3 bg-indigo-50 border-b border-indigo-200 text-xs text-indigo-950">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
                Featured Demonstration Case: Willowfield Trust (M07)
              </span>
              <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                {activeRecord.applied_revision === 1 ? 'Batch 01 (Pre-update fixture)' : 'Batch 02 (Late transcript supplied)'}
              </span>
            </div>
            <p className="mt-1 text-slate-700 leading-relaxed">
              {activeRecord.applied_revision === 1
                ? 'In the initial delivery, M07 has no transcript. Managers can preview metadata and override routing before the update arrives. Upon importing batch 02_update.json, the 27-turn transcript arrives, and your manual override is strictly preserved.'
                : 'Competing interpretations: Product Bug Escalation vs Customer Retention vs Coaching. Customer A surfaced 4 distinct software defects (description save bug, broken document upload on Recreate Payment, stuck reimbursements, and INR 18,200 modal amount leak). Team member A gave a 1–2 hour follow-up SLA.'}
            </p>
          </div>
        )}

        {/* Two-Column Scrollable Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Full Transcript & Turns (7 Cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col h-full bg-slate-50/50 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <span>Conversation Content</span>
                <span className="ml-2 text-xs font-normal text-slate-500 font-mono">
                  ({activeRecord.usable_transcript ? `${activeRecord.transcript_text_length} chars` : 'Unavailable'})
                </span>
              </h3>

              {activeRecord.usable_transcript && (
                <div className="relative w-52">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                    placeholder="Search words in text..."
                    className="w-full bg-white border border-slate-200 rounded text-xs pl-7 pr-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Content Display */}
            {!activeRecord.usable_transcript ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-300 rounded-xl text-center">
                <FileQuestion className="w-10 h-10 text-slate-400 mb-2" />
                <h4 className="text-sm font-semibold text-slate-800">Transcript Unavailable</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
                  {isCall
                    ? 'No transcript was captured or supplied in this extract. Upstream outcome reported: ' + (p.observed_outcome || 'voicemail / unanswered')
                    : (tp?.unavailable_reason || 'Recording bot cancelled or meeting was silent.')}
                </p>
                <div className="mt-4 bg-slate-50 border border-slate-200 rounded p-3 text-left w-full text-xs text-slate-600 font-mono">
                  <div>source_type: {activeRecord.source_type}</div>
                  <div>source_id: {activeRecord.source_id}</div>
                  <div>intake_status: {activeRecord.intake_status}</div>
                  <div>recording_status: {p.recording_status || 'N/A'}</div>
                  <div>duration_seconds: {p.duration_seconds}s</div>
                </div>
              </div>
            ) : isCall ? (
              /* Call Transcript Display */
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-sm leading-relaxed text-slate-800 font-sans whitespace-pre-wrap">
                {p.transcript}
              </div>
            ) : (
              /* Meeting Turns Display */
              <div className="space-y-3">
                {tp?.turns.map((turn: any, index: number) => {
                  const turnNumber = index + 1;
                  const isHighlighted = highlightedTurn === turnNumber;
                  const matchesSearch = textSearch && turn.text.toLowerCase().includes(textSearch.toLowerCase());

                  return (
                    <div
                      key={index}
                      id={`turn-${turnNumber}`}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isHighlighted
                          ? 'bg-indigo-50 border-indigo-400 shadow-sm ring-2 ring-indigo-200'
                          : matchesSearch
                          ? 'bg-amber-50/70 border-amber-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                            Turn {turnNumber}
                          </span>
                          <span className="font-semibold text-slate-700">{turn.speaker}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">{turn.timecode || '00:00:00'}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-800">
                        {turn.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Grounded Analysis & Routing Engine (5 Cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col space-y-6 overflow-y-auto bg-white">
            {/* Section: Routing Decision & Manager Override */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Effective Routing
                </span>
                {r.isManualOverride ? (
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded">
                    Manual Override Active
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    Automated Suggestion
                  </span>
                )}
              </div>

              {/* Effective Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {r.effectiveRoutes.map((route, idx) => {
                  const style = ROUTE_COLORS[route] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
                  return (
                    <span
                      key={idx}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {route}
                    </span>
                  );
                })}
              </div>

              {/* Suggested Baseline */}
              <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded p-2.5 mb-3">
                <div className="font-semibold text-slate-800 mb-0.5">Automated Suggestion:</div>
                <div className="text-slate-600 text-[11px] leading-relaxed mb-1">
                  {r.suggestedRoutes.join(', ')} — {r.suggestedExplanation}
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  Evidence: {r.suggestedEvidence}
                </div>
              </div>

              {/* Edit Override Accordion */}
              {!isEditingRoutes ? (
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setIsEditingRoutes(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center"
                  >
                    <span>Change or override route</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>

                  {r.isManualOverride && (
                    <button
                      onClick={handleResetToSuggested}
                      className="text-xs text-slate-500 hover:text-rose-600 flex items-center"
                      title="Revert to automated suggestion"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" /> Reset to suggested
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-t border-slate-200 pt-3 mt-3 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Taxonomy Destinations (Multi-route supported):
                    </label>
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {ALL_ROUTE_CATEGORIES.map(cat => {
                        const isSelected = selectedRoutes.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleToggleRoute(cat)}
                            className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded text-xs border transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-500 font-semibold text-indigo-900'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>{cat}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Manager Justification / Correction Note:
                    </label>
                    <textarea
                      value={correctionNote}
                      onChange={(e) => setCorrectionNote(e.target.value)}
                      placeholder="Explain why this routing was chosen or changed..."
                      rows={2}
                      className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={handleSaveOverride}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded flex items-center justify-center shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Save Route Decision
                    </button>
                    <button
                      onClick={() => setIsEditingRoutes(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium py-1.5 px-3 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Manager Analysis */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Analytical Findings
                  </h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                    a.isStaleOrPendingReview
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {a.isStaleOrPendingReview ? 'STALE / PENDING REVIEW' : `FRESH (Rev ${a.freshnessRevision})`}
                  </span>
                </div>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {a.summary}
                </p>
              </div>

              {/* Why It Matters */}
              <div>
                <h5 className="text-xs font-bold text-slate-700">Why It Matters to Sales Management</h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {a.whyItMatters}
                </p>
              </div>

              {/* Recommended Action & Owner */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3">
                <div className="text-xs font-bold text-indigo-950 flex items-center">
                  <span>Recommended Next Action</span>
                  {a.actionOwner && (
                    <span className="ml-2 font-mono text-[11px] font-semibold bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded">
                      Owner: {a.actionOwner}
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-900 mt-1 font-medium leading-relaxed">
                  {a.recommendedAction || 'No action required.'}
                </p>
              </div>

              {/* Key Observations */}
              {a.keyPoints && a.keyPoints.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-1">Key Observations</h5>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {a.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Objections & Risks */}
              {a.objectionsOrRisks && a.objectionsOrRisks.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-rose-800 mb-1">Identified Objections & Risks</h5>
                  <ul className="text-xs text-rose-700 space-y-1">
                    {a.objectionsOrRisks.map((risk, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-1.5">⚠️</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Commercial Opportunities */}
              {a.opportunities && a.opportunities.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-emerald-800 mb-1">Commercial Opportunities</h5>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    {a.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-1.5">💡</span>
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grounded Evidence Citations */}
              {a.evidencePassages && a.evidencePassages.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <h5 className="text-xs font-bold text-slate-700 mb-2">Supporting Evidence Citations</h5>
                  <div className="space-y-2">
                    {a.evidencePassages.map((ev, i) => (
                      <div
                        key={i}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-700">
                          <span>{ev.citation}</span>
                          {ev.turnNumber && (
                            <button
                              onClick={() => {
                                setHighlightedTurn(ev.turnNumber!);
                                const el = document.getElementById(`turn-${ev.turnNumber}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                              className="text-indigo-600 hover:text-indigo-900 underline text-[10px]"
                            >
                              Jump to Turn {ev.turnNumber}
                            </button>
                          )}
                        </div>
                        <p className="text-slate-800 italic bg-white p-1.5 rounded border border-slate-100 font-serif">
                          "{ev.quote}"
                        </p>
                        <p className="text-[11px] text-slate-500">
                          <strong className="text-slate-600">Significance:</strong> {ev.significance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncertainties & Missing Information */}
              {a.uncertainties && a.uncertainties.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <h5 className="text-xs font-bold text-slate-500 mb-1">Uncertainties & Missing Data</h5>
                  <ul className="text-xs text-slate-500 space-y-0.5 list-disc list-inside">
                    {a.uncertainties.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
