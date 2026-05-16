export type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  loyalty_tier: string;
  interaction_style: "low_touch" | "balanced" | "high_touch";
  privacy_level: "discreet" | "standard" | "open";
  created_at: string;
};

export type Stay = {
  id: string;
  property_id: string;
  reservation_holder_id: string;
  purpose_of_trip: string;
  occasion: string;
  arrival_date: string;
  departure_date: string;
  status: "arriving_today" | "in_house" | "departed";
  group_size: number;
  interaction_preference: "low_touch" | "balanced" | "high_touch";
  budget_sensitivity: "low" | "moderate" | "high";
  created_at: string;
};

export type StayGuest = {
  id: string;
  stay_id: string;
  guest_id: string;
  role: "reservation_holder" | "guest";
};

export type Memory = {
  id: string;
  guest_id: string;
  memory: string;
  source: string;
  confidence_score: number;
  permission_scope: "staff" | "stay" | "property";
  expires_at: string | null;
  created_at: string;
};

export type Task = {
  id: string;
  stay_id: string;
  assigned_to: string;
  priority: "low" | "medium" | "high";
  status: "suggested" | "approved" | "in_progress" | "done";
  task_type: "arrival" | "concierge" | "dining" | "transport" | "housekeeping";
  description: string;
  due_at: string;
  created_at: string;
};

export type Moment = {
  id: string;
  stay_id: string;
  title: string;
  reasoning: string;
  guest_message: string;
  staff_action: string;
  revenue_opportunity: number;
  relevance_score: number;
  comfort_score: number;
  creepiness_score: number;
  status: "suggested" | "approved" | "suppressed" | "sent";
  created_at: string;
};

export type Communication = {
  id: string;
  stay_id: string;
  sender_type: "guest" | "staff" | "system";
  message: string;
  channel: "sms" | "app" | "internal_note";
  created_at: string;
};

export type Spending = {
  id: string;
  stay_id: string;
  category: string;
  amount: number;
  source: string;
  timestamp: string;
};

export type RoomPreference = {
  id: string;
  guest_id: string;
  temperature: number;
  lighting: string;
  music: string;
  streaming_services: string[];
  bed_type: string;
  pillow_type: string;
};

export type Property = {
  id: string;
  name: string;
  brand: string;
  location: string;
  sense_of_place: string;
  local_context: string;
};

export type IcpProfile = {
  id: string;
  name: string;
  buyer: string;
  property_fit: string;
  guest_archetype: string;
  demo_value: string;
};

export type ArrivalSignal = {
  id: string;
  stay_id: string;
  signal_type: "flight" | "wellness" | "social" | "preference" | "local_context" | "staff_note";
  source: string;
  summary: string;
  trust_level: "observed" | "stated" | "inferred";
  consent_scope: "stay" | "property" | "global" | "do_not_store";
  created_at: string;
};

export type LocalEvent = {
  id: string;
  property_id: string;
  title: string;
  category: "dining" | "wellness" | "culture" | "outdoors" | "family";
  description: string;
  starts_at: string;
  fit_note: string;
};

export type MemoryGovernance = {
  id: string;
  stay_id: string;
  candidate_memory: string;
  decision: "remember" | "stay_scoped" | "ask_permission" | "never_store";
  rationale: string;
  expires_at: string | null;
};

export type SuppressedRecommendation = {
  id: string;
  stay_id: string;
  title: string;
  suppression_reason: string;
  safer_alternative: string;
};

export type StaffBrief = {
  id: string;
  stay_id: string;
  briefing_type: "arrival" | "in_stay" | "post_stay";
  summary: string;
  priority: "low" | "medium" | "high";
  owner: string;
};

export type PostStayEngagement = {
  id: string;
  stay_id: string;
  trigger_name: string;
  suggested_timing: string;
  message_intent: string;
  consent_required: boolean;
};

export type GuestDirectoryEntry = Guest & {
  current_stay_id: string | null;
  current_stay_occasion: string | null;
  last_stay_id: string | null;
  last_stay_occasion: string | null;
  last_property_id: string | null;
  memory_count: number;
  memories: Memory[];
  total_stays: number;
};

export type StayContextSummary = {
  interaction_style: "low_touch" | "balanced" | "high_touch";
  trip_type: string;
  energy_state: string;
  recommended_tone: string;
  stay_read: string;
  restraint_guidance: string;
};

export type MomentScore = {
  comfort: number;
  creepiness: number;
  relevance: number;
  revenue_opportunity: number;
};

export type TaskSuggestion = {
  task_type: Task["task_type"];
  assigned_to: string;
  priority: Task["priority"];
  description: string;
  due_at: string;
};

export type HospitalityMomentRecommendation = {
  title: string;
  reasoning: string;
  guest_message: string;
  staff_action: string;
  scores: MomentScore;
  task_suggestions: TaskSuggestion[];
};

export type StayDetail = {
  stay: Stay;
  property?: Property;
  guests: Guest[];
  holder: Guest;
  memories: Memory[];
  tasks: Task[];
  moments: Moment[];
  communications: Communication[];
  spending: Spending[];
  roomPreferences: RoomPreference[];
  arrivalSignals: ArrivalSignal[];
  localEvents: LocalEvent[];
  memoryGovernance: MemoryGovernance[];
  suppressedRecommendations: SuppressedRecommendation[];
  staffBriefs: StaffBrief[];
  postStayEngagements: PostStayEngagement[];
  context: StayContextSummary;
};
