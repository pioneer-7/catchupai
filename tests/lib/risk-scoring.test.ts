// risk-scoring 유닛 테스트
// SSOT: specs/001-domain/risk-scoring.md

import { describe, it, expect } from 'vitest';
import { calculateRisk, calculateScoreDelta, recalculateLevel } from '@/lib/risk-scoring';

describe('calculateRisk', () => {
  it('모든 값 양호 → stable', () => {
    const result = calculateRisk({
      attendance_rate: 95, missed_sessions: 0,
      assignment_submission_rate: 90, avg_quiz_score: 85, last_active_days_ago: 1,
    });
    expect(result.risk_score).toBe(0);
    expect(result.risk_level).toBe('stable');
    expect(result.risk_factors).toHaveLength(0);
  });

  it('결석 + 활동공백 → warning', () => {
    const result = calculateRisk({
      attendance_rate: 90, missed_sessions: 2,
      assignment_submission_rate: 85, avg_quiz_score: 80, last_active_days_ago: 5,
    });
    // missed_sessions=2 → 25, last_active_days_ago>=4 → 10 = 35 → warning
    expect(result.risk_level).toBe('warning');
    expect(result.risk_factors.some(f => f.type === 'attendance')).toBe(true);
  });

  it('복합 악화 → at_risk', () => {
    const result = calculateRisk({
      attendance_rate: 62, missed_sessions: 2,
      assignment_submission_rate: 45, avg_quiz_score: 58, last_active_days_ago: 9,
    });
    expect(result.risk_level).toBe('at_risk');
    expect(result.risk_score).toBeGreaterThanOrEqual(60);
  });

  it('총점 100 초과 시 clamp', () => {
    const result = calculateRisk({
      attendance_rate: 48, missed_sessions: 3,
      assignment_submission_rate: 30, avg_quiz_score: 35, last_active_days_ago: 16,
    });
    expect(result.risk_score).toBe(100);
  });

  it('경계값: attendance_rate 85 → +0', () => {
    const result = calculateRisk({
      attendance_rate: 85, missed_sessions: 0,
      assignment_submission_rate: 90, avg_quiz_score: 80, last_active_days_ago: 0,
    });
    expect(result.risk_score).toBe(0);
  });

  it('경계값: attendance_rate 84 → +8', () => {
    const result = calculateRisk({
      attendance_rate: 84, missed_sessions: 0,
      assignment_submission_rate: 90, avg_quiz_score: 80, last_active_days_ago: 0,
    });
    expect(result.risk_score).toBe(8);
  });
});

describe('calculateScoreDelta', () => {
  it('3 correct → -20', () => expect(calculateScoreDelta(3)).toBe(-20));
  it('2 correct → -10', () => expect(calculateScoreDelta(2)).toBe(-10));
  it('1 correct → 0', () => expect(calculateScoreDelta(1)).toBe(0));
  it('0 correct → 0', () => expect(calculateScoreDelta(0)).toBe(0));
});

describe('recalculateLevel', () => {
  it('60+ → at_risk', () => expect(recalculateLevel(60)).toBe('at_risk'));
  it('30-59 → warning', () => expect(recalculateLevel(45)).toBe('warning'));
  it('0-29 → stable', () => expect(recalculateLevel(20)).toBe('stable'));
  it('negative clamp → stable', () => expect(recalculateLevel(-5)).toBe('stable'));
});
