import { getRankTier } from "@/lib/rank";

const SIZE_STYLES = {
  sm: { box: "w-9 h-9 text-sm", border: 2 },
  md: { box: "w-12 h-12 text-lg", border: 2 },
  lg: { box: "w-20 h-20 text-3xl", border: 3 },
} as const;

export function RankBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: keyof typeof SIZE_STYLES;
}) {
  const tier = getRankTier(score);
  const s = SIZE_STYLES[size];

  return (
    <div
      className={`shrink-0 grid place-items-center font-display font-bold ${s.box}`}
      style={{
        color: tier.color,
        background: `color-mix(in srgb, ${tier.color} 18%, var(--surface))`,
        border: `${s.border}px solid ${tier.color}`,
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        boxShadow: `0 0 14px color-mix(in srgb, ${tier.color} 50%, transparent)`,
      }}
      aria-label={`討伐ランク ${tier.tier}（${tier.label}）`}
      title={`ランク${tier.tier}：${tier.label}`}
    >
      {tier.tier}
    </div>
  );
}
