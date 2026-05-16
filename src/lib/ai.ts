import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { HospitalityMomentRecommendation, StayDetail } from "@/lib/types";

const recommendationSchema = z.object({
  title: z.string(),
  reasoning: z.string(),
  guest_message: z.string(),
  staff_action: z.string(),
    scores: z.object({
      comfort: z.number().min(0).max(100),
      creepiness: z.number().min(0).max(100),
      relevance: z.number().min(0).max(100),
      revenue_opportunity: z.number().min(0).max(100),
    }),
  task_suggestions: z.array(
    z.object({
      task_type: z.enum(["arrival", "concierge", "dining", "transport", "housekeeping"]),
      assigned_to: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      description: z.string(),
      due_at: z.string(),
    }),
  ),
});

const responseSchema = z.object({
  recommendations: z.array(recommendationSchema),
});

export async function generateMomentRecommendations(
  detail: StayDetail,
  liveContext?: Record<string, unknown>,
): Promise<{
  source: "anthropic" | "fallback";
  recommendations: HospitalityMomentRecommendation[];
  diagnostic?: string;
}> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      source: "fallback",
      recommendations: fallbackRecommendations(detail, liveContext),
      diagnostic: "ANTHROPIC_API_KEY is not set in the server environment.",
    };
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: 1200,
      temperature: 0.3,
      system:
        "You are a luxury hospitality context synthesizer. Recommend restrained, emotionally comfortable service moments. Humans approve everything. Do not be creepy, robotic, or salesy. Return only valid JSON.",
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            instruction:
              "Generate 2 hospitality moments. Suppress anything with creepiness over 35. Optimize for a few perfect moments, optionality, and staff control.",
            positioning:
              "This is a hospitality intelligence layer on top of PMS/CRM/RMS/POS systems. Do not provide pricing, forecasting, occupancy, RevPAR, or revenue-management advice.",
            stay: detail.stay,
            guests: detail.guests,
            memories: detail.memories,
            communications: detail.communications,
            tasks: detail.tasks,
            spending: detail.spending,
            room_preferences: detail.roomPreferences,
            property: detail.property,
            arrival_signals: detail.arrivalSignals,
            local_events: detail.localEvents,
            staff_briefs: detail.staffBriefs,
            synthesized_context: detail.context,
            live_context: liveContext,
            required_shape: {
              recommendations: [
                {
                  title: "string",
                  reasoning: "string",
                  guest_message: "string",
                  staff_action: "string",
                  scores: {
                    comfort: "number 0-100",
                    creepiness: "number 0-100",
                    relevance: "number 0-100",
                    revenue_opportunity: "number 0-100",
                  },
                  task_suggestions: [
                    {
                      task_type: "arrival | concierge | dining | transport | housekeeping",
                      assigned_to: "string",
                      priority: "low | medium | high",
                      description: "string",
                      due_at: "ISO timestamp",
                    },
                  ],
                },
              ],
            },
          }),
        },
      ],
    });

    const text = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
    const parsed = responseSchema.parse(JSON.parse(extractJson(text)));

    return {
      source: "anthropic",
      recommendations: parsed.recommendations.filter((item) => item.scores.creepiness <= 35),
    };
  } catch (error) {
    return {
      source: "fallback",
      recommendations: fallbackRecommendations(detail, liveContext),
      diagnostic: error instanceof Error ? error.message : "Unknown Anthropic generation error.",
    };
  }
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

export function fallbackRecommendations(detail?: StayDetail, liveContext?: Record<string, unknown>): HospitalityMomentRecommendation[] {
  const holder = detail?.holder;
  const guestName = holder ? `${holder.first_name} ${holder.last_name}` : "the guest";
  const occasion = detail?.stay.occasion || "this stay";
  const latestMessage =
    detail?.communications.at(-1)?.message ||
    (typeof liveContext?.lastSignal === "string" ? liveContext.lastSignal : "") ||
    detail?.context.stay_read ||
    "The stay context suggests the guest would value a simple, low-friction arrival.";
  const preference = detail?.roomPreferences[0];
  const temperature = preference?.temperature ? `${preference.temperature}F` : "the saved room temperature";
  const lighting = preference?.lighting || "soft lighting";
  const localOption = detail?.localEvents[0]?.title || detail?.property?.sense_of_place || "a quiet property experience";

  return [
    {
      title: "Quiet arrival reset",
      reasoning:
        `${guestName} is arriving for ${occasion}. The latest context is: "${latestMessage}". A restrained arrival reset creates comfort without asking for another decision.`,
      guest_message:
        "Welcome in. We have kept arrival simple and will stay close by if anything would make the evening easier.",
      staff_action: `Prepare the room at ${temperature} with ${lighting}, keep orientation brief, and avoid repeated follow-up unless the guest asks.`,
      scores: {
        comfort: 94,
        creepiness: 12,
        relevance: 96,
        revenue_opportunity: 62,
      },
      task_suggestions: [
        {
          task_type: "dining",
          assigned_to: "Experience Lead",
          priority: "medium",
          description: `Prepare a low-friction arrival for ${guestName}, including ${temperature}, ${lighting}, and a brief welcome.`,
          due_at: "2026-05-16T18:45:00-07:00",
        },
        {
          task_type: "arrival",
          assigned_to: "Front Office",
          priority: "high",
          description: "Keep check-in brief and ask only one open-ended comfort question.",
          due_at: "2026-05-16T15:45:00-07:00",
        },
      ],
    },
    {
      title: "One local option, no pressure",
      reasoning:
        `A single contextual option can help without making the stay feel managed. The best fit from available property context is ${localOption}.`,
      guest_message:
        "We have one quiet option available nearby if it would be helpful later. No need to decide now.",
      staff_action: `Hold one light-touch option related to ${localOption}; mention it only if the guest asks what is easy nearby.`,
      scores: {
        comfort: 90,
        creepiness: 8,
        relevance: 91,
        revenue_opportunity: 18,
      },
      task_suggestions: [
        {
          task_type: "housekeeping",
          assigned_to: "Concierge",
          priority: "medium",
          description: `Prepare one optional recommendation connected to ${localOption}, with no follow-up sequence.`,
          due_at: "2026-05-16T15:00:00-07:00",
        },
      ],
    },
  ];
}
