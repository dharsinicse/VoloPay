import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AnalysisService } from '../../services/analysisService';
import { ROUTE_COLORS } from '../../services/routingService';
import { RouteCategory } from '../../types';
import {
  Phone,
  Video,
  FileCheck2,
  Clock,
  AlertTriangle,
  Sparkles,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  FileText,
  UserCheck
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DashboardProps {
  onNavigateToInbox: (filterPreset?: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToInbox }) => {
  const { recordsList, openRecordDetail, searchQuery } = useApp();

  const [typeFilter, setTypeFilter] = useState<'all' | 'call' | 'meeting'>('all');
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  // Filter records based on local filters + global search
  const filteredRecords = useMemo(() => {
    let list = recordsList;

    if (typeFilter !== 'all') {
      list = list.filter(r => r.source_type === typeFilter);
    }

    if (selectedPerson !== 'all') {
      list = list.filter(r => {
        const p = r.payload as any;
        return p.rep_name === selectedPerson || p.organizer_email === selectedPerson;
      });
    }

    if (selectedRoute !== 'all') {
      list = list.filter(r => r.routing.effectiveRoutes.includes(selectedRoute as RouteCategory));
    }

    if (searchQuery) {
      list = AnalysisService.search(list, searchQuery);
    }

    return list;
  }, [recordsList, typeFilter, selectedPerson, selectedRoute, searchQuery]);

  const metrics = useMemo(() => {
    return AnalysisService.computeMetrics(filteredRecords);
  }, [filteredRecords]);

  // Total baseline metrics (unfiltered) for denominator transparency
  const baselineMetrics = useMemo(() => {
    return AnalysisService.computeMetrics(recordsList);
  }, [recordsList]);

  // Chart data for Routing Distribution
  const routeChartData = useMemo(() => {
    return Object.entries(metrics.routingDistribution).map(([name, count]) => ({
      name,
      count
    }));
  }, [metrics.routingDistribution]);

  // Chart data for Coverage
  const coverageData = [
    { name: 'Usable Text', value: metrics.usableTranscriptsCount, color: '#4f46e5' },
    { name: 'Metadata Only', value: metrics.totalRecords - metrics.usableTranscriptsCount, color: '#cbd5e1' }
  ];

  // Unique reps and organisers for filter dropdown
  const allPersons = useMemo(() => {
    const reps = new Set<string>();
    const orgs = new Set<string>();
    recordsList.forEach(r => {
      const p = r.payload as any;
      if (p.rep_name) reps.add(p.rep_name);
      if (p.organizer_email) orgs.add(p.organizer_email);
    });
    return {
      reps: Array.from(reps).sort(),
      orgs: Array.from(orgs).sort()
    };
  }, [recordsList]);

  const hasActiveFilters = typeFilter !== 'all' || selectedPerson !== 'all' || selectedRoute !== 'all' || !!searchQuery;

  const resetFilters = () => {
    setTypeFilter('all');
    setSelectedPerson('all');
    setSelectedRoute('all');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Sample Context Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Revenue Intelligence Manager Briefing</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Executive Activity & Intelligence Overview</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Data window: <strong>21 August 2026 (Asia/Kolkata)</strong>. This workspace reflects a <strong>deliberately selected sample of 44 interactions</strong> for manager coaching, routing audit, and defect triage. Metrics reflect selected records, not total sales team headcount.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="block text-2xl font-bold font-mono text-emerald-400">
              {baselineMetrics.usableTranscriptsCount} / {baselineMetrics.totalRecords}
            </span>
            <span className="text-[11px] text-slate-400">
              Coverage: {baselineMetrics.transcriptCoveragePercent}%
            </span>
          </div>
          <button
            onClick={() => onNavigateToInbox()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center shadow-md transition-colors"
          >
            <span>View Inbox</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1 text-slate-500" /> Filter:
          </span>

          {/* Type Filter */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({baselineMetrics.totalRecords})
            </button>
            <button
              onClick={() => setTypeFilter('call')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === 'call' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Calls ({baselineMetrics.callsCount})
            </button>
            <button
              onClick={() => setTypeFilter('meeting')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                typeFilter === 'meeting' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meetings ({baselineMetrics.meetingsCount})
            </button>
          </div>

          {/* Person Filter (Reps & Organisers) */}
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All People (Reps & Organizers)</option>
            <optgroup label="Call Representatives">
              {allPersons.reps.map(r => (
                <option key={r} value={r}>Rep: {r}</option>
              ))}
            </optgroup>
            <optgroup label="Meeting Organizers (Not verified sales reps)">
              {allPersons.orgs.map(o => (
                <option key={o} value={o}>Organizer: {o}</option>
              ))}
            </optgroup>
          </select>

          {/* Route Filter */}
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="all">All Routing Categories</option>
            {Object.keys(baselineMetrics.routingDistribution).map(rt => (
              <option key={rt} value={rt}>{rt} ({baselineMetrics.routingDistribution[rt as RouteCategory]})</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-rose-600 flex items-center px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Reset Filters
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filteredRecords.length}</strong> of {baselineMetrics.totalRecords} records
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unique Records */}
        <div
          onClick={() => onNavigateToInbox()}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Unique Records</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{metrics.totalRecords}</span>
            <span className="text-xs text-slate-500">
              ({metrics.callsCount} calls, {metrics.meetingsCount} mtgs)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between items-center">
            <span>Key: (source_type, source_id)</span>
            <span className="text-indigo-600 font-medium group-hover:underline">Inspect →</span>
          </div>
        </div>

        {/* Card 2: Usable Transcript Coverage */}
        <div
          onClick={() => onNavigateToInbox({ hasTranscript: true })}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Conversation Coverage</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">
              {metrics.transcriptCoveragePercent}%
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({metrics.usableTranscriptsCount}/{metrics.totalRecords})
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between items-center">
            <span>Calls: {metrics.callCoveragePercent}% | Mtgs: {metrics.meetingCoveragePercent}%</span>
            <span className="text-emerald-600 font-medium group-hover:underline">View 18 →</span>
          </div>
        </div>

        {/* Card 3: Actionable Follow-ups */}
        <div
          onClick={() => onNavigateToInbox({ hasFollowUp: true })}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Grounded Follow-ups</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">
              {metrics.followUpActionsCount}
            </span>
            <span className="text-xs text-slate-500">
              evidence-backed tasks
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between items-center">
            <span>Critical SLAs: M07 (1-2h), M03</span>
            <span className="text-amber-600 font-medium group-hover:underline">Open Queue →</span>
          </div>
        </div>

        {/* Card 4: Metadata Inconsistencies & Overrides */}
        <div
          onClick={() => onNavigateToInbox({ hasInconsistencies: true })}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Source Inconsistencies</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-600 font-mono">
              {metrics.metadataInconsistenciesCount}
            </span>
            <span className="text-xs text-slate-500">
              ({metrics.manualOverridesCount} overrides active)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between items-center">
            <span>E.g. C04 (call tag), C06 (rep)</span>
            <span className="text-rose-600 font-medium group-hover:underline">Audit →</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Routing Taxonomy Breakdown (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Effective Routing Taxonomy Distribution</h3>
              <p className="text-xs text-slate-500">
                Total route assignments: <strong>{metrics.totalRouteAssignments}</strong> across {metrics.totalRecords} records (records may have multiple destinations)
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Click bar to filter inbox</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={routeChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#334155' }}
                  width={140}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} records`, 'Assigned Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar
                  dataKey="count"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                  onClick={(entry) => onNavigateToInbox({ route: entry.name })}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Transcript Coverage & Review Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Text Usability vs Review State</h3>
            <p className="text-xs text-slate-500 mb-3">
              Denominator: Total {metrics.totalRecords} selected records
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coverageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {coverageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} records`, 'Count']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-700">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-2"></span>
                Unreviewed
              </span>
              <strong className="font-mono text-slate-800">{metrics.unreviewedCount}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                Reviewed
              </span>
              <strong className="font-mono text-emerald-700">{metrics.reviewedCount}</strong>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span>
                Needs Clarification
              </span>
              <strong className="font-mono text-amber-700">{metrics.needsClarificationCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Rep & Organiser Activity Tables (Strictly Separated!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table 1: Call Representatives (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <Phone className="w-4 h-4 text-blue-600 mr-2" />
                Call Representatives Activity
              </h3>
              <p className="text-xs text-slate-500">
                Telephone calls grouped by rep account (30 calls total in selected extract)
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Conn rate: {baselineMetrics.callConnectionRate.ratePercent}% ({baselineMetrics.callConnectionRate.connectedCount}/{baselineMetrics.callConnectionRate.nonNullCount})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Rep Name</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Total Dials</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Usable Text</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Connected Tag</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Avg Duration</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.repActivity.map((rep) => (
                  <tr key={rep.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] mr-2">
                        {rep.name.substring(0, 2).toUpperCase()}
                      </div>
                      {rep.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium">{rep.totalCalls}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-mono font-semibold ${
                        rep.withTranscript > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'text-slate-400'
                      }`}>
                        {rep.withTranscript}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">{rep.connectedCount}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {rep.avgDurationSeconds}s
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onNavigateToInbox({ person: rep.name })}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-[11px]"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Meeting Organisers (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center">
                  <Video className="w-4 h-4 text-indigo-600 mr-2" />
                  Meeting Organizers
                </h3>
                <p className="text-xs text-slate-500">
                  Calendar organizers (Not automatically sales representatives)
                </p>
              </div>
              <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                14 Meetings
              </span>
            </div>

            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Organizer</th>
                    <th className="py-2 px-2 font-semibold text-center">Mtgs</th>
                    <th className="py-2 px-2 font-semibold text-center">Turns</th>
                    <th className="py-2 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.organiserActivity.map((org) => (
                    <tr key={org.email} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-slate-800 font-mono text-[11px] truncate max-w-[150px]">
                        {org.email}
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-medium">{org.totalMeetings}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-semibold text-[11px] ${
                          org.withTranscript > 0 ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'
                        }`}>
                          {org.withTranscript}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => onNavigateToInbox({ person: org.email })}
                          className="text-indigo-600 hover:text-indigo-900 font-medium text-[11px]"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 leading-normal">
            ℹ️ <strong>Methodology Note:</strong> Organizers are not assumed to be account executives or attendees without transcript verification.
          </div>
        </div>
      </div>
    </div>
  );
};
