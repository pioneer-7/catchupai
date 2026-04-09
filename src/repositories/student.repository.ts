// Student Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { Student } from '@/types';

export const studentRepository = {
  async findById(id: string): Promise<Student | null> {
    const { data } = await db.from('students').select('*').eq('id', id).maybeSingle();
    return data as Student | null;
  },

  async findByName(name: string): Promise<Student | null> {
    const { data } = await db.from('students').select('*').eq('name', name).limit(1).maybeSingle();
    return data as Student | null;
  },

  async save(student: Omit<Student, 'id' | 'created_at'>): Promise<Student> {
    const { data } = await db.from('students').insert(student).select().single();
    return data as Student;
  },

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    const { data } = await db.from('students').update(updates).eq('id', id).select().single();
    return data as Student | null;
  },

  async deleteAll(): Promise<void> {
    await db.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },
};
