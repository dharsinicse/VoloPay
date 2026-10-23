import { RouteCategory, RouteDecision, ReviewState, StoredRecord } from '../types';
import { GROUNDED_RECORD_DATA, getMetadataOnlyIntake } from '../data/groundedAnalyses';

export const ALL_ROUTE_CATEGORIES: RouteCategory[] = [
  'Sales Coaching',
  'Deal / Opportunity Follow-up',
  'Customer Follow-up',
  'Internal / Vendor Coordination',
  'Product / Technical Requirement',
  'Relationship / Partnership',
  'No Action / Low Priority',
  'Human Review Required'
];

export const ROUTE_COLORS: Record<RouteCategory, { bg: string; text: string; border: string }> = {
  'Sales Coaching': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Deal / Opportunity Follow-up': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Customer Follow-up': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Internal / Vendor Coordination': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Product / Technical Requirement': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Relationship / Partnership': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'No Action / Low Priority': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
  'Human Review Required': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
};

export class RoutingService {
  /**
   * Determine suggested route and analysis based on source record and revision
   */
  static getSuggestedRouting(
    sourceType: 'call' | 'meeting',
    sourceId: string,
    recordRef: string,
    revision: number,
    payload: any,
    transcriptPayload: any
  ): {
    suggestedRoutes: RouteCategory[];
    suggestedExplanation: string;
    suggestedEvidence: string;
    suggestedNextAction: string;
    analysis: any;
  } {
    // Check specific grounded record data key
    let lookupKey = `${sourceType}__${sourceId}`;
    if (recordRef === 'M07') {
      lookupKey = revision >= 2
        ? `${sourceType}__${sourceId}_rev2`
        : `${sourceType}__${sourceId}_rev1`;
    }

    if (GROUNDED_RECORD_DATA[lookupKey]) {
      const data = GROUNDED_RECORD_DATA[lookupKey];
      return {
        suggestedRoutes: [...data.suggestedRoutes],
        suggestedExplanation: data.suggestedExplanation,
        suggestedEvidence: data.suggestedEvidence,
        suggestedNextAction: data.suggestedNextAction,
        analysis: { ...data.analysis, freshnessRevision: revision }
      };
    }

    // Fallback for metadata-only records (e.g. B01-B20, M05, M08, etc.)
    const unavailReason = transcriptPayload?.unavailable_reason;
    const recStatus = payload?.recording_status;
    const observedOutcome = payload?.observed_outcome;
    const duration = payload?.duration_seconds;

    const intake = getMetadataOnlyIntake(
      recordRef,
      sourceType,
      unavailReason,
      recStatus,
      observedOutcome,
      duration
    );

    return {
      suggestedRoutes: [...intake.suggestedRoutes],
      suggestedExplanation: intake.suggestedExplanation,
      suggestedEvidence: intake.suggestedEvidence,
      suggestedNextAction: intake.suggestedNextAction,
      analysis: { ...intake.analysis, freshnessRevision: revision }
    };
  }

  /**
   * Build complete RouteDecision merging automated suggestions and any manual overrides
   */
  static computeRouteDecision(
    suggestedRoutes: RouteCategory[],
    suggestedExplanation: string,
    suggestedEvidence: string,
    suggestedNextAction: string,
    existingOverride?: {
      manualOverrideRoutes: RouteCategory[] | null;
      manualCorrectionNote: string | null;
      reviewStatus: ReviewState;
    } | null
  ): RouteDecision {
    const isManualOverride = Boolean(
      existingOverride?.manualOverrideRoutes &&
      existingOverride.manualOverrideRoutes.length > 0
    );

    const effectiveRoutes = isManualOverride && existingOverride?.manualOverrideRoutes
      ? [...existingOverride.manualOverrideRoutes]
      : [...suggestedRoutes];

    return {
      suggestedRoutes: [...suggestedRoutes],
      suggestedExplanation,
      suggestedEvidence,
      suggestedNextAction,
      manualOverrideRoutes: existingOverride?.manualOverrideRoutes || null,
      manualCorrectionNote: existingOverride?.manualCorrectionNote || null,
      effectiveRoutes,
      isManualOverride,
      reviewStatus: existingOverride?.reviewStatus || (isManualOverride ? 'reviewed' : 'unreviewed')
    };
  }
}
