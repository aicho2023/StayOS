import type {
  Communication,
  Guest,
  ArrivalSignal,
  IcpProfile,
  LocalEvent,
  MemoryGovernance,
  Memory,
  Moment,
  PostStayEngagement,
  Property,
  RoomPreference,
  Spending,
  Stay,
  StayContextSummary,
  StayDetail,
  StayGuest,
  StaffBrief,
  SuppressedRecommendation,
  Task,
} from "@/lib/types";

const now = "2026-05-16T09:30:00-07:00";

export const properties: Property[] = [
  {
    id: "rosewood-sand-hill",
    name: "Rosewood Sand Hill",
    brand: "Rosewood",
    location: "Menlo Park, California",
    sense_of_place:
      "A residential Silicon Valley retreat shaped by gardens, California cuisine, wellness, and quiet proximity to Sand Hill Road.",
    local_context:
      "Relevant local context includes Madera, Asaya Spa, private gardens, Stanford cultural programming, cycling routes, and investor meeting rhythms.",
  },
];

export const icpProfiles: IcpProfile[] = [
  {
    id: "icp-ultra-luxury-retreat",
    name: "Ultra-luxury resort or urban retreat",
    buyer: "General Manager, Rooms Director, Experience Director",
    property_fit: "Properties where service quality depends on subtle, cross-department context.",
    guest_archetype: "Privacy-sensitive VIPs, returning couples, founders, families, wellness guests",
    demo_value: "Shows arrival choreography and invisible concierge without replacing staff.",
  },
  {
    id: "icp-multi-property-group",
    name: "Multi-property luxury hotel group",
    buyer: "Brand experience, loyalty, and operations leadership",
    property_fit: "Groups that need memory continuity across PMS, CRM, POS, loyalty, and property notes.",
    guest_archetype: "Returning guests who expect preferences to travel across properties",
    demo_value: "Shows governed memory and post-stay continuity without spam.",
  },
  {
    id: "icp-wellness-luxury",
    name: "Wellness-led luxury property",
    buyer: "Spa Director, Wellness Director, Guest Experience Lead",
    property_fit: "Properties where recovery, sleep, nutrition, and privacy-sensitive preferences shape the stay.",
    guest_archetype: "Guests seeking sleep, recovery, quiet programming, and consent-aware recommendations",
    demo_value: "Shows wellness-aware service with explicit suppression of invasive inference.",
  },
];

