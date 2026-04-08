// CatchUp AI — TypeScript 타입 정의
// SSOT: specs/001-domain/data-model.md 섹션 6

export type RiskLevel = 'stable' | 'warning' | 'at_risk';

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  uploaded_material_text?: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string | null;
  cohort_name?: string | null;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  course_id: string;
  attendance_rate: number;
  missed_sessions: number;
  assignment_submission_rate: number;
  avg_quiz_score: number;
  last_active_days_ago: number;
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors_json: RiskFactor[];
  created_at: string;
  updated_at: string;
}

export interface RiskFactor {
  type: 'attendance' | 'assignment' | 'quiz' | 'activity' | 'compound';
  label: string;
  score: number;
}

export interface RecoveryPlan {
  id: string;
  student_id: string;
  course_id: string;
  missed_concepts_summary: string;
  recovery_steps_json: RecoveryStep[];
  action_plan_text: string;
  caution_points_text?: string | null;
  created_at: string;
}

export interface RecoveryStep {
  step: number;
  title: string;
  description: string;
}

export interface InterventionMessage {
  id: string;
  student_id: string;
  course_id: string;
  message_type: 'teacher' | 'operator' | 'student_support';
  content: string;
  created_at: string;
}

export interface MiniAssessment {
  id: string;
  student_id: string;
  course_id: string;
  questions_json: AssessmentQuestion[];
  answer_key_json: AnswerKey[];
  explanation_json: Explanation[];
  submitted_answers_json?: SubmittedAnswer[] | null;
  score?: number | null;
  submitted_at?: string | null;
  created_at: string;
}

export interface AssessmentQuestion {
  id: number;
  type: 'multiple_choice' | 'short_answer';
  question: string;
  options?: string[];
}

export interface AnswerKey {
  id: number;
  answer: string;
}

export interface Explanation {
  id: number;
  explanation: string;
}

export interface SubmittedAnswer {
  id: number;
  answer: string;
}

// API 응답 타입
// SSOT: specs/004-backend/api-spec.md 섹션 1

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'RATE_LIMITED' | 'INTERNAL_ERROR';
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// 학생 목록 조회 응답
export interface StudentListData {
  students: (Student & Pick<StudentProgress,
    'risk_score' | 'risk_level' | 'attendance_rate' | 'missed_sessions' |
    'assignment_submission_rate' | 'avg_quiz_score' | 'last_active_days_ago'
  >)[];
  total: number;
  summary: {
    stable: number;
    warning: number;
    at_risk: number;
  };
}

// 학생 상세 조회 응답
export interface StudentDetailData {
  student: Student;
  progress: StudentProgress;
  recovery_plans: RecoveryPlan[];
  intervention_messages: InterventionMessage[];
  mini_assessments: MiniAssessment[];
}

// AI 이탈 위험 예측
// SSOT: specs/005-ai/prediction-spec.md
export interface RiskPrediction {
  id: string;
  student_id: string;
  dropout_risk_score: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  primary_risk_factors: string[];
  trajectory: 'improving' | 'stable' | 'declining' | 'critical_decline';
  weeks_to_likely_dropout: number | null;
  confidence_basis: string;
  intervention_impact: string | null;
  recommended_actions: string[];
  created_at: string;
}

// 미니 진단 제출 응답
export interface AssessmentSubmitData {
  score: number;
  total: number;
  correct_answers: AnswerKey[];
  explanations: Explanation[];
  risk_score_before: number;
  risk_score_after: number;
  risk_level_before: RiskLevel;
  risk_level_after: RiskLevel;
}
