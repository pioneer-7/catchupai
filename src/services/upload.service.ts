import Papa from 'papaparse';
import { studentRepository } from '@/repositories/student.repository';
import { courseRepository } from '@/repositories/course.repository';
import { progressRepository } from '@/repositories/progress.repository';
import { recoveryPlanRepository } from '@/repositories/recovery-plan.repository';
import { interventionMessageRepository } from '@/repositories/intervention-message.repository';
import { assessmentRepository } from '@/repositories/assessment.repository';
import { calculateRisk } from '@/lib/risk-scoring';
import { StudentUploadRowSchema } from '@/lib/validation';
import { SAMPLE_COURSE, SAMPLE_STUDENTS, SAMPLE_MATERIAL_TEXT } from '@/lib/sample-data';

const SAMPLE_VISIBILITY_RETRIES = 5;
const SAMPLE_VISIBILITY_DELAY_MS = 150;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const uploadService = {
  async loadSampleData(): Promise<{ course_id: string; total_rows: number }> {
    await assessmentRepository.deleteAll();
    await interventionMessageRepository.deleteAll();
    await recoveryPlanRepository.deleteAll();
    await progressRepository.deleteAll();
    await studentRepository.deleteAll();
    await courseRepository.deleteAll();

    const course = await courseRepository.save({
      title: SAMPLE_COURSE.title,
      description: SAMPLE_COURSE.description,
      uploaded_material_text: SAMPLE_MATERIAL_TEXT,
    });

    for (const s of SAMPLE_STUDENTS) {
      await this.upsertStudentWithProgress(s, course.id);
    }

    // Avoid navigating from the landing CTA before the list query can see the seeded rows.
    for (let attempt = 0; attempt < SAMPLE_VISIBILITY_RETRIES; attempt++) {
      const rows = await progressRepository.findAllWithStudents();
      if (rows.length >= SAMPLE_STUDENTS.length) {
        return { course_id: course.id, total_rows: SAMPLE_STUDENTS.length };
      }
      await delay(SAMPLE_VISIBILITY_DELAY_MS);
    }

    throw new Error('SAMPLE_DATA_NOT_VISIBLE');
  },

  async importFromCSV(text: string): Promise<{ total_rows: number; processed: number; skipped: number; course_id: string }> {
    const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    if (!parsed.data.length) throw new Error('EMPTY_CSV');

    const headers = Object.keys(parsed.data[0]);
    const required = ['student_name', 'attendance_rate', 'missed_sessions', 'assignment_submission_rate', 'avg_quiz_score', 'last_active_days_ago'];
    const missing = required.filter(c => !headers.includes(c));
    if (missing.length > 0) throw new Error(`MISSING_COLUMNS:${missing.join(',')}`);

    let existing = await courseRepository.findFirst();
    if (!existing) {
      existing = await courseRepository.save({ title: '기본 과정', description: null, uploaded_material_text: null });
    }

    let processed = 0;
    let skipped = 0;

    for (const row of parsed.data) {
      const result = StudentUploadRowSchema.safeParse(row);
      if (!result.success) {
        skipped++;
        continue;
      }

      await this.upsertStudentWithProgress({
        name: result.data.student_name,
        email: result.data.email || undefined,
        cohort_name: result.data.cohort_name || undefined,
        attendance_rate: result.data.attendance_rate,
        missed_sessions: result.data.missed_sessions,
        assignment_submission_rate: result.data.assignment_submission_rate,
        avg_quiz_score: result.data.avg_quiz_score,
        last_active_days_ago: result.data.last_active_days_ago,
      }, existing.id);
      processed++;
    }

    return { total_rows: parsed.data.length, processed, skipped, course_id: existing.id };
  },

  async upsertStudentWithProgress(
    data: {
      name: string;
      email?: string;
      cohort_name?: string;
      attendance_rate: number;
      missed_sessions: number;
      assignment_submission_rate: number;
      avg_quiz_score: number;
      last_active_days_ago: number;
    },
    courseId: string
  ) {
    let student = await studentRepository.findByName(data.name);
    if (!student) {
      student = await studentRepository.save({
        name: data.name,
        email: data.email || null,
        cohort_name: data.cohort_name || null,
      });
    } else if (data.email || data.cohort_name) {
      await studentRepository.update(student.id, {
        ...(data.email && { email: data.email }),
        ...(data.cohort_name && { cohort_name: data.cohort_name }),
      });
    }

    const risk = calculateRisk({
      attendance_rate: data.attendance_rate,
      missed_sessions: data.missed_sessions,
      assignment_submission_rate: data.assignment_submission_rate,
      avg_quiz_score: data.avg_quiz_score,
      last_active_days_ago: data.last_active_days_ago,
    });

    const existing = await progressRepository.findByStudentAndCourse(student.id, courseId);
    if (existing) {
      await progressRepository.updateById(existing.id, {
        attendance_rate: data.attendance_rate,
        missed_sessions: data.missed_sessions,
        assignment_submission_rate: data.assignment_submission_rate,
        avg_quiz_score: data.avg_quiz_score,
        last_active_days_ago: data.last_active_days_ago,
        risk_score: risk.risk_score,
        risk_level: risk.risk_level,
        risk_factors_json: risk.risk_factors,
      });
    } else {
      await progressRepository.save({
        student_id: student.id,
        course_id: courseId,
        attendance_rate: data.attendance_rate,
        missed_sessions: data.missed_sessions,
        assignment_submission_rate: data.assignment_submission_rate,
        avg_quiz_score: data.avg_quiz_score,
        last_active_days_ago: data.last_active_days_ago,
        risk_score: risk.risk_score,
        risk_level: risk.risk_level,
        risk_factors_json: risk.risk_factors,
      });
    }
  },
};
