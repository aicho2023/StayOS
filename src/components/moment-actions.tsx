"use client";

import { useState, useTransition } from "react";
import { Check, ClipboardList, MessageSquareText, RefreshCw, ShieldCheck } from "lucide-react";
import { approveMomentAction, generateMomentsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { HospitalityMomentRecommendation } from "@/lib/types";

type MomentActionsProps = {
  stayId: string;
  momentId: string;
  momentTitle: string;
  guestMessage: string;
  initialStatus: "suggested" | "approved" | "suppressed" | "sent";
  onApproved?: () => void;
};

export function MomentActions({
  stayId,
  momentId,
  momentTitle,
  guestMessage,
  initialStatus,
  onApproved,
}: MomentActionsProps) {
  const [approved, setApproved] = useState(initialStatus === "approved" || initialStatus === "sent");
  const [generated, setGenerated] = useState<HospitalityMomentRecommendation[] | null>(null);
  const [source, setSource] = useState<"anthropic" | "fallback" | null>(null);
  const [diagnostic, setDiagnostic] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            startTransition(async () => {
              await approveMomentAction(momentId, stayId);
              setApproved(true);
              onApproved?.();
            })
          }
          disabled={isPending || approved}
        >
          <Check className="h-4 w-4" />
          {approved ? "Approved" : "Approve moment"}
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            startTransition(async () => {
              const result = await generateMomentsAction(stayId);
              setGenerated(result.recommendations);
              setSource(result.source);
              setDiagnostic(result.diagnostic ?? null);
            })
          }
          disabled={isPending}
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate with AI
        </Button>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Human approval checkpoint</p>
        <div className="mt-3 grid gap-2 text-sm">
          {[
            {
              label: approved ? "Staff approved the moment" : "Awaiting staff approval",
              detail: momentTitle,
              icon: ShieldCheck,
              active: approved,
            },
            {
              label: approved ? "Operational task created" : "Task creation is held",
              detail: "Experience Lead coordinates timing and staff ownership.",
              icon: ClipboardList,
              active: approved,
            },
            {
              label: approved ? "Guest copy released" : "Guest copy is not sent yet",
              detail: guestMessage,
              icon: MessageSquareText,
              active: approved,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={
                  item.active
                    ? "rounded-md bg-olive/10 p-3 text-stone-800"
                    : "rounded-md bg-stone-50 p-3 text-stone-500"
                }
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </div>
                <p className="mt-1 leading-5">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </div>

      {source && (
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
          Recommendation source: {source === "anthropic" ? "Live Anthropic" : "Tasteful fallback"}
        </p>
      )}
      {diagnostic && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          AI diagnostic: {diagnostic}
        </p>
      )}

      {generated?.map((moment) => (
        <div key={moment.title} className="rounded-lg border border-stone-300 bg-white/70 p-4">
          <p className="font-serif text-2xl text-stone-950">{moment.title}</p>
          <p className="mt-2 text-sm leading-6 text-stone-600">{moment.reasoning}</p>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-3">
            <div className="rounded-md bg-linen px-3 py-2 text-stone-700">Comfort-first</div>
            <div className="rounded-md bg-linen px-3 py-2 text-stone-700">Low-creepiness guardrail</div>
            <div className="rounded-md bg-linen px-3 py-2 text-stone-700">Staff approval required</div>
          </div>
        </div>
      ))}
    </div>
  );
}
