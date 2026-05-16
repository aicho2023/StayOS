"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateMomentRecommendations } from "@/lib/ai";
import { getStayDetail } from "@/lib/data";
import { defaultKnowledgeBase, staffRoutingKeywords } from "@/lib/knowledge-base";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stayAliases: Record<string, string> = {
  "stay-sandhill-founders": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
};

export async function generateMomentsAction(stayId: string, liveContext?: Record<string, unknown>) {
  const detail = await getStayDetail(stayId);
  return generateMomentRecommendations(detail, liveContext);
}

export async function runAgentAction(input: { agentName: string; prompt: string; context: string }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  function tidyAgentOutput(value: string) {
    return value
      .replace(/\*\*/g, "")
      .replace(/^\s*[-*]\s+/gm, "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (!apiKey) {
    return {
      source: "fallback" as const,
      output: `${input.agentName}: ${input.context}`,
    };
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 260,
      temperature: 0.25,
      system:
        "You are an agent in an AI-native hospitality intelligence layer. Be concise, operational, emotionally intelligent, and restraint-aware. Do not mention replacing PMS, CRM, RMS, POS, or staff. Do not give pricing, forecasting, or revenue-management advice.",
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            agent: input.agentName,
            prompt: input.prompt,
            context: input.context,
            output_style:
              "Return plain text bullets only. Use exactly 3 lines. Start each line with '- '. Include a concrete staff action or suppression decision when relevant.",
          }),
        },
      ],
    });
    const output = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return { source: "anthropic" as const, output: tidyAgentOutput(output) };
  } catch (error) {
    return {
      source: "fallback" as const,
      output:
        error instanceof Error
          ? `${input.agentName} could not reach live AI: ${error.message}. Fallback context: ${input.context}`
          : `${input.agentName}: ${input.context}`,
    };
  }
}

export async function answerGuestMessageAction(input: { message: string; knowledgeBase?: string }) {
  const message = input.message.trim();
  const lower = message.toLowerCase();
  const shouldRouteToStaff = staffRoutingKeywords.some((keyword) => lower.includes(keyword));

  if (shouldRouteToStaff) {
    return {
      route: "staff" as const,
      answer: "I’ve shared this with the team so they can handle it personally.",
      reason: "Operational or reservation-sensitive request.",
    };
  }

  const knowledgeBase = input.knowledgeBase?.trim() || defaultKnowledgeBase;

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      route: "ai" as const,
      answer:
        "Rosewood Sand Hill offers Madera, Madera Bar, in-room dining, Asaya Spa, salon services, and quiet local experiences. I can share a simple option or connect you with the team.",
      reason: "Fallback knowledge-base response.",
    };
  }

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const result = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
      max_tokens: 180,
      temperature: 0.2,
      system:
        "You answer simple guest questions for a luxury hotel using only the provided knowledge base. Keep answers warm, concise, and restrained. If the request requires staff action, say it should be routed to staff.",
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            knowledge_base: knowledgeBase,
            guest_message: message,
            rule: "Answer in under 70 words. Do not invent availability, exact prices, or guarantees.",
          }),
        },
      ],
    });
    const answer = result.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return { route: "ai" as const, answer, reason: "Answered from property knowledge base." };
  } catch {
    return {
      route: "staff" as const,
      answer: "I’ve shared this with the team so they can answer carefully.",
      reason: "AI answer unavailable.",
    };
  }
}

export async function approveMomentAction(momentId: string, stayId: string) {
  const supabase = createSupabaseServerClient();
  const databaseStayId = stayAliases[stayId] ?? stayId;

  if (supabase) {
    const { data: moment } = await supabase
      .from("moments")
      .select("title, guest_message, staff_action")
      .eq("id", momentId)
      .maybeSingle();

    await supabase.from("moments").update({ status: "approved" }).eq("id", momentId);
    await supabase.from("tasks").insert({
      stay_id: databaseStayId,
      assigned_to: "Experience Lead",
      priority: "medium",
      status: "approved",
      task_type: "concierge",
      description: moment?.staff_action ?? `Coordinate approved hospitality moment: ${moment?.title ?? "guest-facing note"}.`,
      due_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    if (moment?.guest_message) {
      await supabase.from("communications").insert({
        stay_id: databaseStayId,
        sender_type: "staff",
        channel: "app",
        message: moment.guest_message,
      });
    }
  }

  revalidatePath(`/stays/${stayId}`);
  revalidatePath(`/guest/${stayId}`);
}

export async function resetDemoStayAction(stayId: string) {
  const supabase = createSupabaseServerClient();
  const databaseStayId = stayAliases[stayId] ?? stayId;

  if (supabase) {
    const { data: moments } = await supabase
      .from("moments")
      .select("guest_message, staff_action")
      .eq("stay_id", databaseStayId);
    const guestMessages = (moments ?? []).map((moment) => moment.guest_message).filter(Boolean);
    const staffActions = (moments ?? []).map((moment) => moment.staff_action).filter(Boolean);

    await supabase.from("moments").update({ status: "suggested" }).eq("stay_id", databaseStayId);

    if (staffActions.length) {
      await supabase.from("tasks").delete().eq("stay_id", databaseStayId).in("description", staffActions);
    }

    if (guestMessages.length) {
      await supabase
        .from("communications")
        .delete()
        .eq("stay_id", databaseStayId)
        .eq("sender_type", "staff")
        .eq("channel", "app")
        .in("message", guestMessages);
    }
  }

  revalidatePath(`/stays/${stayId}`);
  revalidatePath(`/guest/${stayId}`);
  revalidatePath("/demo");
}

const guestStaySchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  arrivalDate: z.string().trim().min(1),
  departureDate: z.string().trim().min(1),
  occasion: z.string().trim().min(1),
  purpose: z.string().trim().min(1),
  friendNames: z.string().trim().optional(),
  temperature: z.preprocess(
    (value) => (value === "" || value === null || typeof value === "undefined" ? undefined : value),
    z.coerce.number().min(62).max(76).optional(),
  ),
  lighting: z.string().trim().min(1),
  pillowType: z.string().trim().min(1),
  arrivalRequest: z.string().trim().optional(),
});

