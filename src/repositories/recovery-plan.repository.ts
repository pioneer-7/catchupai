// RecoveryPlan Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { RecoveryPlan } from '@/types';

export const recoveryPlanRepository = {
  async findByStudent(studentId: string): Promise<RecoveryPlan[]> {
    const { data } = await db.from('recovery_plans')
      .select('*').eq('student_id', studentId).order('created_at', { ascending: false });
    return (data || []) as RecoveryPlan[];
  },

  async save(plan: Omit<RecoveryPlan, 'created_at'> & { id: string }): Promise<void> {
    await db.from('recovery_plans').insert({
      id: plan.id,
      student_id: plan.student_id,
      course_id: plan.course_id,
      missed_concepts_summary: plan.missed_concepts_summary,
      recovery_steps_json: plan.recovery_steps_json,
      action_plan_text: plan.action_plan_text,
      caution_points_text: plan.caution_points_text,
    });
  },

  async deleteAll(): Promise<void> {
    await db.from('recovery_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },
};
