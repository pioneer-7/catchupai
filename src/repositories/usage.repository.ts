// Usage Repository — API 사용량 추적
// SSOT: specs/004-backend/rate-limit-spec.md

import { db } from '@/lib/supabase';

export const usageRepository = {
  async getTodayCount(orgId: string, endpoint: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await db.from('api_usage')
      .select('count')
      .eq('org_id', orgId)
      .eq('endpoint', endpoint)
      .eq('date', today)
      .single();
    return data?.count || 0;
  },

  async increment(orgId: string, endpoint: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await db.from('api_usage')
      .select('id, count')
      .eq('org_id', orgId)
      .eq('endpoint', endpoint)
      .eq('date', today)
      .single();

    if (existing) {
      await db.from('api_usage').update({ count: existing.count + 1 }).eq('id', existing.id);
    } else {
      await db.from('api_usage').insert({ org_id: orgId, endpoint, count: 1, date: today });
    }
  },

  async getWeeklyUsage(orgId: string): Promise<{ date: string; count: number }[]> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data } = await db.from('api_usage')
      .select('date, count')
      .eq('org_id', orgId)
      .gte('date', weekAgo)
      .order('date', { ascending: true });
    return (data || []) as { date: string; count: number }[];
  },
};
