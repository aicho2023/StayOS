"use client";

import Link from "next/link";
import { MonitorSmartphone, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { GuestMobileApp } from "@/components/guest-mobile-app";
import { StayCrmWorkspace } from "@/components/stay-crm-workspace";
import { Button } from "@/components/ui/button";
import { createInitialDemoState, useDemoLiveState } from "@/lib/demo-live-state";
import type { StayDetail } from "@/lib/types";

type DemoSplitViewProps = {
  detail: StayDetail;
};

export function DemoSplitView({ detail }: DemoSplitViewProps) {
  const initialState = useMemo(() => createInitialDemoState(detail), [detail]);
  const { resetDemo } = useDemoLiveState(detail.stay.id, initialState);

  return (
    <main className="min-h-screen bg-[#efebe3] px-4 py-4 text-stone-900">
      <header className="mx-auto flex max-w-[1500px] flex-col gap-3 border-b border-stone-300 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-clay">
            <MonitorSmartphone className="h-4 w-4" />
            Live judge demo
          </div>
          <h1 className="mt-2 font-serif text-4xl text-stone-950">Staff copilot + guest signal</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={resetDemo}>
            <RotateCcw className="h-4 w-4" />
            Reset demo state
          </Button>
          <Link href="/">
            <Button variant="outline">Staff dashboard</Button>
          </Link>
          <Link href="/stay/new">
            <Button variant="outline">New stay flow</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto mt-4 grid max-w-[1500px] gap-4 xl:grid-cols-[1fr_430px]">
        <div className="overflow-hidden rounded-lg border border-stone-300 bg-white">
          <StayCrmWorkspace detail={detail} compact />
        </div>
        <aside className="flex flex-col items-center gap-3">
          <div className="w-full rounded-lg border border-stone-300 bg-white p-4 text-sm leading-6 text-stone-600">
            <p className="font-medium text-stone-950">Judge-friendly live moves</p>
            <p className="mt-1">
              Type a guest message, adjust room temperature, or request water in the phone. The staff copilot updates the live
              signal, room state, and request queue.
            </p>
            <p className="mt-2 text-stone-500">
              Separate tabs also work: keep `/stays/stay-sandhill-founders` open for staff and
              `/guest/stay-sandhill-founders` open for the phone.
            </p>
          </div>
          <GuestMobileApp detail={detail} framed />
        </aside>
      </section>
    </main>
  );
}
