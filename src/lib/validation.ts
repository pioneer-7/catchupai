// Zod 입력 검증 스키마
import { z } from 'zod';

export const AssessmentSubmitSchema = z.object({
  assessment_id: z.string().uuid(),
  answers: z.array(z.object({
    id: z.number(),
    answer: z.string().min(1, '답변을 입력해주세요'),
  })).min(1),
});

export const StudentUploadRowSchema = z.object({
  student_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal('')),
  cohort_name: z.string().optional(),
  attendance_rate: z.coerce.number().min(0).max(100),
  missed_sessions: z.coerce.number().int().min(0),
  assignment_submission_rate: z.coerce.number().min(0).max(100),
  avg_quiz_score: z.coerce.number().min(0).max(100),
  last_active_days_ago: z.coerce.number().int().min(0),
  notes: z.string().optional(),
});

export const WebhookRegisterSchema = z.object({
  url: z.string().url(),
  events: z.array(z.enum([
    'student.risk_level_changed',
    'recovery_plan.created',
    'assessment.submitted',
    'student.imported',
  ])).min(1),
  secret: z.string().min(8).optional(),
});

export const MessageTypeSchema = z.object({
  message_type: z.enum(['teacher', 'operator', 'student_support']).default('teacher'),
});

export type AssessmentSubmitInput = z.infer<typeof AssessmentSubmitSchema>;
export type StudentUploadRow = z.infer<typeof StudentUploadRowSchema>;
export type WebhookRegisterInput = z.infer<typeof WebhookRegisterSchema>;
