import { SAMPLE_COURSE, SAMPLE_STUDENTS } from '@/lib/sample-data';
import { calculateRisk } from '@/lib/risk-scoring';
import type {
  Course,
  RiskLevel,
  Student,
  StudentDetailData,
  StudentListData,
  StudentProgress,
} from '@/types';

const DEMO_CREATED_AT = '2026-04-08T00:00:00.000Z';

type DemoStudent = Student & Pick<StudentProgress,
  'risk_score' | 'risk_level' | 'attendance_rate' | 'missed_sessions' |
  'assignment_submission_rate' | 'avg_quiz_score' | 'last_active_days_ago'
>;

function demoCourse(): Course {
  return {
    id: 'demo-course-1',
    title: SAMPLE_COURSE.title,
    description: SAMPLE_COURSE.description,
    uploaded_material_text: null,
    created_at: DEMO_CREATED_AT,
  };
}

function demoStudent(index: number): DemoStudent {
  const source = SAMPLE_STUDENTS[index];
  const risk = calculateRisk(source);

  return {
    id: `demo-student-${index + 1}`,
    name: source.name,
    email: source.email,
    cohort_name: source.cohort_name,
    created_at: DEMO_CREATED_AT,
    attendance_rate: source.attendance_rate,
    missed_sessions: source.missed_sessions,
    assignment_submission_rate: source.assignment_submission_rate,
    avg_quiz_score: source.avg_quiz_score,
    last_active_days_ago: source.last_active_days_ago,
    risk_score: risk.risk_score,
    risk_level: risk.risk_level,
  };
}

function demoProgress(index: number): StudentProgress {
  const source = SAMPLE_STUDENTS[index];
  const risk = calculateRisk(source);

  return {
    id: `demo-progress-${index + 1}`,
    student_id: `demo-student-${index + 1}`,
    course_id: demoCourse().id,
    attendance_rate: source.attendance_rate,
    missed_sessions: source.missed_sessions,
    assignment_submission_rate: source.assignment_submission_rate,
    avg_quiz_score: source.avg_quiz_score,
    last_active_days_ago: source.last_active_days_ago,
    risk_score: risk.risk_score,
    risk_level: risk.risk_level,
    risk_factors_json: risk.risk_factors,
    created_at: DEMO_CREATED_AT,
    updated_at: DEMO_CREATED_AT,
  };
}

function summarize(students: DemoStudent[]): StudentListData['summary'] {
  return {
    stable: students.filter(student => student.risk_level === 'stable').length,
    warning: students.filter(student => student.risk_level === 'warning').length,
    at_risk: students.filter(student => student.risk_level === 'at_risk').length,
  };
}

export function getDemoStudentList(filters?: {
  risk_level?: RiskLevel;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}): StudentListData {
  const allStudents = SAMPLE_STUDENTS.map((_, index) => demoStudent(index));
  let students = allStudents;

  if (filters?.risk_level) {
    students = students.filter(student => student.risk_level === filters.risk_level);
  }

  if (filters?.search) {
    const search = filters.search.toLocaleLowerCase('ko-KR');
    students = students.filter(student => student.name.toLocaleLowerCase('ko-KR').includes(search));
  }

  const sort = filters?.sort || 'risk_score';
  const order = filters?.order || 'desc';
  students = [...students].sort((a, b) => {
    const aValue = a[sort as keyof DemoStudent];
    const bValue = b[sort as keyof DemoStudent];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return order === 'asc'
      ? String(aValue ?? '').localeCompare(String(bValue ?? ''), 'ko-KR')
      : String(bValue ?? '').localeCompare(String(aValue ?? ''), 'ko-KR');
  });

  return {
    students,
    total: students.length,
    summary: summarize(allStudents),
  };
}

export function getDemoStudentDetail(studentId: string): StudentDetailData | null {
  const index = SAMPLE_STUDENTS.findIndex((_, i) => `demo-student-${i + 1}` === studentId);
  if (index < 0) return null;

  const student = demoStudent(index);

  return {
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      cohort_name: student.cohort_name,
      created_at: student.created_at,
    },
    progress: demoProgress(index),
    recovery_plans: [],
    intervention_messages: [],
    mini_assessments: [],
  };
}

export function getDemoSampleLoadResult(): { course_id: string; total_rows: number } {
  return {
    course_id: demoCourse().id,
    total_rows: SAMPLE_STUDENTS.length,
  };
}

export function shouldUseDemoSampleFallback(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);

  return [
    'fetch failed',
    'Failed to fetch',
    'ENOTFOUND',
    'EAI_AGAIN',
    'ECONNREFUSED',
    'Invalid API key',
    'JWT',
    'relation',
    'schema cache',
    'supabaseUrl is required',
  ].some(fragment => message.includes(fragment));
}

export function logDemoSampleFallback(context: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`${context}: using demo sample fallback (${message})`);
}
