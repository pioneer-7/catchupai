// POST /api/v1/students/[id]/mini-assessment/submit
// SSOT: specs/004-backend/api-versioning-spec.md

import { type NextRequest } from 'next/server';
import { assessmentService } from '@/services/assessment.service';
import { validateApiKey } from '@/lib/api-auth';
import { AssessmentSubmitSchema } from '@/lib/validation';
import { errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = AssessmentSubmitSchema.safeParse(body);
    if (!parsed.success) return errorResponse('VALIDATION_ERROR', parsed.error.issues[0].message, 400);

    const result = await assessmentService.submit(id, parsed.data.assessment_id, parsed.data.answers);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'STUDENT_NOT_FOUND') return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    if (msg === 'ASSESSMENT_NOT_FOUND') return errorResponse('NOT_FOUND', '진단을 찾을 수 없습니다', 404);
    return errorResponse('INTERNAL_ERROR', '진단 제출 중 오류가 발생했습니다', 500);
  }
}
