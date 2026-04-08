// Zod validation 유닛 테스트
// SSOT: specs/004-backend/validation-spec.md

import { describe, it, expect } from 'vitest';
import { AssessmentSubmitSchema, StudentUploadRowSchema, MessageTypeSchema } from '@/lib/validation';

describe('AssessmentSubmitSchema', () => {
  it('유효한 입력 통과', () => {
    const result = AssessmentSubmitSchema.safeParse({
      assessment_id: '550e8400-e29b-41d4-a716-446655440000',
      answers: [{ id: 1, answer: '예측' }],
    });
    expect(result.success).toBe(true);
  });

  it('assessment_id 없으면 실패', () => {
    const result = AssessmentSubmitSchema.safeParse({ answers: [{ id: 1, answer: 'a' }] });
    expect(result.success).toBe(false);
  });

  it('빈 답변 배열 실패', () => {
    const result = AssessmentSubmitSchema.safeParse({
      assessment_id: '550e8400-e29b-41d4-a716-446655440000',
      answers: [],
    });
    expect(result.success).toBe(false);
  });

  it('빈 answer 문자열 실패', () => {
    const result = AssessmentSubmitSchema.safeParse({
      assessment_id: '550e8400-e29b-41d4-a716-446655440000',
      answers: [{ id: 1, answer: '' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('StudentUploadRowSchema', () => {
  it('유효한 행 통과', () => {
    const result = StudentUploadRowSchema.safeParse({
      student_name: '김민수', attendance_rate: '62', missed_sessions: '2',
      assignment_submission_rate: '45', avg_quiz_score: '58', last_active_days_ago: '9',
    });
    expect(result.success).toBe(true);
  });

  it('attendance_rate 범위 초과 실패', () => {
    const result = StudentUploadRowSchema.safeParse({
      student_name: '김민수', attendance_rate: '150', missed_sessions: '0',
      assignment_submission_rate: '90', avg_quiz_score: '80', last_active_days_ago: '1',
    });
    expect(result.success).toBe(false);
  });

  it('student_name 없으면 실패', () => {
    const result = StudentUploadRowSchema.safeParse({
      student_name: '', attendance_rate: '80', missed_sessions: '0',
      assignment_submission_rate: '90', avg_quiz_score: '80', last_active_days_ago: '1',
    });
    expect(result.success).toBe(false);
  });
});

describe('MessageTypeSchema', () => {
  it('teacher 통과', () => {
    expect(MessageTypeSchema.safeParse({ message_type: 'teacher' }).success).toBe(true);
  });
  it('잘못된 타입 → 기본값', () => {
    const result = MessageTypeSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.message_type).toBe('teacher');
  });
});
