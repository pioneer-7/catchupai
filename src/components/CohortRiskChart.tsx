'use client';

// 코호트 위험 분포 — Recharts Stacked Bar
// SSOT: specs/003-frontend/analytics-spec.md 섹션 2.2

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  week: string;
  stable: number;
  warning: number;
  at_risk: number;
}

export function CohortRiskChart({ data }: { data: WeeklyData[] }) {
  return (
    <div className="card p-8">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-6">주차별 위험 분포</h3>
      <div className="chart-container" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="week" tick={{ fill: '#615d59', fontSize: 12 }} />
            <YAxis tick={{ fill: '#615d59', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(49,48,46,0.95)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              formatter={(value: string) => {
                const labels: Record<string, string> = { stable: '안정', warning: '주의', at_risk: '위험' };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="stable" stackId="a" fill="var(--status-stable)" radius={[0, 0, 0, 0]} name="stable" />
            <Bar dataKey="warning" stackId="a" fill="var(--status-warning)" name="warning" />
            <Bar dataKey="at_risk" stackId="a" fill="var(--status-risk)" radius={[4, 4, 0, 0]} name="at_risk" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
