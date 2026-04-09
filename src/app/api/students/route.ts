// GET /api/students — 학생 목록 조회
import { type NextRequest } from 'next/server';
import { studentService } from '@/services/student.service';
import { successResponse } from '@/lib/api-helpers';
import type { RiskLevel } from '@/types';

const VALID_SORT_KEYS = ['risk_score', 'attendance_rate', 'last_active_days_ago', 'created_at', 'name'];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortParam = searchParams.get('sort') || 'risk_score';
  const data = await studentService.getStudentList({
    risk_level: (searchParams.get('risk_level') as RiskLevel) || undefined,
    search: searchParams.get('search') || undefined,
    sort: VALID_SORT_KEYS.includes(sortParam) ? sortParam : 'risk_score',
    order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
  });
  return successResponse(data);
}
