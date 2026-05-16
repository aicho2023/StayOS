import type { StayDetail } from "@/lib/types";

export type HospitalityAgent = {
  id: string;
  name: string;
  role: string;
  status: "ready" | "reasoning" | "guarding" | "waiting_for_human";
  confidence: number;
  reads: string[];
  prompt: string;
  outputHint: string;
  handoff: string;
};

export type AgentDecision = {
  label: string;
  value: string;
  rationale: string;
};

export function getHospitalityAgents(detail: StayDetail): HospitalityAgent[] {
  const topMoment = [...detail.moments].sort((a, b) => b.comfort_score - a.comfort_score)[0];

  return [
    {
      id: "context-synthesizer",
      name: "Context Synthesizer",
      role: "Unifies fragmented PMS, CRM, POS, notes, preferences, and message signals into stay understanding.",
      status: "ready",
      confidence: 88,
      reads: ["PMS stay dates", "CRM preferences", "staff notes", "guest messages", "room preferences"],
      prompt:
        "Synthesize stay context into an emotional read, interaction posture, and recommended tone. Avoid pricing, forecasting, or CRM replacement language.",
      outputHint: detail.context.stay_read,
      handoff: "Feeds emotional read, tone, and interaction posture to Moment Engine.",
    },
    {
      id: "moment-engine",
      name: "Moment Engine",
      role: "Generates one or two high-fit hospitality moments optimized for comfort, timing, and restraint.",
      status: "reasoning",
      confidence: topMoment?.relevance_score ?? 86,
      reads: ["stay understanding", "open tasks", "arrival timing", "guest energy state"],
      prompt:
        "Generate one or two high-fit hospitality moments optimized for comfort, timing, relevance, and restraint. Do not create broad upsell campaigns.",
      outputHint: topMoment
        ? `${topMoment.title}: ${topMoment.staff_action}`
        : "No moment recommended until confidence improves.",
      handoff: "Sends candidate moments to the Restraint Guard before staff sees them.",
    },
    {
      id: "restraint-guard",
      name: "Restraint Guard",
      role: "Suppresses creepy, spammy, low-confidence, overly personal, or aggressive recommendations.",
      status: "guarding",
      confidence: 91,
      reads: ["creepiness score", "confidence", "permission scope", "interaction preference"],
      prompt:
        "Review proposed moments and suppress anything creepy, spammy, low-confidence, too personal, or unnecessarily commercial.",
      outputHint:
        "Allowed: one optional dinner hold and a quiet arrival path. Suppressed: repeated outreach, stress-language, and hard upsell phrasing.",
      handoff: "Only approved, low-creepiness moments progress to staff approval.",
    },
    {
      id: "task-orchestrator",
      name: "Task Orchestrator",
      role: "Turns approved moments into operational tasks while keeping humans in control.",
      status: "waiting_for_human",
      confidence: 84,
      reads: ["approved moment", "department ownership", "due times", "existing task load"],
      prompt:
        "Convert approved moments into operational tasks for staff teams. Keep all assignments human-approved.",
      outputHint:
        "Prepared tasks for Front Office, Madera host, Housekeeping, and Experience Lead. Awaiting staff approval.",
      handoff: "After staff approval, tasks are assigned and tracked in existing operational systems.",
    },
    {
      id: "comms-draft-agent",
      name: "Comms Draft Agent",
      role: "Drafts warm, brief guest language that staff can edit or send.",
      status: "ready",
      confidence: 87,
      reads: ["recommended tone", "moment reasoning", "guest interaction style"],
      prompt:
        "Draft one brief guest-facing message that feels warm, optional, and unintrusive. No over-explaining.",
      outputHint:
        topMoment?.guest_message ??
        "Welcome in. We will keep things simple and stay close by if anything would help.",
      handoff: "Draft stays human-approved; the system does not auto-send.",
    },
    {
      id: "memory-permission-agent",
      name: "Memory Permission Agent",
      role: "Determines what should be remembered, stay-scoped, expired, or never stored.",
      status: "guarding",
      confidence: 79,
      reads: ["source", "permission scope", "sensitivity", "expiry"],
      prompt:
        "Decide which preferences should be remembered, stay-scoped, expired, or not stored. Favor privacy and earned personalization.",
      outputHint:
        "Keep practical preferences; avoid storing inferred emotional states as permanent guest traits.",
      handoff: "Writes only earned, scoped memories back to the intelligence layer.",
    },
  ];
}

export function getAgentDecisions(detail: StayDetail): AgentDecision[] {
  const topMoment = [...detail.moments].sort((a, b) => b.comfort_score - a.comfort_score)[0];

  return [
    {
      label: "Primary posture",
      value: detail.context.interaction_style.replace("_", " "),
      rationale: "The stay note and prior preferences indicate the highest-value service is quiet friction removal.",
    },
    {
      label: "Recommended moment",
      value: topMoment?.title ?? "No moment",
      rationale: topMoment?.reasoning ?? "The agents are waiting for more signal.",
    },
    {
      label: "Suppression",
      value: "No follow-up loop",
      rationale: "The guest receives one useful option, then staff lets the moment breathe.",
    },
    {
      label: "Human gate",
      value: "Approval required",
      rationale: "AI can reason and draft, but staff chooses whether hospitality feels right in the moment.",
    },
  ];
}
