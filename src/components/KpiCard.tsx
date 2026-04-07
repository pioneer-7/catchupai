// KPI 카드 — Notion 카드 스타일
// SSOT: specs/003-frontend/dashboard-spec.md

const colorMap = {
  gray: 'border-l-[#615d59]',
  green: 'border-l-[#1aae39]',
  amber: 'border-l-[#dd5b00]',
  red: 'border-l-[#d32f2f]',
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
    <div
      className={`rounded-xl border border-black/10 bg-white p-5 border-l-4 ${colorMap[color]}`}
      style={{
        boxShadow:
          'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px',
      }}
    >
      <p className="text-sm font-medium text-[#615d59]">{title}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
