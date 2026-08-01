import { ScoredProcedure } from "@/lib/scoring";
import { ProcedureCategory } from "@/lib/types";

export type CategoryGroup = {
  category: ProcedureCategory;
  procedures: ScoredProcedure[];
  best: ScoredProcedure;
  worst: ScoredProcedure;
};

/** カテゴリごとに手続きをまとめ、「書かせない度」が最も高い/低い手続きを抽出する */
export function getCategoryGroups(
  procedures: ScoredProcedure[]
): CategoryGroup[] {
  const byCategory = new Map<ProcedureCategory, ScoredProcedure[]>();
  for (const procedure of procedures) {
    const list = byCategory.get(procedure.category) ?? [];
    list.push(procedure);
    byCategory.set(procedure.category, list);
  }

  return Array.from(byCategory.entries()).map(([category, list]) => {
    const sorted = [...list].sort(
      (a, b) => b.kakasenaiScore - a.kakasenaiScore
    );
    return {
      category,
      procedures: sorted,
      best: sorted[0],
      worst: sorted[sorted.length - 1],
    };
  });
}

/** 「引き算」提案: カテゴリ内でベストとワーストの差が大きい順に並べる */
export function getSuggestions(procedures: ScoredProcedure[]): CategoryGroup[] {
  return getCategoryGroups(procedures)
    .filter((g) => g.procedures.length > 1 && g.best !== g.worst)
    .sort(
      (a, b) =>
        b.worst.hassleScore -
        b.best.hassleScore -
        (a.worst.hassleScore - a.best.hassleScore)
    );
}
