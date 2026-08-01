export type RankTier = "S" | "A" | "B" | "C" | "D";

export type RankInfo = {
  tier: RankTier;
  color: string;
  label: string;
  emoji: string;
};

const TIERS: (RankInfo & { min: number })[] = [
  { min: 80, tier: "S", color: "var(--rank-s)", label: "楽勝", emoji: "😄" },
  { min: 60, tier: "A", color: "var(--rank-a)", label: "らくらく", emoji: "🙂" },
  { min: 40, tier: "B", color: "var(--rank-b)", label: "ふつう", emoji: "😐" },
  { min: 20, tier: "C", color: "var(--rank-c)", label: "てごわい", emoji: "😖" },
  { min: 0, tier: "D", color: "var(--rank-d)", label: "強敵", emoji: "😱" },
];

/** 「書かせない度」スコア（高いほど楽）を討伐難易度ランクS〜Dに変換する */
export function getRankTier(score: number): RankInfo {
  const found = TIERS.find((t) => score >= t.min);
  return found ?? TIERS[TIERS.length - 1];
}
