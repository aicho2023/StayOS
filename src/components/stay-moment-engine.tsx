"use client";

import { useState, useTransition } from "react";
import { Check, RefreshCw, Sparkles, X } from "lucide-react";
import { approveMomentAction, generateMomentsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HospitalityMomentRecommendation, Moment, StayDetail } from "@/lib/types";

type ApprovedMomentPayload = {
  id: string;
  title: string;
  message: string;
  tasks: Array<{ label: string; owner?: string }>;
};

type StayMomentEngineProps = {
  detail: StayDetail;
  approvedMomentIds: string[];
  liveContext?: Record<string, unknown>;
  onApproved: (moment: ApprovedMomentPayload) => void;
};

function seededToRecommendation(moment: Moment): HospitalityMomentRecommendation {
  return {
    title: moment.title,
    reasoning: moment.reasoning,
    guest_message: moment.guest_message,
    staff_action: moment.staff_action,
    scores: {
      comfort: moment.comfort_score,
      creepiness: moment.creepiness_score,
      relevance: moment.relevance_score,
      revenue_opportunity: moment.revenue_opportunity,
    },
    task_suggestions: [
      {
        task_type: "concierge",
        assigned_to: "Experience Lead",
        priority: "medium",
        description: moment.staff_action,
        due_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    ],
  };
}

export function StayMomentEngine({ detail, approvedMomentIds, liveContext, onApproved }: StayMomentEngineProps) {
  const seededMoments = Array.from(
    new Map(
      detail.moments
        .filter((moment) => moment.status !== "suppressed")
        .sort((a, b) => b.comfort_score - a.comfort_score)
        .map((moment) => [`${moment.title}-${moment.guest_message}`, moment]),
    ).values(),
  );
  const [generated, setGenerated] = useState<HospitalityMomentRecommendation[]>([]);
  const [error, setError] = useState("");
  const [source, setSource] = useState<"anthropic" | "fallback" | "none">("none");
  const [approved, setApproved] = useState(() => new Set([...approvedMomentIds, ...seededMoments.filter((moment) => moment.status === "approved").map((moment) => moment.id)]));
  const [dismissed, setDismissed] = useState(() => new Set<string>());
  const [isPending, startTransition] = useTransition();

  const visibleGenerated = generated.filter((moment) => moment.scores.creepiness <= 35);
  const visibleSeeded = seededMoments.filter((moment) => !approved.has(moment.id) && !dismissed.has(moment.id));

  function markApproved(payload: ApprovedMomentPayload) {
    setApproved((current) => {
      const next = new Set(current);
      next.add(payload.id);
      return next;
    });
    setDismissed((current) => {
      const next = new Set(current);
      next.add(payload.id);
      return next;
    });
    onApproved(payload);
  }

  function approveSeeded(moment: Moment) {
    if (approved.has(moment.id)) return;
    startTransition(async () => {
      await approveMomentAction(moment.id, detail.stay.id);
      markApproved({
        id: moment.id,
        title: moment.title,
        message: moment.guest_message,
        tasks: [{ label: moment.staff_action, owner: "Experience Lead" }],
      });
    });
  }

  function approveGenerated(moment: HospitalityMomentRecommendation, index: number) {
    const id = `generated-${detail.stay.id}-${index}-${moment.title}`;
    if (approved.has(id)) return;
    markApproved({
      id,
      title: moment.title,
      message: moment.guest_message,
      tasks: moment.task_suggestions.map((task) => ({
        label: task.description,
        owner: task.assigned_to,
      })),
    });
  }

  function rejectMoment(id: string) {
    setDismissed((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  function generateIdeas() {
    setError("");
    startTransition(async () => {
      try {
        const response = await generateMomentsAction(detail.stay.id, liveContext);
        setGenerated(response.recommendations);
        setSource(response.source);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Could not generate ideas right now.");
      }
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-clay">Moment engine</p>
          <h2 className="mt-2 font-serif text-3xl text-stone-950">Approve one thoughtful move</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Generate restrained ideas, then release only what a staff member approves. Approved moments appear in the guest app.
          </p>
        </div>
        <Button onClick={generateIdeas} disabled={isPending} type="button">
          <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
          Generate new ideas
        </Button>
      </div>

      {source !== "none" && (
        <p className="mt-3 rounded-md bg-linen px-3 py-2 text-xs text-stone-500">
          Recommendation source: {source === "anthropic" ? "live AI" : "demo-safe fallback"}
        </p>
      )}
      {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-5 flex gap-4 overflow-x-auto pb-3">
        {visibleSeeded.map((moment) => (
          <MomentCard
            key={moment.id}
            moment={seededToRecommendation(moment)}
            label="Prepared"
            onApprove={() => approveSeeded(moment)}
            onReject={() => rejectMoment(moment.id)}
            disabled={isPending}
          />
        ))}
        {visibleGenerated.map((moment, index) => {
          const id = `generated-${detail.stay.id}-${index}-${moment.title}`;
          if (approved.has(id) || dismissed.has(id)) return null;
          return (
            <MomentCard
              key={id}
              moment={moment}
              label="Generated"
              onApprove={() => approveGenerated(moment, index)}
              onReject={() => rejectMoment(id)}
              disabled={isPending}
            />
          );
        })}
        {!visibleSeeded.length && !visibleGenerated.some((moment, index) => {
          const id = `generated-${detail.stay.id}-${index}-${moment.title}`;
          return !approved.has(id) && !dismissed.has(id);
        }) && (
          <div className="min-w-full rounded-lg border border-dashed border-stone-200 bg-[#fbfaf7] p-5 text-sm leading-6 text-stone-500">
            No suggestions in the review queue. Generate new ideas when the stay context changes.
          </div>
        )}
      </div>
    </section>
  );
}

function MomentCard({
  moment,
  label,
  onApprove,
  onReject,
  disabled,
}: {
  moment: HospitalityMomentRecommendation;
  label: string;
  onApprove: () => void;
  onReject: () => void;
  disabled: boolean;
}) {
  return (
    <article className="flex min-h-full w-[360px] shrink-0 flex-col rounded-lg border border-stone-200 bg-[#fbfaf7] p-4">
      <div>
        <div>
          <div className="inline-flex max-w-full items-center gap-2 rounded-md bg-white px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-stone-500">
            <Sparkles className="h-3 w-3 text-clay" />
            {label}
          </div>
          <h3 className="mt-3 font-serif text-2xl leading-tight text-stone-950">{moment.title}</h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={onReject} disabled={disabled} size="sm" type="button" variant="outline" className="w-full">
            <X className="h-4 w-4" />
            Reject
          </Button>
          <Button onClick={onApprove} disabled={disabled} size="sm" type="button" className="w-full">
            <Check className="h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-600">{moment.reasoning}</p>
      <div className="mt-4 rounded-md bg-linen p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Staff action</p>
        <p className="mt-2 text-sm leading-5 text-stone-800">{moment.staff_action}</p>
      </div>
      <div className="mt-3 rounded-md bg-white p-3">
        <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Guest message</p>
        <p className="mt-2 text-sm leading-5 text-stone-800">{moment.guest_message}</p>
      </div>
      {moment.task_suggestions.length > 0 && (
        <div className="mt-3 rounded-md border border-stone-200 bg-white p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Creates checklist work</p>
          <div className="mt-2 space-y-2">
            {moment.task_suggestions.map((task) => (
              <p key={`${task.assigned_to}-${task.description}`} className="text-sm leading-5 text-stone-700">
                {task.description}
              </p>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
