insert into guests
  (id, first_name, last_name, email, phone, loyalty_tier, interaction_style, privacy_level, created_at)
values
  ('11111111-1111-4111-8111-111111111111', 'Olivia', 'Chen', 'olivia@halcyonlabs.ai', '+1 415 555 0142', 'Rosewood Elite', 'low_touch', 'discreet', '2026-05-16T09:30:00-07:00'),
  ('22222222-2222-4222-8222-222222222222', 'Marcus', 'Reed', 'marcus@halcyonlabs.ai', '+1 415 555 0188', 'Signature', 'balanced', 'standard', '2026-05-16T09:30:00-07:00'),
  ('33333333-3333-4333-8333-333333333333', 'Priya', 'Raman', 'priya@halcyonlabs.ai', '+1 415 555 0136', 'Signature', 'low_touch', 'discreet', '2026-05-16T09:30:00-07:00')
on conflict (id) do nothing;

insert into stays
  (id, property_id, reservation_holder_id, purpose_of_trip, occasion, arrival_date, departure_date, status, group_size, interaction_preference, budget_sensitivity, created_at)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'rosewood-sand-hill', '11111111-1111-4111-8111-111111111111', 'Founder team in Menlo Park for partner meetings and a late-stage fundraising pitch.', 'VC pitch week decompression', '2026-05-16', '2026-05-19', 'arriving_today', 3, 'low_touch', 'low', '2026-05-16T09:30:00-07:00')
on conflict (id) do nothing;

insert into stay_guests (stay_id, guest_id, role)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'reservation_holder'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '22222222-2222-4222-8222-222222222222', 'guest'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '33333333-3333-4333-8333-333333333333', 'guest')
on conflict (stay_id, guest_id) do nothing;

insert into memories
  (guest_id, memory, source, confidence_score, permission_scope)
values
  ('11111111-1111-4111-8111-111111111111', 'Prefers quietly handled arrivals and concise app messages after travel days.', 'Previous Rosewood Sand Hill stay', 0.86, 'property'),
  ('33333333-3333-4333-8333-333333333333', 'Asked for feather-free pillows and a workspace away from the bed.', 'Pre-arrival preference form', 0.94, 'stay'),
  ('22222222-2222-4222-8222-222222222222', 'Enjoys low-key California cuisine, usually avoids tasting menus after work events.', 'Dining note', 0.72, 'staff');

insert into communications
  (stay_id, sender_type, channel, message, created_at)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'guest', 'internal_note', 'Olivia mentioned the team is probably keeping things low-key tonight after meetings.', '2026-05-16T13:40:00-07:00'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'staff', 'app', 'We will keep arrival light and make sure the suites are ready for a quiet reset.', '2026-05-16T13:44:00-07:00');

insert into tasks
  (stay_id, assigned_to, priority, status, task_type, description, due_at)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Front Office', 'high', 'approved', 'arrival', 'Prepare express arrival path; keep orientation brief and in-room.', '2026-05-16T15:30:00-07:00'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Housekeeping', 'medium', 'approved', 'housekeeping', 'Set suites to 68F, soft lighting, feather-free pillows for Priya.', '2026-05-16T15:00:00-07:00');

insert into moments
  (stay_id, title, reasoning, guest_message, staff_action, revenue_opportunity, relevance_score, comfort_score, creepiness_score, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Quiet dinner hold at Madera', 'The group signaled a low-key evening after investor meetings. A held table creates optionality without pressure.', 'Welcome in. We have kept things light for your arrival and have a quiet table available this evening if helpful.', 'Hold a 7:45 PM patio-adjacent table and mention it only once in the arrival note.', 63, 94, 92, 14, 'suggested'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Discreet transport buffer', 'A short transport buffer helps the group move from pitch meetings to arrival without a coordination burden.', 'Your arrival timing is flexible. We can keep the transfer light if your meetings run long.', 'Ask concierge to keep one house car window flexible between 4:15 and 5:15 PM.', 28, 86, 84, 18, 'suggested');

insert into spending
  (stay_id, category, amount, source, timestamp)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Dining', 420, 'Projected Madera hold', '2026-05-16T19:45:00-07:00'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Transport', 135, 'House car estimate', '2026-05-16T16:30:00-07:00');

insert into room_preferences
  (guest_id, temperature, lighting, music, streaming_services, bed_type, pillow_type)
