// POST /api/students/[id]/mini-assessment — 미니 진단 생성
import { type NextRequest } from 'next/server';
import { assessmentService } from '@/services/assessment.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const assessment = await assessmentService.generate(id);
    return successResponse(assessment);
  } catch (error) {
    if (error instanceof Error && error.message === 'STUDENT_NOT_FOUND') {
      return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    }
    console.error('Mini assessment error:', error);
    return errorResponse('INTERNAL_ERROR', '미니 진단 생성 중 오류가 발생했습니다', 500);
  }
}