export const guests: Guest[] = [
  {
    id: "guest-olivia",
    first_name: "Olivia",
    last_name: "Chen",
    email: "olivia@halcyonlabs.ai",
    phone: "+1 415 555 0142",
    loyalty_tier: "Rosewood Elite",
    interaction_style: "low_touch",
    privacy_level: "discreet",
    created_at: now,
  },
  {
    id: "guest-marcus",
    first_name: "Marcus",
    last_name: "Reed",
    email: "marcus@halcyonlabs.ai",
    phone: "+1 415 555 0188",
    loyalty_tier: "Signature",
    interaction_style: "balanced",
    privacy_level: "standard",
    created_at: now,
  },
  {
    id: "guest-priya",
    first_name: "Priya",
    last_name: "Raman",
    email: "priya@halcyonlabs.ai",
    phone: "+1 415 555 0136",
    loyalty_tier: "Signature",
    interaction_style: "low_touch",
    privacy_level: "discreet",
    created_at: now,
  },
  {
    id: "guest-elena",
    first_name: "Elena",
    last_name: "Morales",
    email: "elena@example.com",
    phone: "+1 212 555 0191",
    loyalty_tier: "Rosewood Elite",
    interaction_style: "balanced",
    privacy_level: "standard",
    created_at: now,
  },
  {
    id: "guest-david",
    first_name: "David",
    last_name: "Morales",
    email: "david@example.com",
    phone: "+1 212 555 0192",
    loyalty_tier: "Rosewood Elite",
    interaction_style: "balanced",
    privacy_level: "standard",
    created_at: now,
  },
  {
    id: "guest-naomi",
    first_name: "Naomi",
    last_name: "Hart",
    email: "naomi@example.com",
    phone: "+1 310 555 0166",
    loyalty_tier: "Signature",
    interaction_style: "low_touch",
    privacy_level: "discreet",
    created_at: now,
  },
  {
    id: "guest-amelia",
    first_name: "Amelia",
    last_name: "Kwan",
    email: "amelia@example.com",
    phone: "+1 650 555 0182",
    loyalty_tier: "Guest",
    interaction_style: "high_touch",
    privacy_level: "open",
    created_at: now,
  },
  {
    id: "guest-sophia",
    first_name: "Sophia",
    last_name: "Laurent",
    email: "sophia@example.com",
    phone: "+33 6 55 01 22 18",
    loyalty_tier: "Rosewood Elite",
    interaction_style: "low_touch",
    privacy_level: "discreet",
    created_at: now,
  },
  {
    id: "guest-karim",
    first_name: "Karim",
    last_name: "Almasi",
    email: "karim@example.com",
    phone: "+971 50 555 0198",
    loyalty_tier: "Rosewood Elite",
    interaction_style: "balanced",
    privacy_level: "standard",
    created_at: now,
  },
  {
    id: "guest-vivian",
    first_name: "Vivian",
    last_name: "Park",
    email: "vivian@example.com",
    phone: "+1 646 555 0177",
    loyalty_tier: "Signature",
    interaction_style: "high_touch",
    privacy_level: "open",
    created_at: now,
  },
];

export const stays: Stay[] = [
  {
    id: "stay-sandhill-founders",
    property_id: "rosewood-sand-hill",
    reservation_holder_id: "guest-olivia",
    purpose_of_trip:
      "Founder team in Menlo Park after Sand Hill Road partner meetings, a late-stage fundraising pitch, and a delayed inbound flight from Seattle.",
    occasion: "Founder retreat after investor meetings",
    arrival_date: "2026-05-16",
    departure_date: "2026-05-19",
    status: "arriving_today",
    group_size: 3,
    interaction_preference: "low_touch",
    budget_sensitivity: "low",
    created_at: now,
  },
  {
    id: "stay-returning-suite",
    property_id: "rosewood-sand-hill",
    reservation_holder_id: "guest-marcus",
    purpose_of_trip: "Returning guest overnighting before a board dinner.",
    occasion: "Board dinner",
    arrival_date: "2026-05-16",
    departure_date: "2026-05-17",
    status: "arriving_today",
    group_size: 1,
    interaction_preference: "balanced",
    budget_sensitivity: "moderate",
    created_at: now,
  },
  {
    id: "stay-anniversary-return",
    property_id: "rosewood-sand-hill",
    reservation_holder_id: "guest-elena",
    purpose_of_trip: "Returning couple celebrating a quiet anniversary after visiting Rosewood London last year.",
    occasion: "Anniversary weekend",
    arrival_date: "2026-05-16",
    departure_date: "2026-05-18",
    status: "arriving_today",
    group_size: 2,
    interaction_preference: "balanced",
    budget_sensitivity: "low",
    created_at: now,
  },
  {
    id: "stay-wellness-recovery",
    property_id: "rosewood-sand-hill",
    reservation_holder_id: "guest-naomi",
    purpose_of_trip: "Solo recovery weekend after long-haul travel and a packed work month.",
    occasion: "Sleep and recovery reset",
    arrival_date: "2026-05-16",
    departure_date: "2026-05-20",
    status: "arriving_today",
    group_size: 1,
    interaction_preference: "low_touch",
    budget_sensitivity: "moderate",
    created_at: now,
  },
  {
    id: "stay-family-culture",
    property_id: "rosewood-sand-hill",
    reservation_holder_id: "guest-amelia",
    purpose_of_trip: "Multigenerational family visit blending Stanford campus time, dining, and a birthday.",
    occasion: "Family birthday weekend",
    arrival_date: "2026-05-17",
    departure_date: "2026-05-21",
    status: "arriving_today",
    group_size: 5,
    interaction_preference: "high_touch",
    budget_sensitivity: "moderate",
    created_at: now,
  },
  {
    id: "stay-sophia-paris-past",
    property_id: "rosewood-hotel-de-crillon",
    reservation_holder_id: "guest-sophia",
    purpose_of_trip: "Couture week and quiet recovery between events.",
    occasion: "Paris couture week",
    arrival_date: "2025-07-02",
    departure_date: "2025-07-07",
    status: "departed",
    group_size: 1,
    interaction_preference: "low_touch",
    budget_sensitivity: "low",
    created_at: now,
  },
  {
    id: "stay-karim-london-past",
    property_id: "rosewood-london",
    reservation_holder_id: "guest-karim",
    purpose_of_trip: "Family holiday with private dining and museum programming.",
    occasion: "Family winter holiday",
    arrival_date: "2025-12-18",
    departure_date: "2025-12-24",
    status: "departed",
    group_size: 4,
    interaction_preference: "balanced",
    budget_sensitivity: "low",
    created_at: now,
  },
  {
    id: "stay-vivian-hk-past",
    property_id: "rosewood-hong-kong",
    reservation_holder_id: "guest-vivian",
    purpose_of_trip: "Art fair weekend and client hosting.",
    occasion: "Art Basel Hong Kong",
    arrival_date: "2025-03-26",
    departure_date: "2025-03-31",
    status: "departed",
    group_size: 2,
    interaction_preference: "high_touch",
    budget_sensitivity: "moderate",
    created_at: now,
  },
];

