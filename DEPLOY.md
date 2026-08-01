# デプロイ手順（Cloudflare Workers）

本アプリはNext.js（App Router、ISR利用）のため、`@opennextjs/cloudflare` アダプタで **Cloudflare Workers** にデプロイします。DBは使用せず、練馬区オープンデータAPIをリクエスト時に直接取得するだけの構成なので、追加のCloudflareリソース（D1・Hyperdrive等）は不要です。

| 役割 | サービス | 費用 |
| :--- | :--- | :--- |
| アプリ本体（Next.js SSR + ISR） | Cloudflare Workers（`@opennextjs/cloudflare` アダプタ） | 無料枠内（1日10万リクエストまで無料） |
| データソース | 練馬区「行政手続情報」API（東京都オープンデータ、リクエスト時にfetch） | 無料 |

このリポジトリには既に以下が設定済みです：

- `@opennextjs/cloudflare` / `wrangler`（devDependencies）
- [`wrangler.jsonc`](wrangler.jsonc)（Workerの設定。Worker名は `kakasenai-do-ranking`）
- [`open-next.config.ts`](open-next.config.ts)（Cloudflareアダプタの設定）
- `package.json` の `cf:preview` / `cf:deploy` スクリプト

以下はすべてユーザー自身が手元で実行する手順です（このリポジトリ側での自動実行はしていません）。

---

## 手順1: Cloudflareアカウントの確認とCLIログイン（約3分）

1. 付与されたCloudflareアカウントで https://dash.cloudflare.com にログインできることを確認
2. このディレクトリ（`tokyo_hack/16_tetsuduki_kakasenai_do_ranking`）でCLIにログインする

   ```bash
   npx wrangler login
   ```

   ブラウザが開くので、Cloudflareアカウントで認可する

## 手順2: 依存関係のインストール（約2分）

```bash
npm install
```

`package.json` に追加済みの `@opennextjs/cloudflare` と `wrangler` がインストールされる

## 手順3: ローカルでCloudflare向けビルド・動作確認（約5分）

デプロイ前に、Cloudflare Workers環境を模したローカルプレビューで確認する。

```bash
npm run cf:preview
```

- ビルド後に開くURL（デフォルト `http://localhost:8788` 付近）で以下の4画面が表示されることを確認
  - `/`（トップ）
  - `/ranking`（クエストボード。カテゴリタブ・並び替えが動くこと）
  - `/procedures/[slug]`（クエスト詳細。ランキングカードから遷移）
  - `/suggestions`（作戦会議室）
- いずれの画面も練馬区オープンデータAPIから取得した実データが表示されればOK（サンプルデータへのフォールバックではないことを確認）

## 手順4: デプロイ（約3分）

```bash
npm run cf:deploy
```

初回はCloudflareアカウント・プロジェクトの確認を求められる場合があります。
完了すると `https://kakasenai-do-ranking.<あなたのサブドメイン>.workers.dev` のURLが発行されます。

> Worker名（`kakasenai-do-ranking`）を変更したい場合は、[`wrangler.jsonc`](wrangler.jsonc) の `name` と `services[0].service` の両方を同じ値に書き換えてから再デプロイしてください（自己参照バインディングの名前がWorker名と一致している必要があります）。

## 手順5（任意）: カスタムドメイン設定

1. Cloudflareダッシュボードで対象のWorkerを開く
2. 「Settings」→「Domains & Routes」→「Add」からカスタムドメインを追加
3. ドメインがCloudflareで管理されていれば、DNSレコードは自動で設定される

---

## 動作確認チェックリスト

- [ ] `/` — タイトル画面（ヒーロー）が表示される
- [ ] `/ranking` — クエストカードが討伐難易度ランクS〜D付きで表示され、カテゴリタブ・並び替えが機能する
- [ ] `/procedures/[slug]` — 持ち物リスト・比較グラフ・攻略ヒントが表示される
- [ ] `/suggestions` — 強敵 VS 楽勝クエストのカードが表示される
- [ ] いずれの画面も練馬区オープンデータAPIからの実データが反映されている（件数が0件やエラー表示になっていない）

## トラブルシューティング

| 症状 | 対処 |
| :--- | :--- |
| `npm run cf:preview` / `cf:deploy` でビルドエラー | `npm install` が完了しているか確認。Node.jsのバージョンが古い場合はアップデートする |
| 各画面でデータが表示されない・0件になる | 練馬区API（`service.api.metro.tokyo.lg.jp`）へのアウトバウンドfetchがCloudflare Workers側でブロックされていないか確認。`wrangler.jsonc` の `compatibility_flags` に `global_fetch_strictly_public` が入っていることが原因でプライベートIP宛リクエストとして弾かれるケースがあるため、その場合はこのフラグを一時的に外して切り分ける |
| デプロイ後にキャッシュが更新されない | ISR（`revalidate: 86400`）により最大24時間は古いデータが表示され得る仕様。即時反映したい場合は `wrangler.jsonc` の `services`（自己参照バインディング）が正しく設定されているか確認した上で、Workerを再デプロイする |
| `wrangler.jsonc` の `services[0].service` エラー | Worker名（`name`）と `services[0].service` の値が一致しているか確認 |

## 費用の目安

- **Cloudflare Workers**: 無料枠（1日10万リクエスト）で十分。カード登録不要
- **練馬区オープンデータAPI**: 無料（利用制限に注意し、必要に応じてISRのrevalidate間隔を調整する）