values
  ('11111111-1111-4111-8111-111111111111', 68, 'Warm, low evening lamps', 'Off by default', array['Apple TV+', 'Netflix'], 'King', 'Down alternative'),
  ('33333333-3333-4333-8333-333333333333', 69, 'Desk light on, bedside low', 'Off', array['Netflix'], 'Queen', 'Feather-free');

insert into properties
  (id, name, brand, location, sense_of_place, local_context)
values
  ('rosewood-sand-hill', 'Rosewood Sand Hill', 'Rosewood', 'Menlo Park, California', 'A residential Silicon Valley retreat shaped by gardens, California cuisine, wellness, and quiet proximity to Sand Hill Road.', 'Relevant local context includes Madera, Asaya Spa, private gardens, Stanford cultural programming, cycling routes, and investor meeting rhythms.')
on conflict (id) do update set
  name = excluded.name,
  sense_of_place = excluded.sense_of_place,
  local_context = excluded.local_context;

insert into icp_profiles
  (id, name, buyer, property_fit, guest_archetype, demo_value)
values
  ('icp-ultra-luxury-retreat', 'Ultra-luxury resort or urban retreat', 'General Manager, Rooms Director, Experience Director', 'Properties where service quality depends on subtle, cross-department context.', 'Privacy-sensitive VIPs, returning couples, founders, families, wellness guests', 'Shows arrival choreography and invisible concierge without replacing staff.'),
  ('icp-multi-property-group', 'Multi-property luxury hotel group', 'Brand experience, loyalty, and operations leadership', 'Groups that need memory continuity across PMS, CRM, POS, loyalty, and property notes.', 'Returning guests who expect preferences to travel across properties', 'Shows governed memory and post-stay continuity without spam.'),
  ('icp-wellness-luxury', 'Wellness-led luxury property', 'Spa Director, Wellness Director, Guest Experience Lead', 'Properties where recovery, sleep, nutrition, and privacy-sensitive preferences shape the stay.', 'Guests seeking sleep, recovery, quiet programming, and consent-aware recommendations', 'Shows wellness-aware service with explicit suppression of invasive inference.')
on conflict (id) do update set
  buyer = excluded.buyer,
  property_fit = excluded.property_fit,
  guest_archetype = excluded.guest_archetype,
  demo_value = excluded.demo_value;

insert into guests
  (id, first_name, last_name, email, phone, loyalty_tier, interaction_style, privacy_level, created_at)
values
  ('44444444-4444-4444-8444-444444444444', 'Elena', 'Morales', 'elena@example.com', '+1 212 555 0191', 'Rosewood Elite', 'balanced', 'standard', '2026-05-16T09:30:00-07:00'),
  ('55555555-5555-4555-8555-555555555555', 'David', 'Morales', 'david@example.com', '+1 212 555 0192', 'Rosewood Elite', 'balanced', 'standard', '2026-05-16T09:30:00-07:00'),
  ('66666666-6666-4666-8666-666666666666', 'Naomi', 'Hart', 'naomi@example.com', '+1 310 555 0166', 'Signature', 'low_touch', 'discreet', '2026-05-16T09:30:00-07:00'),
  ('77777777-7777-4777-8777-777777777777', 'Amelia', 'Kwan', 'amelia@example.com', '+1 650 555 0182', 'Guest', 'high_touch', 'open', '2026-05-16T09:30:00-07:00'),
  ('88888888-8888-4888-8888-888888888888', 'Sophia', 'Laurent', 'sophia@example.com', '+33 6 55 01 22 18', 'Rosewood Elite', 'low_touch', 'discreet', '2026-05-16T09:30:00-07:00'),
  ('99999999-9999-4999-8999-999999999999', 'Karim', 'Almasi', 'karim@example.com', '+971 50 555 0198', 'Rosewood Elite', 'balanced', 'standard', '2026-05-16T09:30:00-07:00'),
  ('12121212-1212-4212-8212-121212121212', 'Vivian', 'Park', 'vivian@example.com', '+1 646 555 0177', 'Signature', 'high_touch', 'open', '2026-05-16T09:30:00-07:00')
on conflict (id) do nothing;