export const stayGuests: StayGuest[] = [
  { id: "sg-1", stay_id: "stay-sandhill-founders", guest_id: "guest-olivia", role: "reservation_holder" },
  { id: "sg-2", stay_id: "stay-sandhill-founders", guest_id: "guest-marcus", role: "guest" },
  { id: "sg-3", stay_id: "stay-sandhill-founders", guest_id: "guest-priya", role: "guest" },
  { id: "sg-4", stay_id: "stay-returning-suite", guest_id: "guest-marcus", role: "reservation_holder" },
  { id: "sg-5", stay_id: "stay-anniversary-return", guest_id: "guest-elena", role: "reservation_holder" },
  { id: "sg-6", stay_id: "stay-anniversary-return", guest_id: "guest-david", role: "guest" },
  { id: "sg-7", stay_id: "stay-wellness-recovery", guest_id: "guest-naomi", role: "reservation_holder" },
  { id: "sg-8", stay_id: "stay-family-culture", guest_id: "guest-amelia", role: "reservation_holder" },
  { id: "sg-9", stay_id: "stay-sophia-paris-past", guest_id: "guest-sophia", role: "reservation_holder" },
  { id: "sg-10", stay_id: "stay-karim-london-past", guest_id: "guest-karim", role: "reservation_holder" },
  { id: "sg-11", stay_id: "stay-vivian-hk-past", guest_id: "guest-vivian", role: "reservation_holder" },
];

