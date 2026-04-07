// Supabase 기반 데이터 스토어
// 서버리스 환경(Vercel)에서 인스턴스 간 데이터 공유를 위해 Supabase 직접 사용

import { createClient } from '@supabase/supabase-js';
import type {
  Course, Student, StudentProgress, RecoveryPlan,
  InterventionMessage, MiniAssessment, StudentListData,
  StudentDetailData, RiskLevel,
} from '@/types';
import { calculateRisk } from '@/lib/risk-scoring';
import { SAMPLE_COURSE, SAMPLE_STUDENTS, SAMPLE_MATERIAL_TEXT } from '@/lib/sample-data';

// Supabase 클라이언트 (서버 사이드 — service role key 우선)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const db = createClient(supabaseUrl, supabaseKey);

// === Public API (모두 async) ===

export async function loadSampleData(): Promise<{ course_id: string; total_rows: number }> {
  // 기존 데이터 정리
  await db.from('mini_assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('intervention_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('recovery_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('student_progress').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await db.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 과정 생성
  const { data: course } = await db.from('courses').insert({
    title: SAMPLE_COURSE.title,
    description: SAMPLE_COURSE.description,
    uploaded_material_text: SAMPLE_MATERIAL_TEXT,
  }).select().single();

  const courseId = course!.id;

  // 학생 + progress 생성
  for (const s of SAMPLE_STUDENTS) {
    await upsertStudentWithProgress(s, courseId);
  }

  return { course_id: courseId, total_rows: SAMPLE_STUDENTS.length };
}

export async function getOrCreateDefaultCourse(): Promise<Course> {
  const { data } = await db.from('courses').select('*').limit(1).single();
  if (data) return data as Course;

  const { data: created } = await db.from('courses').insert({
    title: '기본 과정',
    description: null,
    uploaded_material_text: null,
  }).select().single();

  return created as Course;
}

export async function updateCourseMaterial(courseId: string, text: string): Promise<Course | null> {
  const { data } = await db.from('courses')
    .update({ uploaded_material_text: text })
    .eq('id', courseId)
    .select()
    .single();
  return data as Course | null;
}

export async function upsertStudentWithProgress(
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
): Promise<{ student: Student; progress: StudentProgress }> {
  // Find or create student
  let { data: student } = await db.from('students')
    .select('*')
    .eq('name', data.name)
    .limit(1)
    .single();

  if (!student) {
    const { data: created } = await db.from('students').insert({
      name: data.name,
      email: data.email || null,
      cohort_name: data.cohort_name || null,
    }).select().single();
    student = created;
  } else {
    if (data.email || data.cohort_name) {
      await db.from('students')
        .update({
          ...(data.email && { email: data.email }),
          ...(data.cohort_name && { cohort_name: data.cohort_name }),
        })
        .eq('id', student.id);
    }
  }

  // Calculate risk
  const risk = calculateRisk({
    attendance_rate: data.attendance_rate,
    missed_sessions: data.missed_sessions,
    assignment_submission_rate: data.assignment_submission_rate,
    avg_quiz_score: data.avg_quiz_score,
    last_active_days_ago: data.last_active_days_ago,
  });

  // Upsert progress
  const { data: existingProgress } = await db.from('student_progress')
    .select('id')
    .eq('student_id', student!.id)
    .eq('course_id', courseId)
    .limit(1)
    .single();

  let progress: StudentProgress;

  if (existingProgress) {
    const { data: updated } = await db.from('student_progress')
      .update({
        attendance_rate: data.attendance_rate,
        missed_sessions: data.missed_sessions,
        assignment_submission_rate: data.assignment_submission_rate,
        avg_quiz_score: data.avg_quiz_score,
        last_active_days_ago: data.last_active_days_ago,
        risk_score: risk.risk_score,
        risk_level: risk.risk_level,
        risk_factors_json: risk.risk_factors,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProgress.id)
      .select()
      .single();
    progress = updated as StudentProgress;
  } else {
    const { data: created } = await db.from('student_progress')
      .insert({
        student_id: student!.id,
        course_id: courseId,
        attendance_rate: data.attendance_rate,
        missed_sessions: data.missed_sessions,
        assignment_submission_rate: data.assignment_submission_rate,
        avg_quiz_score: data.avg_quiz_score,
        last_active_days_ago: data.last_active_days_ago,
        risk_score: risk.risk_score,
        risk_level: risk.risk_level,
        risk_factors_json: risk.risk_factors,
      })
      .select()
      .single();
    progress = created as StudentProgress;
  }

  return { student: student as Student, progress };
}

export async function getStudentList(filters?: {
  risk_level?: RiskLevel;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}): Promise<StudentListData> {
  // Join students + progress
  let query = db.from('student_progress')
    .select('*, students!inner(id, name, email, cohort_name, created_at)');

  if (filters?.risk_level) {
    query = query.eq('risk_level', filters.risk_level);
  }

  if (filters?.search) {
    query = query.ilike('students.name', `%${filters.search}%`);
  }

  const sortKey = filters?.sort || 'risk_score';
  const ascending = (filters?.order || 'desc') === 'asc';
  query = query.order(sortKey, { ascending });

  const { data: rows } = await query;

  const students = (rows || []).map((row: Record<string, unknown>) => {
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

  // Summary (전체 기준)
  const { data: allProgress } = await db.from('student_progress').select('risk_level');
  const all = allProgress || [];
  const summary = {
    stable: all.filter((p: Record<string, unknown>) => p.risk_level === 'stable').length,
    warning: all.filter((p: Record<string, unknown>) => p.risk_level === 'warning').length,
    at_risk: all.filter((p: Record<string, unknown>) => p.risk_level === 'at_risk').length,
  };

  return { students, total: students.length, summary };
}

export async function getStudentDetail(studentId: string): Promise<StudentDetailData | null> {
  const { data: student } = await db.from('students')
    .select('*')
    .eq('id', studentId)
    .single();
  if (!student) return null;

  const { data: progress } = await db.from('student_progress')
    .select('*')
    .eq('student_id', studentId)
    .single();
  if (!progress) return null;

  const { data: recovery_plans } = await db.from('recovery_plans')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  const { data: intervention_messages } = await db.from('intervention_messages')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  const { data: mini_assessments } = await db.from('mini_assessments')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  return {
    student: student as Student,
    progress: progress as StudentProgress,
    recovery_plans: (recovery_plans || []) as RecoveryPlan[],
    intervention_messages: (intervention_messages || []) as InterventionMessage[],
    mini_assessments: (mini_assessments || []) as MiniAssessment[],
  };
}

export async function getFirstCourse(): Promise<Course | null> {
  const { data } = await db.from('courses').select('*').limit(1).single();
  return (data as Course) || null;
}

export async function addRecoveryPlan(plan: RecoveryPlan): Promise<void> {
  await db.from('recovery_plans').insert({
    id: plan.id,
    student_id: plan.student_id,
    course_id: plan.course_id,
    missed_concepts_summary: plan.missed_concepts_summary,
    recovery_steps_json: plan.recovery_steps_json,
    action_plan_text: plan.action_plan_text,
    caution_points_text: plan.caution_points_text,
  });
}

export async function addInterventionMessage(msg: InterventionMessage): Promise<void> {
  await db.from('intervention_messages').insert({
    id: msg.id,
    student_id: msg.student_id,
    course_id: msg.course_id,
    message_type: msg.message_type,
    content: msg.content,
  });
}

export async function addMiniAssessment(assessment: MiniAssessment): Promise<void> {
  await db.from('mini_assessments').insert({
    id: assessment.id,
    student_id: assessment.student_id,
    course_id: assessment.course_id,
    questions_json: assessment.questions_json,
    answer_key_json: assessment.answer_key_json,
    explanation_json: assessment.explanation_json,
  });
}

export async function getMiniAssessment(studentId: string, assessmentId: string): Promise<MiniAssessment | null> {
  const { data } = await db.from('mini_assessments')
    .select('*')
    .eq('id', assessmentId)
    .eq('student_id', studentId)
    .single();
  return (data as MiniAssessment) || null;
}

export async function updateMiniAssessment(
  studentId: string,
  assessmentId: string,
  updates: Partial<MiniAssessment>
): Promise<MiniAssessment | null> {
  const { data } = await db.from('mini_assessments')
    .update(updates)
    .eq('id', assessmentId)
    .eq('student_id', studentId)
    .select()
    .single();
  return (data as MiniAssessment) || null;
}

export async function updateProgress(
  studentId: string,
  courseId: string,
  updates: Partial<StudentProgress>
): Promise<StudentProgress | null> {
  const { data } = await db.from('student_progress')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .select()
    .single();
  return (data as StudentProgress) || null;
}
