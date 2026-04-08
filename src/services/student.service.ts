// Student Service — 학생 목록/상세 비즈니스 로직
import { studentRepository } from '@/repositories/student.repository';
import { progressRepository } from '@/repositories/progress.repository';
import { recoveryPlanRepository } from '@/repositories/recovery-plan.repository';
import { interventionMessageRepository } from '@/repositories/intervention-message.repository';
import { assessmentRepository } from '@/repositories/assessment.repository';
import type { StudentListData, StudentDetailData, RiskLevel } from '@/types';

export const studentService = {
  async getStudentList(filters?: {
    risk_level?: RiskLevel;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<StudentListData> {
    const rows = await progressRepository.findAllWithStudents(filters);
    const summary = await progressRepository.countByRiskLevel();

    const students = rows.map((row: Record<string, unknown>) => {
      const s = row.students as Record<string, unknown>;
      return {
        id: s.id as string,
        name: s.name as string,
        email: s.email as string | null,
        cohort_name: s.cohort_name as string | null,
        created_at: s.created_at as string,
        risk_score: row.risk_score as number,
        risk_level: row.risk_level as RiskLevel,
        attendance_rate: row.attendance_rate as number,
        missed_sessions: row.missed_sessions as number,
        assignment_submission_rate: row.assignment_submission_rate as number,
        avg_quiz_score: row.avg_quiz_score as number,
        last_active_days_ago: row.last_active_days_ago as number,
      };
    });

    return { students, total: students.length, summary };
  },

  async getStudentDetail(studentId: string): Promise<StudentDetailData | null> {
    const student = await studentRepository.findById(studentId);
    if (!student) return null;

    const progress = await progressRepository.findByStudent(studentId);
    if (!progress) return null;

    const [recovery_plans, intervention_messages, mini_assessments] = await Promise.all([
      recoveryPlanRepository.findByStudent(studentId),
      interventionMessageRepository.findByStudent(studentId),
      assessmentRepository.findByStudent(studentId),
    ]);

    return { student, progress, recovery_plans, intervention_messages, mini_assessments };
  },
};