export const memories: Memory[] = [
  {
    id: "memory-1",
    guest_id: "guest-olivia",
    memory:
      "Prefers quietly handled arrivals, concise app messages, and no public recognition when traveling with her leadership team.",
    source: "Previous Rosewood Sand Hill stay",
    confidence_score: 0.86,
    permission_scope: "property",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-2",
    guest_id: "guest-priya",
    memory:
      "Asked for feather-free pillows, a desk setup away from the bed, and sparkling water near the workspace before arrival.",
    source: "Pre-arrival preference form",
    confidence_score: 0.94,
    permission_scope: "stay",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-3",
    guest_id: "guest-marcus",
    memory:
      "Enjoys low-key California cuisine and usually avoids tasting menus after work events; prefers a flexible table over a fixed dining commitment.",
    source: "Dining note",
    confidence_score: 0.72,
    permission_scope: "staff",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-4",
    guest_id: "guest-marcus",
    memory: "When traveling solo before board events, appreciates a precise arrival and one practical dinner option.",
    source: "Experience lead note",
    confidence_score: 0.68,
    permission_scope: "staff",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-5",
    guest_id: "guest-sophia",
    memory: "Prefers a very quiet arrival, chilled still water, and no floral scent in the suite.",
    source: "Rosewood Hotel de Crillon stay",
    confidence_score: 0.9,
    permission_scope: "property",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-6",
    guest_id: "guest-sophia",
    memory: "Enjoys private museum access and fashion-adjacent cultural programming, but dislikes public recognition.",
    source: "Concierge note",
    confidence_score: 0.82,
    permission_scope: "staff",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-7",
    guest_id: "guest-karim",
    memory: "Travels with family, prefers adjoining suites, early private dining, and child-friendly cultural plans.",
    source: "Rosewood London family stay",
    confidence_score: 0.88,
    permission_scope: "property",
    expires_at: null,
    created_at: now,
  },
  {
    id: "memory-8",
    guest_id: "guest-vivian",
    memory: "Likes high-touch art programming, gallery previews, and staff who can move quickly on restaurant holds.",
    source: "Rosewood Hong Kong art fair stay",
    confidence_score: 0.78,
    permission_scope: "staff",
    expires_at: null,
    created_at: now,
  },
];

export const arrivalSignals: ArrivalSignal[] = [
  {
    id: "arrival-founder-flight",
    stay_id: "stay-sandhill-founders",
    signal_type: "flight",
    source: "Flight status integration",
    summary:
      "Inbound SFO flight moved 22 minutes later after a connection delay; likely arrival at property between 4:45 and 5:15 PM.",
    trust_level: "observed",
    consent_scope: "stay",
    created_at: now,
  },
  {
    id: "arrival-founder-social",
    stay_id: "stay-sandhill-founders",
    signal_type: "staff_note",
    source: "Experience lead note",
    summary:
      "Olivia said, 'We're probably keeping things low-key tonight. Everyone's talked enough for one day.'",
    trust_level: "stated",
    consent_scope: "stay",
    created_at: now,
  },
  {
    id: "arrival-founder-local",
    stay_id: "stay-sandhill-founders",
    signal_type: "local_context",
    source: "Property programming",
    summary:
      "Madera has a garden-adjacent table at 7:45 PM, a quieter alcove at 8:15 PM, and in-room dining can stage a family-style California menu without requiring a decision at check-in.",
    trust_level: "observed",
    consent_scope: "property",
    created_at: now,
  },
  {
    id: "arrival-founder-room",
    stay_id: "stay-sandhill-founders",
    signal_type: "preference",
    source: "Pre-arrival preference form",
    summary:
      "Group asked for three nearby suites, soft lighting, feather-free pillows for Priya, desks cleared, and music off by default.",
    trust_level: "stated",
    consent_scope: "stay",
    created_at: now,
  },
  {
    id: "arrival-founder-meeting",
    stay_id: "stay-sandhill-founders",
    signal_type: "staff_note",
    source: "Concierge handoff",
    summary:
      "Their final meeting may run long; avoid time-sensitive greetings and keep one house car window flexible rather than asking for exact timing.",
    trust_level: "stated",
    consent_scope: "stay",
    created_at: now,
  },
  {
    id: "arrival-anniversary-history",
    stay_id: "stay-anniversary-return",
    signal_type: "preference",
    source: "Rosewood London dining note",
    summary: "Last anniversary stay favored handwritten notes and understated dessert, not room decoration.",
    trust_level: "observed",
    consent_scope: "global",
    created_at: now,
  },
  {
    id: "arrival-wellness-fatigue",
    stay_id: "stay-wellness-recovery",
    signal_type: "wellness",
    source: "Pre-arrival form",
    summary: "Guest selected sleep quality, quiet meals, and no morning calls as priorities.",
    trust_level: "stated",
    consent_scope: "stay",
    created_at: now,
  },
  {
    id: "arrival-family-context",
    stay_id: "stay-family-culture",
    signal_type: "local_context",
    source: "Local events",
    summary: "Stanford Cantor Arts Center has a family-friendly afternoon window that fits the second day.",
    trust_level: "observed",
    consent_scope: "property",
    created_at: now,
  },
];

