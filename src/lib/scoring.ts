import { Procedure } from "@/lib/types";

/**
 * 重みづけ単純加重合計（ルールベース、AI不使用）。数値が大きいほど「書かせる度」が高い＝面倒。
 * 練馬区オープンデータAPIには所要時間の項目がないため、必要書類数・担当窓口数・オンライン申請可否のみで算出する。
 */
export const SCORE_WEIGHTS = {
  docs: 15,
  counters: 10,
  offlineOnlyPenalty: 40,
} as const;

export function computeHassleScoreRaw(procedure: Procedure): number {
  return (
    procedure.requiredDocs.length * SCORE_WEIGHTS.docs +
    Math.max(0, procedure.counterCount - 1) * SCORE_WEIGHTS.counters +
    (procedure.onlineApplicationUrls.length > 0
      ? 0
      : SCORE_WEIGHTS.offlineOnlyPenalty)
  );
}

export type ScoredProcedure = Procedure & {
  hassleScore: number;
  kakasenaiScore: number;
};

/** データセット全体で0-100に正規化した「面倒度」「書かせない度」を付与する */
export function withScores(procedures: Procedure[]): ScoredProcedure[] {
  const raws = procedures.map(computeHassleScoreRaw);
  const min = Math.min(...raws);
  const max = Math.max(...raws);

  return procedures.map((procedure, i) => {
    const raw = raws[i];
    const hassleScore =
      max === min ? 50 : Math.round(((raw - min) / (max - min)) * 100);
    return {
      ...procedure,
      hassleScore,
      kakasenaiScore: 100 - hassleScore,
    };
  });
}
