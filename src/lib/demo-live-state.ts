"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Communication, RoomPreference, StayDetail } from "@/lib/types";

export type DemoGuestMessage = {
  id: string;
  sender: "guest" | "staff" | "system";
  text: string;
  createdAt: string;
};

export type DemoRoomState = {
  temperature: number;
  lighting: string;
  music: string;
  pillowType: string;
  privacyMode: boolean;
};

export type DemoRequest = {
  id: string;
  label: string;
  amount?: number;
  category?: string;
  status: "requested" | "acknowledged";
  createdAt: string;
};

export type DemoApprovedMoment = {
  id: string;
  title: string;
  message: string;
  approvedAt: string;
};

export type DemoArrivalTask = {
  id: string;
  label: string;
  owner: string;
  done: boolean;
};

export type DemoBooking = {
  arrivalDate: string;
  departureDate: string;
  reservationName: string;
  friendNames: string[];
  occasion: string;
};

export type DemoLiveState = {
  messages: DemoGuestMessage[];
  room: DemoRoomState;
  requests: DemoRequest[];
  approvedMoments: DemoApprovedMoment[];
  arrivalTasks: DemoArrivalTask[];
  lastSignal: string;
  booking: DemoBooking;
};

const eventName = "stay-os-demo-state";
export const resetEventName = "stay-os-demo-reset";

function storageKey(stayId: string) {
  return `stay-os-demo:${stayId}`;
}

export function momentCacheKey(stayId: string) {
  return `stay-os-moment-cache:${stayId}`;
}

function toMessage(item: Communication): DemoGuestMessage {
  return {
    id: item.id,
    sender: item.sender_type === "guest" ? "guest" : item.sender_type === "staff" ? "staff" : "system",
    text: item.message,
    createdAt: item.created_at,
  };
}

function initialRoom(preference?: RoomPreference): DemoRoomState {
  return {
    temperature: preference?.temperature ?? 68,
    lighting: preference?.lighting ?? "Warm, low evening lamps",
    music: preference?.music ?? "Off by default",
    pillowType: preference?.pillow_type ?? "Down alternative",
    privacyMode: true,
  };
}

export function createInitialDemoState(detail: StayDetail): DemoLiveState {
  const seededMessages = detail.communications.map(toMessage);
  const hasStaffMessage = seededMessages.some((message) => message.sender === "staff");

  return {
    messages: hasStaffMessage
      ? seededMessages
      : [
          ...seededMessages,
          {
            id: "demo-welcome",
            sender: "staff",
            text: detail.moments[0]?.guest_message ?? "Welcome in. We will keep arrival simple and close by.",
            createdAt: new Date().toISOString(),
          },
        ],
    room: initialRoom(detail.roomPreferences[0]),
    requests: [
      {
        id: "request-table",
        label: "Quiet table held at Madera",
        status: "acknowledged",
        createdAt: new Date().toISOString(),
      },
    ],
    approvedMoments: [],
    arrivalTasks: [],
    lastSignal: "We're probably keeping things low-key tonight. Everyone's talked enough for one day.",
    booking: {
      arrivalDate: detail.stay.arrival_date,
      departureDate: detail.stay.departure_date,
      reservationName: `${detail.holder.first_name} ${detail.holder.last_name}`,
      friendNames: detail.guests
        .filter((guest) => guest.id !== detail.holder.id)
        .map((guest) => `${guest.first_name} ${guest.last_name}`),
      occasion: detail.stay.occasion,
    },
  };
}