export const localEvents: LocalEvent[] = [
  {
    id: "event-madera-garden",
    property_id: "rosewood-sand-hill",
    title: "Quiet garden-adjacent dinner at Madera",
    category: "dining",
    description: "California cuisine with calm early-evening seating that preserves a low-key arrival.",
    starts_at: "2026-05-16T19:45:00-07:00",
    fit_note: "Best for founder group or returning couple; offer once, make optional.",
  },
  {
    id: "event-asaya-sleep",
    property_id: "rosewood-sand-hill",
    title: "Asaya sleep recovery window",
    category: "wellness",
    description: "A quiet recovery-oriented spa window that can be held without pushing a package.",
    starts_at: "2026-05-17T10:30:00-07:00",
    fit_note: "Best for wellness recovery guest; ask permission before storing wellness preferences.",
  },
  {
    id: "event-stanford-culture",
    property_id: "rosewood-sand-hill",
    title: "Stanford cultural afternoon",
    category: "culture",
    description: "A gentle family-friendly cultural outing near the property.",
    starts_at: "2026-05-18T14:00:00-07:00",
    fit_note: "Best for family or cultural explorer stays; coordinate transportation only if requested.",
  },
];

export const memoryGovernance: MemoryGovernance[] = [
  {
    id: "memory-gov-founder-1",
    stay_id: "stay-sandhill-founders",
    candidate_memory: "Founder group was socially tired after VC meetings and asked for a low-key evening.",
    decision: "stay_scoped",
    rationale: "Useful for this arrival, but emotional state should not become a permanent profile trait.",
    expires_at: "2026-05-20T12:00:00-07:00",
  },
  {
    id: "memory-gov-founder-2",
    stay_id: "stay-sandhill-founders",
    candidate_memory: "Priya prefers feather-free pillows and a cleared workspace.",
    decision: "remember",
    rationale: "Practical comfort preference explicitly provided and low sensitivity.",
    expires_at: null,
  },
  {
    id: "memory-gov-anniversary",
    stay_id: "stay-anniversary-return",
    candidate_memory: "Anniversary date and preference for understated gestures.",
    decision: "ask_permission",
    rationale: "High-value continuity, but long-term relationship memory should be guest-permissioned.",
    expires_at: null,
  },
  {
    id: "memory-gov-wellness",
    stay_id: "stay-wellness-recovery",
    candidate_memory: "Guest appears depleted after work month.",
    decision: "never_store",
    rationale: "Inferred wellness state is sensitive and should not persist beyond operational handling.",
    expires_at: null,
  },
];

export const suppressedRecommendations: SuppressedRecommendation[] = [
  {
    id: "suppress-founder-spa",
    stay_id: "stay-sandhill-founders",
    title: "Send a spa recovery package because the team seems stressed",
    suppression_reason:
      "Too commercially forward, infers stress from work context, and adds another decision after a long travel day.",
    safer_alternative:
      "Prepare restful room conditions and one optional evening dining path without naming stress or fatigue.",
  },
  {
    id: "suppress-anniversary-room",
    stay_id: "stay-anniversary-return",
    title: "Decorate suite with anniversary setup before arrival",
    suppression_reason: "Prior preference indicates understated gestures; decoration risks feeling generic.",
    safer_alternative: "Prepare a handwritten note and discreet dessert option.",
  },
  {
    id: "suppress-wellness-memory",
    stay_id: "stay-wellness-recovery",
    title: "Store recovery profile for future properties",
    suppression_reason: "Wellness inference requires explicit permission and should not become global memory.",
    safer_alternative: "Use sleep preferences for this stay only.",
  },
];

