import { StoredRecord, RouteCategory } from '../types';
import { ALL_ROUTE_CATEGORIES } from './routingService';

export interface DashboardMetrics {
  totalRecords: number;
  callsCount: number;
  meetingsCount: number;
  usableTranscriptsCount: number;
  transcriptCoveragePercent: number; // Denominator: totalRecords (44)
  callCoveragePercent: number; // Denominator: callsCount (30)
  meetingCoveragePercent: number; // Denominator: meetingsCount (14)
  unreviewedCount: number;
  reviewedCount: number;
  needsClarificationCount: number;
  manualOverridesCount: number;
  metadataInconsistenciesCount: number;
  followUpActionsCount: number;
  routingDistribution: Record<RouteCategory, number>;
  totalRouteAssignments: number;
  repActivity: Array<{
    name: string;
    totalCalls: number;
    withTranscript: number;
    connectedCount: number;
    avgDurationSeconds: number;
  }>;
  organiserActivity: Array<{
    email: string;
    totalMeetings: number;
    withTranscript: number;
    recordedCount: number;
    cancelledCount: number;
    notScheduledCount: number;
  }>;
  callConnectionRate: {
    connectedCount: number;
    nonNullCount: number;
    ratePercent: number; // Denominator: calls with non-null is_connected
    nullCount: number;
  };
}

