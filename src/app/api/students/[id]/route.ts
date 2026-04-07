// GET /api/students/[id] — 학생 상세 조회
// SSOT: specs/004-backend/api-spec.md 섹션 2.2

import { type NextRequest } from 'next/server';
import { getStudentDetail } from '@/lib/store';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const data = getStudentDetail(id);

  if (!data) {
    return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
  }

  return successResponse(data);
}