function readState(stayId: string, fallback: DemoLiveState) {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(storageKey(stayId));
  if (!stored) {
    window.localStorage.setItem(storageKey(stayId), JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = { ...fallback, ...JSON.parse(stored) } as DemoLiveState;
    parsed.approvedMoments = (parsed.approvedMoments ?? []).filter(
      (moment): moment is DemoApprovedMoment =>
        typeof moment !== "string" &&
        Boolean(moment?.id && moment.title && moment.message) &&
        moment.message !== "A staff-approved update is ready.",
    );
    parsed.arrivalTasks = (parsed.arrivalTasks ?? []).filter(
      (task): task is DemoArrivalTask => Boolean(task?.id && task.label && task.owner),
    );
    return parsed;
  } catch {
    window.localStorage.setItem(storageKey(stayId), JSON.stringify(fallback));
    return fallback;
  }
}

export function useDemoLiveState(stayId: string, fallback: DemoLiveState) {
  const stableFallback = useMemo(() => fallback, [fallback]);
  const [state, setState] = useState<DemoLiveState>(stableFallback);

  const persist = useCallback(
    (next: DemoLiveState) => {
      window.localStorage.setItem(storageKey(stayId), JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(eventName, { detail: { stayId, state: next } }));
    },
    [stayId],
  );

  const update = useCallback(
    (updater: (current: DemoLiveState) => DemoLiveState) => {
      setState((current) => {
        const next = updater(current);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  useEffect(() => {
    setState(readState(stayId, stableFallback));

    function handleStorage(event: StorageEvent) {
      if (event.key !== storageKey(stayId) || !event.newValue) {
        return;
      }
      setState({ ...stableFallback, ...JSON.parse(event.newValue) });
    }

    function handleCustom(event: Event) {
      const custom = event as CustomEvent<{ stayId: string; state: DemoLiveState }>;
      if (custom.detail?.stayId === stayId) {
        setState(custom.detail.state);
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(eventName, handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(eventName, handleCustom);
    };
  }, [stableFallback, stayId]);

  return {
    state,
    sendGuestMessage: (text: string) =>
      update((current) => ({
        ...current,
        messages: [
          ...current.messages,
          { id: `guest-${Date.now()}`, sender: "guest", text, createdAt: new Date().toISOString() },
        ],
        lastSignal: text,
      })),
    sendStaffMessage: (text: string) =>
      update((current) => ({
        ...current,
        messages: [
          ...current.messages,
          { id: `staff-${Date.now()}`, sender: "staff", text, createdAt: new Date().toISOString() },
        ],
      })),
    sendSystemMessage: (text: string) =>
      update((current) => ({
        ...current,
        messages: [
          ...current.messages,
          { id: `system-${Date.now()}`, sender: "system", text, createdAt: new Date().toISOString() },
        ],
      })),
    updateRoom: (room: Partial<DemoRoomState>) =>
      update((current) => ({
        ...current,
        room: { ...current.room, ...room },
      })),
    addRequest: (label: string) =>
      update((current) => ({
        ...current,
        requests: [
          { id: `request-${Date.now()}`, label, status: "requested", createdAt: new Date().toISOString() },
          ...current.requests,
        ],
      })),
    addServiceRequest: (request: { label: string; amount: number; category: string }) =>
      update((current) => ({
        ...current,
        requests: [
          {
            id: `request-${Date.now()}`,
            label: request.label,
            amount: request.amount,
            category: request.category,
            status: "requested",
            createdAt: new Date().toISOString(),
          },
          ...current.requests,
        ],
        lastSignal: `Guest requested ${request.label}`,
      })),
    acknowledgeRequest: (id: string) =>
      update((current) => ({
        ...current,
        requests: current.requests.map((request) =>
          request.id === id ? { ...request, status: "acknowledged" } : request,
        ),
      })),
    approveMoment: (moment: { id: string; title: string; message: string }) =>
      update((current) => ({
        ...current,
        approvedMoments: current.approvedMoments.some((item) => item.id === moment.id)
          ? current.approvedMoments
          : [...current.approvedMoments, { ...moment, approvedAt: new Date().toISOString() }],
      })),
    addArrivalTasks: (tasks: Array<{ label: string; owner?: string }>) =>
      update((current) => {
        const existing = new Set(current.arrivalTasks.map((task) => task.label));
        const nextTasks = tasks
          .map((task) => ({
            id: `arrival-task-${Date.now()}-${task.label}`,
            label: task.label,
            owner: task.owner ?? "Experience Lead",
            done: false,
          }))
          .filter((task) => !existing.has(task.label));

        return {
          ...current,
          arrivalTasks: [...current.arrivalTasks, ...nextTasks],
        };
      }),
    updateBooking: (booking: Partial<DemoBooking>) =>
      update((current) => ({
        ...current,
        booking: { ...current.booking, ...booking },
        lastSignal: `Booked ${booking.arrivalDate ?? current.booking.arrivalDate} to ${
          booking.departureDate ?? current.booking.departureDate
        } for ${[booking.reservationName ?? current.booking.reservationName, ...(booking.friendNames ?? current.booking.friendNames)]
          .filter(Boolean)
          .join(", ")}`,
      })),
    resetDemo: () => {
      window.localStorage.removeItem(storageKey(stayId));
      window.localStorage.removeItem(momentCacheKey(stayId));
      setState(stableFallback);
      persist(stableFallback);
      window.dispatchEvent(new CustomEvent(resetEventName, { detail: { stayId } }));
    },
  };
}
