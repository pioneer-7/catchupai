// 학습 지표 카드 — Notion metric card + 디자인 토큰
// SSOT: specs/003-frontend/student-detail-spec.md

export function MetricCard({
  title,
  value,
  unit,
  alert = false,
}: {
  title: string;
  value: number | string;
  unit: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`card p-6 ${
        alert ? 'border-l-4 border-l-[var(--status-risk)] bg-[var(--status-risk-bg)]/20' : ''
      }`}
    >
      <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      <p className="mt-3">
        <span className="text-2xl font-bold tracking-tight num-display">{value}</span>
        <span className="ml-1.5 text-sm text-[var(--text-muted)]">{unit}</span>
      </p>
    </div>
  );
}
