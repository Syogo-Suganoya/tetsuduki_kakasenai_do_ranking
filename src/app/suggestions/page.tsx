import Link from "next/link";
import { getProcedures } from "@/lib/procedures";
import { withScores } from "@/lib/scoring";
import { getSuggestions } from "@/lib/aggregate";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { RankBadge } from "@/components/RankBadge";

export const revalidate = 86400;

export default async function SuggestionsPage() {
  const scored = withScores(await getProcedures());
  const groups = getSuggestions(scored);

  return (
    <div className="space-y-6">
      <div className="rpg-panel p-5 sm:p-6">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <span aria-hidden>💡</span>作戦会議室
        </h1>
        <p className="text-[var(--ink-secondary)] mt-2 text-sm leading-relaxed">
          同じカテゴリの中から、一番の「強敵」クエストと一番の「楽勝」クエスト（ベストプラクティス）を1対1で見比べます。ランク差が大きいカテゴリ＝簡素化の伸びしろが大きいカテゴリです。
        </p>
      </div>

      <div className="space-y-5">
        {groups.map((g) => {
          const gap = g.worst.hassleScore - g.best.hassleScore;
          const meta = CATEGORY_META[g.category];
          return (
            <div key={g.category} className="rpg-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${meta.color} 16%, transparent)`,
                      color: meta.color,
                    }}
                  >
                    <span aria-hidden>{meta.emoji}</span>
                    {g.category}
                  </span>
                </h2>
                <span className="text-xs text-[var(--ink-muted)] font-mono">
                  {g.procedures.length}件のクエスト
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-center">
                <Link
                  href={`/procedures/${g.worst.slug}`}
                  className="rounded-sm border-2 p-4 hover:opacity-85 transition-opacity"
                  style={{
                    borderColor: "var(--rank-d)",
                    background:
                      "color-mix(in srgb, var(--rank-d) 8%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RankBadge score={g.worst.kakasenaiScore} size="sm" />
                    <p className="text-xs font-semibold" style={{ color: "var(--rank-d)" }}>
                      😱 強敵：{g.worst.name}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--ink-secondary)]">
                    持ち物 {g.worst.requiredDocs.length}種・窓口{" "}
                    {g.worst.counterCount}箇所・
                    {g.worst.onlineApplicationUrls.length > 0
                      ? "遠隔討伐可"
                      : "窓口のみ"}
                  </p>
                </Link>

                <span
                  className="justify-self-center font-display text-sm px-2.5 py-1 rounded-full shrink-0"
                  style={{
                    color: "var(--gold)",
                    background: "color-mix(in srgb, var(--gold) 18%, transparent)",
                  }}
                  aria-hidden
                >
                  VS
                </span>

                <Link
                  href={`/procedures/${g.best.slug}`}
                  className="rounded-sm border-2 p-4 hover:opacity-85 transition-opacity"
                  style={{
                    borderColor: "var(--rank-s)",
                    background:
                      "color-mix(in srgb, var(--rank-s) 8%, transparent)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <RankBadge score={g.best.kakasenaiScore} size="sm" />
                    <p className="text-xs font-semibold" style={{ color: "var(--rank-s)" }}>
                      😄 楽勝：{g.best.name}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--ink-secondary)]">
                    持ち物 {g.best.requiredDocs.length}種・窓口{" "}
                    {g.best.counterCount}箇所・
                    {g.best.onlineApplicationUrls.length > 0
                      ? "遠隔討伐可"
                      : "窓口のみ"}
                  </p>
                </Link>
              </div>
              <p className="text-xs text-[var(--ink-muted)] mt-3 font-mono">
                難易度ギャップ: {gap}pt
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
