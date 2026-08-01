import { RankingTable } from "@/components/RankingTable";
import { getProcedures } from "@/lib/procedures";
import { withScores } from "@/lib/scoring";

export const revalidate = 86400;

export default async function Home() {
  const procedures = await getProcedures();
  const scored = withScores(procedures);

  return (
    <div className="space-y-6">
      <div className="rpg-panel p-5 sm:p-6">
        <h1 className="text-2xl font-display flex items-center gap-2">
          <span aria-hidden>🏆</span>
          クエストボード
        </h1>
        <p className="text-[var(--ink-secondary)] mt-2 text-sm leading-relaxed">
          必要書類の数・窓口の数・オンライン申請できるかどうかから算出した「書かせない度」を討伐難易度ランクS〜Dに変換。練馬区の手続きという名の「クエスト」を、楽勝なものから並べています。カードをタップすると詳細な攻略情報が見られます。
        </p>
        <p className="text-[var(--ink-muted)] mt-2 text-xs font-mono">
          データ出典:{" "}
          <a
            href="https://catalog.data.metro.tokyo.lg.jp/dataset/t131202d0000000117"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            練馬区「行政手続情報」（東京都オープンデータAPIカタログサイト）
          </a>
          を毎回APIから取得して表示しています（全{procedures.length}件）。
        </p>
      </div>
      <RankingTable data={scored} />
    </div>
  );
}
