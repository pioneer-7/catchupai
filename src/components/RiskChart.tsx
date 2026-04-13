'use client';

// 위험도 분포 도넛 차트 — 순수 SVG (라이브러리 불필요)

import { useState } from 'react';

interface ChartData {
  stable: number;
  warning: number;
  at_risk: number;
}

const SEGMENTS: { key: keyof ChartData; label: string; color: string }[] = [
  { key: 'at_risk', label: '위험', color: 'var(--status-risk)' },
  { key: 'warning', label: '주의', color: 'var(--status-warning)' },
  { key: 'stable', label: '안정', color: 'var(--status-stable)' },
];

export function RiskChart({ data, total }: { data: ChartData; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (total === 0) return null;

  const cx = 80, cy = 80, r = 60;
  const circumference = 2 * Math.PI * r;
  const arcs = SEGMENTS.reduce<Array<(typeof SEGMENTS)[number] & {
    value: number;
    ratio: number;
    length: number;
    offset: number;
  }>>((acc, seg) => {
    const offset = acc.reduce((sum, arc) => sum + arc.length, 0);
    const value = data[seg.key];
    const ratio = value / total;
    const length = ratio * circumference;
    if (value > 0) {
      acc.push({ ...seg, value, ratio, length, offset });
    }
    return acc;
  }, []);

  return (
    <div className="card p-8">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-6">위험도 분포</h3>
      <div className="flex items-center justify-center gap-8">
        {/* SVG Donut */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-warm)" strokeWidth="20" />
            {/* Segments */}
            {arcs.map(arc => (
              <circle
                key={arc.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth={hovered === arc.key ? 24 : 20}
                strokeDasharray={`${arc.length} ${circumference - arc.length}`}
                strokeDashoffset={-arc.offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: 'stroke-width 0.2s ease' }}
                onMouseEnter={() => setHovered(arc.key)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold num-display">{total}</span>
            <span className="text-xs text-[var(--text-muted)]">전체</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {arcs.map(arc => (
            <div
              key={arc.key}
              className={`flex items-center gap-3 transition-opacity ${
                hovered && hovered !== arc.key ? 'opacity-40' : ''
              }`}
              onMouseEnter={() => setHovered(arc.key)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: arc.color }}
              />
              <div>
                <span className="text-sm font-semibold">{arc.label}</span>
                <span className="text-sm text-[var(--text-muted)] ml-2">
                  {arc.value}명 ({Math.round(arc.ratio * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
