import { cn } from "@/lib/utils";

type ScorePillProps = {
  label: string;
  value: number;
  intent?: "comfort" | "creepiness" | "revenue";
};

export function ScorePill({ label, value, intent = "comfort" }: ScorePillProps) {
  return (
    <div className="min-w-[104px] rounded-md border border-stone-200 bg-white/70 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-serif text-2xl text-stone-900">{value}</span>
        <span
          className={cn(
            "h-1.5 flex-1 rounded-full",
            intent === "comfort" && "bg-olive",
            intent === "creepiness" && "bg-clay",
            intent === "revenue" && "bg-stone-400",
          )}
        />
      </div>
    </div>
  );
}
