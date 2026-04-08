// Rate Limiter — 티어별 AI 호출 한도 체크
// SSOT: specs/004-backend/rate-limit-spec.md

import { usageRepository } from '@/repositories/usage.repository';

const LIMITS: Record<string, Record<string, number>> = {
  free: { ai_generation: 5 },
  pro: { ai_generation: Infinity },
  api: { api_call: 1000 },
};

export async function checkRateLimit(
  orgId: string,
  plan: string,
  endpoint: string
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const category = endpoint.includes('chat') || endpoint.includes('recovery') ||
    endpoint.includes('message') || endpoint.includes('assessment') ||
    endpoint.includes('prediction') ? 'ai_generation' : 'api_call';

  const limit = LIMITS[plan]?.[category] ?? 5;
  if (limit === Infinity) return { allowed: true, current: 0, limit };

  const current = await usageRepository.getTodayCount(orgId, category);
  return { allowed: current < limit, current, limit };
}

export async function trackUsage(orgId: string, endpoint: string): Promise<void> {
  const category = endpoint.includes('chat') || endpoint.includes('recovery') ||
    endpoint.includes('message') || endpoint.includes('assessment') ||
    endpoint.includes('prediction') ? 'ai_generation' : 'api_call';

  await usageRepository.increment(orgId, category);
}
