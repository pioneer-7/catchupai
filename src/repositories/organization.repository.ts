// Organization Repository — Supabase 데이터 접근
// SSOT: specs/004-backend/multi-tenant-spec.md

import { db } from '@/lib/supabase';

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  plan: 'free' | 'pro' | 'api';
  created_at: string;
}

export const organizationRepository = {
  async findById(id: string): Promise<Organization | null> {
    const { data } = await db.from('organizations').select('*').eq('id', id).maybeSingle();
    return data as Organization | null;
  },

  async findByOwner(ownerId: string): Promise<Organization | null> {
    const { data } = await db.from('organizations').select('*').eq('owner_id', ownerId).limit(1).maybeSingle();
    return data as Organization | null;
  },

  async create(org: { name: string; owner_id: string; plan?: string }): Promise<Organization> {
    const { data } = await db.from('organizations').insert(org).select().single();
    return data as Organization;
  },

  async updatePlan(id: string, plan: string): Promise<void> {
    await db.from('organizations').update({ plan }).eq('id', id);
  },
};
