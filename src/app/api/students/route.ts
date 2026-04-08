// GET /api/students — 학생 목록 조회
import { type NextRequest } from 'next/server';
import { studentService } from '@/services/student.service';
import { successResponse } from '@/lib/api-helpers';
import type { RiskLevel } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const data = await studentService.getStudentList({
    risk_level: (searchParams.get('risk_level') as RiskLevel) || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'risk_score',
    order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
  });
  return successResponse(data);
}
