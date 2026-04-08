// POST /api/students/[id]/prediction — AI 이탈 예측
// SSOT: specs/005-ai/prediction-spec.md

import { type NextRequest } from 'next/server';
import { predictionService } from '@/services/prediction.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const prediction = await predictionService.generate(id);
    return successResponse(prediction);
  } catch (error) {
    if (error instanceof Error && error.message === 'STUDENT_NOT_FOUND')
      return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    console.error('Prediction error:', error);
    return errorResponse('INTERNAL_ERROR', '예측 생성 중 오류가 발생했습니다', 500);
  }
}
