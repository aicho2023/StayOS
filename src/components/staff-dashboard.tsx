"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  MessageSquare,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { KnowledgeBasePanel } from "@/components/knowledge-base-panel";
import { OperationsPrioritizer } from "@/components/operations-prioritizer";
import { createInitialDemoState, useDemoLiveState } from "@/lib/demo-live-state";
import { cn, formatDate } from "@/lib/utils";
import type { Communication, Guest, GuestDirectoryEntry, Moment, StayDetail, Task } from "@/lib/types";

type StaffDashboardProps = {
  arrivals: StayDetail[];
  guestDirectory: GuestDirectoryEntry[];
};

type DashboardTab = "home" | "arrivals" | "stays" | "guests" | "messages" | "tasks" | "moments" | "knowledge";

function ArrivalRow({ detail }: { detail: StayDetail }) {
  const initialState = useMemo(() => createInitialDemoState(detail), [detail]);
  const { state } = useDemoLiveState(detail.stay.id, initialState);
  const bestMoment = [...detail.moments].sort((a, b) => b.comfort_score - a.comfort_score)[0];
  const latestGuestMessage = [...state.messages].reverse().find((message) => message.sender === "guest");
  const guestNames = [state.booking.reservationName, ...state.booking.friendNames].filter(Boolean);
  const openRequests = state.requests.filter((request) => request.status === "requested").length;
  const openWork = detail.tasks.filter((task) => task.status !== "done").length + openRequests;

  return (
    <Link
      href={`/stays/${detail.stay.id}`}
      className="grid gap-4 border-b border-stone-200 px-4 py-4 transition hover:bg-stone-50 lg:grid-cols-[1.15fr_0.8fr_0.9fr_0.65fr_0.55fr]"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span>{formatDate(detail.stay.arrival_date)}</span>
          <span>·</span>
          <span>{detail.stay.group_size} guests</span>
          <span className="rounded bg-stone-100 px-2 py-1 capitalize text-stone-700">
            {detail.stay.interaction_preference.replace("_", " ")}
          </span>
        </div>
        <p className="mt-2 font-serif text-2xl text-stone-950">
          {guestNames.map((name) => name.split(" ")[0]).join(", ")}
        </p>
        <p className="mt-1 line-clamp-1 text-sm text-stone-500">{state.booking.occasion}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Live guest signal</p>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-700">
          {latestGuestMessage?.text ?? state.lastSignal}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-stone-400">Best moment</p>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-stone-700">
          {bestMoment?.title ?? "Awaiting intelligence review"}
        </p>
      </div>
      <div className="flex items-center gap-2 lg:justify-center">
        <span className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700">
          {openWork} open
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <span className="text-sm font-medium text-stone-900">Review</span>
        <ArrowRight className="h-4 w-4 text-stone-400" />
      </div>
    </Link>
  );
}

