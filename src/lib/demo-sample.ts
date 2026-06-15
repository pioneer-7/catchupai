import { SAMPLE_COURSE, SAMPLE_STUDENTS } from '@/lib/sample-data';
import { calculateRisk, calculateScoreDelta, recalculateLevel } from '@/lib/risk-scoring';
import type {
  AssessmentSubmitData,
  Course,
  InterventionMessage,
  MiniAssessment,
  RecoveryPlan,
  RiskLevel,
  RiskPrediction,
  Student,
  StudentDetailData,
  StudentListData,
  StudentProgress,
  SubmittedAnswer,
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

function getDemoIndex(studentId: string): number {
  return SAMPLE_STUDENTS.findIndex((_, i) => `demo-student-${i + 1}` === studentId);
}

function demoAssessmentId(studentId: string): string {
  const index = getDemoIndex(studentId);
  const suffix = String(Math.max(index + 1, 0)).padStart(12, '0');
  return `00000000-0000-4000-8000-${suffix}`;
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
  const index = getDemoIndex(studentId);
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

export function isDemoStudentId(studentId: string): boolean {
  return getDemoIndex(studentId) >= 0;
}

export function getDemoSampleLoadResult(): { course_id: string; total_rows: number } {
  return {
    course_id: demoCourse().id,
    total_rows: SAMPLE_STUDENTS.length,
  };
}

export function getDemoRecoveryPlan(studentId: string): RecoveryPlan | null {
  const detail = getDemoStudentDetail(studentId);
  if (!detail) return null;

  const studentName = detail.student.name;

  return {
    id: `demo-recovery-plan-${studentId}`,
    student_id: studentId,
    course_id: demoCourse().id,
    missed_concepts_summary: `${studentName} 학생은 데이터 분석의 핵심 개념을 짧게 다시 정리하고, 회귀분석과 시각화 예제를 직접 풀어보는 복습이 필요합니다.`,
    recovery_steps_json: [
      {
        step: 1,
        title: '핵심 개념 10분 복습',
        description: '평균, 중앙값, 표준편차, 이상치의 의미를 강의자료에서 다시 확인합니다.',
      },
      {
        step: 2,
        title: '회귀분석 예제 풀이',
        description: '독립변수와 종속변수를 구분하고, 간단한 예측 문제를 한 번 풀어봅니다.',
      },
      {
        step: 3,
        title: '시각화 체크',
        description: '막대 그래프, 산점도, 히스토그램이 어떤 데이터에 적합한지 예시로 정리합니다.',
      },
    ],
    action_plan_text: '오늘은 강의자료 1~4장을 15분만 훑고, 가장 헷갈린 개념 2개를 노트에 적은 뒤 예제 문제 1개를 풀어보세요.',
    caution_points_text: '모든 내용을 한 번에 따라잡으려 하기보다, 결측값 처리와 회귀분석처럼 자주 쓰이는 개념부터 차례로 확인하세요.',
    created_at: new Date().toISOString(),
  };
}

export function getDemoInterventionMessage(
  studentId: string,
  messageType: InterventionMessage['message_type'] = 'teacher'
): InterventionMessage | null {
  const detail = getDemoStudentDetail(studentId);
  if (!detail) return null;

  return {
    id: `demo-intervention-message-${studentId}-${messageType}`,
    student_id: studentId,
    course_id: demoCourse().id,
    message_type: messageType,
    content: `${detail.student.name}님, 최근 학습 흐름이 조금 끊긴 부분이 보여서 짧은 복습 루트를 준비했습니다. 오늘은 강의자료의 핵심 개념만 15분 정도 확인하고, 회귀분석 예제 1개만 풀어보면 충분합니다. 부담을 크게 갖기보다 작은 단위로 다시 시작해보세요. 필요한 부분은 함께 정리해드릴게요.`,
    created_at: new Date().toISOString(),
  };
}

export function getDemoMiniAssessment(studentId: string): MiniAssessment | null {
  const detail = getDemoStudentDetail(studentId);
  if (!detail) return null;

  return {
    id: demoAssessmentId(studentId),
    student_id: studentId,
    course_id: demoCourse().id,
    questions_json: [
      {
        id: 1,
        type: 'multiple_choice',
        question: '평균(mean)에 대한 설명으로 가장 알맞은 것은?',
        options: ['가장 자주 나온 값', '모든 값의 합을 개수로 나눈 값', '정렬했을 때 가운데 값', '가장 큰 값과 작은 값의 차이'],
      },
      {
        id: 2,
        type: 'multiple_choice',
        question: '산점도가 가장 적합한 상황은?',
        options: ['범주별 개수 비교', '두 변수 간 관계 확인', '문장 길이 측정', '결측값 삭제'],
      },
      {
        id: 3,
        type: 'short_answer',
        question: '회귀분석에서 독립변수는 어떤 역할을 하나요?',
      },
    ],
    answer_key_json: [
      { id: 1, answer: '모든 값의 합을 개수로 나눈 값' },
      { id: 2, answer: '두 변수 간 관계 확인' },
      { id: 3, answer: '예측에 사용하는 입력값' },
    ],
    explanation_json: [
      { id: 1, explanation: '평균은 전체 합계를 데이터 개수로 나눈 대표값입니다.' },
      { id: 2, explanation: '산점도는 두 변수의 관계나 패턴을 확인할 때 사용합니다.' },
      { id: 3, explanation: '독립변수는 종속변수를 예측하기 위해 모델에 넣는 입력 변수입니다.' },
    ],
    submitted_answers_json: null,
    score: null,
    submitted_at: null,
    created_at: new Date().toISOString(),
  };
}

export function getDemoAssessmentSubmitResult(
  studentId: string,
  answers: SubmittedAnswer[]
): AssessmentSubmitData | null {
  const detail = getDemoStudentDetail(studentId);
  const assessment = getDemoMiniAssessment(studentId);
  if (!detail || !assessment) return null;

  let correctCount = 0;
  for (const key of assessment.answer_key_json) {
    const submitted = answers.find(answer => answer.id === key.id);
    if (submitted && submitted.answer.trim() === key.answer.trim()) {
      correctCount++;
    }
  }

  const riskScoreBefore = detail.progress.risk_score;
  const riskLevelBefore = detail.progress.risk_level;
  const riskScoreAfter = Math.max(0, riskScoreBefore + calculateScoreDelta(correctCount));
  const riskLevelAfter = recalculateLevel(riskScoreAfter);

  return {
    score: correctCount,
    total: assessment.answer_key_json.length,
    correct_answers: assessment.answer_key_json,
    explanations: assessment.explanation_json,
    risk_score_before: riskScoreBefore,
    risk_score_after: riskScoreAfter,
    risk_level_before: riskLevelBefore,
    risk_level_after: riskLevelAfter,
  };
}

export function getDemoRiskPrediction(studentId: string): RiskPrediction | null {
  const detail = getDemoStudentDetail(studentId);
  if (!detail) return null;

  const riskLevel: RiskPrediction['risk_level'] =
    detail.progress.risk_score >= 80 ? 'high' : detail.progress.risk_score >= 60 ? 'medium' : 'low';

  return {
    id: `demo-risk-prediction-${studentId}`,
    student_id: studentId,
    dropout_risk_score: Math.min(1, detail.progress.risk_score / 100),
    risk_level: riskLevel,
    primary_risk_factors: detail.progress.risk_factors_json.slice(0, 3).map(factor => factor.label),
    trajectory: detail.progress.risk_score >= 60 ? 'declining' : 'stable',
    weeks_to_likely_dropout: detail.progress.risk_score >= 80 ? 4 : null,
    confidence_basis: 'demo_behavioral_signals_only',
    intervention_impact: '짧은 회복학습과 주 1회 체크인을 병행하면 위험도를 낮출 가능성이 있습니다.',
    recommended_actions: ['회복학습 1단계부터 진행', '다음 수업 전 미니 진단 제출', '1주 후 위험도 재확인'],
    created_at: new Date().toISOString(),
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
