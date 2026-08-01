"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ScoredProcedure } from "@/lib/scoring";
import { ProcedureCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/categoryMeta";
import { ScoreBar } from "@/components/ScoreBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { RankBadge } from "@/components/RankBadge";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

type SortKey = "kakasenaiScore" | "requiredDocsCount" | "counterCount" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "kakasenaiScore", label: "楽勝順（書かせない度が高い順）" },
  { value: "requiredDocsCount", label: "持ち物が少ない順" },
  { value: "counterCount", label: "窓口が少ない順" },
  { value: "name", label: "クエスト名順" },
];

function sortValue(p: ScoredProcedure, key: SortKey): number | string {
  switch (key) {
    case "requiredDocsCount":
      return p.requiredDocs.length;
    case "counterCount":
      return p.counterCount;
    case "name":
      return p.name;
    default:
      return p.kakasenaiScore;
  }
}

export function RankingTable({ data }: { data: ScoredProcedure[] }) {
  const [category, setCategory] = useState<ProcedureCategory | "すべて">(
    "すべて"
  );
  const [sortKey, setSortKey] = useState<SortKey>("kakasenaiScore");

  const filtered = useMemo(
    () =>
      category === "すべて" ? data : data.filter((d) => d.category === category),
    [data, category]
  );

  const sorted = useMemo(() => {
    const asc = sortKey === "requiredDocsCount" || sortKey === "counterCount";
    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp =
        typeof av === "string" && typeof bv === "string"
          ? av.localeCompare(bv, "ja")
          : (av as number) - (bv as number);
      return asc ? cmp : -cmp;
    });
  }, [filtered, sortKey]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CategoryTabs value={category} onChange={setCategory} />
        <label className="flex items-center gap-2 text-sm font-mono text-[var(--ink-secondary)]">
          並び替え
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rpg-panel px-2.5 py-1.5 text-sm text-[var(--foreground)] cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="font-mono text-xs text-[var(--ink-muted)]">
        {sorted.length}件のクエストが見つかった
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sorted.map((p, i) => {
          const meta = CATEGORY_META[p.category];
          const online = p.onlineApplicationUrls.length > 0;
          return (
            <li key={p.slug}>
              <Link
                href={`/procedures/${p.slug}`}
                className="rpg-panel h-full flex flex-col gap-3 p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <RankBadge score={p.kakasenaiScore} />
                  {category === "すべて" && i < 3 ? (
                    <span
                      className="font-mono text-xs px-2 py-1 rounded-sm"
                      style={{
                        color: "var(--gold)",
                        background:
                          "color-mix(in srgb, var(--gold) 14%, transparent)",
                      }}
                    >
                      {RANK_MEDALS[i]} #{i + 1}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-[var(--ink-muted)]">
                      #{i + 1}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold leading-snug">{p.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${meta.color} 16%, transparent)`,
                        color: meta.color,
                      }}
                    >
                      <span aria-hidden>{meta.emoji}</span>
                      {p.category}
                    </span>
                    <span className="text-xs text-[var(--ink-muted)]">
                      {p.department}
                    </span>
                  </div>
                </div>

                <ScoreBar score={p.kakasenaiScore} />

                <div className="flex items-center gap-3 text-xs text-[var(--ink-secondary)] font-mono mt-auto pt-2 border-t border-[var(--border-soft)]">
                  <span>📎{p.requiredDocs.length}種</span>
                  <span>🏢{p.counterCount}箇所</span>
                  <span style={{ color: online ? "var(--status-good)" : "var(--ink-muted)" }}>
                    {online ? "💻 遠隔討伐可" : "🏢 窓口のみ"}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