export class AnalysisService {
  /**
   * Compute comprehensive, mathematically traceable metrics from the current stored records
   */
  static computeMetrics(records: StoredRecord[]): DashboardMetrics {
    const totalRecords = records.length;
    const calls = records.filter(r => r.source_type === 'call');
    const meetings = records.filter(r => r.source_type === 'meeting');

    const usableTranscripts = records.filter(r => r.usable_transcript);
    const usableCalls = calls.filter(c => c.usable_transcript);
    const usableMeetings = meetings.filter(m => m.usable_transcript);

    const unreviewed = records.filter(r => r.routing.reviewStatus === 'unreviewed');
    const reviewed = records.filter(r => r.routing.reviewStatus === 'reviewed');
    const needsClarification = records.filter(r => r.routing.reviewStatus === 'needs_clarification');

    const manualOverrides = records.filter(r => r.routing.isManualOverride);
    const inconsistencies = records.filter(r => r.metadata_inconsistencies.length > 0);
    const followUps = records.filter(r => r.analysis.recommendedAction && r.analysis.recommendedAction.length > 0 && r.usable_transcript);

    // Routing distribution (multi-route assignments allowed)
    const routingDistribution: Record<RouteCategory, number> = ALL_ROUTE_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = 0;
      return acc;
    }, {} as Record<RouteCategory, number>);

    let totalRouteAssignments = 0;
    records.forEach(r => {
      r.routing.effectiveRoutes.forEach(route => {
        if (routingDistribution[route] !== undefined) {
          routingDistribution[route]++;
          totalRouteAssignments++;
        }
      });
    });

    // Call Representatives Breakdown
    const repMap: Record<string, { calls: StoredRecord[] }> = {};
    calls.forEach(c => {
      const rep = (c.payload as any).rep_name || 'Unassigned';
      if (!repMap[rep]) repMap[rep] = { calls: [] };
      repMap[rep].calls.push(c);
    });

    const repActivity = Object.entries(repMap).map(([name, data]) => {
      const repCalls = data.calls;
      const withTx = repCalls.filter(c => c.usable_transcript).length;
      const connected = repCalls.filter(c => (c.payload as any).is_connected === true).length;
      const totalDur = repCalls.reduce((acc, c) => acc + ((c.payload as any).duration_seconds || 0), 0);
      return {
        name,
        totalCalls: repCalls.length,
        withTranscript: withTx,
        connectedCount: connected,
        avgDurationSeconds: repCalls.length > 0 ? Math.round(totalDur / repCalls.length) : 0
      };
    }).sort((a, b) => b.totalCalls - a.totalCalls);

    // Meeting Organisers Breakdown (NOT assumed to be sales reps)
    const orgMap: Record<string, { meetings: StoredRecord[] }> = {};
    meetings.forEach(m => {
      const org = (m.payload as any).organizer_email || 'Unassigned';
      if (!orgMap[org]) orgMap[org] = { meetings: [] };
      orgMap[org].meetings.push(m);
    });

    const organiserActivity = Object.entries(orgMap).map(([email, data]) => {
      const orgMeetings = data.meetings;
      const withTx = orgMeetings.filter(m => m.usable_transcript).length;
      const recorded = orgMeetings.filter(m => (m.payload as any).recording_status === 'recorded').length;
      const cancelled = orgMeetings.filter(m => (m.payload as any).recording_status === 'cancelled').length;
      const notScheduled = orgMeetings.filter(m => (m.payload as any).recording_status === 'not_scheduled').length;
      return {
        email,
        totalMeetings: orgMeetings.length,
        withTranscript: withTx,
        recordedCount: recorded,
        cancelledCount: cancelled,
        notScheduledCount: notScheduled
      };
    }).sort((a, b) => b.totalMeetings - a.totalMeetings);

    // Call Connection Rate Traceable Calculation
    let connectedCallsCount = 0;
    let nonNullConnectedCallsCount = 0;
    let nullConnectedCallsCount = 0;
    calls.forEach(c => {
      const isConn = (c.payload as any).is_connected;
      if (isConn === null || isConn === undefined) {
        nullConnectedCallsCount++;
      } else {
        nonNullConnectedCallsCount++;
        if (isConn === true) connectedCallsCount++;
      }
    });

    return {
      totalRecords,
      callsCount: calls.length,
      meetingsCount: meetings.length,
      usableTranscriptsCount: usableTranscripts.length,
      transcriptCoveragePercent: totalRecords > 0 ? Math.round((usableTranscripts.length / totalRecords) * 1000) / 10 : 0,
      callCoveragePercent: calls.length > 0 ? Math.round((usableCalls.length / calls.length) * 1000) / 10 : 0,
      meetingCoveragePercent: meetings.length > 0 ? Math.round((usableMeetings.length / meetings.length) * 1000) / 10 : 0,
      unreviewedCount: unreviewed.length,
      reviewedCount: reviewed.length,
      needsClarificationCount: needsClarification.length,
      manualOverridesCount: manualOverrides.length,
      metadataInconsistenciesCount: inconsistencies.length,
      followUpActionsCount: followUps.length,
      routingDistribution,
      totalRouteAssignments,
      repActivity,
      organiserActivity,
      callConnectionRate: {
        connectedCount: connectedCallsCount,
        nonNullCount: nonNullConnectedCallsCount,
        ratePercent: nonNullConnectedCallsCount > 0 ? Math.round((connectedCallsCount / nonNullConnectedCallsCount) * 1000) / 10 : 0,
        nullCount: nullConnectedCallsCount
      }
    };
  }

  /**
   * Universal search across ref, title/company, rep/organiser, transcript text, turns, and evidence
   */
  static search(records: StoredRecord[], query: string): StoredRecord[] {
    if (!query || !query.trim()) return records;
    const q = query.trim().toLowerCase();

    return records.filter(r => {
      const p = r.payload as any;
      const tp = r.transcript_payload;

      // Check record reference and source ID
      if (r.record_ref.toLowerCase().includes(q)) return true;
      if (r.source_id.toLowerCase().includes(q)) return true;

      // Check title or company
      if (r.source_type === 'meeting' && p.title && p.title.toLowerCase().includes(q)) return true;
      if (r.source_type === 'call') {
        if (p.to_number && p.to_number.toLowerCase().includes(q)) return true;
        if (p.rep_name && p.rep_name.toLowerCase().includes(q)) return true;
        if (p.observed_outcome && p.observed_outcome.toLowerCase().includes(q)) return true;
      }

      // Check rep or organiser email
      if (p.rep_email && p.rep_email.toLowerCase().includes(q)) return true;
      if (p.organizer_email && p.organizer_email.toLowerCase().includes(q)) return true;

      // Check routes
      if (r.routing.effectiveRoutes.some(rt => rt.toLowerCase().includes(q))) return true;

      // Check transcript text
      if (r.source_type === 'call' && p.transcript && p.transcript.toLowerCase().includes(q)) return true;

      // Check meeting turns
      if (r.source_type === 'meeting' && tp?.turns) {
        if (tp.turns.some((t: any) => t.text?.toLowerCase().includes(q) || t.speaker?.toLowerCase().includes(q))) {
          return true;
        }
      }

      // Check analysis text
      if (r.analysis.summary.toLowerCase().includes(q)) return true;
      if (r.analysis.recommendedAction.toLowerCase().includes(q)) return true;

      return false;
    });
  }
}
