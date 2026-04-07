// 위험 요인 태그 — warm 팔레트 pill 스타일
// SSOT: specs/003-frontend/student-detail-spec.md

import type { RiskFactor } from '@/types';

const typeColors: Record<string, { bg: string; text: string }> = {
  attendance: { bg: 'bg-[var(--tint-blue)]', text: 'text-[var(--tint-blue-text)]' },
  assignment: { bg: 'bg-[var(--tint-purple)]', text: 'text-[var(--tint-purple-text)]' },
  quiz: { bg: 'bg-[var(--tint-orange)]', text: 'text-[var(--tint-orange-text)]' },
  activity: { bg: 'bg-[var(--tint-gray)]', text: 'text-[var(--tint-gray-text)]' },
  compound: { bg: 'bg-[var(--tint-red)]', text: 'text-[var(--tint-red-text)]' },
};

export function RiskFactorTag({ factor }: { factor: RiskFactor }) {
  const colors = typeColors[factor.type] || typeColors.activity;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {factor.label}
      <span className="opacity-50">+{factor.score}</span>
    </span>
  );
}
