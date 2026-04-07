'use client';

// KPI 카드 — Notion 카드 스타일 + AnimatedNumber
// SSOT: specs/003-frontend/dashboard-spec.md

import { AnimatedNumber } from '@/components/AnimatedNumber';

const colorMap = {
  gray: 'border-l-[var(--text-secondary)]',
  green: 'border-l-[var(--status-stable)]',
  amber: 'border-l-[var(--status-warning)]',
  red: 'border-l-[var(--status-risk)]',
};

export function KpiCard({
  title,
  value,
  color = 'gray',
}: {
  title: string;
  value: number;
  color?: 'gray' | 'green' | 'amber' | 'red';
}) {
  return (
    <div className={`card p-6 border-l-4 ${colorMap[color]}`}>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}