insert into stays
  (id, property_id, reservation_holder_id, purpose_of_trip, occasion, arrival_date, departure_date, status, group_size, interaction_preference, budget_sensitivity, created_at)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'rosewood-sand-hill', '44444444-4444-4444-8444-444444444444', 'Returning couple celebrating a quiet anniversary after visiting Rosewood London last year.', 'Anniversary weekend', '2026-05-16', '2026-05-18', 'arriving_today', 2, 'balanced', 'low', '2026-05-16T09:30:00-07:00'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'rosewood-sand-hill', '66666666-6666-4666-8666-666666666666', 'Solo recovery weekend after long-haul travel and a packed work month.', 'Sleep and recovery reset', '2026-05-16', '2026-05-20', 'arriving_today', 1, 'low_touch', 'moderate', '2026-05-16T09:30:00-07:00'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'rosewood-sand-hill', '77777777-7777-4777-8777-777777777777', 'Multigenerational family visit blending Stanford campus time, dining, and a birthday.', 'Family birthday weekend', '2026-05-17', '2026-05-21', 'arriving_today', 5, 'high_touch', 'moderate', '2026-05-16T09:30:00-07:00'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', 'rosewood-hotel-de-crillon', '88888888-8888-4888-8888-888888888888', 'Couture week and quiet recovery between events.', 'Paris couture week', '2025-07-02', '2025-07-07', 'departed', 1, 'low_touch', 'low', '2026-05-16T09:30:00-07:00'),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', 'rosewood-london', '99999999-9999-4999-8999-999999999999', 'Family holiday with private dining and museum programming.', 'Family winter holiday', '2025-12-18', '2025-12-24', 'departed', 4, 'balanced', 'low', '2026-05-16T09:30:00-07:00'),
  ('13131313-1313-4313-8313-131313131313', 'rosewood-hong-kong', '12121212-1212-4212-8212-121212121212', 'Art fair weekend and client hosting.', 'Art Basel Hong Kong', '2025-03-26', '2025-03-31', 'departed', 2, 'high_touch', 'moderate', '2026-05-16T09:30:00-07:00')
on conflict (id) do nothing;

insert into stay_guests (stay_id, guest_id, role)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '44444444-4444-4444-8444-444444444444', 'reservation_holder'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '55555555-5555-4555-8555-555555555555', 'guest'),
  ('cccccccc-cccc-4ccc-8ccc-cccccccccccc', '66666666-6666-4666-8666-666666666666', 'reservation_holder'),
  ('dddddddd-dddd-4ddd-8ddd-dddddddddddd', '77777777-7777-4777-8777-777777777777', 'reservation_holder'),
  ('eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', '88888888-8888-4888-8888-888888888888', 'reservation_holder'),
  ('ffffffff-ffff-4fff-8fff-ffffffffffff', '99999999-9999-4999-8999-999999999999', 'reservation_holder'),
  ('13131313-1313-4313-8313-131313131313', '12121212-1212-4212-8212-121212121212', 'reservation_holder')
on conflict (stay_id, guest_id) do nothing;

insert into memories
  (guest_id, memory, source, confidence_score, permission_scope)
values
  ('88888888-8888-4888-8888-888888888888', 'Prefers a very quiet arrival, chilled still water, and no floral scent in the suite.', 'Rosewood Hotel de Crillon stay', 0.90, 'property'),
  ('88888888-8888-4888-8888-888888888888', 'Enjoys private museum access and fashion-adjacent cultural programming, but dislikes public recognition.', 'Concierge note', 0.82, 'staff'),
  ('99999999-9999-4999-8999-999999999999', 'Travels with family, prefers adjoining suites, early private dining, and child-friendly cultural plans.', 'Rosewood London family stay', 0.88, 'property'),
  ('12121212-1212-4212-8212-121212121212', 'Likes high-touch art programming, gallery previews, and staff who can move quickly on restaurant holds.', 'Rosewood Hong Kong art fair stay', 0.78, 'staff');

insert into arrival_signals
  (id, stay_id, signal_type, source, summary, trust_level, consent_scope, created_at)