export const staffBriefs: StaffBrief[] = [
  {
    id: "brief-founder-arrival",
    stay_id: "stay-sandhill-founders",
    briefing_type: "arrival",
    summary:
      "Founder group arrives after delayed travel and investor meetings. Keep check-in in-room, protect quiet suites, avoid public recognition, and prepare one optional Madera or in-room dining path.",
    priority: "high",
    owner: "Experience Lead",
  },
  {
    id: "brief-anniversary-arrival",
    stay_id: "stay-anniversary-return",
    briefing_type: "arrival",
    summary:
      "Returning couple values understated recognition. Coordinate note and dessert without visible fanfare.",
    priority: "medium",
    owner: "Guest Relations",
  },
  {
    id: "brief-wellness-arrival",
    stay_id: "stay-wellness-recovery",
    briefing_type: "arrival",
    summary:
      "Solo recovery guest asked for quiet meals and sleep quality. Protect morning privacy and avoid upsell language.",
    priority: "high",
    owner: "Wellness Concierge",
  },
];

export const postStayEngagements: PostStayEngagement[] = [
  {
    id: "post-founder",
    stay_id: "stay-sandhill-founders",
    trigger_name: "Next Sand Hill Road trip",
    suggested_timing: "Only after guest initiates or books again",
    message_intent: "Remember low-touch arrival preferences and quiet dining posture.",
    consent_required: false,
  },
  {
    id: "post-anniversary",
    stay_id: "stay-anniversary-return",
    trigger_name: "Anniversary continuity",
    suggested_timing: "Nine months after stay, only if permission is granted",
    message_intent: "Offer a future Rosewood anniversary idea without promotional cadence.",
    consent_required: true,
  },
];

export const communications: Communication[] = [
  {
    id: "comm-1",
    stay_id: "stay-sandhill-founders",
    sender_type: "guest",
    channel: "app",
    message: "We're probably keeping things low-key tonight. Everyone's talked enough for one day.",
    created_at: "2026-05-16T13:40:00-07:00",
  },
  {
    id: "comm-2",
    stay_id: "stay-sandhill-founders",
    sender_type: "staff",
    channel: "app",
    message:
      "We will keep arrival light, prepare the suites for a quiet reset, and hold one easy dinner option without needing a decision at check-in.",
    created_at: "2026-05-16T13:44:00-07:00",
  },
  {
    id: "comm-3",
    stay_id: "stay-returning-suite",
    sender_type: "system",
    channel: "internal_note",
    message: "Returning solo guest arrives before a board dinner; keep check-in exact and avoid extended conversation.",
    created_at: "2026-05-16T11:20:00-07:00",
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    stay_id: "stay-sandhill-founders",
    assigned_to: "Front Office",
    priority: "high",
    status: "approved",
    task_type: "arrival",
    description: "Prepare in-room express arrival; greet by name, skip lobby orientation, and avoid public recognition.",
    due_at: "2026-05-16T15:30:00-07:00",
    created_at: now,
  },
  {
    id: "task-2",
    stay_id: "stay-sandhill-founders",
    assigned_to: "Housekeeping",
    priority: "medium",
    status: "approved",
    task_type: "housekeeping",
    description:
      "Set nearby suites to 68F, soft lighting, music off, feather-free pillows for Priya, and desks cleared with sparkling water.",
    due_at: "2026-05-16T15:00:00-07:00",
    created_at: now,
  },
  {
    id: "task-founder-dining",
    stay_id: "stay-sandhill-founders",
    assigned_to: "Madera Host",
    priority: "medium",
    status: "suggested",
    task_type: "dining",
    description:
      "Soft-hold one garden-adjacent Madera table and one in-room dining backup; release whichever is not used after arrival.",
    due_at: "2026-05-16T17:30:00-07:00",
    created_at: now,
  },
  {
    id: "task-3",
    stay_id: "stay-returning-suite",
    assigned_to: "Front Office",
    priority: "medium",
    status: "approved",
    task_type: "arrival",
    description: "Prepare a short solo arrival and confirm board dinner transport timing.",
    due_at: "2026-05-16T16:00:00-07:00",
    created_at: now,
  },
];

