import Link from "next/link";
import { CheckCircle2, CircleAlert, Database, Sparkles } from "lucide-react";
import { getSystemStatus } from "@/lib/system-status";

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-stone-200 bg-white p-4">
      <span className="text-sm text-stone-700">{label}</span>
      <span className={ok ? "text-olive" : "text-clay"}>
        {ok ? <CheckCircle2 className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
      </span>
    </div>
  );
}

export default async function SystemPage() {
  const status = await getSystemStatus();

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-stone-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-stone-500 hover:text-stone-950">
          Back to hospitality intelligence
        </Link>
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-clay">System readiness</p>
          <h1 className="mt-3 font-serif text-5xl text-stone-950">Integration status</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-600">
            This page confirms server-side connectivity without displaying secrets. It is useful before a live demo.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <StatusRow label="Supabase configured" ok={status.supabaseConfigured} />
            <StatusRow label="Supabase stay read" ok={status.supabaseRead} />
            <StatusRow label="Supabase server write" ok={status.supabaseWrite} />
            <StatusRow label="Anthropic key configured" ok={status.anthropicConfigured} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-md bg-linen p-4">
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Sparkles className="h-4 w-4 text-clay" />
                AI model
              </div>
              <p className="mt-2 font-mono text-sm text-stone-600">{status.model}</p>
            </div>
            <div className="rounded-md bg-linen p-4">
              <div className="flex items-center gap-2 text-sm text-stone-700">
                <Database className="h-4 w-4 text-clay" />
                Data posture
              </div>
              <p className="mt-2 text-sm text-stone-600">PMS/CRM/RMS/POS companion layer, not replacement.</p>
            </div>
          </div>

          {status.notes.length > 0 && (
            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              {status.notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
