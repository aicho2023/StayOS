create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  loyalty_tier text not null default 'Signature',
  interaction_style text not null check (interaction_style in ('low_touch', 'balanced', 'high_touch')),
  privacy_level text not null check (privacy_level in ('discreet', 'standard', 'open')),
  created_at timestamptz not null default now()
);

create table if not exists stays (
  id uuid primary key default gen_random_uuid(),
  property_id text not null,
  reservation_holder_id uuid not null references guests(id) on delete restrict,
  purpose_of_trip text not null,
  occasion text,
  arrival_date date not null,
  departure_date date not null,
  status text not null check (status in ('arriving_today', 'in_house', 'departed')),
  group_size integer not null check (group_size > 0),
  interaction_preference text not null check (interaction_preference in ('low_touch', 'balanced', 'high_touch')),
  budget_sensitivity text not null check (budget_sensitivity in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create table if not exists stay_guests (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references stays(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  role text not null check (role in ('reservation_holder', 'guest')),
  unique (stay_id, guest_id)
);

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references guests(id) on delete cascade,
  memory text not null,
  source text not null,
  confidence_score numeric not null check (confidence_score >= 0 and confidence_score <= 1),
  permission_scope text not null check (permission_scope in ('staff', 'stay', 'property')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references stays(id) on delete cascade,
  assigned_to text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null check (status in ('suggested', 'approved', 'in_progress', 'done')),
  task_type text not null check (task_type in ('arrival', 'concierge', 'dining', 'transport', 'housekeeping')),
  description text not null,
  due_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists moments (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references stays(id) on delete cascade,
  title text not null,
  reasoning text not null,
  guest_message text not null,
  staff_action text not null,
  revenue_opportunity integer not null check (revenue_opportunity >= 0 and revenue_opportunity <= 100),
  relevance_score integer not null default 80 check (relevance_score >= 0 and relevance_score <= 100),
  comfort_score integer not null check (comfort_score >= 0 and comfort_score <= 100),
  creepiness_score integer not null check (creepiness_score >= 0 and creepiness_score <= 100),
  status text not null check (status in ('suggested', 'approved', 'suppressed', 'sent')),
  created_at timestamptz not null default now()
);

create table if not exists communications (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references stays(id) on delete cascade,
  sender_type text not null check (sender_type in ('guest', 'staff', 'system')),
  message text not null,
  channel text not null check (channel in ('sms', 'app', 'internal_note')),
  created_at timestamptz not null default now()
);

create table if not exists spending (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references stays(id) on delete cascade,
  category text not null,
  amount numeric not null check (amount >= 0),
  source text not null,
  timestamp timestamptz not null default now()
);

create table if not exists room_preferences (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references guests(id) on delete cascade,
  temperature integer,
  lighting text,
  music text,
  streaming_services text[] not null default '{}',
  bed_type text,
  pillow_type text
);

create index if not exists stays_status_arrival_idx on stays(status, arrival_date);
create index if not exists stay_guests_stay_id_idx on stay_guests(stay_id);
create index if not exists memories_guest_id_idx on memories(guest_id);
create index if not exists tasks_stay_id_due_at_idx on tasks(stay_id, due_at);
create index if not exists moments_stay_id_created_at_idx on moments(stay_id, created_at desc);
create index if not exists communications_stay_id_created_at_idx on communications(stay_id, created_at);
create index if not exists spending_stay_id_timestamp_idx on spending(stay_id, timestamp);
