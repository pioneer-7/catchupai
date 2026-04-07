// 인메모리 데이터 스토어 (globalThis 싱글턴)
// MVP 데모용 — Supabase 어댑터는 Day 4+ 에서 추가

import type {
  Course, Student, StudentProgress, RecoveryPlan,
  InterventionMessage, MiniAssessment, StudentListData,
  StudentDetailData, RiskLevel,
} from '@/types';
import { calculateRisk } from '@/lib/risk-scoring';
import { SAMPLE_COURSE, SAMPLE_STUDENTS, SAMPLE_MATERIAL_TEXT } from '@/lib/sample-data';

interface Store {
  courses: Map<string, Course>;
  students: Map<string, Student>;
  progress: Map<string, StudentProgress>; // key: `${student_id}_${course_id}`
  recoveryPlans: Map<string, RecoveryPlan[]>; // key: student_id
  interventionMessages: Map<string, InterventionMessage[]>;
  miniAssessments: Map<string, MiniAssessment[]>;
}

function generateId(): string {
  return crypto.randomUUID();
}

function createStore(): Store {
  return {
    courses: new Map(),
    students: new Map(),
    progress: new Map(),
    recoveryPlans: new Map(),
    interventionMessages: new Map(),
    miniAssessments: new Map(),
  };
}

// globalThis로 핫리로드 시에도 데이터 유지
const g = globalThis as unknown as { __catchupStore?: Store };
if (!g.__catchupStore) {
  g.__catchupStore = createStore();
}
const store = g.__catchupStore;

// === Public API ===

export function isLoaded(): boolean {
  return store.students.size > 0;
}

export function clear(): void {
  store.courses.clear();
  store.students.clear();
  store.progress.clear();
  store.recoveryPlans.clear();
  store.interventionMessages.clear();
  store.miniAssessments.clear();
}

export function loadSampleData(): { course_id: string; total_rows: number } {
  clear();

  const courseId = generateId();
  const course: Course = {
    id: courseId,
    title: SAMPLE_COURSE.title,
    description: SAMPLE_COURSE.description,
    uploaded_material_text: SAMPLE_MATERIAL_TEXT,
    created_at: new Date().toISOString(),
  };
  store.courses.set(courseId, course);

  for (const s of SAMPLE_STUDENTS) {
    upsertStudentWithProgress(s, courseId);
  }

  return { course_id: courseId, total_rows: SAMPLE_STUDENTS.length };
}

export function getOrCreateDefaultCourse(): Course {
  const existing = Array.from(store.courses.values())[0];
  if (existing) return existing;

  const id = generateId();
  const course: Course = {
    id,
    title: '기본 과정',
    description: null,
    uploaded_material_text: null,
    created_at: new Date().toISOString(),
  };
  store.courses.set(id, course);
  return course;
}

export function updateCourseMaterial(courseId: string, text: string): Course | null {
  const course = store.courses.get(courseId);
  if (!course) return null;
  course.uploaded_material_text = text;
  return course;
}

export function upsertStudentWithProgress(
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
): { student: Student; progress: StudentProgress } {
  // Find or create student by name
  let student = Array.from(store.students.values()).find(s => s.name === data.name);
  if (!student) {
    student = {
      id: generateId(),
      name: data.name,
      email: data.email || null,
      cohort_name: data.cohort_name || null,
      created_at: new Date().toISOString(),
    };
    store.students.set(student.id, student);
  } else {
    if (data.email) student.email = data.email;
    if (data.cohort_name) student.cohort_name = data.cohort_name;
  }

  // Calculate risk
  const risk = calculateRisk({
    attendance_rate: data.attendance_rate,
    missed_sessions: data.missed_sessions,
    assignment_submission_rate: data.assignment_submission_rate,
    avg_quiz_score: data.avg_quiz_score,
    last_active_days_ago: data.last_active_days_ago,
  });

  const progressKey = `${student.id}_${courseId}`;
  const now = new Date().toISOString();

  const progress: StudentProgress = {
    id: store.progress.has(progressKey) ? store.progress.get(progressKey)!.id : generateId(),
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
    created_at: store.progress.has(progressKey) ? store.progress.get(progressKey)!.created_at : now,
    updated_at: now,
  };
  store.progress.set(progressKey, progress);

  return { student, progress };
}

