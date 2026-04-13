'use client';

// 개입 효과 차트 — Before/After Dot Plot
// SSOT: specs/003-frontend/analytics-spec.md 섹션 2.3

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import type { TooltipPayloadEntry, TooltipValueType } from 'recharts';
import type { ReactNode } from 'react';

interface EffectData {
  name: string;
  before: number;
  after: number;
}

export function InterventionEffectChart({ data }: { data: EffectData[] }) {
  const chartData = data.map(d => ({ ...d, x: d.before, y: d.after }));

  return (
    <div className="card p-8">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">개입 효과</h3>
      <p className="text-xs text-[var(--text-muted)] mb-6">대각선 아래 = 개선 (risk 감소)</p>
      <div className="chart-container" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              type="number" dataKey="x" name="개입 전"
              domain={[0, 100]}
              tick={{ fill: '#615d59', fontSize: 12 }}
              label={{ value: '개입 전 risk score', position: 'bottom', offset: -5, fill: '#615d59', fontSize: 11 }}
            />
            <YAxis
              type="number" dataKey="y" name="개입 후"
              domain={[0, 100]}
              tick={{ fill: '#615d59', fontSize: 12 }}
              label={{ value: '개입 후', angle: -90, position: 'insideLeft', fill: '#615d59', fontSize: 11 }}
            />
            <ReferenceLine
              segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]}
              stroke="var(--border)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip
              contentStyle={{ background: 'rgba(49,48,46,0.95)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13 }}
              formatter={(value, name) => [value, name === 'x' ? '개입 전' : '개입 후']}
              labelFormatter={(_label: ReactNode, payload: ReadonlyArray<TooltipPayloadEntry<TooltipValueType, string | number>>) => {
                const name = payload[0]?.payload?.name;
                if (typeof name === 'string') return name;
                return '';
              }}
            />
            <Scatter data={chartData} fill="var(--chart-series-1)">
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.after < entry.before ? 'var(--status-stable)' : 'var(--status-risk)'}
                  r={7}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex gap-6 justify-center mt-4 text-xs">
        {data.map(d => (
          <span key={d.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.after < d.before ? 'var(--status-stable)' : 'var(--status-risk)' }} />
            {d.name} ({d.before}→{d.after})
          </span>
        ))}
      </div>
    </div>
  );
}