values
  ('arrival-founder-flight', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'flight', 'Flight status integration', 'SFO arrival moved 22 minutes later; likely arrival at property between 4:45 and 5:15 PM.', 'observed', 'stay', '2026-05-16T09:30:00-07:00'),
  ('arrival-founder-social', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'staff_note', 'Experience lead note', 'Guest said the group is probably keeping things low-key tonight.', 'stated', 'stay', '2026-05-16T09:30:00-07:00'),
  ('arrival-founder-local', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'local_context', 'Property programming', 'Madera has two quieter early-evening tables and garden seating is calm before 8 PM.', 'observed', 'property', '2026-05-16T09:30:00-07:00'),
  ('arrival-anniversary-history', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'preference', 'Rosewood London dining note', 'Last anniversary stay favored handwritten notes and understated dessert, not room decoration.', 'observed', 'global', '2026-05-16T09:30:00-07:00'),
  ('arrival-wellness-fatigue', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'wellness', 'Pre-arrival form', 'Guest selected sleep quality, quiet meals, and no morning calls as priorities.', 'stated', 'stay', '2026-05-16T09:30:00-07:00'),
  ('arrival-family-context', 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', 'local_context', 'Local events', 'Stanford Cantor Arts Center has a family-friendly afternoon window that fits the second day.', 'observed', 'property', '2026-05-16T09:30:00-07:00')
on conflict (id) do update set summary = excluded.summary;

insert into local_events
  (id, property_id, title, category, description, starts_at, fit_note)
values
  ('event-madera-garden', 'rosewood-sand-hill', 'Quiet garden-adjacent dinner at Madera', 'dining', 'California cuisine with calm early-evening seating that preserves a low-key arrival.', '2026-05-16T19:45:00-07:00', 'Best for founder group or returning couple; offer once, make optional.'),
  ('event-asaya-sleep', 'rosewood-sand-hill', 'Asaya sleep recovery window', 'wellness', 'A quiet recovery-oriented spa window that can be held without pushing a package.', '2026-05-17T10:30:00-07:00', 'Best for wellness recovery guest; ask permission before storing wellness preferences.'),
  ('event-stanford-culture', 'rosewood-sand-hill', 'Stanford cultural afternoon', 'culture', 'A gentle family-friendly cultural outing near the property.', '2026-05-18T14:00:00-07:00', 'Best for family or cultural explorer stays; coordinate transportation only if requested.')
on conflict (id) do update set fit_note = excluded.fit_note;

insert into memory_governance
  (id, stay_id, candidate_memory, decision, rationale, expires_at)
values
  ('memory-gov-founder-1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Founder group was socially tired after VC meetings.', 'stay_scoped', 'Useful for this arrival, but emotional state should not become a permanent profile trait.', '2026-05-20T12:00:00-07:00'),
  ('memory-gov-founder-2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Priya prefers feather-free pillows.', 'remember', 'Practical comfort preference explicitly provided and low sensitivity.', null),
  ('memory-gov-anniversary', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Anniversary date and preference for understated gestures.', 'ask_permission', 'High-value continuity, but long-term relationship memory should be guest-permissioned.', null),
  ('memory-gov-wellness', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Guest appears depleted after work month.', 'never_store', 'Inferred wellness state is sensitive and should not persist beyond operational handling.', null)
on conflict (id) do update set decision = excluded.decision, rationale = excluded.rationale;

insert into suppressed_recommendations
  (id, stay_id, title, suppression_reason, safer_alternative)
values
  ('suppress-founder-spa', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Push a spa recovery package after meetings', 'Too commercially forward and infers stress from work context.', 'Hold one quiet dinner option and preserve optionality.'),
  ('suppress-anniversary-room', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Decorate suite with anniversary setup before arrival', 'Prior preference indicates understated gestures; decoration risks feeling generic.', 'Prepare a handwritten note and discreet dessert option.'),
  ('suppress-wellness-memory', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'Store recovery profile for future properties', 'Wellness inference requires explicit permission and should not become global memory.', 'Use sleep preferences for this stay only.')
on conflict (id) do update set suppression_reason = excluded.suppression_reason;

insert into staff_briefs
  (id, stay_id, briefing_type, summary, priority, owner)
values
  ('brief-founder-arrival', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'arrival', 'Founder group arrives after investor meetings. Keep check-in short, suites quiet, and offer one optional Madera table.', 'high', 'Experience Lead'),
  ('brief-anniversary-arrival', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'arrival', 'Returning couple values understated recognition. Coordinate note and dessert without visible fanfare.', 'medium', 'Guest Relations'),
  ('brief-wellness-arrival', 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', 'arrival', 'Solo recovery guest asked for quiet meals and sleep quality. Protect morning privacy and avoid upsell language.', 'high', 'Wellness Concierge')
on conflict (id) do update set summary = excluded.summary, owner = excluded.owner;

insert into post_stay_engagements
  (id, stay_id, trigger_name, suggested_timing, message_intent, consent_required)
values
  ('post-founder', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Next Sand Hill Road trip', 'Only after guest initiates or books again', 'Remember low-touch arrival preferences and quiet dining posture.', false),
  ('post-anniversary', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Anniversary continuity', 'Nine months after stay, only if permission is granted', 'Offer a future Rosewood anniversary idea without promotional cadence.', true)
on conflict (id) do update set message_intent = excluded.message_intent;