function SectionHeader({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="border-b border-stone-200 bg-stone-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.16em] text-stone-400">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{copy}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="p-5 text-sm leading-6 text-stone-500">{label}</p>;
}

function ArrivalsTable({ arrivals }: { arrivals: StayDetail[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <SectionHeader title="Arrivals" copy="Stay-centered arrivals that need staff awareness today." />
      <div className="hidden border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs uppercase tracking-[0.14em] text-stone-400 lg:grid lg:grid-cols-[1.15fr_0.8fr_0.9fr_0.65fr_0.55fr]">
        <span>Stay</span>
        <span>Signal</span>
        <span>Moment</span>
        <span className="text-center">Work</span>
        <span className="text-right">Next</span>
      </div>
      {arrivals.length ? (
        arrivals.map((detail) => <ArrivalRow key={detail.stay.id} detail={detail} />)
      ) : (
        <EmptyState label="No arrivals are queued for today." />
      )}
    </section>
  );
}

function StaysTab({ arrivals }: { arrivals: StayDetail[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <SectionHeader title="Stays" copy="A stay-centric view across active and upcoming guest journeys." />
      <div className="grid border-b border-stone-200 bg-stone-50 px-4 py-3 text-xs uppercase tracking-[0.14em] text-stone-400 lg:grid-cols-[1fr_0.8fr_0.7fr_0.8fr_0.35fr]">
        <span>Stay</span>
        <span>Purpose</span>
        <span>Dates</span>
        <span>Posture</span>
        <span className="text-right">Open</span>
      </div>
      {arrivals.map((detail) => {
        const openWork = detail.tasks.filter((task) => task.status !== "done").length;
        return (
          <Link
            key={detail.stay.id}
            href={`/stays/${detail.stay.id}`}
            className="grid gap-3 border-b border-stone-200 px-4 py-4 text-sm transition hover:bg-stone-50 lg:grid-cols-[1fr_0.8fr_0.7fr_0.8fr_0.35fr]"
          >
            <div>
              <p className="font-serif text-2xl text-stone-950">
                {detail.guests.map((guest) => guest.first_name).join(", ")}
              </p>
              <p className="mt-1 text-stone-500">{detail.stay.occasion}</p>
            </div>
            <p className="leading-6 text-stone-700">{detail.stay.purpose_of_trip}</p>
            <p className="text-stone-600">
              {formatDate(detail.stay.arrival_date)} to {formatDate(detail.stay.departure_date)}
            </p>
            <p className="capitalize text-stone-700">{detail.context.interaction_style.replace("_", " ")}</p>
            <p className="text-right font-medium text-stone-950">{openWork}</p>
          </Link>
        );
      })}
    </section>
  );
}

function GuestsTab({
  currentGuests,
  guestDirectory,
}: {
  currentGuests: (Guest & { stayId: string; stayOccasion: string; role: string })[];
  guestDirectory: GuestDirectoryEntry[];
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredDirectory = guestDirectory.filter((guest) => {
    if (!normalizedQuery) {
      return true;
    }
    return [
      guest.first_name,
      guest.last_name,
      guest.email,
      guest.loyalty_tier,
      guest.last_stay_occasion ?? "",
      guest.memories.map((memory) => memory.memory).join(" "),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <SectionHeader title="Current guests" copy="Guests attached to active arrival and in-house stays." />
        {currentGuests.length ? (
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
            {currentGuests.map((guest) => (
            <Link key={`${guest.stayId}-${guest.id}`} href={`/stays/${guest.stayId}`} className="rounded-md border border-stone-200 bg-[#fbfaf7] p-4 transition hover:border-stone-300 hover:bg-linen">
              <p className="font-serif text-2xl text-stone-950">
                {guest.first_name} {guest.last_name}
              </p>
              <p className="mt-1 text-sm text-stone-500">{guest.email}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs capitalize text-stone-600">
                <span className="rounded bg-white px-2 py-1">{guest.role}</span>
                <span className="rounded bg-white px-2 py-1">{guest.interaction_style.replace("_", " ")}</span>
                <span className="rounded bg-white px-2 py-1">{guest.privacy_level}</span>
              </div>
              <p className="mt-3 text-sm leading-5 text-stone-600">{guest.stayOccasion}</p>
            </Link>
            ))}
          </div>
        ) : (
          <EmptyState label="No guest records are attached to current stays." />
        )}
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 bg-stone-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Historical guest database</p>
          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-stone-600">
              Search returning VIPs, prior stays, and permissioned memories before a new stay is created.
            </p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-10 min-w-72 rounded-md border border-stone-200 bg-white px-3 text-sm outline-none focus:border-stone-400"
              placeholder="Search guest, memory, occasion"
            />
          </div>
        </div>
        <div className="grid gap-3 p-4 xl:grid-cols-2">
          {filteredDirectory.map((guest) => {
            const targetStayId = guest.current_stay_id ?? guest.last_stay_id;
            const content = (
              <div className="rounded-md border border-stone-200 bg-[#fbfaf7] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-2xl text-stone-950">
                      {guest.first_name} {guest.last_name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">{guest.email}</p>
                  </div>
                  <span className="rounded bg-white px-2 py-1 text-xs text-stone-600">{guest.loyalty_tier}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-stone-600">
                  <div className="rounded bg-white p-2">
                    <p className="font-medium text-stone-950">{guest.total_stays}</p>
                    <p>stays</p>
                  </div>
                  <div className="rounded bg-white p-2">
                    <p className="font-medium text-stone-950">{guest.memory_count}</p>
                    <p>memories</p>
                  </div>
                  <div className="rounded bg-white p-2">
                    <p className="font-medium capitalize text-stone-950">{guest.privacy_level}</p>
                    <p>privacy</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-5 text-stone-600">
                  Last stay: {guest.last_stay_occasion ?? "No prior stay recorded"}
                </p>
                <div className="mt-3 space-y-2">
                  {guest.memories.slice(0, 2).map((memory) => (
                    <p key={memory.id} className="rounded bg-white p-3 text-sm leading-5 text-stone-700">
                      {memory.memory}
                    </p>
                  ))}
                </div>
              </div>
            );

            return targetStayId ? (
              <Link key={guest.id} href={`/stays/${targetStayId}`}>
                {content}
              </Link>
            ) : (
              <div key={guest.id}>{content}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function MessagesTab({
  conversations,
}: {
  conversations: {
    stayId: string;
    stayName: string;
    guestNames: string;
    messages: Communication[];
    lastMessage: Communication;
  }[];
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <SectionHeader title="Messages" copy="Consolidated conversation threads by stay, with latest signal surfaced first." />
      {conversations.length ? (
        conversations.map((conversation) => (
          <Link
            key={conversation.stayId}
            href={`/stays/${conversation.stayId}`}
            className="grid gap-3 border-b border-stone-200 px-4 py-4 text-sm transition hover:bg-stone-50 md:grid-cols-[0.7fr_1.5fr_0.5fr]"
          >
            <div>
              <p className="font-medium text-stone-950">{conversation.stayName}</p>
              <p className="mt-1 text-xs text-stone-500">{conversation.guestNames}</p>
            </div>
            <div>
              <p className="capitalize text-stone-500">{conversation.lastMessage.sender_type}</p>
              <p className="mt-1 leading-6 text-stone-700">{conversation.lastMessage.message}</p>
            </div>
            <div className="text-right text-stone-500">
              <p>{conversation.messages.length} messages</p>
              <p className="mt-1">{formatDate(conversation.lastMessage.created_at)}</p>
            </div>
          </Link>
        ))
      ) : (
        <EmptyState label="No messages or internal notes are attached to current stays." />
      )}
    </section>
  );
}

function TasksTab({ tasks }: { tasks: (Task & { stayName: string; stayId: string; occasion: string })[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <SectionHeader title="Open Tasks" copy="Operational work suggested or approved from stay intelligence." />
      {tasks.length ? (
        tasks.map((task) => (
          <Link
            key={task.id}
            href={`/stays/${task.stayId}`}
            className="grid gap-3 border-b border-stone-200 px-4 py-4 text-sm transition hover:bg-stone-50 md:grid-cols-[0.75fr_1.4fr_0.5fr_0.55fr_0.55fr]"
          >
            <div>
              <p className="font-medium text-stone-950">{task.stayName}</p>
              <p className="mt-1 text-xs text-stone-500">{task.occasion}</p>
            </div>
            <p className="leading-6 text-stone-700">{task.description}</p>
            <p className="text-stone-600">{task.assigned_to}</p>
            <p className="capitalize text-stone-600">{task.priority}</p>
            <p className="text-right capitalize text-stone-600">{task.status.replace("_", " ")}</p>
          </Link>
        ))
      ) : (
        <EmptyState label="No tasks are open right now." />
      )}
    </section>
  );
}

function MomentsTab({ moments }: { moments: (Moment & { stayName: string; stayId: string })[] }) {
  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <SectionHeader title="Moments" copy="Tasteful recommendations that staff can review, suppress, or approve." />
      {moments.length ? (
        <div className="grid gap-3 p-4 xl:grid-cols-2">
          {moments.map((moment) => (
            <Link key={moment.id} href={`/stays/${moment.stayId}`} className="rounded-md border border-stone-200 bg-[#fbfaf7] p-4 transition hover:border-stone-300 hover:bg-linen">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl text-stone-950">{moment.title}</p>
                  <p className="mt-1 text-sm text-stone-500">{moment.stayName}</p>
                </div>
                <span className="rounded bg-white px-2 py-1 text-xs capitalize text-stone-600">
                  {moment.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-600">{moment.reasoning}</p>
              <p className="mt-4 rounded-md bg-white p-3 text-sm leading-6 text-stone-700">{moment.staff_action}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState label="No hospitality moments have been generated yet." />
      )}
    </section>
  );
}

export function StaffDashboard({ arrivals, guestDirectory }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");
  const openTasks = arrivals.reduce((sum, item) => sum + item.tasks.filter((task) => task.status !== "done").length, 0);
  const allTasks = arrivals.flatMap((detail) =>
    detail.tasks.map((task) => ({
      ...task,
      stayName: `${detail.holder.first_name} ${detail.holder.last_name}`,
      stayId: detail.stay.id,
      occasion: detail.stay.occasion,
    })),
  );
  const allMoments = arrivals.flatMap((detail) =>
    detail.moments.map((moment) => ({
      ...moment,
      stayName: `${detail.holder.first_name} ${detail.holder.last_name}`,
      stayId: detail.stay.id,
    })),
  );
  const allGuests = arrivals.flatMap((detail) =>
    detail.guests.map((guest) => ({
      ...guest,
      stayId: detail.stay.id,
      stayOccasion: detail.stay.occasion,
      role: guest.id === detail.holder.id ? "reservation holder" : "guest",
    })),
  );
  const conversations = arrivals
    .map((detail) => {
      const sortedMessages = [...detail.communications].sort((a, b) => a.created_at.localeCompare(b.created_at));
      const lastMessage = sortedMessages.at(-1);
      return lastMessage
        ? {
            stayId: detail.stay.id,
            stayName: `${detail.holder.first_name} ${detail.holder.last_name}`,
            guestNames: detail.guests.map((guest) => `${guest.first_name} ${guest.last_name}`).join(", "),
            messages: sortedMessages,
            lastMessage,
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const suggestedMoments = arrivals.reduce(
    (sum, item) => sum + item.moments.filter((moment) => moment.status === "suggested").length,
    0,
  );
  const navItems: [DashboardTab, string, typeof LayoutDashboard][] = [
    ["home", "Home", LayoutDashboard],
    ["arrivals", "Arrivals", LayoutDashboard],
    ["stays", "Stays", BriefcaseBusiness],
    ["guests", "Guests", Users],
    ["messages", "Messages", MessageSquare],
    ["knowledge", "Knowledge", Search],
  ];

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-stone-900">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-stone-200 bg-[#fbfaf7] px-5 py-6 lg:block">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Rosewood</p>
            <h1 className="mt-2 font-serif text-3xl text-stone-950">Sand Hill</h1>
          </div>
          <nav className="mt-10 space-y-1 text-sm">
            {navItems.map(([tab, label, Icon]) => {
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition",
                    activeTab === tab ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="px-4 py-5 md:px-8">
          <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-clay">Staff operating system</p>
              <h2 className="mt-2 font-serif text-4xl text-stone-950 md:text-5xl">Hospitality intelligence</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-10 min-w-64 items-center gap-2 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-500">
                <Search className="h-4 w-4" />
                Search stays, guests, signals
              </div>
              <Link href="/demo">
                <Button variant="outline">Live demo</Button>
              </Link>
              <Link href="/system">
                <Button variant="outline">System status</Button>
              </Link>
              <Link href="/guest/stay-sandhill-founders">
                <Button variant="outline">Guest phone</Button>
              </Link>
              <Link href="/stay/new">
                <Button>New stay flow</Button>
              </Link>
            </div>
          </header>

          <nav className="mt-5 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  activeTab === tab
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600",
                )}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="grid gap-4 py-6 md:grid-cols-4">
            <button
              onClick={() => setActiveTab("arrivals")}
              className={cn(
                "rounded-lg border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300 hover:shadow-sm",
                activeTab === "arrivals" && "border-stone-900",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Arrivals</p>
                <CalendarDays className="h-4 w-4 text-clay" />
              </div>
              <p className="mt-3 font-serif text-4xl">{arrivals.length}</p>
              <p className="mt-1 text-sm text-stone-500">view arriving stays</p>
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={cn(
                "rounded-lg border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300 hover:shadow-sm",
                activeTab === "tasks" && "border-stone-900",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Open tasks</p>
                <Bell className="h-4 w-4 text-clay" />
              </div>
              <p className="mt-3 font-serif text-4xl">{openTasks}</p>
              <p className="mt-1 text-sm text-stone-500">view task list</p>
            </button>
            <button
              onClick={() => setActiveTab("moments")}
              className={cn(
                "rounded-lg border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300 hover:shadow-sm",
                activeTab === "moments" && "border-stone-900",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Moments</p>
                <Sparkles className="h-4 w-4 text-clay" />
              </div>
              <p className="mt-3 font-serif text-4xl">{allMoments.length}</p>
              <p className="mt-1 text-sm text-stone-500">view recommendations</p>
            </button>
            <button
              onClick={() => setActiveTab("moments")}
              className={cn(
                "rounded-lg border border-stone-200 bg-white p-4 text-left transition hover:border-stone-300 hover:shadow-sm",
                activeTab === "moments" && "border-stone-900",
              )}
            >
              <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Human review</p>
              <p className="mt-3 font-serif text-4xl">{suggestedMoments}</p>
              <p className="mt-1 text-sm text-stone-500">needs human review</p>
            </button>
          </section>

          {activeTab === "home" && <OperationsPrioritizer arrivals={arrivals} />}

          {activeTab === "arrivals" && <ArrivalsTable arrivals={arrivals} />}

          {activeTab === "stays" && <StaysTab arrivals={arrivals} />}

          {activeTab === "guests" && <GuestsTab currentGuests={allGuests} guestDirectory={guestDirectory} />}

          {activeTab === "messages" && <MessagesTab conversations={conversations} />}

          {activeTab === "tasks" && <TasksTab tasks={allTasks} />}

          {activeTab === "moments" && <MomentsTab moments={allMoments} />}

          {activeTab === "knowledge" && <KnowledgeBasePanel />}
        </section>
      </div>
    </main>
  );
}
