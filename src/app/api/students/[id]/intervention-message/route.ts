// POST /api/students/[id]/intervention-message — 개입 메시지 생성
// SSOT: specs/004-backend/api-spec.md 섹션 2.3

import { type NextRequest } from 'next/server';
import { getStudentDetail, getFirstCourse, addInterventionMessage } from '@/lib/store';
import { buildAiContext, generateInterventionMessage } from '@/lib/ai';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import type { InterventionMessage } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const data = getStudentDetail(id);
    if (!data) return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);

    let messageType: 'teacher' | 'operator' | 'student_support' = 'teacher';
    try {
      const body = await request.json();
      if (body.message_type) messageType = body.message_type;
    } catch {
      // no body — use default
    }

    const course = getFirstCourse();
    const ctx = buildAiContext(data.student, data.progress, course);
    const conceptsSummary = data.recovery_plans[0]?.missed_concepts_summary;
    const result = await generateInterventionMessage(ctx, conceptsSummary);

    const msg: InterventionMessage = {
      id: crypto.randomUUID(),
      student_id: id,
      course_id: course?.id || '',
      message_type: messageType,
      content: result.message,
      created_at: new Date().toISOString(),
    };

    addInterventionMessage(msg);
    return successResponse(msg);
  } catch (error) {
    console.error('Intervention message error:', error);
    return errorResponse('INTERNAL_ERROR', '메시지 생성 중 오류가 발생했습니다', 500);
  }
}
