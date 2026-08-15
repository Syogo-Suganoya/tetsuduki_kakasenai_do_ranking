"""アーキテクチャ図の生成スクリプト。

実行:
    /Library/Developer/CommandLineTools/usr/bin/python3 docs/architecture.py

必要: pip install diagrams / brew install graphviz
出力: docs/architecture.png
"""

from pathlib import Path

from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.ci import GithubActions
from diagrams.onprem.client import Users
from diagrams.onprem.network import Internet
from diagrams.programming.framework import React
from diagrams.saas.cdn import Cloudflare

FONT = "Hiragino Sans"

graph_attr = {
    "fontname": FONT,
    "fontsize": "20",
    "labelloc": "t",
    "bgcolor": "white",
    "pad": "0.6",
    "nodesep": "0.6",
    "ranksep": "1.2",
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

    with Cluster("Cloudflare Workers", graph_attr=cluster_attr):
        app = React(
            "Next.js 16（App Router）"
        )
        edge = Cloudflare("@opennextjs/cloudflare")

    api = Internet("練馬区「行政手続情報」API\n（東京都オープンデータ）")
    ci = GithubActions("GitHub Actions")

    user >> Edge(label="HTTPS") >> edge >> Edge(label="SSR") >> app
    app >> Edge(label="サーバーサイドfetch", style="bold") >> api
    ci >> Edge(label="deploy", style="dashed") >> edge

if __name__ == "__main__":
    print(f"generated: {out}.png")
