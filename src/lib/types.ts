export type ProcedureCategory = "子育て" | "住民登録" | "福祉" | "くらし・その他";

/** 練馬区オープンデータAPI「行政手続情報」の1行（1手続き×1書類）のレスポンス型 */
export type NerimaProcedureRow = {
  row: number;
  手続名称: string;
  書類正式名称: string;
  担当課: string;
  担当係: string;
  場所: string;
  用途: string;
  留意事項: string;
  電話番号: string;
  URL: string;
  電子申請: string;
};

export type NerimaProcedureApiResponse = {
  total: number;
  subtotal: number;
  limit: number;
  offset: number;
  metadata: Record<string, string>;
  hits: NerimaProcedureRow[];
};

/** 同一手続き名で複数行(=複数必要書類)を束ねた、手続き単位のレコード */
export type Procedure = {
  slug: string;
  name: string;
  category: ProcedureCategory;
  department: string;
  section: string;
  location: string;
  purpose: string;
  notes: string;
  phone: string;
  infoUrl: string;
  onlineApplicationUrls: string[];
  requiredDocs: string[];
  counterCount: number;
};
