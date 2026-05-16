import { unstable_noStore as noStore } from "next/cache";
import { getDemoArrivals, getDemoStayDetail, guests as demoGuests, memories as demoMemories, stayGuests as demoStayGuests, stays as demoStays } from "@/lib/demo-data";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Guest, GuestDirectoryEntry, Memory, Stay, StayContextSummary, StayDetail, StayGuest } from "@/lib/types";

export const stayAliases: Record<string, string> = {
  "stay-sandhill-founders": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
};

function synthesizeStayContext(stay: Stay): StayContextSummary {
  const purpose = stay.purpose_of_trip.toLowerCase();
  const occasion = stay.occasion?.toLowerCase() ?? "";

  if (purpose.includes("recovery") || occasion.includes("sleep")) {
    return {
      interaction_style: stay.interaction_preference,
      trip_type: "wellness recovery",
      energy_state: "privacy-seeking and recovery-oriented",
      recommended_tone: "quiet, permissioned, restorative",
      stay_read: "The guest will value protected rest, minimal interruption, and practical wellness support.",
      restraint_guidance: "Do not infer health status; use only stated sleep and quiet-dining preferences.",
    };
  }

  if (occasion.includes("anniversary")) {
    return {
      interaction_style: stay.interaction_preference,
      trip_type: "returning anniversary stay",
      energy_state: "emotionally receptive but prefers understated recognition",
      recommended_tone: "warm, personal, and discreet",
      stay_read: "The highest-value service is continuity from prior Rosewood stays without visible fanfare.",
      restraint_guidance: "Ask before storing anniversary memory long term; avoid generic decoration.",
    };
  }

  if (purpose.includes("family") || occasion.includes("birthday")) {
    return {
      interaction_style: stay.interaction_preference,
      trip_type: "family cultural stay",
      energy_state: "coordination-heavy and celebratory",
      recommended_tone: "clear, helpful, and flexible",
      stay_read: "The family needs coordination relief, local programming, and gentle birthday recognition.",
      restraint_guidance: "Offer a small number of useful options; avoid over-scheduling the group.",
    };
  }

  return {
    interaction_style: stay.interaction_preference,
    trip_type: stay.purpose_of_trip,
    energy_state: "focused",
    recommended_tone: "warm and direct",
    stay_read: "Keep service precise, contextual, and unfussy.",
    restraint_guidance: "Offer practical support without expanding the conversation.",
  };
}

export async function getTodayArrivals(): Promise<StayDetail[]> {
  noStore();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return getDemoArrivals();
  }

  const { data, error } = await supabase
    .from("stays")
    .select("*")
    .eq("status", "arriving_today")
    .order("arrival_date", { ascending: true });

  if (error || !data?.length) {
    return getDemoArrivals();
  }

  const details = await Promise.all(data.map((stay) => getStayDetail(stay.id)));
  return details.filter((detail): detail is StayDetail => Boolean(detail));
}

function buildGuestDirectory(
  guestRows: Guest[],
  stayRows: Stay[],
  stayGuestRows: StayGuest[],
  memoryRows: Memory[],
): GuestDirectoryEntry[] {
  return guestRows
    .map((guest) => {
      const linkedStays = stayGuestRows
        .filter((link) => link.guest_id === guest.id)
        .map((link) => stayRows.find((stay) => stay.id === link.stay_id))
        .filter((stay): stay is Stay => Boolean(stay))
        .sort((a, b) => b.arrival_date.localeCompare(a.arrival_date));
      const currentStay = linkedStays.find((stay) => stay.status !== "departed") ?? null;
      const lastStay = linkedStays[0] ?? null;
      const guestMemories = memoryRows.filter((memory) => memory.guest_id === guest.id);

      return {
        ...guest,
        current_stay_id: currentStay?.id ?? null,
        current_stay_occasion: currentStay?.occasion ?? null,
        last_stay_id: lastStay?.id ?? null,
        last_stay_occasion: lastStay?.occasion ?? null,
        last_property_id: lastStay?.property_id ?? null,
        memory_count: guestMemories.length,
        memories: guestMemories,
        total_stays: linkedStays.length,
      };
    })
    .sort((a, b) => Number(Boolean(b.current_stay_id)) - Number(Boolean(a.current_stay_id)) || b.memory_count - a.memory_count);
}

