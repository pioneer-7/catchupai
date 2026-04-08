// GET /api/v1/students/[id] — 학생 상세 (인증 필요)
// SSOT: specs/004-backend/api-versioning-spec.md

import { type NextRequest } from 'next/server';
import { studentService } from '@/services/student.service';
import { validateApiKey } from '@/lib/api-auth';
import { errorResponse } from '@/lib/api-helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { id } = await params;
  const data = await studentService.getStudentDetail(id);
  if (!data) return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
  });
}
