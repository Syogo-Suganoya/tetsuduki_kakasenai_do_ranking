import { NerimaProcedureApiResponse, NerimaProcedureRow } from "@/lib/types";

/**
 * 東京都オープンデータAPIカタログサイト(https://spec.api.metro.tokyo.lg.jp/spec/search)で
 * 「行政手続情報」を検索して見つかった練馬区の公開API。
 * データセット: https://catalog.data.metro.tokyo.lg.jp/dataset/t131202d0000000117
 */
const NERIMA_PROCEDURE_API_URL =
  "https://service.api.metro.tokyo.lg.jp/api/t131202d0000000117-2dfe94b3ce6c4fe25f40d2ff77653f8b-0/json";

const PAGE_SIZE = 1000;

async function fetchPage(offset: number): Promise<NerimaProcedureApiResponse> {
  const res = await fetch(
    `${NERIMA_PROCEDURE_API_URL}?limit=${PAGE_SIZE}&offset=${offset}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) {
    throw new Error(
      `練馬区 行政手続情報APIの取得に失敗しました (status: ${res.status})`
    );
  }

  return res.json();
}

/** 総件数がPAGE_SIZEを超えた場合に備え、全件を取得し終えるまでページングする */
export async function fetchNerimaProcedureRows(): Promise<NerimaProcedureRow[]> {
  const rows: NerimaProcedureRow[] = [];
  let offset = 0;

  for (;;) {
    const page = await fetchPage(offset);
    rows.push(...page.hits);
    offset += page.hits.length;
    if (page.hits.length === 0 || offset >= page.total) break;
  }

  return rows;
}