export async function getGuestDirectory(): Promise<GuestDirectoryEntry[]> {
  noStore();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return buildGuestDirectory(demoGuests, demoStays, demoStayGuests, demoMemories);
  }

  const [guestsResult, staysResult, stayGuestsResult, memoriesResult] = await Promise.all([
    supabase.from("guests").select("*").order("created_at", { ascending: false }).limit(80),
    supabase.from("stays").select("*").order("arrival_date", { ascending: false }).limit(120),
    supabase.from("stay_guests").select("*"),
    supabase.from("memories").select("*").order("created_at", { ascending: false }),
  ]);

  if (guestsResult.error || staysResult.error || stayGuestsResult.error || memoriesResult.error) {
    return buildGuestDirectory(demoGuests, demoStays, demoStayGuests, demoMemories);
  }

  return buildGuestDirectory(
    guestsResult.data ?? [],
    staysResult.data ?? [],
    stayGuestsResult.data ?? [],
    memoriesResult.data ?? [],
  );
}

export async function getStayDetail(stayId: string): Promise<StayDetail> {
  noStore();
  const supabase = createSupabaseServerClient();
  const lookupId = stayAliases[stayId] ?? stayId;

  if (!supabase) {
    return getDemoStayDetail(stayId);
  }

  const { data: stay, error: stayError } = await supabase
    .from("stays")
    .select("*")
    .eq("id", lookupId)
    .single();

  if (stayError || !stay) {
    return getDemoStayDetail(stayId);
  }

  const [
    stayGuestsResult,
    tasksResult,
    momentsResult,
    communicationsResult,
    spendingResult,
    propertyResult,
    arrivalSignalsResult,
    localEventsResult,
    memoryGovernanceResult,
    suppressedRecommendationsResult,
    staffBriefsResult,
    postStayEngagementsResult,
  ] = await Promise.all([
    supabase.from("stay_guests").select("*, guests(*)").eq("stay_id", lookupId),
    supabase.from("tasks").select("*").eq("stay_id", lookupId).order("due_at", { ascending: true }),
    supabase.from("moments").select("*").eq("stay_id", lookupId).order("created_at", { ascending: false }),
    supabase.from("communications").select("*").eq("stay_id", lookupId).order("created_at", { ascending: true }),
    supabase.from("spending").select("*").eq("stay_id", lookupId).order("timestamp", { ascending: true }),
    supabase.from("properties").select("*").eq("id", stay.property_id).maybeSingle(),
    supabase.from("arrival_signals").select("*").eq("stay_id", lookupId).order("created_at", { ascending: true }),
    supabase.from("local_events").select("*").eq("property_id", stay.property_id).order("starts_at", { ascending: true }),
    supabase.from("memory_governance").select("*").eq("stay_id", lookupId),
    supabase.from("suppressed_recommendations").select("*").eq("stay_id", lookupId),
    supabase.from("staff_briefs").select("*").eq("stay_id", lookupId),
    supabase.from("post_stay_engagements").select("*").eq("stay_id", lookupId),
  ]);

  if (stayGuestsResult.error) {
    return getDemoStayDetail(stayId);
  }

  const guests = (stayGuestsResult.data ?? [])
    .map((link) => link.guests)
    .filter(Boolean)
    .flat();
  const guestIds = guests.map((guest) => guest.id);
  const holder = guests.find((guest) => guest.id === stay.reservation_holder_id) ?? guests[0];

  if (!holder) {
    return getDemoStayDetail(stayId);
  }

  const [memoriesResult, roomPreferencesResult] = await Promise.all([
    supabase.from("memories").select("*").in("guest_id", guestIds),
    supabase.from("room_preferences").select("*").in("guest_id", guestIds),
  ]);
  const demoDetail = getDemoStayDetail(stayId);
  const knownDemoContext =
    demoDetail.stay.id === stayId ||
    stayAliases[stayId] === lookupId ||
    lookupId === "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const demoOnly = knownDemoContext ? demoDetail : undefined;

  return {
    stay,
    property: propertyResult.data ?? demoOnly?.property,
    guests,
    holder,
    memories: memoriesResult.data ?? [],
    tasks: tasksResult.data ?? [],
    moments: (momentsResult.data ?? []).map((moment) => ({
      ...moment,
      relevance_score: moment.relevance_score ?? moment.comfort_score ?? 80,
    })),
    communications: communicationsResult.data ?? [],
    spending: spendingResult.data ?? [],
    roomPreferences: roomPreferencesResult.data ?? [],
    arrivalSignals: arrivalSignalsResult.data ?? demoOnly?.arrivalSignals ?? [],
    localEvents: localEventsResult.data ?? demoOnly?.localEvents ?? [],
    memoryGovernance: memoryGovernanceResult.data ?? demoOnly?.memoryGovernance ?? [],
    suppressedRecommendations: suppressedRecommendationsResult.data ?? demoOnly?.suppressedRecommendations ?? [],
    staffBriefs: staffBriefsResult.data ?? demoOnly?.staffBriefs ?? [],
    postStayEngagements: postStayEngagementsResult.data ?? demoOnly?.postStayEngagements ?? [],
    context: knownDemoContext ? demoDetail.context : synthesizeStayContext(stay),
  };
}
