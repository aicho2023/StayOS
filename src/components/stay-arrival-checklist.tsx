"use client";

import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { DemoArrivalTask } from "@/lib/demo-live-state";
import type { StayDetail } from "@/lib/types";

type StayArrivalChecklistProps = {
  detail: StayDetail;
  liveTasks?: DemoArrivalTask[];
};

export function StayArrivalChecklist({ detail, liveTasks = [] }: StayArrivalChecklistProps) {
  const items = useMemo(() => {
    const taskItems = detail.tasks
      .filter((task) => !task.description.startsWith("Approved moment:"))
      .slice(0, 4)
      .map((task) => ({
        id: task.id,
        label: task.description,
        owner: task.assigned_to,
        done: task.status === "done" || task.status === "approved",
      }));
    const signalItems = detail.arrivalSignals.slice(0, 2).map((signal) => ({
      id: signal.id,
      label: signal.summary,
      owner: signal.source,
      done: signal.trust_level !== "inferred",
    }));
    const merged = [
      ...taskItems,
      ...signalItems,
      ...liveTasks,
      {
        id: "human-review",
        label: "Human review before guest-facing outreach",
        owner: "Experience Lead",
        done: false,
      },
    ];
    return Array.from(new Map(merged.map((item) => [item.label, item])).values());
  }, [detail, liveTasks]);
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((item) => [item.id, item.done])),
  );

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">Arrival orchestration</p>
      <h2 className="mt-2 font-serif text-3xl text-stone-950">Arrival checklist</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setChecked((current) => ({ ...current, [item.id]: !current[item.id] }))}
            className="flex w-full items-start gap-3 rounded-md border border-stone-200 bg-[#fbfaf7] p-3 text-left transition hover:bg-linen"
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                checked[item.id] ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white",
              )}
            >
              {checked[item.id] && <Check className="h-3.5 w-3.5" />}
            </span>
            <span>
              <span className="block text-sm leading-5 text-stone-800">{item.label}</span>
              <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-stone-400">{item.owner}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
