"""アーキテクチャ図の生成スクリプト。

実行:
    /Library/Developer/CommandLineTools/usr/bin/python3 docs/architecture.py

必要: pip install diagrams / brew install graphviz
出力: docs/architecture.png
"""

from pathlib import Path

from diagrams import Cluster, Diagram, Edge
from diagrams.generic.storage import Storage
from diagrams.onprem.client import Users
from diagrams.onprem.network import Internet
from diagrams.programming.framework import React
from diagrams.programming.language import TypeScript
from diagrams.saas.cdn import Cloudflare

FONT = "Hiragino Sans"

graph_attr = {
    "fontname": FONT,
    "fontsize": "20",
    "labelloc": "t",
    "bgcolor": "white",
    "pad": "0.6",
    "nodesep": "0.5",
    "ranksep": "0.9",
    "splines": "spline",
}
node_attr = {"fontname": FONT, "fontsize": "11"}
edge_attr = {"fontname": FONT, "fontsize": "10", "color": "#555555"}
cluster_attr = {"fontname": FONT, "fontsize": "13", "pencolor": "#888888"}

out = Path(__file__).resolve().parent / "architecture"

with Diagram(
    "行政手続き「書かせない度」可視化ランキング — アーキテクチャ",
    filename=str(out),
    outformat="png",
    show=False,
    direction="LR",
    graph_attr=graph_attr,
    node_attr=node_attr,
    edge_attr=edge_attr,
):
    user = Users("住民 / ブラウザ")

    with Cluster("Cloudflare Workers（@opennextjs/cloudflare）", graph_attr=cluster_attr):
        worker = Cloudflare("kakasenai-do-ranking\nWorker")

        with Cluster("Next.js App Router（Server Components）", graph_attr=cluster_attr):
            top = React("/\nトップ")
            ranking = React("/ranking\nクエストボード")
            detail = React("/procedures/[slug]\nクエスト詳細")
            suggestions = React("/suggestions\n作戦会議室")
            pages = [top, ranking, detail, suggestions]

        with Cluster("Client Components", graph_attr=cluster_attr):
            table = React("RankingTable\n+ CategoryTabs")
            chart = React("ComparisonChart\n(Recharts)")

        with Cluster("src/lib（ドメインロジック）", graph_attr=cluster_attr):
            fetcher = TypeScript("tokyoOpenData.ts\nAPI取得・全件ページング")
            aggregator = TypeScript("procedures.ts\n手続き単位に集約\n+ カテゴリ分類")
            scoring = TypeScript("scoring.ts\nSCORE_WEIGHTS\n加重合計スコア")
            agg = TypeScript("aggregate.ts\nカテゴリ内\nベスト/ワースト抽出")
            rank = TypeScript("rank.ts\nS〜Dランク判定")

        isr = Storage("Next.js fetch キャッシュ\nrevalidate: 86400（1日）")

    with Cluster("外部データソース", graph_attr=cluster_attr):
        api = Internet(
            "練馬区「行政手続情報」API\nservice.api.metro.tokyo.lg.jp\n（東京都オープンデータ）"
        )

    user >> Edge(label="HTTPS") >> worker
    worker >> Edge(label="SSR / ISR") >> pages

    for page in (ranking, detail, suggestions):
        page >> Edge(label="getProcedures()") >> aggregator

    fetcher >> Edge(label="NerimaProcedureRow[]") >> aggregator
    fetcher >> Edge(label="POST /json?limit&offset", style="bold") >> api
    fetcher >> Edge(style="dashed", label="1日キャッシュ") >> isr

    aggregator >> Edge(label="Procedure[]") >> scoring
    scoring >> Edge(label="ScoredProcedure[]") >> agg
    scoring >> Edge(style="dotted", label="ランク付与") >> rank

    ranking >> Edge(label="props") >> table
    detail >> Edge(label="props") >> chart
    # 集約結果はページに戻って描画される（レイアウト順序には影響させない）
    agg >> Edge(style="dotted", label="比較 / 提案", constraint="false") >> detail
    agg >> Edge(style="dotted", constraint="false") >> suggestions

if __name__ == "__main__":
    print(f"generated: {out}.png")
