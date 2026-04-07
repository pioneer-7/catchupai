// POST /api/students/[id]/recovery-plan — 회복학습 킷 생성
// SSOT: specs/004-backend/api-spec.md 섹션 2.3

import { type NextRequest } from 'next/server';
import { getStudentDetail, getFirstCourse, addRecoveryPlan } from '@/lib/store';
import { buildAiContext, generateRecoveryPlan } from '@/lib/ai';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import type { RecoveryPlan } from '@/types';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = getStudentDetail(id);
    if (!data) return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);

    const course = getFirstCourse();
    const ctx = buildAiContext(data.student, data.progress, course);
    const result = await generateRecoveryPlan(ctx);

    const plan: RecoveryPlan = {
      id: crypto.randomUUID(),
      student_id: id,
      course_id: course?.id || '',
      missed_concepts_summary: result.missed_concepts_summary,
      recovery_steps_json: result.recovery_steps,
      action_plan_text: result.action_plan_text,
      caution_points_text: result.caution_points_text,
      created_at: new Date().toISOString(),
    };

    addRecoveryPlan(plan);
    return successResponse(plan);
  } catch (error) {
    console.error('Recovery plan error:', error);
    return errorResponse('INTERNAL_ERROR', '회복학습 생성 중 오류가 발생했습니다', 500);
  }
}
