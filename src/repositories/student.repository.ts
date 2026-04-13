// Student Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { Student } from '@/types';

function throwIfSupabaseError(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`);
}

export const studentRepository = {
  async findById(id: string): Promise<Student | null> {
    const { data, error } = await db.from('students').select('*').eq('id', id).maybeSingle();
    throwIfSupabaseError(error, 'students.findById failed');
    return data as Student | null;
  },

  async findByName(name: string): Promise<Student | null> {
    const { data, error } = await db.from('students').select('*').eq('name', name).limit(1).maybeSingle();
    throwIfSupabaseError(error, 'students.findByName failed');
    return data as Student | null;
  },

  async save(student: Omit<Student, 'id' | 'created_at'>): Promise<Student> {
    const { data, error } = await db.from('students').insert(student).select().single();
    throwIfSupabaseError(error, 'students.save failed');
    return data as Student;
  },

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    const { data, error } = await db.from('students').update(updates).eq('id', id).select().single();
    throwIfSupabaseError(error, 'students.update failed');
    return data as Student | null;
  },

  async deleteAll(): Promise<void> {
    const { error } = await db.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    throwIfSupabaseError(error, 'students.deleteAll failed');
  },
};