export const moments: Moment[] = [
  {
    id: "moment-quiet-table",
    stay_id: "stay-sandhill-founders",
    title: "A quiet table, held lightly",
    reasoning:
      "Olivia explicitly signaled the group has talked enough for one day, while Marcus tends to prefer low-key California cuisine after work events. A soft hold creates ease without forcing a decision.",
    guest_message:
      "Welcome in. We have kept things light for your arrival and have a quiet table available this evening if helpful.",
    staff_action:
      "Soft-hold the 7:45 PM garden-adjacent Madera table and mention it once in the welcome note; release it quietly if they decline.",
    revenue_opportunity: 63,
    relevance_score: 94,
    comfort_score: 92,
    creepiness_score: 14,
    status: "suggested",
    created_at: now,
  },
  {
    id: "moment-transport",
    stay_id: "stay-sandhill-founders",
    title: "Flexible arrival buffer",
    reasoning:
      "The inbound flight delay and final meeting uncertainty make exact timing fragile. Keeping transport flexible removes coordination work without asking the group to manage another schedule.",
    guest_message:
      "Your arrival timing can stay flexible. We will keep things easy if the afternoon runs longer than expected.",
    staff_action:
      "Keep one house car window flexible between 4:15 and 5:30 PM and avoid asking for a precise arrival update unless the guest initiates.",
    revenue_opportunity: 28,
    relevance_score: 86,
    comfort_score: 84,
    creepiness_score: 18,
    status: "suggested",
    created_at: now,
  },
  {
    id: "moment-room-reset",
    stay_id: "stay-sandhill-founders",
    title: "Suite reset before they ask",
    reasoning:
      "The group wants a low-friction arrival, Priya has a practical feather-free/workspace preference, and Olivia prefers concise service. Preparing the rooms invisibly is more valuable than another message.",
    guest_message:
      "Your suites are ready for a quiet reset, with the room details kept simple for arrival.",
    staff_action:
      "Confirm adjacent suites, 68F temperature, soft lighting, music off, cleared desks, sparkling water, and feather-free pillows for Priya before the group reaches the property.",
    revenue_opportunity: 12,
    relevance_score: 96,
    comfort_score: 95,
    creepiness_score: 8,
    status: "suggested",
    created_at: now,
  },
  {
    id: "moment-board-dinner",
    stay_id: "stay-returning-suite",
    title: "Precise board dinner arrival support",
    reasoning:
      "A returning solo guest before a board dinner benefits from punctuality and privacy more than expansive service.",
    guest_message:
      "Welcome back. We will keep arrival simple and can have your dinner transfer ready whenever you would like it.",
    staff_action: "Confirm the preferred departure time once, then stage transport without additional reminders.",
    revenue_opportunity: 34,
    relevance_score: 88,
    comfort_score: 86,
    creepiness_score: 10,
    status: "suggested",
    created_at: now,
  },
];

export const spending: Spending[] = [
  {
    id: "spend-1",
    stay_id: "stay-sandhill-founders",
    category: "Dining",
    amount: 420,
    source: "Projected Madera hold",
    timestamp: "2026-05-16T19:45:00-07:00",
  },
  {
    id: "spend-2",
    stay_id: "stay-sandhill-founders",
    category: "Transport",
    amount: 135,
    source: "House car estimate",
    timestamp: "2026-05-16T16:30:00-07:00",
  },
  {
    id: "spend-3",
    stay_id: "stay-returning-suite",
    category: "Transport",
    amount: 95,
    source: "Board dinner transfer estimate",
    timestamp: "2026-05-16T18:15:00-07:00",
  },
];

