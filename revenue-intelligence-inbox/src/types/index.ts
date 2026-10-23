export type SourceType = 'call' | 'meeting';

export type RouteCategory =
  | 'Sales Coaching'
  | 'Deal / Opportunity Follow-up'
  | 'Customer Follow-up'
  | 'Internal / Vendor Coordination'
  | 'Product / Technical Requirement'
  | 'Relationship / Partnership'
  | 'No Action / Low Priority'
  | 'Human Review Required';

export type ReviewState = 'unreviewed' | 'reviewed' | 'needs_clarification';

export interface CallPayload {
  id: string;
  external_call_id: string;
  workspace_slug: string;
  rep_email: string | null;
  rep_name: string | null;
  rep_user_id: string | null;
  direction: string;
  direction_raw: string;
  from_number: string | null;
  to_number: string | null;
  started_at: string;
  duration_seconds: number;
  talk_time_seconds: number | null;
  speaker_count: number | null;
  segment_count: number | null;
  is_connected: boolean | null;
  is_conversation: boolean | null;
  observed_outcome: string | null;
  classification_reason: string | null;
  classification_status: string | null;
  is_campaign_call: boolean | null;
  first_dial_ever: boolean | null;
  first_connect_ever: boolean | null;
  prior_dials_ever: number | null;
  prior_connects_ever: number | null;
  summary: string | null;
  summary_status: string | null;
  transcript: string | null;
}

export interface MeetingTurn {
  speaker: string;
  starts_at_seconds: number;
  timecode: string;
  text: string;
}

export interface MeetingTranscriptPayload {
  meeting_id: string;
  turns: MeetingTurn[];
  unavailable_reason: string | null;
}

export interface MeetingPayload {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  duration_seconds: number;
  provider: string;
  join_url: string;
  organizer_email: string | null;
  attendee_count: number | null;
  recording_status: string;
  recording_detail: string | null;
  recording_id: string | null;
  has_transcript: boolean;
  has_video: boolean;
  summary: string | null;
  summary_status: string | null;
  redacted: boolean;
}

export interface SourceRecordEnvelope {
  record_ref: string;
  source_type: SourceType;
  source_id: string;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
}

export interface DeliveryEnvelope {
  batch_id: string;
  revision: number;
  exported_at: string;
  records: SourceRecordEnvelope[];
}

export interface EvidencePassage {
  citation: string; // e.g. "M07 Turn 21" or "C04 exact quote"
  turnNumber?: number;
  speaker?: string;
  quote: string;
  significance: string;
}

export interface DerivedAnalysis {
  summary: string;
  whyItMatters: string;
  keyPoints: string[];
  objectionsOrRisks: string[];
  opportunities: string[];
  commitments: string[];
  recommendedAction: string;
  actionOwner: string | null;
  uncertainties: string[];
  evidencePassages: EvidencePassage[];
  freshnessRevision: number;
  isStaleOrPendingReview: boolean;
}

export interface RouteDecision {
  suggestedRoutes: RouteCategory[];
  suggestedExplanation: string;
  suggestedEvidence: string;
  suggestedNextAction: string;
  manualOverrideRoutes: RouteCategory[] | null;
  manualCorrectionNote: string | null;
  effectiveRoutes: RouteCategory[];
  isManualOverride: boolean;
  reviewStatus: ReviewState;
}

export interface StoredRecord {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  payload: CallPayload | MeetingPayload;
  transcript_payload: MeetingTranscriptPayload | null;
  usable_transcript: boolean;
  transcript_text_length: number;
  local_date_kolkata: string;
  local_time_kolkata: string;
  intake_status: string;
  metadata_inconsistencies: string[];
  analysis: DerivedAnalysis;
  routing: RouteDecision;
  last_updated_at: string;
}

export interface ImportAuditEntry {
  id: string;
  timestamp: string;
  batch_id: string;
  revision: number;
  total_in_batch: number;
  records_added: number;
  records_updated: number;
  duplicates_ignored: number;
  unchanged_records: number;
  transcript_availability_changes: Array<{
    record_ref: string;
    source_type: SourceType;
    source_id: string;
    previous: boolean;
    current: boolean;
  }>;
  total_unique_records_after: number;
  usable_transcripts_after: number;
}

export interface ExportManifestItem {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  applied_revision: number;
  suggested_routes: RouteCategory[];
  effective_routes: RouteCategory[];
  output_paths: string[];
  processing_state: string;
  review_state: ReviewState;
  manual_override: boolean;
  analysis_freshness: string; // e.g. "Current (rev 2)" or "Stale / Pending Review"
  transcript_available: boolean;
}

export interface ExportManifest {
  export_id: string;
  generated_at: string;
  dataset_date: string;
  total_unique_records: number;
  calls_count: number;
  meetings_count: number;
  usable_transcripts_count: number;
  records: ExportManifestItem[];
}
