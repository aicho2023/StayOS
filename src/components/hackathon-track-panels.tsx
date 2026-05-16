"use client";

import { ClipboardCheck, EyeOff, MapPin, Plane, ShieldCheck, Sparkles } from "lucide-react";
import type { StayDetail } from "@/lib/types";

type StayTrackPanelsProps = {
  detail: StayDetail;
};

export function StayTrackPanels({ detail }: StayTrackPanelsProps) {
  const arrivalBrief = detail.staffBriefs.find((brief) => brief.briefing_type === "arrival");
  const flightSignal = detail.arrivalSignals.find((signal) => signal.signal_type === "flight");
  const wellnessSignal = detail.arrivalSignals.find((signal) => signal.signal_type === "wellness");
  const statedSignal = detail.arrivalSignals.find(
    (signal) => signal.signal_type === "staff_note" || signal.signal_type === "preference",
  );
  const localFit = detail.localEvents[0];
  const topMoment = detail.moments[0];

  return (
    <section className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-stone-700">
          <Plane className="h-4 w-4 text-clay" />
          Hyper-personalized arrival orchestration
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Arrival signal", flightSignal?.summary ?? "No live flight signal connected for this stay."],
            ["Recovery signal", wellnessSignal?.summary ?? detail.context.energy_state],
            ["Stated preference", statedSignal?.summary ?? detail.context.restraint_guidance],
            ["Room readiness", detail.roomPreferences[0]
              ? `${detail.roomPreferences[0].temperature}F, ${detail.roomPreferences[0].lighting}, ${detail.roomPreferences[0].pillow_type} pillows`
              : "Use known practical preferences only."],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md bg-linen p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">{label}</p>
              <p className="mt-2 text-sm leading-6 text-stone-700">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-stone-200 bg-[#fbfaf7] p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">Staff choreography</p>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            {arrivalBrief?.summary ?? "Prepare an emotionally comfortable arrival with one clear owner."}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">
            Owner: {arrivalBrief?.owner ?? "Experience Lead"}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-stone-700">
          <MapPin className="h-4 w-4 text-clay" />
          Sense of Place fit
        </div>
        <h3 className="mt-4 font-serif text-2xl text-stone-950">
          {localFit?.title ?? detail.property?.name ?? "Property context"}
        </h3>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {localFit?.description ?? detail.property?.sense_of_place ?? "Local property context enriches recommendations."}
        </p>
        <div className="mt-4 rounded-md bg-sand p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">Fit note</p>
          <p className="mt-2 text-sm leading-6 text-stone-800">
            {localFit?.fit_note ?? topMoment?.staff_action ?? "Offer only when it reduces guest effort."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function InvisibleConciergePanel({ detail }: StayTrackPanelsProps) {
  return (
    <section className="mt-5 grid gap-5 xl:grid-cols-3">
      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm xl:col-span-2">
        <div className="flex items-center gap-2 text-sm text-stone-700">
          <EyeOff className="h-4 w-4 text-clay" />
          Invisible concierge queue
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {detail.arrivalSignals.slice(0, 4).map((signal) => (
            <div key={signal.id} className="rounded-md bg-stone-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">
                  {signal.signal_type.replace("_", " ")}
                </p>
                <span className="rounded bg-white px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-stone-500">
                  {signal.trust_level}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-700">{signal.summary}</p>
              <p className="mt-3 text-xs text-stone-500">Memory scope: {signal.consent_scope.replace("_", " ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-stone-700">
          <Sparkles className="h-4 w-4 text-clay" />
          Suppressed by restraint guard
        </div>
        <div className="mt-4 space-y-3">
          {detail.suppressedRecommendations.length ? (
            detail.suppressedRecommendations.map((item) => (
              <div key={item.id} className="rounded-md bg-linen p-4">
                <p className="text-sm font-medium text-stone-950">{item.title}</p>
                <p className="mt-2 text-sm leading-5 text-stone-600">{item.suppression_reason}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">Safer: {item.safer_alternative}</p>
              </div>
            ))
          ) : (
            <p className="rounded-md bg-linen p-4 text-sm leading-6 text-stone-600">
              No suppressed recommendations yet. The guardrail will appear here when the system avoids a risky action.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function MemoryContinuityPanel({ detail }: StayTrackPanelsProps) {
  return (
    <section className="mt-5 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-stone-700">
        <ShieldCheck className="h-4 w-4 text-clay" />
        Memory, consent, and post-stay continuity
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.75fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {detail.memoryGovernance.map((item) => (
            <div key={item.id} className="rounded-md bg-stone-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-stone-400">{item.decision.replace("_", " ")}</p>
              <p className="mt-2 text-sm font-medium leading-5 text-stone-900">{item.candidate_memory}</p>
              <p className="mt-2 text-sm leading-5 text-stone-600">{item.rationale}</p>
            </div>
          ))}
        </div>
        <div className="rounded-md bg-linen p-4">
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <ClipboardCheck className="h-4 w-4 text-clay" />
            Post-stay continuity
          </div>
          <div className="mt-3 space-y-3">
            {detail.postStayEngagements.length ? (
              detail.postStayEngagements.map((item) => (
                <div key={item.id} className="border-t border-stone-200 pt-3 first:border-t-0 first:pt-0">
                  <p className="text-sm font-medium text-stone-950">{item.trigger_name}</p>
                  <p className="mt-1 text-sm leading-5 text-stone-600">{item.message_intent}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-stone-500">
                    {item.suggested_timing} · {item.consent_required ? "permission required" : "no extra permission"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-stone-600">
                No post-stay outreach recommended. Silence is sometimes the most hospitable continuation.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
