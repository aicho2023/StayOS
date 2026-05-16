import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SystemStatus = {
  supabaseConfigured: boolean;
  supabaseRead: boolean;
  supabaseWrite: boolean;
  anthropicConfigured: boolean;
  model: string;
  notes: string[];
};

export async function getSystemStatus(): Promise<SystemStatus> {
  const notes: string[] = [];
  const supabase = createSupabaseServerClient();
  const anthropicConfigured = Boolean(process.env.ANTHROPIC_API_KEY);

  let supabaseRead = false;
  let supabaseWrite = false;

  if (supabase) {
    const stay = await supabase
      .from("stays")
      .select("id")
      .eq("id", "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa")
      .maybeSingle();
    supabaseRead = !stay.error && Boolean(stay.data);
    if (stay.error) notes.push(`Supabase read: ${stay.error.message}`);

    const insert = await supabase
      .from("communications")
      .insert({
        stay_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        sender_type: "system",
        channel: "internal_note",
        message: "Stay OS status check.",
      })
      .select("id")
      .single();
    supabaseWrite = !insert.error && Boolean(insert.data?.id);
    if (insert.error) notes.push(`Supabase write: ${insert.error.message}`);
    if (insert.data?.id) {
      await supabase.from("communications").delete().eq("id", insert.data.id);
    }
  } else {
    notes.push("Supabase client is not configured.");
  }

  if (!anthropicConfigured) {
    notes.push("ANTHROPIC_API_KEY is not configured.");
  }

  return {
    supabaseConfigured: Boolean(supabase),
    supabaseRead,
    supabaseWrite,
    anthropicConfigured,
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6",
    notes,
  };
}
