// POST /api/students/[id]/mini-assessment — 미니 진단 생성
// SSOT: specs/004-backend/api-spec.md 섹션 2.3

import { type NextRequest } from 'next/server';
import { getStudentDetail, getFirstCourse, addMiniAssessment } from '@/lib/store';
import { buildAiContext, generateMiniAssessment } from '@/lib/ai';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import type { MiniAssessment } from '@/types';

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
    const conceptsSummary = data.recovery_plans[0]?.missed_concepts_summary || '최근 수업에서 다룬 핵심 개념';
    const result = await generateMiniAssessment(ctx, conceptsSummary);

    const assessment: MiniAssessment = {
      id: crypto.randomUUID(),
      student_id: id,
      course_id: course?.id || '',
      questions_json: result.questions as MiniAssessment['questions_json'],
      answer_key_json: result.answer_key,
      explanation_json: result.explanations,
      submitted_answers_json: null,
      score: null,
      submitted_at: null,
      created_at: new Date().toISOString(),
    };

    addMiniAssessment(assessment);
    return successResponse(assessment);
  } catch (error) {
    console.error('Mini assessment error:', error);
    return errorResponse('INTERNAL_ERROR', '미니 진단 생성 중 오류가 발생했습니다', 500);
  }
}