function splitName(name: string) {
  const cleanName = name.replace(/<[^>]*>/g, "").trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] ?? "Guest",
    last_name: parts.slice(1).join(" "),
  };
}

function parseFriend(friend: string, index: number) {
  const emailMatch = friend.match(/<([^>]+)>/);
  const name = splitName(friend);

  return {
    ...name,
    email: emailMatch?.[1]?.trim() || `guest-${Date.now()}-${index}@stayos.demo`,
    phone: "",
    loyalty_tier: "Invited guest",
    interaction_style: "balanced",
    privacy_level: "standard",
  };
}

export async function createGuestStayAction(input: z.input<typeof guestStaySchema>) {
  const parsed = guestStaySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Please complete the guest and stay details." };
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return { ok: false as const, error: "Supabase is not configured on the server." };
  }

  const data = parsed.data;
  const friendNames = (data.friendNames ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const existingGuest = await supabase
    .from("guests")
    .select("*")
    .ilike("email", data.email)
    .maybeSingle();

  if (existingGuest.error) {
    return { ok: false as const, error: existingGuest.error.message };
  }

  const guestInsert = existingGuest.data
    ? { data: existingGuest.data, error: null }
    : await supabase
    .from("guests")
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone ?? "",
      loyalty_tier: "Guest",
      interaction_style: "low_touch",
      privacy_level: "standard",
    })
    .select("*")
    .single();

  if (guestInsert.error || !guestInsert.data) {
    return { ok: false as const, error: guestInsert.error?.message ?? "Could not create guest." };
  }

  const stayInsert = await supabase
    .from("stays")
    .insert({
      property_id: "rosewood-sand-hill",
      reservation_holder_id: guestInsert.data.id,
      purpose_of_trip: data.purpose,
      occasion: data.occasion,
      arrival_date: data.arrivalDate,
      departure_date: data.departureDate,
      status: "arriving_today",
      group_size: 1 + friendNames.length,
      interaction_preference: "low_touch",
      budget_sensitivity: "moderate",
    })
    .select("*")
    .single();

  if (stayInsert.error || !stayInsert.data) {
    return { ok: false as const, error: stayInsert.error?.message ?? "Could not create stay." };
  }

  const stayId = stayInsert.data.id;
  const friendGuests = friendNames.map(parseFriend);

  const insertedFriends = friendGuests.length
    ? await supabase.from("guests").insert(friendGuests).select("*")
    : { data: [], error: null };

  if (insertedFriends.error) {
    return { ok: false as const, error: insertedFriends.error.message };
  }

  const allStayGuests = [
    { stay_id: stayId, guest_id: guestInsert.data.id, role: "reservation_holder" },
    ...(insertedFriends.data ?? []).map((guest) => ({
      stay_id: stayId,
      guest_id: guest.id,
      role: "guest",
    })),
  ];

  await supabase.from("stay_guests").insert(allStayGuests);
  await supabase.from("room_preferences").insert({
    guest_id: guestInsert.data.id,
    temperature: data.temperature ?? null,
    lighting: data.lighting,
    music: "Off by default",
    streaming_services: [],
    bed_type: "King",
    pillow_type: data.pillowType,
  });

  await supabase.from("communications").insert([
    {
      stay_id: stayId,
      sender_type: "guest",
      channel: "app",
      message: data.arrivalRequest || "New stay intake completed.",
    },
    {
      stay_id: stayId,
      sender_type: "system",
      channel: "internal_note",
      message: `Guest-created stay from phone onboarding. Friends: ${friendNames.join(", ") || "none"}.`,
    },
  ]);

  await supabase.from("moments").insert({
    stay_id: stayId,
    title: "Smooth, low-friction arrival",
    reasoning:
      "The guest completed a direct intake and shared preferences before arrival. The best first move is to quietly honor the context without over-messaging.",
    guest_message:
      "Welcome in. We have your stay details and will keep arrival simple, warm, and easy.",
    staff_action:
      "Review new intake, confirm room preferences, and prepare a brief arrival with one useful option only.",
    revenue_opportunity: 18,
    relevance_score: 88,
    comfort_score: 90,
    creepiness_score: 6,
    status: "suggested",
  });

  await supabase.from("tasks").insert({
    stay_id: stayId,
    assigned_to: "Experience Lead",
    priority: "medium",
    status: "suggested",
    task_type: "arrival",
    description: "Review new guest-created stay and confirm preferences before arrival.",
    due_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  });

  revalidatePath("/");
  revalidatePath(`/guest/${stayId}`);
  revalidatePath(`/stays/${stayId}`);

  return { ok: true as const, stayId };
}
