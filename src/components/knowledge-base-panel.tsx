"use client";

import { useState } from "react";
import { BookOpen, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultKnowledgeBase } from "@/lib/knowledge-base";
import { useKnowledgeBase } from "@/lib/use-knowledge-base";

export function KnowledgeBasePanel() {
  const { knowledgeBase, save, reset } = useKnowledgeBase();
  const [draft, setDraft] = useState(knowledgeBase);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-stone-200 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-stone-700">
            <BookOpen className="h-4 w-4 text-clay" />
            Staff knowledge base
          </div>
          <h2 className="mt-2 font-serif text-3xl text-stone-950">Property answer guide</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
            Guest AI answers use this document for simple questions. Scheduling, billing, allergy, and operational
            requests are still routed to staff.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              setDraft(defaultKnowledgeBase);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={() => save(draft)}>
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="mt-4 h-72 w-full resize-none rounded-md border border-stone-200 bg-[#fbfaf7] p-4 font-mono text-xs leading-5 text-stone-700 outline-none focus:border-stone-400"
      />
    </section>
  );
}
