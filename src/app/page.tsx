import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    emoji: "🏆",
    title: "討伐難易度ランキング",
    desc: "必要書類の数・窓口の数・オンライン申請できるかどうかから「書かせない度」を算出し、S〜Dランクの討伐難易度として手続きをランキング表示します。",
  },
  {
    emoji: "🔍",
    title: "クエスト詳細シート",
    desc: "手続きごとに、持ち物リスト・窓口・電話番号・オンライン申請リンクをクエストシート形式でひとまとめに確認できます。",
  },
  {
    emoji: "💡",
    title: "作戦会議室",
    desc: "同じカテゴリの中から一番シンプルな手続き（楽勝ルート）を自動で見つけて、強敵クエストとVS形式で紹介します。",
  },
];

const STEPS = [
  {
    emoji: "1️⃣",
    title: "クエストボードでカテゴリを選ぶ",
    desc: "「子育て」「住民登録」「福祉」「くらし・その他」からカテゴリを選ぶと、手続きが討伐難易度（書かせない度）順に並びます。Sランクほど持ち物が少なく、オンラインで完結しやすいクエストです。",
    image: "/screenshots/step1-ranking.png",
  },
  {
    emoji: "2️⃣",
    title: "クエストカードをタップして攻略情報を見る",
    desc: "気になるクエストカードをタップすると、持ち物一覧・窓口・電話番号・オンライン申請リンクと、同じカテゴリの平均との比較グラフが見られます。",
    image: "/screenshots/step2-detail.png",
  },
  {
    emoji: "3️⃣",
    title: "「作戦会議室」でヒントを見つける",
    desc: "ナビの「作戦会議室」から、強敵クエストと楽勝クエスト（ベストプラクティス）をカテゴリごとにVS形式で見比べられます。行政の簡素化のヒント探しにも使えます。",
    image: "/screenshots/step3-suggestions.png",
  },
];

export default function LandingPage() {
  return (
    <div className="space-y-16">
      {/* Hero: title screen */}
      <section className="relative text-center rpg-panel px-6 py-16 sm:py-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--violet) 22%, transparent), transparent 60%)",
          }}
        />
        <div className="relative">
          <span
            aria-hidden
            className="inline-grid place-items-center w-16 h-16 text-3xl mb-6 border-2 rounded-sm"
            style={{
              borderColor: "var(--gold)",
              background: "color-mix(in srgb, var(--gold) 16%, var(--surface))",
              boxShadow: "0 0 20px color-mix(in srgb, var(--gold) 45%, transparent)",
            }}
          >
            📝
          </span>
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--gold)] mb-3">
            QUEST BOARD ── 練馬区版
          </p>
          <h1 className="font-display text-3xl sm:text-5xl leading-snug">
            その手続き、
            <br className="sm:hidden" />
            本当に書類が必要ですか？
          </h1>
          <p className="text-[var(--ink-secondary)] mt-5 max-w-xl mx-auto leading-relaxed">
            行政手続きという名の「クエスト」を、必要書類数・窓口数・オンライン申請の可否から
            討伐難易度ランクS〜Dで見える化。あなたの街の「書かせない度」を確かめよう。
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ranking"
              className="px-6 py-3 rounded-sm font-display border-2 transition-all hover:-translate-y-0.5"
              style={{
                borderColor: "var(--gold)",
                background: "var(--gold)",
                color: "var(--background)",
                boxShadow: "0 0 20px color-mix(in srgb, var(--gold) 40%, transparent)",
              }}
            >
              🏆 クエストボードを開く
            </Link>
            <Link
              href="/suggestions"
              className="px-6 py-3 rounded-sm font-display border-2 transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--border-strong)" }}
            >
              💡 作戦会議室へ
            </Link>
          </div>
        </div>
      </section>

      {/* What can you do */}
      <section>
        <h2 className="font-display text-xl text-center mb-6">できること</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rpg-panel p-5">
              <span aria-hidden className="text-2xl">
                {f.emoji}
              </span>
              <h3 className="font-semibold mt-2">{f.title}</h3>
              <p className="text-sm text-[var(--ink-secondary)] mt-1.5 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to use, with screenshots — quest log */}
      <section>
        <h2 className="font-display text-xl text-center mb-2">クエストログ</h2>
        <p className="text-sm text-[var(--ink-secondary)] text-center mb-8">
          実際の画面を見ながら、3ステップで使い方を紹介します。
        </p>
        <div className="space-y-10">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rpg-panel grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-5 sm:p-6">
              <div>
                <p className="font-mono text-xs text-[var(--gold)] mb-1">
                  STEP {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-2xl" aria-hidden>
                  {s.emoji}
                </p>
                <h3 className="font-semibold text-lg mt-1">{s.title}</h3>
                <p className="text-sm text-[var(--ink-secondary)] mt-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <div className="rounded-sm overflow-hidden border-2 border-[var(--border-strong)] shadow-sm">
                <Image
                  src={s.image}
                  alt={s.title}
                  width={900}
                  height={900}
                  className="w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data source */}
      <section className="rpg-panel p-5 sm:p-6 text-center">
        <h2 className="font-display text-base mb-2">📡 使っているデータ</h2>
        <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
          東京都オープンデータAPIカタログサイト経由で、
          <a
            href="https://catalog.data.metro.tokyo.lg.jp/dataset/t131202d0000000117"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            練馬区「行政手続情報」
          </a>
          を毎回APIから取得しています。サンプルデータではなく、常に最新の公開情報を表示します。
        </p>
        <Link
          href="/ranking"
          className="inline-block mt-5 px-6 py-3 rounded-sm font-display border-2 transition-all hover:-translate-y-0.5"
          style={{
            borderColor: "var(--gold)",
            background: "var(--gold)",
            color: "var(--background)",
          }}
        >
          さっそくクエストボードを見る →
        </Link>
      </section>
    </div>
  );
}
