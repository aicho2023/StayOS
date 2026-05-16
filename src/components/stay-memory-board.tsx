"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Memory } from "@/lib/types";

type StayMemoryBoardProps = {
  memories: Memory[];
};

export function StayMemoryBoard({ memories }: StayMemoryBoardProps) {
  const [items, setItems] = useState(
    memories.map((memory) => ({
      id: memory.id,
      memory: memory.memory,
      scope: memory.permission_scope,
      source: memory.source,
    })),
  );
  const [activeId, setActiveId] = useState(items[0]?.id ?? "new");
  const [draft, setDraft] = useState("");
  const active = useMemo(() => items.find((item) => item.id === activeId), [activeId, items]);

  function addMemory() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const next = {
      id: `local-memory-${Date.now()}`,
      memory: trimmed,
      scope: "stay" as const,
      source: "Staff note",
    };
    setItems((current) => [next, ...current]);
    setActiveId(next.id);
    setDraft("");
  }

  function removeMemory(id: string) {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      setActiveId((active) => (active === id ? next[0]?.id ?? "new" : active));
      return next;
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">Memory governance</p>
      <h2 className="mt-2 font-serif text-3xl text-stone-950">Guest memories</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm",
              activeId === item.id ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white text-stone-600",
            )}
          >
            {item.scope}
          </button>
        ))}
      </div>
      {active ? (
        <div className="mt-4 rounded-md bg-linen p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm leading-6 text-stone-800">{active.memory}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-stone-500">
                {active.source} · {active.scope}
              </p>
            </div>
            <button onClick={() => removeMemory(active.id)} className="rounded-md border border-stone-200 bg-white p-2">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-md bg-linen p-4 text-sm text-stone-500">No memories saved for this stay yet.</p>
      )}
      <div className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400"
          placeholder="Add a stay-scoped memory"
        />
        <Button onClick={addMemory} type="button">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
    </section>
  );
}
