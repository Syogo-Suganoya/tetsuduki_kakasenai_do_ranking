import { notFound } from "next/navigation";
import Link from "next/link";
import { getProcedures } from "@/lib/procedures";
import { withScores } from "@/lib/scoring";
import { getCategoryGroups } from "@/lib/aggregate";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { ComparisonChart } from "@/components/ComparisonChart";
import { ScoreBar } from "@/components/ScoreBar";
import { RankBadge } from "@/components/RankBadge";

export const revalidate = 86400;

export default async function ProcedureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scored = withScores(await getProcedures());
  const procedure = scored.find((p) => p.slug === slug);
  if (!procedure) notFound();

  const group = getCategoryGroups(scored).find(
    (g) => g.category === procedure.category
  )!;
  const categoryAvgDocs =
    group.procedures.reduce((sum, p) => sum + p.requiredDocs.length, 0) /
    group.procedures.length;
  const categoryAvgCounters =
    group.procedures.reduce((sum, p) => sum + p.counterCount, 0) /
    group.procedures.length;

  const chartData = [
    {
      label: procedure.name,
      必要書類数: procedure.requiredDocs.length,
      担当窓口数: procedure.counterCount,
    },
    {
      label: `${procedure.category}の平均`,
      必要書類数: Math.round(categoryAvgDocs * 10) / 10,
      担当窓口数: Math.round(categoryAvgCounters * 10) / 10,
    },
  ];

  const categoryMeta = CATEGORY_META[procedure.category];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/ranking"
          className="text-sm text-[var(--ink-secondary)] hover:underline underline-offset-2 font-mono"
        >
          ← クエストボードに戻る
        </Link>
        <div className="flex items-start gap-3 mt-2">
          <RankBadge score={procedure.kakasenaiScore} size="lg" />
          <div>
            <p className="text-xs font-mono text-[var(--ink-muted)]">クエスト詳細</p>
            <h1 className="text-2xl font-bold leading-snug">{procedure.name}</h1>
          </div>
        </div>
        <p className="text-sm text-[var(--ink-secondary)] mt-3 flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: `color-mix(in srgb, ${categoryMeta.color} 16%, transparent)`,
              color: categoryMeta.color,
            }}
          >
            <span aria-hidden>{categoryMeta.emoji}</span>
            {procedure.category}
          </span>
          <span>
            🏛️ {procedure.department}
            {procedure.section ? ` ${procedure.section}` : ""}
          </span>
        </p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rpg-panel p-5 space-y-3 text-sm">
          <p>
            <span className="text-[var(--ink-muted)]">📋 用途: </span>
            {procedure.purpose || "情報なし"}
          </p>
          <p>
            <span className="text-[var(--ink-muted)]">📍 窓口: </span>
            {procedure.location || "情報なし"}
          </p>
          <p>
            <span className="text-[var(--ink-muted)]">☎️ 電話番号: </span>
            {procedure.phone || "情報なし"}
          </p>
          {procedure.notes && (
            <p>
              <span className="text-[var(--ink-muted)]">💡 留意事項: </span>
              {procedure.notes}
            </p>
          )}
          {procedure.infoUrl && (
            <p>
              <a
                href={procedure.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                🔗 案内ページを見る
              </a>
            </p>
          )}
        </div>
        <div className="rpg-panel p-5 space-y-3 text-sm">
          <p className="font-semibold">
            📎 持ち物リスト（{procedure.requiredDocs.length}種類）
          </p>
          {procedure.requiredDocs.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-[var(--ink-secondary)]">
              {procedure.requiredDocs.map((doc) => (
                <li key={doc}>{doc}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[var(--status-good)]">
              ✅ 指定様式の提出は不要です。
            </p>
          )}
          <p className="pt-1">
            <span className="text-[var(--ink-muted)]">💻 オンライン申請: </span>
            {procedure.onlineApplicationUrls.length > 0 ? (
              <span className="space-x-2">
                {procedure.onlineApplicationUrls.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    申請リンク{procedure.onlineApplicationUrls.length > 1 ? i + 1 : ""}
                  </a>
                ))}
              </span>
            ) : (
              <span className="text-[var(--ink-muted)]">
                窓口のみ（オンライン申請なし）
              </span>
            )}
          </p>
          <div className="pt-2 border-t border-[var(--border-soft)]">
            <p className="text-[var(--ink-muted)] text-xs mb-1.5 pt-2 font-mono">
              討伐しやすさゲージ
            </p>
            <ScoreBar score={procedure.kakasenaiScore} />
          </div>
        </div>
      </section>

      <section className="rpg-panel p-5">
        <h2 className="font-display text-base mb-3 flex items-center gap-1.5">
          <span aria-hidden>📊</span>「{procedure.category}」パーティ平均との比較
        </h2>
        <ComparisonChart data={chartData} />
        <p className="text-xs text-[var(--ink-muted)] mt-2">
          出典:{" "}
          <a
            href="https://catalog.data.metro.tokyo.lg.jp/dataset/t131202d0000000117"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            練馬区「行政手続情報」
          </a>
          （東京都オープンデータAPIカタログサイト経由）
        </p>
      </section>

      {group.best.slug !== procedure.slug && (
        <section
          className="rounded-sm border-2 p-5"
          style={{
            borderColor: "var(--gold)",
            background: "color-mix(in srgb, var(--gold) 8%, transparent)",
          }}
        >
          <h2
            className="font-display text-base mb-1.5 flex items-center gap-1.5"
            style={{ color: "var(--gold)" }}
          >
            <span aria-hidden>🎁</span>攻略ヒント発見
          </h2>
          <p className="text-sm leading-relaxed">
            「{procedure.name}」は持ち物{procedure.requiredDocs.length}
            種類・窓口{procedure.counterCount}箇所ですが、同じ「{procedure.category}
            」カテゴリの「
            <Link
              href={`/procedures/${group.best.slug}`}
              className="underline underline-offset-2 font-medium"
            >
              {group.best.name}
            </Link>
            」は持ち物{group.best.requiredDocs.length}種類・窓口
            {group.best.counterCount}箇所
            {group.best.onlineApplicationUrls.length > 0
              ? "かつ遠隔討伐可能"
              : ""}
            で運用されています。この手続きをベストプラクティスとして参考にすることで
            簡素化の余地があります。
          </p>
        </section>
      )}
    </div>
  );
}
