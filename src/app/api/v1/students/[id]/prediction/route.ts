// POST /api/v1/students/[id]/prediction — AI 이탈 예측 (v1, 인증)
// SSOT: specs/005-ai/prediction-spec.md

import { type NextRequest } from 'next/server';
import { predictionService } from '@/services/prediction.service';
import { validateApiKey } from '@/lib/api-auth';
import { errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { id } = await params;
  try {
    const prediction = await predictionService.generate(id);
    return new Response(JSON.stringify({ success: true, data: prediction }), {
      headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'STUDENT_NOT_FOUND')
      return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    return errorResponse('INTERNAL_ERROR', '예측 생성 중 오류가 발생했습니다', 500);
  }
}
