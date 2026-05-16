"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import {
  Bell,
  Calendar,
  Coffee,
  MessageCircle,
  Minus,
  Moon,
  Plus,
  Send,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { answerGuestMessageAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { createInitialDemoState, useDemoLiveState } from "@/lib/demo-live-state";
import { getPersonalizedRecommendations } from "@/lib/knowledge-base";
import { useKnowledgeBase } from "@/lib/use-knowledge-base";
import type { StayDetail } from "@/lib/types";

type GuestMobileAppProps = {
  detail: StayDetail;
  framed?: boolean;
};

const lightingOptions = ["Warm", "Dim", "Reading"];
const musicOptions = ["Off", "Piano", "Jazz"];

export function GuestMobileApp({ detail, framed = false }: GuestMobileAppProps) {
  const initialState = useMemo(() => createInitialDemoState(detail), [detail]);
  const { state, sendGuestMessage, sendStaffMessage, sendSystemMessage, updateRoom, addRequest, addServiceRequest } = useDemoLiveState(detail.stay.id, initialState);
  const { knowledgeBase } = useKnowledgeBase();
  const [message, setMessage] = useState("");
  const [pendingService, setPendingService] = useState<{
    label: string;
    amount: number;
    category: string;
    rationale: string;
  } | null>(null);
  const [isRouting, startRouting] = useTransition();
  const [activeTab, setActiveTab] = useState<"stay" | "updates" | "services" | "messages">("stay");
  const personalized = getPersonalizedRecommendations({
    occasion: state.booking.occasion,
    lastSignal: state.lastSignal,
    privacyMode: state.room.privacyMode,
  });

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }
    sendGuestMessage(trimmed);
    setMessage("");
    startRouting(async () => {
      const result = await answerGuestMessageAction({ message: trimmed, knowledgeBase });
      if (result.route === "ai") {
        sendSystemMessage(result.answer);
      } else {
        addRequest(`Guest message routed to staff: ${trimmed}`);
        sendSystemMessage(result.answer);
      }
    });
  }

  const app = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#f8f3ea] text-stone-900">
      <header className="shrink-0 border-b border-stone-200 px-5 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-clay">Rosewood</p>
            <h1 className="mt-1 font-serif text-2xl">Sand Hill</h1>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-600 shadow-sm">
            <Bell className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          Welcome in, {detail.holder.first_name}. We have kept things light for your arrival.
        </p>
      </header>

      <div className="flex shrink-0 border-b border-stone-200 bg-white/70 px-2 py-2">
        {[
          ["stay", Calendar, "Stay"],
          ["updates", Sparkles, "Updates"],
          ["services", SlidersHorizontal, "Services"],
          ["messages", MessageCircle, "Messages"],
        ].map(([key, Icon, label]) => {
          const LucideIcon = Icon as typeof Calendar;
          return (
            <button
              key={key as string}
              onClick={() => setActiveTab(key as "stay" | "updates" | "services" | "messages")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1 rounded-md px-1.5 py-2 text-xs font-medium text-stone-500",
                activeTab === key && "bg-stone-900 text-white",
              )}
            >
              <LucideIcon className="h-3.5 w-3.5" />
              {label as string}
            </button>
          );
        })}
      </div>
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
        {activeTab === "stay" && (
          <div className="space-y-3">
            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Your stay</p>
              <p className="mt-2 font-serif text-2xl">
                {new Date(`${state.booking.arrivalDate}T00:00:00`).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(`${state.booking.departureDate}T00:00:00`).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">{state.booking.occasion}</p>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Room preferences</p>
              <div className="mt-3 flex items-center justify-between">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200"
                  onClick={() => updateRoom({ temperature: state.room.temperature - 1 })}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-serif text-4xl">{state.room.temperature}F</span>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200"
                  onClick={() => updateRoom({ temperature: state.room.temperature + 1 })}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-stone-600">{state.room.lighting}</p>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">This evening</p>
              <p className="mt-2 font-serif text-2xl">Quiet table available</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                A relaxed table can be held at Madera. No need to decide now.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => addRequest("Guest accepted quiet table at Madera")}>
                  <Utensils className="h-4 w-4" />
                  Hold table
                </Button>
                <Button size="sm" variant="outline" onClick={() => addRequest("Guest asked to keep evening open")}>
                  Keep open
                </Button>
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Group</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[state.booking.reservationName, ...state.booking.friendNames].filter(Boolean).map((name) => (
                  <span key={name} className="rounded-md bg-sand px-3 py-2 text-xs text-stone-700">
                    {name}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Quick requests</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={() => addRequest("Sparkling water for arrival")}>
                  <Coffee className="h-4 w-4" />
                  Water
                </Button>
                <Button size="sm" variant="outline" onClick={() => addRequest("Do not disturb until morning")}>
                  <Moon className="h-4 w-4" />
                  DND
                </Button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "updates" && (
          <div className="space-y-3">
            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Staff-approved moments</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Only updates approved by the Rosewood team appear here.
              </p>
            </section>
            {state.approvedMoments.length ? (
              state.approvedMoments.map((moment) => (
                <section key={moment.id} className="rounded-lg border border-stone-200 bg-white p-4">
                  <p className="font-serif text-2xl text-stone-950">{moment.title}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{moment.message}</p>
                </section>
              ))
            ) : (
              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="text-sm leading-6 text-stone-500">
                  No staff-approved updates yet. The team will keep things quiet unless something useful is ready.
                </p>
              </section>
            )}
          </div>
        )}

        {activeTab === "services" && (
          <div className="space-y-3">
            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Recommended for your stay</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                A few quiet options selected from your stay context. Nothing is booked unless you ask.
              </p>
              <div className="mt-3 space-y-2">
                {personalized.map((service, index) => {
                  const Icon = [Waves, Utensils, Coffee, Calendar, Sparkles][index % 5];
                  return (
                    <button
                      key={service.label}
                      onClick={() => setPendingService(service)}
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-stone-200 bg-stone-50 p-3 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-clay">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm text-stone-800">{service.label}</span>
                          <span className="text-xs leading-4 text-stone-500">{service.rationale}</span>
                        </span>
                      </span>
                      <span className="text-sm text-stone-500">{service.amount ? `$${service.amount}` : "Included"}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {pendingService && (
              <section className="rounded-lg border border-stone-300 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Confirm request</p>
                <p className="mt-2 font-serif text-2xl">{pendingService.label}</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">{pendingService.rationale}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-stone-500">{pendingService.category}</span>
                  <span className="font-medium text-stone-950">
                    {pendingService.amount ? `$${pendingService.amount}` : "Included"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      addServiceRequest(pendingService);
                      setPendingService(null);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setPendingService(null)}>
                    Not now
                  </Button>
                </div>
              </section>
            )}

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Lighting</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {lightingOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateRoom({ lighting: option })}
                    className={cn(
                      "rounded-md border border-stone-200 px-2 py-2 text-sm text-stone-600",
                      state.room.lighting.includes(option) && "border-stone-900 bg-stone-900 text-white",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-stone-200 bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Music</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {musicOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => updateRoom({ music: option })}
                    className={cn(
                      "rounded-md border border-stone-200 px-2 py-2 text-sm text-stone-600",
                      state.room.music.includes(option) && "border-stone-900 bg-stone-900 text-white",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <button
              onClick={() => updateRoom({ privacyMode: !state.room.privacyMode })}
              className="flex w-full items-center justify-between rounded-lg border border-stone-200 bg-white p-4 text-left"
            >
              <span>
                <span className="block text-sm font-medium">Privacy mode</span>
                <span className="text-xs text-stone-500">Limit outreach unless requested</span>
              </span>
              <span
                className={cn(
                  "flex h-6 w-11 items-center rounded-full p-1 transition",
                  state.room.privacyMode ? "bg-stone-900" : "bg-stone-300",
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 rounded-full bg-white transition",
                    state.room.privacyMode && "translate-x-5",
                  )}
                />
              </span>
            </button>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="flex min-h-full flex-col">
            <div className="flex-1 space-y-2">
              {state.messages.slice(-8).map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "max-w-[86%] rounded-lg px-3 py-2 text-sm leading-5",
                    item.sender === "guest"
                      ? "ml-auto bg-stone-900 text-white"
                      : "bg-white text-stone-700",
                  )}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <form onSubmit={submitMessage} className="shrink-0 border-t border-stone-200 bg-white p-3">
        <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={isRouting ? "Thinking..." : "Message the team"}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-stone-400"
          />
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );

  if (!framed) {
    return (
      <main className="flex h-screen items-center justify-center overflow-hidden bg-stone-200 px-3 py-3">
        <div className="h-[min(812px,calc(100vh-1.5rem))] w-full max-w-[390px] overflow-hidden rounded-[2rem] border-[10px] border-stone-950 bg-stone-950 shadow-2xl">
          <div className="h-full overflow-hidden rounded-[1.35rem] bg-[#f8f3ea]">{app}</div>
        </div>
      </main>
    );
  }

  return (
    <div className="h-[min(812px,calc(100vh-2rem))] w-full max-w-[390px] overflow-hidden rounded-[2rem] border-[10px] border-stone-950 bg-stone-950 shadow-2xl">
      <div className="h-full overflow-hidden rounded-[1.35rem] bg-[#f8f3ea]">{app}</div>
    </div>
  );
}
