import { ProcedureCategory } from "@/lib/types";

export const CATEGORY_META: Record<
  ProcedureCategory,
  { emoji: string; color: string }
> = {
  子育て: { emoji: "👶", color: "var(--cat-child)" },
  住民登録: { emoji: "🏠", color: "var(--cat-resident)" },
  福祉: { emoji: "🤝", color: "var(--cat-welfare)" },
  "くらし・その他": { emoji: "🏙️", color: "var(--cat-other)" },
};
