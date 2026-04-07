// 위험 요인 태그 — pill 스타일
// SSOT: specs/003-frontend/student-detail-spec.md

import type { RiskFactor } from '@/types';

const typeColors: Record<string, { bg: string; text: string }> = {
  attendance: { bg: 'bg-blue-50', text: 'text-blue-700' },
  assignment: { bg: 'bg-purple-50', text: 'text-purple-700' },
  quiz: { bg: 'bg-orange-50', text: 'text-orange-700' },
  activity: { bg: 'bg-gray-100', text: 'text-gray-700' },
  compound: { bg: 'bg-red-50', text: 'text-red-700' },
};

export function RiskFactorTag({ factor }: { factor: RiskFactor }) {
  const colors = typeColors[factor.type] || typeColors.activity;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {factor.label}
      <span className="opacity-60">+{factor.score}</span>
    </span>
  );
}
