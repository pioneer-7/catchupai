// Course Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { Course } from '@/types';

function throwIfSupabaseError(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`);
}

export const courseRepository = {
  async findFirst(): Promise<Course | null> {
    const { data, error } = await db.from('courses').select('*').limit(1).maybeSingle();
    throwIfSupabaseError(error, 'courses.findFirst failed');
    return data as Course | null;
  },

  async save(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    const { data, error } = await db.from('courses').insert(course).select().single();
    throwIfSupabaseError(error, 'courses.save failed');
    return data as Course;
  },

  async updateMaterial(id: string, text: string): Promise<Course | null> {
    const { data, error } = await db.from('courses')
      .update({ uploaded_material_text: text })
      .eq('id', id).select().single();
    throwIfSupabaseError(error, 'courses.updateMaterial failed');
    return data as Course | null;
  },

  async deleteAll(): Promise<void> {
    const { error } = await db.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    throwIfSupabaseError(error, 'courses.deleteAll failed');
  },
};
