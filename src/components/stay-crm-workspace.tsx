"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StayArrivalChecklist } from "@/components/stay-arrival-checklist";
import { StayMemoryBoard } from "@/components/stay-memory-board";
import { StayMomentEngine } from "@/components/stay-moment-engine";
import { createInitialDemoState, useDemoLiveState } from "@/lib/demo-live-state";
import { cn } from "@/lib/utils";
import type { StayDetail } from "@/lib/types";

type StayCrmWorkspaceProps = {
  detail: StayDetail;
  compact?: boolean;
};

export function StayCrmWorkspace({ detail, compact = false }: StayCrmWorkspaceProps) {
  const initialState = useMemo(() => createInitialDemoState(detail), [detail]);
  const { state, sendStaffMessage, approveMoment, addArrivalTasks } = useDemoLiveState(detail.stay.id, initialState);
  const [reply, setReply] = useState("Of course. We will keep tonight casual and light.");
  const latestGuestMessage = [...state.messages].reverse().find((message) => message.sender === "guest");

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = reply.trim();
    if (!trimmed) return;
    sendStaffMessage(trimmed);
    setReply("");
  }

  return (
    <main className={cn("min-h-screen bg-[#f7f4ee] px-4 py-5 text-stone-900 md:px-8", compact && "min-h-0")}>
      <div className="mx-auto max-w-7xl">
        {!compact && (
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-950">
            <ArrowLeft className="h-4 w-4" />
            Today&apos;s arrivals
          </Link>
        )}

        <section className="mt-4 rounded-lg border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-5 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-clay">Stay intelligence</p>
                <h1 className="mt-2 font-serif text-4xl leading-none text-stone-950 md:text-5xl">
                  {[state.booking.reservationName, ...state.booking.friendNames]
                    .filter(Boolean)
                    .map((name) => name.split(" ")[0])
                    .join(", ")}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-600">{detail.context.stay_read}</p>
              </div>
              <div className="grid min-w-64 gap-2 text-sm">
                <div className="flex items-center justify-between rounded-md bg-linen px-3 py-2">
                  <span className="text-stone-500">Interaction</span>
                  <span className="font-medium capitalize text-stone-900">
                    {detail.context.interaction_style.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-linen px-3 py-2">
                  <span className="text-stone-500">Approved moments</span>
                  <span className="font-medium text-stone-900">{state.approvedMoments.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-stone-900 px-3 py-2 text-white">
                  <span>Human approval</span>
                  <span className="font-medium">Required</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid border-b border-stone-200 bg-stone-50 px-5 py-3 text-xs uppercase tracking-[0.14em] text-stone-400 md:grid-cols-4">
            <span>Profile</span>
            <span>Latest signal</span>
            <span>Room state</span>
            <span>Context read</span>
          </div>
          <div className="grid gap-0 md:grid-cols-4">
            <div className="border-b border-stone-200 p-5 md:border-b-0 md:border-r">
              <p className="text-sm font-medium text-stone-950">{state.booking.reservationName}</p>
              <p className="mt-1 text-sm text-stone-500">{detail.holder.loyalty_tier}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-400">Dates</p>
              <p className="mt-1 text-sm text-stone-700">
                {state.booking.arrivalDate} to {state.booking.departureDate}
              </p>
              <p className="mt-4 rounded-md bg-linen p-3 text-sm leading-5 text-stone-600">{state.booking.occasion}</p>
            </div>
            <div className="border-b border-stone-200 p-5 md:border-b-0 md:border-r">
              <p className="text-sm leading-5 text-stone-700">{latestGuestMessage?.text ?? state.lastSignal}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-stone-900 px-3 py-2 text-xs text-white">
                <Brain className="h-3.5 w-3.5" />
                Tone: {detail.context.recommended_tone}
              </div>
            </div>
            <div className="border-b border-stone-200 p-5 md:border-b-0 md:border-r">
              <p className="font-serif text-3xl">{state.room.temperature}F</p>
              <p className="mt-2 text-sm leading-5 text-stone-600">{state.room.lighting}</p>
              <p className="mt-1 text-sm text-stone-500">Music: {state.room.music}</p>
            </div>
            <div className="p-5">
              <p className="text-sm leading-5 text-stone-700">{detail.context.restraint_guidance}</p>
              <p className="mt-3 rounded-md bg-linen px-3 py-2 text-xs uppercase tracking-[0.14em] text-stone-500">
                fewer, higher-quality interactions
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[0.82fr_1fr]">
          <StayArrivalChecklist detail={detail} liveTasks={state.arrivalTasks} />
          <StayMomentEngine
            detail={detail}
            approvedMomentIds={state.approvedMoments.map((moment) => moment.id)}
            liveContext={{
              reservationName: state.booking.reservationName,
              guestNames: [state.booking.reservationName, ...state.booking.friendNames].filter(Boolean),
              occasion: state.booking.occasion,
              arrivalDate: state.booking.arrivalDate,
              departureDate: state.booking.departureDate,
              lastSignal: state.lastSignal,
              latestGuestMessage: latestGuestMessage?.text,
              room: state.room,
              currentArrivalTasks: state.arrivalTasks.map((task) => task.label),
              approvedMoments: state.approvedMoments.map((moment) => moment.title),
            }}
            onApproved={(moment) => {
              approveMoment(moment);
              addArrivalTasks(moment.tasks);
              sendStaffMessage(moment.message);
            }}
          />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <StayMemoryBoard memories={detail.memories} />

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-stone-700">
              <MessageCircle className="h-4 w-4 text-clay" />
              Live guest messages
            </div>
            <div className="mt-4 rounded-md border border-stone-200 bg-linen p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Prompt shown to guest</p>
              <p className="mt-2 text-sm leading-5 text-stone-700">
                Is there anything we should know about your stay so we can make arrival feel easy?
              </p>
            </div>
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-md bg-stone-50 p-3">
              {state.messages.slice(-9).map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm leading-5",
                    message.sender === "guest" ? "bg-white text-stone-950 shadow-sm" : "bg-sand text-stone-700",
                  )}
                >
                  <p className="mb-1 text-[10px] uppercase tracking-[0.14em] text-stone-400">{message.sender}</p>
                  {message.text}
                </div>
              ))}
            </div>
            <form onSubmit={submitReply} className="mt-3 flex gap-2">
              <input
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                className="min-w-0 flex-1 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
                placeholder="Reply as staff"
              />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
