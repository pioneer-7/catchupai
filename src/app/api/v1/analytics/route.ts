// GET /api/v1/analytics — 교육 분석 데이터 (v1, 인증)
// SSOT: specs/003-frontend/analytics-spec.md
import { type NextRequest } from 'next/server';
import { validateApiKey } from '@/lib/api-auth';
import { errorResponse } from '@/lib/api-helpers';
import { GET as getAnalytics } from '@/app/api/analytics/route';

export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);
  return getAnalytics();
}
