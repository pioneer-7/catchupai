// Assessment Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { MiniAssessment } from '@/types';

export const assessmentRepository = {
  async findById(studentId: string, assessmentId: string): Promise<MiniAssessment | null> {
    const { data } = await db.from('mini_assessments')
      .select('*').eq('id', assessmentId).eq('student_id', studentId).single();
    return data as MiniAssessment | null;
  },

  async findByStudent(studentId: string): Promise<MiniAssessment[]> {
    const { data } = await db.from('mini_assessments')
      .select('*').eq('student_id', studentId).order('created_at', { ascending: false });
    return (data || []) as MiniAssessment[];
  },

  async save(assessment: Omit<MiniAssessment, 'created_at'>): Promise<void> {
    await db.from('mini_assessments').insert({
      id: assessment.id,
      student_id: assessment.student_id,
      course_id: assessment.course_id,
      questions_json: assessment.questions_json,
      answer_key_json: assessment.answer_key_json,
      explanation_json: assessment.explanation_json,
    });
  },

  async update(studentId: string, assessmentId: string, updates: Partial<MiniAssessment>): Promise<MiniAssessment | null> {
    const { data } = await db.from('mini_assessments')
      .update(updates).eq('id', assessmentId).eq('student_id', studentId).select().single();
    return data as MiniAssessment | null;
  },

  async deleteAll(): Promise<void> {
    await db.from('mini_assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },
};
