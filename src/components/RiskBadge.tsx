// 위험도 상태 배지 — Notion pill badge + 디자인 토큰
// SSOT: specs/002-ux/copy-guidelines.md

import type { RiskLevel } from '@/types';

const config: Record<RiskLevel, { label: string; bg: string; text: string }> = {
  stable: { label: '안정', bg: 'bg-[var(--status-stable-bg)]', text: 'text-[var(--status-stable)]' },
  warning: { label: '주의', bg: 'bg-[var(--status-warning-bg)]', text: 'text-[var(--status-warning)]' },
  at_risk: { label: '위험', bg: 'bg-[var(--status-risk-bg)]', text: 'text-[var(--status-risk)]' },
};

export function RiskBadge({
  level,
  size = 'md',
}: {
  level: RiskLevel;
  size?: 'sm' | 'md';
}) {
  const { label, bg, text } = config[level];
  const sizeClass = size === 'sm'
    ? 'px-2.5 py-0.5 text-[11px]'
    : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold tracking-wide ${bg} ${text} ${sizeClass}`}>
      {label}
    </span>
  );
}
