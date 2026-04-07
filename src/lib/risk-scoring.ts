// 위험도 계산 (규칙기반, deterministic)
// SSOT: specs/001-domain/risk-scoring.md
// IMPORTANT: AI는 이 계산을 하지 않는다

import type { RiskFactor, RiskLevel } from '@/types';

export interface RiskInput {
  attendance_rate: number;
  missed_sessions: number;
  assignment_submission_rate: number;
  avg_quiz_score: number;
  last_active_days_ago: number;
}

export interface RiskResult {
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
}

export function calculateRisk(input: RiskInput): RiskResult {
  let score = 0;
  const riskFactors: RiskFactor[] = [];

  // A1. 결석 횟수
  if (input.missed_sessions >= 3) {
    score += 30;
    riskFactors.push({ type: 'attendance', label: '최근 결석 3회 이상', score: 30 });
  } else if (input.missed_sessions === 2) {
    score += 25;
    riskFactors.push({ type: 'attendance', label: '최근 결석 2회', score: 25 });
  } else if (input.missed_sessions === 1) {
    score += 10;
    riskFactors.push({ type: 'attendance', label: '최근 결석 1회', score: 10 });
  }

  // A2. 출석률
  if (input.attendance_rate < 50) {
    score += 25;
    riskFactors.push({ type: 'attendance', label: '출석률 50% 미만', score: 25 });
  } else if (input.attendance_rate < 70) {
    score += 15;
    riskFactors.push({ type: 'attendance', label: '출석률 70% 미만', score: 15 });
  } else if (input.attendance_rate < 85) {
    score += 8;
    riskFactors.push({ type: 'attendance', label: '출석률 85% 미만', score: 8 });
  }

  // B1. 과제 제출률
  if (input.assignment_submission_rate < 40) {
    score += 30;
    riskFactors.push({ type: 'assignment', label: '과제 제출률 40% 미만', score: 30 });
  } else if (input.assignment_submission_rate < 60) {
    score += 25;
    riskFactors.push({ type: 'assignment', label: '과제 제출률 60% 미만', score: 25 });
  } else if (input.assignment_submission_rate < 80) {
    score += 10;
    riskFactors.push({ type: 'assignment', label: '과제 제출률 80% 미만', score: 10 });
  }

  // C1. 퀴즈 평균
  if (input.avg_quiz_score < 40) {
    score += 25;
    riskFactors.push({ type: 'quiz', label: '퀴즈 평균 40점 미만', score: 25 });
  } else if (input.avg_quiz_score < 60) {
    score += 20;
    riskFactors.push({ type: 'quiz', label: '퀴즈 평균 60점 미만', score: 20 });
  } else if (input.avg_quiz_score < 75) {
    score += 10;
    riskFactors.push({ type: 'quiz', label: '퀴즈 평균 75점 미만', score: 10 });
  }

  // D1. 최근 활동 공백
  if (input.last_active_days_ago > 14) {
    score += 25;
    riskFactors.push({ type: 'activity', label: '최근 활동 없음 14일 초과', score: 25 });
  } else if (input.last_active_days_ago >= 8) {
    score += 20;
    riskFactors.push({ type: 'activity', label: '최근 활동 없음 8일 이상', score: 20 });
  } else if (input.last_active_days_ago >= 4) {
    score += 10;
    riskFactors.push({ type: 'activity', label: '최근 활동 없음 4일 이상', score: 10 });
  }

  // E1. 동시 악화 보정 (2개 이상 → +10)
  const compoundFlags = [
    input.missed_sessions >= 2,
    input.assignment_submission_rate < 60,
    input.avg_quiz_score < 60,
    input.last_active_days_ago > 7,
  ].filter(Boolean).length;

  if (compoundFlags >= 2) {
    score += 10;
    riskFactors.push({ type: 'compound', label: '여러 위험 지표 동시 악화', score: 10 });
  }

  // E2. 고위험 집중 보정 (3개 이상 → +10)
  const severeFlags = [
    input.attendance_rate < 70,
    input.assignment_submission_rate < 60,
    input.avg_quiz_score < 60,
    input.last_active_days_ago > 7,
  ].filter(Boolean).length;

  if (severeFlags >= 3) {
    score += 10;
    riskFactors.push({ type: 'compound', label: '고위험 지표 집중 발생', score: 10 });
  }

  const risk_score = Math.min(100, score);
  const risk_level: RiskLevel =
    risk_score >= 60 ? 'at_risk' : risk_score >= 30 ? 'warning' : 'stable';

  return { risk_score, risk_level, risk_factors: riskFactors };
}

// 미니 진단 후 점수 갱신
// SSOT: specs/001-domain/risk-scoring.md 섹션 9
export function calculateScoreDelta(correctCount: number): number {
  if (correctCount >= 3) return -20;
  if (correctCount === 2) return -10;
  return 0;
}

export function recalculateLevel(score: number): RiskLevel {
  const clamped = Math.max(0, Math.min(100, score));
  return clamped >= 60 ? 'at_risk' : clamped >= 30 ? 'warning' : 'stable';
}
