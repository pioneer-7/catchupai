'use client';

// 교육 분석 대시보드
// SSOT: specs/003-frontend/analytics-spec.md

import { useEffect, useState } from 'react';
import { DropoutFunnel } from '@/components/DropoutFunnel';
import { CohortRiskChart } from '@/components/CohortRiskChart';
import { InterventionEffectChart } from '@/components/InterventionEffectChart';
import { FadeIn } from '@/components/FadeIn';

interface AnalyticsData {
  funnel: { enrolled: number; risk_detected: number; intervention_sent: number; recovered: number; still_at_risk: number; dropped: number };
  cohort_weekly: { week: string; stable: number; warning: number; at_risk: number }[];
  intervention_effect: { name: string; before: number; after: number }[];
  summary: { stable: number; warning: number; at_risk: number; total: number };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(json => { if (json.success) setData(json.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl heading-md mb-8">교육 분석</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-64 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse" />)}
        </div>
      </main>
    );
  }

  if (!data || data.summary.total === 0) {
    return (
      <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl heading-md mb-8">교육 분석</h1>
        <div className="card p-16 text-center">
          <p className="text-[var(--text-secondary)]">분석할 데이터가 없습니다. 먼저 샘플 데이터를 로드해주세요.</p>
        </div>
      </main>
    );
  }

  const recoveryRate = data.funnel.intervention_sent > 0
    ? Math.round((data.funnel.recovered / data.funnel.intervention_sent) * 100)
    : 0;

  const avgReduction = data.intervention_effect.length > 0
    ? Math.round(data.intervention_effect.reduce((sum, d) => sum + (d.before - d.after), 0) / data.intervention_effect.length)
    : 0;

  const bestImproved = data.intervention_effect.length > 0
    ? data.intervention_effect.reduce((best, d) => (d.before - d.after) > (best.before - best.after) ? d : best)
    : null;

  return (
    <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-2">교육 분석</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">학생 이탈 과정과 개입 효과를 시각적으로 확인합니다.</p>

      {/* Summary Stat Boxes */}
      <FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="stat-box">
            <div className="stat-box-label">회복률</div>
            <div className="stat-box-value" style={{ color: 'var(--status-stable)' }}>{recoveryRate}%</div>
            <div className="stat-box-change positive">개입 학생 중 {data.funnel.recovered}명 회복</div>
          </div>
          <div className="stat-box">
            <div className="stat-box-label">평균 위험도 감소</div>
            <div className="stat-box-value" style={{ color: 'var(--accent)' }}>-{avgReduction}</div>
            <div className="stat-box-change positive">개입 후 평균 risk score 변화</div>
          </div>
          <div className="stat-box">
            <div className="stat-box-label">가장 개선된 학생</div>
            <div className="stat-box-value">{bestImproved?.name || '-'}</div>
            {bestImproved && <div className="stat-box-change positive">{bestImproved.before} → {bestImproved.after} (-{bestImproved.before - bestImproved.after})</div>}
          </div>
        </div>
      </FadeIn>

      {/* Funnel */}
      <FadeIn delay={100}>
        <div className="mb-10">
          <DropoutFunnel data={data.funnel} />
        </div>
      </FadeIn>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={200}>
          <CohortRiskChart data={data.cohort_weekly} />
        </FadeIn>
        <FadeIn delay={300}>
          <InterventionEffectChart data={data.intervention_effect} />
        </FadeIn>
      </div>
    </main>
  );
}
