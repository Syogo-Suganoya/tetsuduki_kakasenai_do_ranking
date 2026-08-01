import { getRankTier } from "@/lib/rank";

export function ScoreBar({ score }: { score: number }) {
  const tier = getRankTier(score);

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <span aria-hidden className="text-base leading-none">
        {tier.emoji}
      </span>
      <div
        className="h-2.5 flex-1 rounded-sm overflow-hidden border"
        style={{
          backgroundColor: "var(--surface-2)",
          borderColor: "var(--border-soft)",
        }}
      >
        <div
          className="h-full transition-[width]"
          style={{ width: `${score}%`, backgroundColor: tier.color }}
        />
      </div>
      <span className="font-mono text-xs text-[var(--ink-secondary)] whitespace-nowrap w-20 shrink-0">
        {score}pt・{tier.label}
      </span>
    </div>
  );
}
