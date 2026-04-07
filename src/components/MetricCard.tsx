// 학습 지표 카드 — Notion metric card 패턴
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
      className={`rounded-xl border bg-white p-5 ${
        alert ? 'border-[#d32f2f]/30 bg-[#ffebee]/30' : 'border-black/10'
      }`}
      style={{
        boxShadow:
          'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px',
      }}
    >
      <p className="text-sm font-medium text-[#615d59]">{title}</p>
      <p className="mt-1">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <span className="ml-1 text-sm text-[#a39e98]">{unit}</span>
      </p>
    </div>
  );
}
