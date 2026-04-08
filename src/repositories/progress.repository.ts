// Progress Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { StudentProgress, RiskLevel } from '@/types';

export const progressRepository = {
  async findByStudent(studentId: string): Promise<StudentProgress | null> {
    const { data } = await db.from('student_progress')
      .select('*').eq('student_id', studentId).single();
    return data as StudentProgress | null;
  },

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<StudentProgress | null> {
    const { data } = await db.from('student_progress')
      .select('id').eq('student_id', studentId).eq('course_id', courseId).limit(1).single();
    return data as StudentProgress | null;
  },

  async findAllWithStudents(filters?: {
    risk_level?: RiskLevel;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    let query = db.from('student_progress')
      .select('*, students!inner(id, name, email, cohort_name, created_at)');

    if (filters?.risk_level) query = query.eq('risk_level', filters.risk_level);
    if (filters?.search) query = query.ilike('students.name', `%${filters.search}%`);

    const sortKey = filters?.sort || 'risk_score';
    const ascending = (filters?.order || 'desc') === 'asc';
    query = query.order(sortKey, { ascending });

    const { data } = await query;
    return data || [];
  },

  async countByRiskLevel() {
    const { data } = await db.from('student_progress').select('risk_level');
    const all = data || [];
    return {
      stable: all.filter((p: Record<string, unknown>) => p.risk_level === 'stable').length,
      warning: all.filter((p: Record<string, unknown>) => p.risk_level === 'warning').length,
      at_risk: all.filter((p: Record<string, unknown>) => p.risk_level === 'at_risk').length,
    };
  },

  async save(progress: Omit<StudentProgress, 'id' | 'created_at' | 'updated_at'>): Promise<StudentProgress> {
    const { data } = await db.from('student_progress').insert(progress).select().single();
    return data as StudentProgress;
  },

  async update(studentId: string, courseId: string, updates: Partial<StudentProgress>): Promise<StudentProgress | null> {
    const { data } = await db.from('student_progress')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('student_id', studentId).eq('course_id', courseId)
      .select().single();
    return data as StudentProgress | null;
  },

  async updateById(id: string, updates: Partial<StudentProgress>): Promise<StudentProgress | null> {
    const { data } = await db.from('student_progress')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();
    return data as StudentProgress | null;
  },

  async deleteAll(): Promise<void> {
    await db.from('student_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },
};
