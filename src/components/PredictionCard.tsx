// AI 이탈 예측 결과 카드
// SSOT: specs/005-ai/prediction-spec.md 섹션 5

import { TrendingUp, ArrowRight, TrendingDown, AlertTriangle } from 'lucide-react';
import type { RiskPrediction } from '@/types';

const LEVEL_CONFIG = {
  critical: { label: '매우 위험', color: 'var(--status-risk)', bg: 'var(--status-risk-bg)' },
  high: { label: '위험', color: 'var(--status-risk)', bg: 'var(--status-risk-bg)' },
  medium: { label: '주의', color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
  low: { label: '안정', color: 'var(--status-stable)', bg: 'var(--status-stable-bg)' },
};

const TRAJECTORY_CONFIG = {
  improving: { label: '개선 중', icon: TrendingUp, color: 'var(--status-stable)' },
  stable: { label: '유지', icon: ArrowRight, color: 'var(--text-secondary)' },
  declining: { label: '악화 중', icon: TrendingDown, color: 'var(--status-warning)' },
  critical_decline: { label: '급격 악화', icon: AlertTriangle, color: 'var(--status-risk)' },
};

export function PredictionCard({ prediction }: { prediction: RiskPrediction }) {
  const level = LEVEL_CONFIG[prediction.risk_level];
  const p = prediction;

  return (
    <div className="space-y-6">
      {/* Risk Score + Level */}
      <div className="card p-8 text-center">
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">AI 위험 평가</p>
        <p className="text-5xl font-bold num-display" style={{ color: level.color }}>
          {Math.round(p.dropout_risk_score * 100)}%
        </p>
        <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: level.bg, color: level.color }}>
          {level.label}
        </span>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          {(() => {
            const t = TRAJECTORY_CONFIG[p.trajectory];
            return (
              <span className="flex items-center gap-1" style={{ color: t.color, fontWeight: 510 }}>
                <t.icon size={14} strokeWidth={2} /> {t.label}
              </span>
            );
          })()}
          {p.weeks_to_likely_dropout && <span className="text-[var(--text-muted)]">· 예상 이탈까지 {p.weeks_to_likely_dropout}주</span>}
        </div>
      </div>

      {/* Risk Factors */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">주요 위험 요인</h3>
        <div className="space-y-2">
          {p.primary_risk_factors.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[var(--status-risk)] mt-0.5">●</span>
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intervention Impact */}
      {p.intervention_impact && (
        <div className="card p-6 border-l-4 border-l-[var(--accent)]">
          <h3 className="text-sm font-semibold text-[var(--accent)] mb-2">개입 효과 예측</h3>
          <p className="text-sm leading-relaxed">{p.intervention_impact}</p>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">권장 조치</h3>
        <div className="space-y-2">
          {p.recommended_actions.map((a, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-white text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-sm">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence */}
      <p className="text-xs text-[var(--text-muted)] text-center">
        평가 근거: {p.confidence_basis === 'behavioral_signals_only' ? '행동 데이터 기반' : '데이터 부족'} · AI 생성 평가
      </p>
    </div>
  );
}