export const roomPreferences: RoomPreference[] = [
  {
    id: "room-1",
    guest_id: "guest-olivia",
    temperature: 68,
    lighting: "Warm, low evening lamps",
    music: "Off by default",
    streaming_services: ["Apple TV+", "Netflix"],
    bed_type: "King",
    pillow_type: "Down alternative",
  },
  {
    id: "room-2",
    guest_id: "guest-priya",
    temperature: 69,
    lighting: "Desk light on, bedside low",
    music: "Off",
    streaming_services: ["Netflix"],
    bed_type: "Queen",
    pillow_type: "Feather-free",
  },
];

export const contextSummary: StayContextSummary = {
  interaction_style: "low_touch",
  trip_type: "founder fundraising and decompression",
  energy_state: "socially depleted, travel-delayed, and likely relieved after high-stakes meetings",
  recommended_tone: "calm, brief, optional",
  stay_read:
    "Olivia's group is arriving after investor meetings, delayed travel, and a high-cognitive-load day. The best service is invisible orchestration: rooms prepared exactly, flexible timing, and one optional evening path.",
  restraint_guidance:
    "Do not name fatigue, stress, fundraising, or investor context in guest-facing copy. Offer one useful option, keep it optional, and let the team decline without follow-up.",
};

export function getDemoStayDetail(stayId = "stay-sandhill-founders"): StayDetail {
  const stay = stays.find((item) => item.id === stayId) ?? stays[0];
  const links = stayGuests.filter((item) => item.stay_id === stay.id);
  const stayGuestRecords = links
    .map((link) => guests.find((guest) => guest.id === link.guest_id))
    .filter((guest): guest is Guest => Boolean(guest));
  const holder = guests.find((guest) => guest.id === stay.reservation_holder_id) ?? stayGuestRecords[0];
  const guestIds = new Set(stayGuestRecords.map((guest) => guest.id));
  const property = properties.find((item) => item.id === stay.property_id);

  return {
    stay,
    property,
    guests: stayGuestRecords,
    holder,
    memories: memories.filter((memory) => guestIds.has(memory.guest_id)),
    tasks: tasks.filter((task) => task.stay_id === stay.id),
    moments: moments.filter((moment) => moment.stay_id === stay.id),
    communications: communications.filter((message) => message.stay_id === stay.id),
    spending: spending.filter((item) => item.stay_id === stay.id),
    roomPreferences: roomPreferences.filter((preference) => guestIds.has(preference.guest_id)),
    arrivalSignals: arrivalSignals.filter((signal) => signal.stay_id === stay.id),
    localEvents: localEvents.filter((event) => event.property_id === stay.property_id),
    memoryGovernance: memoryGovernance.filter((item) => item.stay_id === stay.id),
    suppressedRecommendations: suppressedRecommendations.filter((item) => item.stay_id === stay.id),
    staffBriefs: staffBriefs.filter((brief) => brief.stay_id === stay.id),
    postStayEngagements: postStayEngagements.filter((item) => item.stay_id === stay.id),
    context: stay.id === "stay-sandhill-founders" ? contextSummary : {
      interaction_style: stay.interaction_preference,
      trip_type: stay.purpose_of_trip,
      energy_state: "focused",
      recommended_tone: "warm and direct",
      stay_read: "Keep service precise and unfussy.",
      restraint_guidance: "Offer practical support without expanding the conversation.",
    },
  };
}

export function getDemoArrivals() {
  return stays
    .filter((stay) => stay.status === "arriving_today")
    .map((stay) => getDemoStayDetail(stay.id));
}
