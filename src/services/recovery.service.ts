// Recovery Service — 회복학습 생성 비즈니스 로직
import { studentService } from '@/services/student.service';
import { courseRepository } from '@/repositories/course.repository';
import { recoveryPlanRepository } from '@/repositories/recovery-plan.repository';
import { buildAiContext, generateRecoveryPlan } from '@/lib/ai';
import type { RecoveryPlan } from '@/types';

export const recoveryService = {
  async generate(studentId: string): Promise<RecoveryPlan> {
    const data = await studentService.getStudentDetail(studentId);
    if (!data) throw new Error('STUDENT_NOT_FOUND');

    const course = await courseRepository.findFirst();
    const ctx = buildAiContext(data.student, data.progress, course);
    const result = await generateRecoveryPlan(ctx);

    const plan: RecoveryPlan = {
      id: crypto.randomUUID(),
      student_id: studentId,
      course_id: course?.id || '',
      missed_concepts_summary: result.missed_concepts_summary,
      recovery_steps_json: result.recovery_steps,
      action_plan_text: result.action_plan_text,
      caution_points_text: result.caution_points_text,
      created_at: new Date().toISOString(),
    };

    await recoveryPlanRepository.save(plan);
    return plan;
  },
};
