// 위험도 상태 배지 — Notion pill badge 스타일
// SSOT: specs/002-ux/copy-guidelines.md

import type { RiskLevel } from '@/types';

const config: Record<RiskLevel, { label: string; bg: string; text: string }> = {
  stable: { label: '안정', bg: 'bg-[#e8f5e9]', text: 'text-[#1aae39]' },
  warning: { label: '주의', bg: 'bg-[#fff3e0]', text: 'text-[#dd5b00]' },
  at_risk: { label: '위험', bg: 'bg-[#ffebee]', text: 'text-[#d32f2f]' },
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
    ? 'px-2 py-0.5 text-[11px]'
    : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold tracking-wide ${bg} ${text} ${sizeClass}`}>
      {label}
    </span>
  );
}
