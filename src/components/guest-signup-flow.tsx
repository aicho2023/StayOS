"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, Plus, Trash2, UserRoundPlus } from "lucide-react";
import { createGuestStayAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Friend = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const requiredFields = [
  "firstName",
  "email",
  "arrivalDate",
  "departureDate",
  "occasion",
  "purpose",
  "lighting",
  "pillowType",
] as const;

export function GuestSignupFlow() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    arrivalDate: "",
    departureDate: "",
    occasion: "",
    purpose: "",
    temperature: "",
    lighting: "",
    pillowType: "",
    arrivalRequest: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setMissing((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });
  }

  function updateFriend(id: string, key: keyof Omit<Friend, "id">, value: string) {
    setFriends((current) =>
      current.map((friend) => (friend.id === id ? { ...friend, [key]: value } : friend)),
    );
  }

  function addFriend() {
    setFriends((current) => [
      ...current,
      { id: `friend-${Date.now()}`, firstName: "", lastName: "", email: "" },
    ]);
  }

  function removeFriend(id: string) {
    setFriends((current) => current.filter((friend) => friend.id !== id));
  }

  function inputClass(key: string) {
    return cn(
      "rounded-md border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-500",
      missing.has(key) && "border-clay bg-clay/5",
    );
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const nextMissing = new Set<string>();
    requiredFields.forEach((field) => {
      if (!String(form[field]).trim()) nextMissing.add(field);
    });
    friends.forEach((friend, index) => {
      if (friend.firstName.trim() || friend.lastName.trim() || friend.email.trim()) {
        if (!friend.firstName.trim()) nextMissing.add(`friend-${index}-firstName`);
        if (!friend.email.trim()) nextMissing.add(`friend-${index}-email`);
      }
    });
    if (nextMissing.size) {
      setMissing(nextMissing);
      setError("Please complete the highlighted fields.");
      return;
    }
    startTransition(async () => {
      const friendPayload = friends
        .filter((friend) => friend.firstName.trim() || friend.lastName.trim() || friend.email.trim())
        .map((friend) => `${friend.firstName.trim()} ${friend.lastName.trim()} <${friend.email.trim()}>`)
        .join(", ");
      const result = await createGuestStayAction({ ...form, friendNames: friendPayload });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/guest/${result.stayId}`);
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-200 px-3 py-3">
      <div className="h-[min(812px,calc(100vh-1.5rem))] w-full max-w-[390px] overflow-hidden rounded-[2rem] border-[10px] border-stone-950 bg-stone-950 shadow-2xl">
        <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-[#f8f3ea] text-stone-900">
          <header className="shrink-0 border-b border-stone-200 px-5 py-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-clay">Rosewood Sand Hill</p>
            <h1 className="mt-2 font-serif text-3xl leading-none">Create your stay</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Share the context that helps the house prepare quietly: who is coming, what kind of trip this is,
              and what would make arrival feel effortless.
            </p>
          </header>

          <form onSubmit={submit} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <UserRoundPlus className="h-4 w-4 text-clay" />
                  Guest
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input className={inputClass("firstName")} value={form.firstName} onChange={(event) => update("firstName", event.target.value)} placeholder="First name" />
                  <input className={inputClass("lastName")} value={form.lastName} onChange={(event) => update("lastName", event.target.value)} placeholder="Last name (optional)" />
                </div>
                <input type="email" className={cn("mt-2 w-full", inputClass("email"))} value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Email" />
              </section>

              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <CalendarDays className="h-4 w-4 text-clay" />
                  Stay
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input type="date" className={inputClass("arrivalDate")} value={form.arrivalDate} onChange={(event) => update("arrivalDate", event.target.value)} />
                  <input type="date" className={inputClass("departureDate")} value={form.departureDate} onChange={(event) => update("departureDate", event.target.value)} />
                </div>
                <input className={cn("mt-2 w-full", inputClass("occasion"))} value={form.occasion} onChange={(event) => update("occasion", event.target.value)} placeholder="Occasion or mood of the stay" />
                <textarea className={cn("mt-2 w-full", inputClass("purpose"))} rows={3} value={form.purpose} onChange={(event) => update("purpose", event.target.value)} placeholder="What brings you in? Meetings, celebration, decompression, family time..." />
                <p className="mt-2 text-xs leading-5 text-stone-500">
                  More context helps the team remove friction without asking you more questions later.
                </p>
              </section>

              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-700">Friends joining</p>
                  <button type="button" onClick={addFriend} className="flex items-center gap-1 text-xs text-stone-600">
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  {friends.length === 0 && (
                    <p className="rounded-md bg-linen p-3 text-xs leading-5 text-stone-500">
                      Add friends if anyone else should appear on the stay.
                    </p>
                  )}
                  {friends.map((friend, index) => (
                    <div key={friend.id} className="rounded-md border border-stone-200 p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input className={inputClass(`friend-${index}-firstName`)} value={friend.firstName} onChange={(event) => updateFriend(friend.id, "firstName", event.target.value)} placeholder="First name" />
                        <input className="rounded-md border border-stone-200 px-3 py-2 text-sm" value={friend.lastName} onChange={(event) => updateFriend(friend.id, "lastName", event.target.value)} placeholder="Last name" />
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input className={cn("min-w-0 flex-1", inputClass(`friend-${index}-email`))} value={friend.email} onChange={(event) => updateFriend(friend.id, "email", event.target.value)} placeholder="Email" />
                        <button type="button" onClick={() => removeFriend(friend.id)} className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-200">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="text-sm text-stone-700">Preferences</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input type="number" className="rounded-md border border-stone-200 px-3 py-2 text-sm" value={form.temperature} onChange={(event) => update("temperature", event.target.value)} placeholder="Preferred temperature, if any" />
                  <input className={inputClass("pillowType")} value={form.pillowType} onChange={(event) => update("pillowType", event.target.value)} placeholder="Pillow preference" />
                </div>
                <input className={cn("mt-2 w-full", inputClass("lighting"))} value={form.lighting} onChange={(event) => update("lighting", event.target.value)} placeholder="Lighting preference" />
                <textarea className="mt-2 w-full rounded-md border border-stone-200 px-3 py-2 text-sm" rows={2} value={form.arrivalRequest} onChange={(event) => update("arrivalRequest", event.target.value)} placeholder="Anything that would make arrival easier?" />
              </section>
            </div>

            {error && <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</p>}

            <Button className="mt-4 w-full" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create stay
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
