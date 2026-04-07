// GET /api/students — 학생 목록 조회
// SSOT: specs/004-backend/api-spec.md 섹션 2.2

import { type NextRequest } from 'next/server';
import { getStudentList } from '@/lib/store';
import { successResponse } from '@/lib/api-helpers';
import type { RiskLevel } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const risk_level = searchParams.get('risk_level') as RiskLevel | null;
  const search = searchParams.get('search') || undefined;
  const sort = searchParams.get('sort') || 'risk_score';
  const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

  const data = await getStudentList({
    risk_level: risk_level || undefined,
    search,
    sort,
    order,
  });

  return successResponse(data);
}
