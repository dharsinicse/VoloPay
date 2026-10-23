import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StoredRecord, RouteCategory, ReviewState } from '../../types';
import { ALL_ROUTE_CATEGORIES, ROUTE_COLORS } from '../../services/routingService';
import { AnalysisService } from '../../services/analysisService';
import { formatDuration } from '../../utils/dateUtils';
import {
  Phone,
  Video,
  Clock,
  User,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Search,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface ConversationInboxProps {
  initialFilter?: any;
}

export const ConversationInbox: React.FC<ConversationInboxProps> = ({ initialFilter }) => {
  const { recordsList, openRecordDetail, searchQuery, setSearchQuery } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'call' | 'meeting'>(initialFilter?.type || 'all');
  const [routeFilter, setRouteFilter] = useState<string>(initialFilter?.route || 'all');
  const [reviewFilter, setReviewFilter] = useState<string>(initialFilter?.review || 'all');
  const [transcriptFilter, setTranscriptFilter] = useState<'all' | 'available' | 'unavailable'>(
    initialFilter?.hasTranscript !== undefined ? (initialFilter.hasTranscript ? 'available' : 'unavailable') : 'all'
  );
  const [overrideFilter, setOverrideFilter] = useState<'all' | 'overridden' | 'automated'>('all');
  const [followUpFilter, setFollowUpFilter] = useState<boolean>(initialFilter?.hasFollowUp || false);
  const [personFilter, setPersonFilter] = useState<string>(initialFilter?.person || 'all');
  const [inconsistencyFilter, setInconsistencyFilter] = useState<boolean>(initialFilter?.hasInconsistencies || false);

  const [sortField, setSortField] = useState<'time' | 'ref' | 'duration' | 'review'>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let result = recordsList;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(r => r.source_type === typeFilter);
    }

    // Route filter
    if (routeFilter !== 'all') {
      result = result.filter(r => r.routing.effectiveRoutes.includes(routeFilter as RouteCategory));
    }

    // Review status filter
    if (reviewFilter !== 'all') {
      result = result.filter(r => r.routing.reviewStatus === reviewFilter);
    }

    // Transcript availability
    if (transcriptFilter === 'available') {
      result = result.filter(r => r.usable_transcript);
    } else if (transcriptFilter === 'unavailable') {
      result = result.filter(r => !r.usable_transcript);
    }

    // Override filter
    if (overrideFilter === 'overridden') {
      result = result.filter(r => r.routing.isManualOverride);
    } else if (overrideFilter === 'automated') {
      result = result.filter(r => !r.routing.isManualOverride);
    }

    // Follow-up required
    if (followUpFilter) {
      result = result.filter(r => r.analysis.recommendedAction && r.analysis.recommendedAction.length > 0 && r.usable_transcript);
    }

    // Inconsistencies filter
    if (inconsistencyFilter) {
      result = result.filter(r => r.metadata_inconsistencies.length > 0);
    }

    // Person filter
    if (personFilter !== 'all') {
      result = result.filter(r => {
        const p = r.payload as any;
        return p.rep_name === personFilter || p.organizer_email === personFilter;
      });
    }

    // Universal Search
    if (searchQuery) {
      result = AnalysisService.search(result, searchQuery);
    }

    // Sorting
    return [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'time') {
        const timeA = a.source_type === 'call' ? (a.payload as any).started_at : (a.payload as any).starts_at;
        const timeB = b.source_type === 'call' ? (b.payload as any).started_at : (b.payload as any).starts_at;
        cmp = new Date(timeA).getTime() - new Date(timeB).getTime();
      } else if (sortField === 'ref') {
        cmp = a.record_ref.localeCompare(b.record_ref);
      } else if (sortField === 'duration') {
        const durA = (a.payload as any).duration_seconds || 0;
        const durB = (b.payload as any).duration_seconds || 0;
        cmp = durA - durB;
      } else if (sortField === 'review') {
        cmp = a.routing.reviewStatus.localeCompare(b.routing.reviewStatus);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [
    recordsList,
    typeFilter,
    routeFilter,
    reviewFilter,
    transcriptFilter,
    overrideFilter,
    followUpFilter,
    inconsistencyFilter,
    personFilter,
    searchQuery,
    sortField,
    sortDirection
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRecords.slice(start, start + pageSize);
  }, [filteredAndSortedRecords, currentPage, pageSize]);

  // Extract unique persons for filter
  const allPersons = useMemo(() => {
    const list = new Set<string>();
    recordsList.forEach(r => {
      const p = r.payload as any;
      if (p.rep_name) list.add(p.rep_name);
      if (p.organizer_email) list.add(p.organizer_email);
    });
    return Array.from(list).sort();
  }, [recordsList]);

  const handleResetFilters = () => {
    setTypeFilter('all');
    setRouteFilter('all');
    setReviewFilter('all');
    setTranscriptFilter('all');
    setOverrideFilter('all');
    setFollowUpFilter(false);
    setInconsistencyFilter(false);
    setPersonFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSort = (field: 'time' | 'ref' | 'duration' | 'review') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Conversation Inbox</h2>
          <p className="text-xs text-slate-500">
            Complete registry of all <strong>44 unique source records</strong> (30 calls, 14 meetings) for 21 August 2026.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-mono">
            Showing {filteredAndSortedRecords.length} of {recordsList.length} records
          </span>
        </div>
      </div>

      {/* Filter Matrix Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        {/* Row 1: Primary Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Source Type Filter */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => { setTypeFilter('all'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => { setTypeFilter('call'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === 'call' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calls
            </button>
            <button
              onClick={() => { setTypeFilter('meeting'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === 'meeting' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meetings
            </button>
          </div>

          {/* Route Category Dropdown */}
          <select
            value={routeFilter}
            onChange={(e) => { setRouteFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Routing Categories</option>
            {ALL_ROUTE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Review Status Dropdown */}
          <select
            value={reviewFilter}
            onChange={(e) => { setReviewFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Review States</option>
            <option value="unreviewed">⏳ Unreviewed</option>
            <option value="reviewed">✅ Reviewed</option>
            <option value="needs_clarification">⚠️ Needs Clarification</option>
          </select>

          {/* Transcript Usability Dropdown */}
          <select
            value={transcriptFilter}
            onChange={(e) => { setTranscriptFilter(e.target.value as any); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">Transcript: All</option>
            <option value="available">Usable Transcript Present</option>
            <option value="unavailable">Metadata Only (No text)</option>
          </select>

          {/* Person Dropdown */}
          <select
            value={personFilter}
            onChange={(e) => { setPersonFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Reps & Organizers</option>
            {allPersons.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Row 2: Quick Toggle Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 font-medium">Quick Toggles:</span>

          {/* Follow-up Required Pill */}
          <button
            onClick={() => { setFollowUpFilter(!followUpFilter); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              followUpFilter
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Follow-up Required Only
          </button>

          {/* Inconsistencies Pill */}
          <button
            onClick={() => { setInconsistencyFilter(!inconsistencyFilter); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              inconsistencyFilter
                ? 'bg-rose-100 border-rose-300 text-rose-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Metadata Discrepancies
          </button>

          {/* Overrides Pill */}
          <button
            onClick={() => {
              setOverrideFilter(overrideFilter === 'overridden' ? 'all' : 'overridden');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-full border transition-all ${
              overrideFilter === 'overridden'
                ? 'bg-indigo-100 border-indigo-300 text-indigo-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Human Overrides
          </button>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="ml-auto text-slate-400 hover:text-slate-700 flex items-center font-medium"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Clear all filters
          </button>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('ref')}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Ref</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Title / Target Contact</th>
                <th className="py-3 px-3 font-semibold">Rep / Organizer</th>
                <th
                  onClick={() => handleSort('time')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Local Time</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Transcript</th>
                <th className="py-3 px-4 font-semibold">Effective Routing</th>
                <th
                  onClick={() => handleSort('review')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900"
                >
                  <div className="flex items-center space-x-1">
                    <span>Review State</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No records matched the selected filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const p = record.payload as any;
                  const isCall = record.source_type === 'call';
                  const title = isCall
                    ? `Call to ${p.to_number || 'Target Contact'}`
                    : p.title;

                  const personDisplay = isCall
                    ? (p.rep_name || 'N/A')
                    : (p.organizer_email || 'N/A');

                  return (
                    <tr
                      key={`${record.source_type}__${record.source_id}`}
                      onClick={() => openRecordDetail(record.record_ref)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Ref Badge */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-700 px-2 py-1 rounded transition-colors">
                          {record.record_ref}
                        </span>
                        {record.record_ref === 'M07' && (
                          <span className="ml-1.5 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-sans font-bold">
                            DEMO
                          </span>
                        )}
                      </td>

                      {/* Source Type Icon */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isCall ? (
                          <span className="flex items-center text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium text-[11px] w-fit">
                            <Phone className="w-3 h-3 mr-1" /> Call
                          </span>
                        ) : (
                          <span className="flex items-center text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-medium text-[11px] w-fit">
                            <Video className="w-3 h-3 mr-1" /> Meeting
                          </span>
                        )}
                      </td>

                      {/* Title & Metadata Badges */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">
                          {title}
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{formatDuration(p.duration_seconds)}</span>
                          {record.metadata_inconsistencies.length > 0 && (
                            <span className="text-amber-600 font-medium flex items-center" title={record.metadata_inconsistencies.join('; ')}>
                              <AlertTriangle className="w-3 h-3 mr-0.5" /> Label Mismatch
                            </span>
                          )}
                          {record.routing.isManualOverride && (
                            <span className="text-indigo-600 font-medium font-mono">
                              [Override]
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Rep or Organizer */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-slate-800 text-[11px] truncate max-w-[130px]">
                          {personDisplay}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isCall ? 'Sales Rep' : 'Calendar Organizer'}
                        </div>
                      </td>

                      {/* Local Time */}
                      <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                        {record.local_time_kolkata}
                      </td>

                      {/* Transcript Usability */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {record.usable_transcript ? (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            {isCall ? `${record.transcript_text_length} chars` : `${record.transcript_payload?.turns.length} turns`}
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            Metadata only
                          </span>
                        )}
                      </td>

                      {/* Effective Routing Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {record.routing.effectiveRoutes.map((rt, idx) => {
                            const style = ROUTE_COLORS[rt] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' };
                            return (
                              <span
                                key={idx}
                                className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${style.bg} ${style.text} ${style.border}`}
                              >
                                {rt}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Review State */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {record.routing.reviewStatus === 'reviewed' ? (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px] flex items-center w-fit">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Reviewed
                          </span>
                        ) : record.routing.reviewStatus === 'needs_clarification' ? (
                          <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold text-[11px] flex items-center w-fit">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Needs Check
                          </span>
                        ) : (
                          <span className="text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium text-[11px] flex items-center w-fit">
                            <Clock className="w-3 h-3 mr-1" /> Unreviewed
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span className="text-indigo-600 font-semibold group-hover:underline text-[11px]">
                          Inspect →
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50">
          <div>
            Page <strong className="text-slate-800">{currentPage}</strong> of {totalPages}
          </div>

          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono">{currentPage}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
