'use client';

// 이탈 퍼널 차트 — 수평 바 형태
// SSOT: specs/003-frontend/analytics-spec.md 섹션 2.1

interface FunnelData {
  enrolled: number;
  risk_detected: number;
  intervention_sent: number;
  recovered: number;
  still_at_risk: number;
  dropped: number;
}

const STAGES = [
  { key: 'enrolled', label: '전체 등록', color: 'var(--chart-series-1)' },
  { key: 'risk_detected', label: '위험 감지', color: 'var(--chart-series-3)' },
  { key: 'intervention_sent', label: '개입 진행', color: 'var(--chart-series-5)' },
  { key: 'recovered', label: '회복', color: 'var(--chart-series-2)' },
] as const;

export function DropoutFunnel({ data }: { data: FunnelData }) {
  const max = data.enrolled || 1;

  return (
    <div className="card p-8">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-6">이탈 퍼널</h3>
      <div className="space-y-4">
        {STAGES.map(stage => {
          const value = data[stage.key as keyof FunnelData];
          const pct = Math.round((value / max) * 100);
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium">{stage.label}</span>
                <span className="font-bold num-display">{value}명 <span className="text-[var(--text-muted)] font-normal">({pct}%)</span></span>
              </div>
              <div className="h-8 rounded-full bg-[var(--bg-warm)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: stage.color }}
                />
              </div>
            </div>
          );
        })}
        {/* 결과 분기 */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
          <div className="stat-box">
            <div className="stat-box-label">이탈 위험 지속</div>
            <div className="stat-box-value" style={{ color: 'var(--status-risk)' }}>{data.still_at_risk}</div>
          </div>
          <div className="stat-box">
            <div className="stat-box-label">이탈</div>
            <div className="stat-box-value" style={{ color: 'var(--status-risk)' }}>{data.dropped}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
