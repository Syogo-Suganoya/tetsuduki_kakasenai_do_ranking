"use client";

import clsx from "clsx";
import { ProcedureCategory } from "@/lib/types";
import { CATEGORY_META } from "@/lib/categoryMeta";

const CATEGORIES: (ProcedureCategory | "すべて")[] = [
  "すべて",
  "子育て",
  "住民登録",
  "福祉",
  "くらし・その他",
];

export function CategoryTabs({
  value,
  onChange,
}: {
  value: ProcedureCategory | "すべて";
  onChange: (v: ProcedureCategory | "すべて") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="カテゴリを選ぶ">
      {CATEGORIES.map((c) => {
        const meta = c === "すべて" ? null : CATEGORY_META[c];
        const active = value === c;
        return (
          <button
            key={c}
            role="tab"
            aria-selected={active}
            data-active={active}
            onClick={() => onChange(c)}
            className={clsx(
              "rpg-select-marker flex items-center px-3.5 py-2 rounded-sm text-sm font-medium transition-all cursor-pointer border-2",
              active
                ? "bg-[var(--surface)] shadow-sm"
                : "bg-transparent text-[var(--ink-secondary)] hover:bg-[var(--surface)]/60 border-transparent"
            )}
            style={
              active
                ? { borderColor: meta ? meta.color : "var(--gold)", color: meta ? meta.color : "var(--gold)" }
                : undefined
            }
          >
            <span aria-hidden className="mr-1.5">
              {meta ? meta.emoji : "✨"}
            </span>
            {c}
          </button>
        );
      })}
    </div>
  );
}
