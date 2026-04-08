// POST /api/students/[id]/mini-assessment/submit — 미니 진단 제출 + 채점
import { type NextRequest } from 'next/server';
import { assessmentService } from '@/services/assessment.service';
import { AssessmentSubmitSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = AssessmentSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.issues[0].message, 400);
    }

    const result = await assessmentService.submit(id, parsed.data.assessment_id, parsed.data.answers);
    return successResponse(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'STUDENT_NOT_FOUND') return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    if (msg === 'ASSESSMENT_NOT_FOUND') return errorResponse('NOT_FOUND', '진단을 찾을 수 없습니다', 404);
    console.error('Assessment submit error:', error);
    return errorResponse('INTERNAL_ERROR', '진단 제출 중 오류가 발생했습니다', 500);
  }
}
