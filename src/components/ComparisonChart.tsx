"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ComparisonDatum = {
  label: string;
  必要書類数: number;
  担当窓口数: number;
};

export function ComparisonChart({ data }: { data: ComparisonDatum[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border-soft)" vertical={false} />
          <XAxis
            dataKey="label"
            fontSize={12}
            fontFamily="var(--font-mono)"
            stroke="var(--ink-muted)"
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            fontSize={12}
            fontFamily="var(--font-mono)"
            stroke="var(--ink-muted)"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--border-soft)" }}
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "2px solid var(--border-strong)",
              borderRadius: 8,
              color: "var(--foreground)",
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "var(--ink-secondary)" }} />
          <Bar
            dataKey="必要書類数"
            fill="var(--chart-1)"
            radius={[3, 3, 0, 0]}
            maxBarSize={48}
          />
          <Bar
            dataKey="担当窓口数"
            fill="var(--chart-2)"
            radius={[3, 3, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
