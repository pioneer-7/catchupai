'use client';

// KPI 카드 — Notion+Linear 하이브리드 + AnimatedNumber + lucide 아이콘
// SSOT: specs/003-frontend/dashboard-spec.md

import { AnimatedNumber } from '@/components/AnimatedNumber';
import type { LucideIcon } from 'lucide-react';

const colorMap = {
  gray: { border: 'border-l-[var(--text-secondary)]', iconBg: 'var(--tint-gray)', iconColor: 'var(--tint-gray-text)' },
  green: { border: 'border-l-[var(--status-stable)]', iconBg: 'var(--status-stable-bg)', iconColor: 'var(--status-stable)' },
  amber: { border: 'border-l-[var(--status-warning)]', iconBg: 'var(--status-warning-bg)', iconColor: 'var(--status-warning)' },
  red: { border: 'border-l-[var(--status-risk)]', iconBg: 'var(--status-risk-bg)', iconColor: 'var(--status-risk)' },
};

export function KpiCard({
  title,
  value,
  color = 'gray',
  icon: Icon,
}: {
  title: string;
  value: number;
  color?: 'gray' | 'green' | 'amber' | 'red';
  icon?: LucideIcon;
}) {
  const c = colorMap[color];

  return (
    <div className={`card p-6 border-l-4 ${c.border}`}>
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-[var(--text-secondary)]" style={{ fontWeight: 510 }}>{title}</p>
        {Icon && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.iconBg }}>
            <Icon size={16} style={{ color: c.iconColor }} strokeWidth={1.8} />
          </div>
        )}
      </div>
      <p className="mt-3 text-4xl tracking-tight" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}
