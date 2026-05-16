"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [draft, setDraft] = useState("");

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
    setDraft("");
  }

  function removeMemory(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">Memory governance</p>
      <h2 className="mt-2 font-serif text-3xl text-stone-950">Guest memories</h2>
      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="rounded-md border border-stone-200 bg-linen p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm leading-6 text-stone-800">{item.memory}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-stone-500">
                    {item.source} · {item.scope}
                  </p>
                </div>
                <button
                  onClick={() => removeMemory(item.id)}
                  className="rounded-md border border-stone-200 bg-white p-2 text-stone-500 hover:text-stone-950"
                  aria-label={`Remove memory: ${item.memory}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="rounded-md bg-linen p-4 text-sm text-stone-500">No memories saved for this stay yet.</p>
        )}
        </div>
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
