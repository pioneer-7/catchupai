// GET /api/v1/students — 학생 목록 (인증 필요)
// SSOT: specs/004-backend/api-versioning-spec.md, api-auth-spec.md

import { type NextRequest } from 'next/server';
import { studentService } from '@/services/student.service';
import { validateApiKey } from '@/lib/api-auth';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import type { RiskLevel } from '@/types';

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { searchParams } = request.nextUrl;
  const data = await studentService.getStudentList({
    risk_level: (searchParams.get('risk_level') as RiskLevel) || undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'risk_score',
    order: (searchParams.get('order') || 'desc') as 'asc' | 'desc',
  });

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
  });
}
