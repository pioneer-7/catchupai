// POST /api/students/[id]/recovery-plan — 회복학습 생성
import { type NextRequest } from 'next/server';
import { recoveryService } from '@/services/recovery.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const plan = await recoveryService.generate(id);
    return successResponse(plan);
  } catch (error) {
    if (error instanceof Error && error.message === 'STUDENT_NOT_FOUND') {
      return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    }
    console.error('Recovery plan error:', error);
    return errorResponse('INTERNAL_ERROR', '회복학습 생성 중 오류가 발생했습니다', 500);
  }
}
