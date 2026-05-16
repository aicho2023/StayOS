create table if not exists properties (
  id text primary key,
  name text not null,
  brand text not null,
  location text not null,
  sense_of_place text not null,
  local_context text not null
);

create table if not exists icp_profiles (
  id text primary key,
  name text not null,
  buyer text not null,
  property_fit text not null,
  guest_archetype text not null,
  demo_value text not null
);

create table if not exists arrival_signals (
  id text primary key,
  stay_id uuid not null references stays(id) on delete cascade,
  signal_type text not null check (signal_type in ('flight', 'wellness', 'social', 'preference', 'local_context', 'staff_note')),
  source text not null,
  summary text not null,
  trust_level text not null check (trust_level in ('observed', 'stated', 'inferred')),
  consent_scope text not null check (consent_scope in ('stay', 'property', 'global', 'do_not_store')),
  created_at timestamptz not null default now()
);

create table if not exists local_events (
  id text primary key,
  property_id text not null references properties(id) on delete cascade,
  title text not null,
  category text not null check (category in ('dining', 'wellness', 'culture', 'outdoors', 'family')),
  description text not null,
  starts_at timestamptz not null,
  fit_note text not null
);

create table if not exists memory_governance (
  id text primary key,
  stay_id uuid not null references stays(id) on delete cascade,
  candidate_memory text not null,
  decision text not null check (decision in ('remember', 'stay_scoped', 'ask_permission', 'never_store')),
  rationale text not null,
  expires_at timestamptz
);

create table if not exists suppressed_recommendations (
  id text primary key,
  stay_id uuid not null references stays(id) on delete cascade,
  title text not null,
  suppression_reason text not null,
  safer_alternative text not null
);

create table if not exists staff_briefs (
  id text primary key,
  stay_id uuid not null references stays(id) on delete cascade,
  briefing_type text not null check (briefing_type in ('arrival', 'in_stay', 'post_stay')),
  summary text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  owner text not null
);

create table if not exists post_stay_engagements (
  id text primary key,
  stay_id uuid not null references stays(id) on delete cascade,
  trigger_name text not null,
  suggested_timing text not null,
  message_intent text not null,
  consent_required boolean not null default true
);

create index if not exists arrival_signals_stay_id_idx on arrival_signals(stay_id);
create index if not exists local_events_property_id_starts_at_idx on local_events(property_id, starts_at);
create index if not exists memory_governance_stay_id_idx on memory_governance(stay_id);
create index if not exists suppressed_recommendations_stay_id_idx on suppressed_recommendations(stay_id);
create index if not exists staff_briefs_stay_id_idx on staff_briefs(stay_id);
create index if not exists post_stay_engagements_stay_id_idx on post_stay_engagements(stay_id);
