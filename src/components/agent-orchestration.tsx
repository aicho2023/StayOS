"use client";

import { Bot, CheckCircle2, GitBranch, Hand, ShieldCheck, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { runAgentAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { HospitalityAgent, AgentDecision } from "@/lib/agents";

type AgentOrchestrationProps = {
  agents: HospitalityAgent[];
  decisions: AgentDecision[];
};

const icons = [Bot, Sparkles, ShieldCheck, GitBranch, Hand, CheckCircle2];

export function AgentOrchestration({ agents, decisions }: AgentOrchestrationProps) {
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAgent(agent: HospitalityAgent) {
    setRunningAgent(agent.id);
    startTransition(async () => {
      const result = await runAgentAction({
        agentName: agent.name,
        prompt: agent.prompt,
        context: agent.outputHint,
      });
      setOutputs((current) => ({ ...current, [agent.id]: result.output }));
      setRunningAgent(null);
    });
  }

  function runAll() {
    startTransition(async () => {
      setRunningAgent("all");
      const results = await Promise.all(
        agents.map(async (agent) => {
          const result = await runAgentAction({
            agentName: agent.name,
            prompt: agent.prompt,
            context: agent.outputHint,
          });
          return [agent.id, result.output] as const;
        }),
      );
      setOutputs((current) => ({ ...current, ...Object.fromEntries(results) }));
      setRunningAgent(null);
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-clay">Stay intelligence agents</p>
          <h2 className="mt-2 font-serif text-3xl text-stone-950">From signal to staff decision</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Each agent has a narrow job: understand the stay, propose a restrained moment, guard against overreach, and
            prepare staff-controlled work. Outputs stay blank until a team member asks the system to reason.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-md bg-stone-900 px-3 py-2 text-xs uppercase tracking-[0.14em] text-white">
            AI suggests · humans decide
          </div>
          <Button onClick={runAll} disabled={isPending} variant="outline">
            {runningAgent === "all" ? "Running review..." : "Run intelligence review"}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-lg border border-stone-200 bg-[#fbfaf7] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Workflow</p>
          <div className="mt-4 space-y-3">
            {agents.map((agent, index) => {
              const Icon = icons[index % icons.length];
              return (
                <button
                  key={agent.id}
                  onClick={() => runAgent(agent)}
                  disabled={isPending}
                  className="group grid w-full grid-cols-[40px_1fr_auto] items-start gap-3 rounded-md border border-stone-200 bg-white p-3 text-left transition hover:border-stone-300 hover:bg-linen disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-linen text-clay group-hover:bg-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-stone-950">{agent.name}</span>
                    <span className="mt-1 block text-sm leading-5 text-stone-600">{agent.role}</span>
                    <span className="mt-2 block text-xs leading-5 text-stone-500">Prompt: {agent.prompt}</span>
                  </span>
                  <span className="rounded bg-stone-900 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white">
                    {runningAgent === agent.id || runningAgent === "all" ? "Running" : "Run"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Generated staff plan</p>
          <div className="mt-4 space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-md bg-stone-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-stone-950">{agent.name}</p>
                  <p className="text-xs text-stone-500">{agent.handoff}</p>
                </div>
                <p className="mt-2 max-h-32 overflow-y-auto text-sm leading-6 text-stone-700">
                  {outputs[agent.id] ?? (
                    <span className="text-stone-400">Waiting for staff to run this agent.</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-stone-200 pt-5 md:grid-cols-4">
        {decisions.map((decision) => (
          <div key={decision.label} className="rounded-md bg-linen p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">{decision.label}</p>
            <p className="mt-2 font-serif text-xl capitalize text-stone-950">{decision.value}</p>
            <p className="mt-2 text-xs leading-5 text-stone-600">{decision.rationale}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
