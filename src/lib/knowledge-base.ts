export const defaultKnowledgeBase = `Rosewood Sand Hill hospitality knowledge base

Positioning
- Rosewood Sand Hill is a calm Silicon Valley retreat on Sand Hill Road in Menlo Park.
- Staff should answer warmly, briefly, and with restraint.
- If a guest asks for a booking, reservation, price confirmation, medical advice, transportation guarantee, or anything operationally sensitive, route to staff.

Dining
- Madera celebrates Northern California seasonal cooking, locally sourced ingredients, and serene breakfasts through dinner.
- Madera Bar offers crafted cocktails and light bites with Santa Cruz Mountain views from the terrace.
- In-room dining offers seasonal dishes in the privacy of the room or terrace.
- Private dining rooms within Madera can host intimate gatherings of up to 16 guests.
- Flamingo Estate Afternoon Tea is offered in The Library with signature teas, savory bites, and house-made pastries.

Wellness
- Asaya Spa offers holistic treatments, mindful rituals, serene surroundings, and restoration-focused wellness.
- The property includes spa, fitness, pool, salon, and curated wellness experiences.
- Sand Hill Salon is available for hair and salon appointments.

Experiences
- Cycling Concierge is available for guests who want an active local route.
- The property is close to Stanford, Menlo Park, Palo Alto, and Sand Hill Road offices.

Response policy
- Answer simple informational questions directly.
- Keep answers under 70 words.
- Never invent exact availability.
- Never guarantee reservations or appointments.
- Route booking, scheduling, allergy, billing, complaint, maintenance, and urgent requests to staff.
- Avoid hard selling. Offer one quiet option when helpful.`;

export const staffRoutingKeywords = [
  "book",
  "reserve",
  "reservation",
  "appointment",
  "schedule",
  "allergy",
  "maintenance",
  "broken",
  "late checkout",
  "bill",
  "charge",
  "refund",
  "transport",
  "car",
  "urgent",
  "manager",
];

export type RecommendedService = {
  label: string;
  amount: number;
  category: string;
  rationale: string;
};

export function getPersonalizedRecommendations(input: {
  occasion: string;
  lastSignal: string;
  privacyMode: boolean;
}): RecommendedService[] {
  const text = `${input.occasion} ${input.lastSignal}`.toLowerCase();

  if (text.includes("low") || text.includes("quiet") || text.includes("tired") || text.includes("meeting")) {
    return [
      {
        label: "Madera quiet dinner hold",
        amount: 420,
        category: "Dining",
        rationale: "A low-pressure table creates optionality after a full day without asking the group to decide now.",
      },
      {
        label: "Asaya Spa personalized treatment",
        amount: 250,
        category: "Wellness",
        rationale: "A restorative treatment fits a decompression stay and can be offered without additional outreach.",
      },
      {
        label: "In-room seasonal dinner",
        amount: 160,
        category: "Dining",
        rationale: "Best if privacy mode stays on and the group wants the evening to remain residential.",
      },
    ];
  }

  if (text.includes("active") || text.includes("outdoor") || text.includes("cycle")) {
    return [
      {
        label: "Cycling concierge route",
        amount: 0,
        category: "Activity",
        rationale: "A local route supports an active stay without adding friction.",
      },
      {
        label: "Asaya Spa recovery treatment",
        amount: 250,
        category: "Wellness",
        rationale: "A recovery-focused treatment pairs naturally with an active day.",
      },
    ];
  }

  return [
    {
      label: "Flamingo Estate afternoon tea",
      amount: 95,
      category: "Dining",
      rationale: "A contained, elegant moment that adds texture to the stay without feeling over-planned.",
    },
    {
      label: "Madera Bar terrace aperitif",
      amount: 80,
      category: "Dining",
      rationale: "A light option with minimal commitment and a strong sense of place.",
    },
  ];
}