export function getStudentList(filters?: {
  risk_level?: RiskLevel;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}): StudentListData {
  let entries = Array.from(store.progress.values()).map(p => {
    const student = store.students.get(p.student_id)!;
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      cohort_name: student.cohort_name,
      created_at: student.created_at,
      risk_score: p.risk_score,
      risk_level: p.risk_level,
      attendance_rate: p.attendance_rate,
      missed_sessions: p.missed_sessions,
      assignment_submission_rate: p.assignment_submission_rate,
      avg_quiz_score: p.avg_quiz_score,
      last_active_days_ago: p.last_active_days_ago,
    };
  });

  // Filter by risk_level
  if (filters?.risk_level) {
    entries = entries.filter(e => e.risk_level === filters.risk_level);
  }

  // Filter by search (name)
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    entries = entries.filter(e => e.name.toLowerCase().includes(q));
  }

  // Sort
  const sortKey = filters?.sort || 'risk_score';
  const order = filters?.order || 'desc';
  entries.sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortKey];
    const bVal = (b as Record<string, unknown>)[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'desc' ? bVal - aVal : aVal - bVal;
    }
    return order === 'desc'
      ? String(bVal).localeCompare(String(aVal))
      : String(aVal).localeCompare(String(bVal));
  });

  // Summary
  const allProgress = Array.from(store.progress.values());
  const summary = {
    stable: allProgress.filter(p => p.risk_level === 'stable').length,
    warning: allProgress.filter(p => p.risk_level === 'warning').length,
    at_risk: allProgress.filter(p => p.risk_level === 'at_risk').length,
  };

  return { students: entries, total: entries.length, summary };
}

export function getStudentDetail(studentId: string): StudentDetailData | null {
  const student = store.students.get(studentId);
  if (!student) return null;

  const progress = Array.from(store.progress.values()).find(p => p.student_id === studentId);
  if (!progress) return null;

  return {
    student,
    progress,
    recovery_plans: store.recoveryPlans.get(studentId) || [],
    intervention_messages: store.interventionMessages.get(studentId) || [],
    mini_assessments: store.miniAssessments.get(studentId) || [],
  };
}

export function getFirstCourse(): Course | null {
  return Array.from(store.courses.values())[0] || null;
}

export function addRecoveryPlan(plan: RecoveryPlan): void {
  const list = store.recoveryPlans.get(plan.student_id) || [];
  list.unshift(plan);
  store.recoveryPlans.set(plan.student_id, list);
}

export function addInterventionMessage(msg: InterventionMessage): void {
  const list = store.interventionMessages.get(msg.student_id) || [];
  list.unshift(msg);
  store.interventionMessages.set(msg.student_id, list);
}

export function addMiniAssessment(assessment: MiniAssessment): void {
  const list = store.miniAssessments.get(assessment.student_id) || [];
  list.unshift(assessment);
  store.miniAssessments.set(assessment.student_id, list);
}

export function getMiniAssessment(studentId: string, assessmentId: string): MiniAssessment | null {
  const list = store.miniAssessments.get(studentId) || [];
  return list.find(a => a.id === assessmentId) || null;
}

export function updateMiniAssessment(studentId: string, assessmentId: string, updates: Partial<MiniAssessment>): MiniAssessment | null {
  const assessment = getMiniAssessment(studentId, assessmentId);
  if (!assessment) return null;
  Object.assign(assessment, updates);
  return assessment;
}

export function updateProgress(studentId: string, courseId: string, updates: Partial<StudentProgress>): StudentProgress | null {
  const key = `${studentId}_${courseId}`;
  const p = store.progress.get(key);
  if (!p) return null;
  Object.assign(p, updates, { updated_at: new Date().toISOString() });
  return p;
}
