# 開発ガイド

## セットアップ

```bash
npm install
```

## コマンド

```bash
npm run dev     # 開発サーバー起動（http://localhost:3000）
npm run build   # 本番ビルド
npm run start   # 本番サーバー起動
npm run lint    # ESLint実行
```

## 既知の注意事項

- **Turbopackのパス処理バグ回避のため `--webpack` を使用しています。** 本リポジトリは日本語ディレクトリ（`趣味`, `開発` 等）を含むパス配下にあり、Next.js 16 のデフォルトバンドラーである Turbopack でビルドすると、非ASCII文字を含むパスのハッシュ生成処理でパニック（`start byte index ... is not a char boundary`）が発生します。そのため `package.json` の `dev`/`build` スクリプトは Webpack にフォールバックしています。日本語を含まないパスに移動できる場合はこの制約は不要です。
- 型チェックは `npx tsc --noEmit` で個別に実行できます。
- **データは実行時に外部API（`service.api.metro.tokyo.lg.jp`）から取得します。** `npm run dev` / `npm run build` にはネットワーク接続が必要です。取得結果はNext.jsの`fetch`キャッシュにより1日（`revalidate: 86400`）保持されます。API仕様の詳細は[README.mdの「使用データ（API）」](./README.md#使用データapi)を参照してください。

## ディレクトリ構成

```
src/
  app/                    ルーティング（ランキング / 詳細 / 改善提案）
  components/             ランキング表・比較グラフ等のUIコンポーネント
  lib/
    types.ts              データ型定義（APIレスポンス型・手続きレコード型）
    tokyoOpenData.ts       練馬区「行政手続情報」APIの呼び出し
    procedures.ts          APIレスポンスを手続き単位に集約・カテゴリ分類
    scoring.ts              複雑度・書かせない度スコアの算出ロジック
    aggregate.ts            カテゴリ内のベスト/ワースト手続きの抽出
```

## スコアリングロジックの変更

重みづけは [`src/lib/scoring.ts`](./src/lib/scoring.ts) の `SCORE_WEIGHTS` で調整できます。AI/MLは使用せず、ルールベースの加重合計のみで説明可能なスコアとしています。
