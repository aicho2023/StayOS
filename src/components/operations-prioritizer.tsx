"use client";

import { AlertCircle, Bot, ClipboardList, Sparkles } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { runAgentAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { StayDetail } from "@/lib/types";

type OperationsPrioritizerProps = {
  arrivals: StayDetail[];
};

type OpsAgent = {
  id: string;
  name: string;
  useCase: string;
  prompt: string;
  context: string;
  icon: typeof Bot;
};

export function OperationsPrioritizer({ arrivals }: OperationsPrioritizerProps) {
  const initialOutputs = useMemo(() => buildInitialOutputs(arrivals), [arrivals]);
  const [outputs, setOutputs] = useState<Record<string, string[]>>(initialOutputs);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openTasks = arrivals.reduce((sum, item) => sum + item.tasks.filter((task) => task.status !== "done").length, 0);
  const reviewMoments = arrivals.reduce(
    (sum, item) => sum + item.moments.filter((moment) => moment.status === "suggested").length,
    0,
  );

  const stayBrief = arrivals
    .map((detail) => {
      const holder = `${detail.holder.first_name} ${detail.holder.last_name}`;
      const latestNote = detail.communications.at(-1)?.message ?? detail.context.stay_read;
      const tasks = detail.tasks.filter((task) => task.status !== "done").map((task) => task.description);
      return {
        stay: holder,
        occasion: detail.stay.occasion,
        posture: detail.context.interaction_style,
        energy: detail.context.energy_state,
        latest_signal: latestNote,
        open_tasks: tasks,
        candidate_moments: detail.moments.map((moment) => moment.title),
      };
    });

  const agents: OpsAgent[] = useMemo(
    () => [
      {
        id: "morning-brief",
        name: "Morning Brief Agent",
        useCase: "Summarize what the hotel team should know before arrivals begin.",
        prompt:
          "Create a concise morning operations brief for the hospitality lead. Return exactly 3 bullet points. Prioritize emotional context, friction points, and staff coordination.",
        context: JSON.stringify(stayBrief),
        icon: ClipboardList,
      },
      {
        id: "satisfaction-priority",
        name: "Satisfaction Priority Agent",
        useCase: "Rank the few staff actions most likely to improve guest comfort today.",
        prompt:
          "Prioritize actions that maximize guest satisfaction and reduce friction. Return exactly 3 bullet points, each with clear ownership.",
        context: JSON.stringify({
          open_tasks: openTasks,
          moments_to_review: reviewMoments,
          stays: stayBrief,
        }),
        icon: AlertCircle,
      },
      {
        id: "moment-curator",
        name: "Moment Queue Agent",
        useCase: "Select which hospitality moments deserve human review, and which should stay quiet.",
        prompt:
          "Curate the moment queue. Return exactly 3 bullet points. Surface restrained, high-context moments worth staff approval, and suppress anything unnecessary.",
        context: JSON.stringify(stayBrief),
        icon: Sparkles,
      },
    ],
    [openTasks, reviewMoments, stayBrief],
  );

  function runOpsAgent(agent: OpsAgent) {
    setRunningId(agent.id);
    startTransition(async () => {
      const result = await runAgentAction({
        agentName: agent.name,
        prompt: agent.prompt,
        context: agent.context,
      });
      setOutputs((current) => ({ ...current, [agent.id]: parseAgentBullets(result.output) }));
      setRunningId(null);
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-clay">Admin intelligence layer</p>
          <h3 className="mt-2 font-serif text-3xl text-stone-950">What should the hotel prioritize?</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
            Run lightweight agents that synthesize today&apos;s stays, requests, and proposed moments into a staff-first
            operating brief. The goal is fewer, better interventions.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <div className="rounded-md bg-linen px-4 py-3">
            <p className="font-serif text-2xl text-stone-950">{openTasks}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-stone-500">open tasks</p>
          </div>
          <div className="rounded-md bg-linen px-4 py-3">
            <p className="font-serif text-2xl text-stone-950">{reviewMoments}</p>
            <p className="text-xs uppercase tracking-[0.14em] text-stone-500">moments</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <article key={agent.id} className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-clay shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-950">{agent.name}</h4>
                  <p className="mt-1 text-sm leading-5 text-stone-600">{agent.useCase}</p>
                </div>
              </div>
              <Button className="mt-4 w-full" variant="outline" onClick={() => runOpsAgent(agent)} disabled={isPending}>
                {runningId === agent.id ? "Synthesizing..." : "Run agent"}
              </Button>
              <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
                {(outputs[agent.id] ?? []).map((item, index) => (
                  <div key={`${agent.id}-${index}`} className="rounded-md bg-white p-3 text-sm leading-6 text-stone-700">
                    {item}
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function parseAgentBullets(output: string) {
  const lines = output
    .split(/\n/)
    .flatMap((line) => line.split("•"))
    .map((line) => line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
  return (lines.length ? lines : [output]).slice(0, 4);
}

function buildInitialOutputs(arrivals: StayDetail[]): Record<string, string[]> {
  const highPriority = arrivals
    .flatMap((detail) =>
      detail.tasks
        .filter((task) => task.status !== "done")
        .map((task) => `${task.assigned_to}: ${task.description}`),
    )
    .slice(0, 2);
  const firstArrival = arrivals[0];
  const firstMoment = firstArrival?.moments[0];

  return {
    "morning-brief": [
      `${arrivals.length} arrivals need staff awareness today; keep the focus on arrival friction, privacy posture, and one useful moment per stay.`,
      firstArrival
        ? `${firstArrival.holder.first_name} ${firstArrival.holder.last_name}: ${firstArrival.context.stay_read}`
        : "No arrivals are currently queued.",
      highPriority[0] ?? "No urgent operational task is blocking the morning briefing.",
    ],
    "satisfaction-priority": [
      highPriority[0] ?? "Experience Lead: review any stay with missing arrival signals before outreach.",
      highPriority[1] ?? "Front Office: preserve low-touch arrivals where guests have signaled fatigue or privacy.",
      "Guest Relations: only send guest-facing notes after a human approves the tone and timing.",
    ],
    "moment-curator": [
      firstMoment
        ? `Review: ${firstMoment.title}. It is concrete, optional, and tied to current stay context.`
        : "No moment is ready for approval; run stay-level intelligence first.",
      "Suppress: repeated outreach, broad packages, or recommendations based on sensitive inference.",
      "Prefer: one quiet, high-context option that staff can mention once and let breathe.",
    ],
  };
}
