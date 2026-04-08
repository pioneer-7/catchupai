// GET /api/students/[id] — 학생 상세 조회
import { type NextRequest } from 'next/server';
import { studentService } from '@/services/student.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await studentService.getStudentDetail(id);
  if (!data) return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
  return successResponse(data);
}
