# Stay OS

A stay-centric luxury hospitality operating system demo for Rosewood Sand Hill.

The app works immediately with local seeded fallback data. Supabase and Anthropic are optional for the first look, but the code is ready for both.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If you run `npm run build` while the dev server is open, restart `npm run dev` afterward. Next.js rewrites `.next` during production builds, and a stale dev server can show temporary missing chunk errors.

Primary demo routes:

- Staff arrivals: `http://localhost:3000`
- Stay detail: `http://localhost:3000/stays/stay-sandhill-founders`
- Guest phone: `http://localhost:3000/guest/stay-sandhill-founders`
- New guest signup: `http://localhost:3000/guest/new`
- Side-by-side demo: `http://localhost:3000/demo`
- Booking flow: `http://localhost:3000/book`
- System status: `http://localhost:3000/system`

## Demo Script

Use `http://localhost:3000/demo` when you want the staff hospitality copilot and guest phone visible together.

For separate tabs, use the same port so browser state can sync:

- Staff copilot tab: `http://localhost:3000/stays/stay-sandhill-founders`
- Guest phone tab: `http://localhost:3000/guest/stay-sandhill-founders`

Avoid running one tab on port 3000 and the other on 3001 for the local demo. Browser storage is origin-scoped, so different ports do not share state unless you wire a backend like Supabase Realtime.

Live interactions that work without accounts:

- Type a guest message in the phone. It appears in the staff live signal and message thread.
- Adjust room temperature, lighting, music, or privacy mode. The staff view updates.
- Tap quick requests like water, DND, or hold table. The staff request queue updates.
- Reply from the staff copilot. The message appears in the guest phone.
- Book a stay at `/book`; the selected dates and friend names appear in the staff view and phone.

Live Supabase-backed guest onboarding:

- Open `/guest/new`.
- Complete the phone-style guest intake.
- Submit `Create stay`.
- The app creates a real guest, stay, stay-guests links, room preference, communications, a starter moment, and a task in the backend.
- The new stay opens at `/guest/{stayId}` and appears on the staff dashboard after refresh.
- Reset the demo state from the side-by-side page.

Good judge prompts:

- Ask them to type: "Could we keep dinner very casual tonight?"
- Ask them to increase the room temperature.
- Ask them to request sparkling water.
- Ask them what feels creepy, then show comfort, relevance, and creepiness scoring in the staff copilot.

Agent orchestration to point out:

- Context Synthesizer: unifies PMS, CRM, POS, notes, preferences, and messages into stay understanding.
- Moment Engine: creates only one or two high-fit hospitality moments.
- Restraint Guard: suppresses creepy, spammy, low-confidence, or hard-sell recommendations.
- Task Orchestrator: converts approved moments into staff tasks.
- Comms Draft Agent: drafts guest-facing language for staff approval.
- Memory Permission Agent: decides what should be remembered, stay-scoped, expired, or never stored.

The stay copilot starts with blank agent outputs. Press `Run all agents` or run individual agents to generate live outputs from Anthropic. This supports both the polished prefilled Rosewood scenario and a from-scratch judge-created stay.

For a deeper live demo, wire Supabase Auth + Realtime so each judge can have a remembered account and cross-device state. The current browser demo uses local storage so it is fast and reliable in a pitch setting.

## Optional Environment Setup

Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

### Anthropic

Required only for live AI regeneration. Without it, Stay OS uses a deterministic fallback recommendation.

```bash
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

The model name follows Anthropic's current model naming docs: https://docs.anthropic.com/en/docs/about-claude/models/all-models

### Supabase

Required only if you want real Postgres-backed demo data. Without it, the app uses `src/lib/demo-data.ts` and browser local storage for live demo state.

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
3. Run `supabase/seed.sql` in the SQL editor.
4. Add these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Use either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; Supabase's newer dashboard often labels this as the publishable key. The service role key is used only server-side for writes in this no-auth demo. Do not expose it in client code or commit `.env.local`.

If you already ran the first migration before `relevance_score` existed, also run:

```sql
alter table moments
add column if not exists relevance_score integer not null default 80 check (relevance_score >= 0 and relevance_score <= 100);
```

Recommended next Supabase upgrades:

- Add staff and guest auth identities.
- Persist guest messages, room changes, and service requests into Postgres.
- Subscribe to `communications`, `room_preferences`, and `tasks` with Supabase Realtime.
- Store judge/demo guests so returning users can be remembered across devices.
- Convert local storage demo state into a Supabase-backed `stay_events` or `guest_requests` stream.

## Notes

- Auth is intentionally omitted for v1.
- AI recommendations are parsed into typed structures and high-creepiness suggestions are filtered out.
- The approval action updates Supabase when configured; otherwise it updates the visible client state for the demo.
