import type { Metadata } from "next";
import { DotGothic16, Geist_Mono, M_PLUS_Rounded_1c } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const roundedSans = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});

const dotDisplay = DotGothic16({
  variable: "--font-dot",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "書かせない度クエストボード",
  description: "行政手続き「書かせない度」討伐ランキング RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${roundedSans.variable} ${dotDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header className="sticky top-0 z-10 bg-[var(--background)]/92 backdrop-blur border-b-2 border-[var(--border-strong)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm sm:text-lg text-[var(--foreground)] whitespace-nowrap"
            >
              <span
                aria-hidden
                className="grid place-items-center w-8 h-8 sm:w-9 sm:h-9 text-base sm:text-lg border-2 rounded-sm shrink-0"
                style={{
                  borderColor: "var(--gold)",
                  background:
                    "color-mix(in srgb, var(--gold) 16%, var(--surface))",
                  boxShadow:
                    "0 0 10px color-mix(in srgb, var(--gold) 45%, transparent)",
                }}
              >
                📝
              </span>
              <span className="leading-tight">
                書かせない度クエストボード
              </span>
            </Link>
            <nav className="flex gap-1 text-xs sm:text-sm font-medium font-display -mx-1 sm:mx-0">
              <Link
                href="/"
                className="px-2.5 sm:px-3 py-1.5 rounded-sm whitespace-nowrap hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-colors"
              >
                タイトル
              </Link>
              <Link
                href="/ranking"
                className="px-2.5 sm:px-3 py-1.5 rounded-sm whitespace-nowrap hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-colors"
              >
                クエストボード
              </Link>
              <Link
                href="/suggestions"
                className="px-2.5 sm:px-3 py-1.5 rounded-sm whitespace-nowrap hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-colors"
              >
                作戦会議室
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <footer className="border-t-2 border-[var(--border-strong)] py-5 text-center text-xs text-[var(--ink-muted)] font-mono">
          本デモは東京都オープンデータAPIカタログサイト経由で練馬区「行政手続情報」APIを実データ取得して動作しています。
        </footer>
      </body>
    </html>
  );
}
