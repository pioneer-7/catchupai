// GET /api/analytics — 교육 분석 데이터
// SSOT: specs/003-frontend/analytics-spec.md 섹션 3

import { progressRepository } from '@/repositories/progress.repository';
import { successResponse } from '@/lib/api-helpers';

export async function GET() {
  const summary = await progressRepository.countByRiskLevel();
  const total = summary.stable + summary.warning + summary.at_risk;

  // 합성 퍼널 데이터 (실제 운영에서는 이벤트 로그 기반)
  const riskDetected = summary.warning + summary.at_risk;
  const funnel = {
    enrolled: total,
    risk_detected: riskDetected,
    intervention_sent: Math.max(1, Math.round(riskDetected * 0.8)),
    recovered: Math.max(0, Math.round(riskDetected * 0.3)),
    still_at_risk: summary.at_risk,
    dropped: Math.max(0, Math.round(summary.at_risk * 0.2)),
  };

  // 합성 4주 코호트 데이터
  const cohort_weekly = [
    { week: '1주차', stable: Math.min(total, total - 1), warning: 1, at_risk: 0 },
    { week: '2주차', stable: Math.max(0, total - 3), warning: 2, at_risk: 1 },
    { week: '3주차', stable: summary.stable + 1, warning: summary.warning, at_risk: Math.max(1, summary.at_risk - 1) },
    { week: '4주차 (현재)', stable: summary.stable, warning: summary.warning, at_risk: summary.at_risk },
  ];

  // 합성 개입 효과 데이터
  const intervention_effect = [
    { name: '김민수', before: 100, after: 80 },
    { name: '최수아', before: 100, after: 90 },
    { name: '한예린', before: 83, after: 55 },
    { name: '정도윤', before: 50, after: 35 },
    { name: '박서준', before: 48, after: 30 },
  ];

  return successResponse({ funnel, cohort_weekly, intervention_effect, summary: { ...summary, total } });
}
