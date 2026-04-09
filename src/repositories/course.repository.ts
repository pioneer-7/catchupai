// Course Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { Course } from '@/types';

export const courseRepository = {
  async findFirst(): Promise<Course | null> {
    const { data } = await db.from('courses').select('*').limit(1).maybeSingle();
    return data as Course | null;
  },

  async save(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    const { data } = await db.from('courses').insert(course).select().single();
    return data as Course;
  },

  async updateMaterial(id: string, text: string): Promise<Course | null> {
    const { data } = await db.from('courses')
      .update({ uploaded_material_text: text })
      .eq('id', id).select().single();
    return data as Course | null;
  },

  async deleteAll(): Promise<void> {
    await db.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },
};
