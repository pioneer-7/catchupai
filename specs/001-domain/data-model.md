# 데이터 모델

> **SSOT 문서** — 엔티티 정의, 테이블 DDL, 관계도, CSV 업로드 계약, TypeScript 타입

---

## 1. 설계 원칙

- MVP에서는 **간단하고 설명 가능한 구조**를 유지한다.
- 학생, 과정, 진행상태, AI 산출물은 분리 저장한다.
- AI 결과물은 재생성 가능하지만, 데모 안정성을 위해 저장한다.

---

## 2. 엔티티 개요

| 테이블 | 설명 |
|--------|------|
| `courses` | 과정/수업 단위 정보 |
| `students` | 학생 기본 정보 |
| `student_progress` | 학생의 과정별 학습 상태 + 위험도 |
| `recovery_plans` | AI 생성 회복학습 결과 |
| `intervention_messages` | AI 생성 개입 메시지 |
| `mini_assessments` | AI 생성 미니 진단 |

---

## 3. 테이블 정의

### 3.1 `courses`

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  uploaded_material_text text,
  created_at timestamptz not null default now()
);
```

| 필드 | 설명 |
|------|------|
| `title` | 강의/과정명 |
| `description` | 과정 설명 |
| `uploaded_material_text` | PDF/텍스트 업로드 후 추출된 본문 |

### 3.2 `students`

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  cohort_name text,
  created_at timestamptz not null default now()
);
```

| 필드 | 설명 |
|------|------|
| `name` | 학생명 |
| `email` | 선택 |
| `cohort_name` | 반/기수명 |

### 3.3 `student_progress`

```sql
create table student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  attendance_rate numeric(5,2) not null,
  missed_sessions integer not null,
  assignment_submission_rate numeric(5,2) not null,
  avg_quiz_score numeric(5,2) not null,
  last_active_days_ago integer not null,
  risk_score integer not null,
  risk_level text not null check (risk_level in ('stable','warning','at_risk')),
  risk_factors_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, course_id)
);
```

| 필드 | 설명 |
|------|------|
| `risk_score` | 0~100 정수, 규칙기반 계산 |
| `risk_level` | `stable / warning / at_risk` |
| `risk_factors_json` | 계산된 위험 요인 배열 (→ [`risk-scoring.md`](./risk-scoring.md) 참조) |

### 3.4 `recovery_plans`

```sql
create table recovery_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  missed_concepts_summary text not null,
  recovery_steps_json jsonb not null,
  action_plan_text text not null,
  caution_points_text text,
  created_at timestamptz not null default now()
);
```

#### `recovery_steps_json` 예시

```json
[
  {
    "step": 1,
    "title": "핵심 개념 다시 보기",
    "description": "회귀분석의 목적과 입력 변수를 먼저 복습합니다."
  },
  {
    "step": 2,
    "title": "짧은 예제로 확인",
    "description": "작은 데이터셋으로 예측 문제를 다시 풀어봅니다."
  }
]
```

### 3.5 `intervention_messages`

```sql
create table intervention_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  message_type text not null check (message_type in ('teacher','operator','student_support')),
  content text not null,
  created_at timestamptz not null default now()
);
```

### 3.6 `mini_assessments`

```sql
create table mini_assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  questions_json jsonb not null,
  answer_key_json jsonb not null,
  explanation_json jsonb not null,
  submitted_answers_json jsonb,
  score integer,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 4. 관계도

```
courses 1 ──── N student_progress
students 1 ──── N student_progress
students 1 ──── N recovery_plans
students 1 ──── N intervention_messages
students 1 ──── N mini_assessments
courses 1 ──── N recovery_plans
courses 1 ──── N intervention_messages
courses 1 ──── N mini_assessments
```

- 한 `course`는 여러 `student_progress`를 가진다.
- 한 `student`는 여러 `student_progress`를 가질 수 있다.
- 한 학생-과정 조합은 여러 `recovery_plan`, `mini_assessment`, `intervention_message`를 가질 수 있다.

---

## 5. CSV 업로드 계약

### 컬럼 스키마

| column | type | required | 설명 |
|--------|------|----------|------|
| `student_name` | string | Y | 학생 이름 |
| `email` | string | N | 학생 이메일 |
| `cohort_name` | string | N | 반/기수 |
| `attendance_rate` | number | Y | 출석률 (0~100) |
| `missed_sessions` | integer | Y | 결석 횟수 |
| `assignment_submission_rate` | number | Y | 과제 제출률 (0~100) |
| `avg_quiz_score` | number | Y | 평균 퀴즈 점수 (0~100) |
| `last_active_days_ago` | integer | Y | 마지막 활동 이후 경과일 |
| `notes` | string | N | 참고 메모 |

### 샘플 CSV

```csv
student_name,email,cohort_name,attendance_rate,missed_sessions,assignment_submission_rate,avg_quiz_score,last_active_days_ago,notes
김민수,minsu@example.com,데이터분석 1기,62,2,45,58,9,최근 과제 미제출이 이어짐
이지은,jieun@example.com,데이터분석 1기,88,0,92,81,1,안정적 수강 중
박서준,seojun@example.com,데이터분석 1기,79,1,70,66,5,기초 개념 복습 필요
최수아,sua@example.com,데이터분석 1기,48,3,30,35,16,결석 및 활동 공백 심함
```

---

## 6. 애플리케이션 타입 정의

```ts
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
```

---

## 7. 인덱스 권장

```sql
create index idx_student_progress_course_id on student_progress(course_id);
create index idx_student_progress_risk_level on student_progress(risk_level);
create index idx_student_progress_risk_score on student_progress(risk_score desc);
create index idx_recovery_plans_student_course on recovery_plans(student_id, course_id);
create index idx_intervention_messages_student_course on intervention_messages(student_id, course_id);
create index idx_mini_assessments_student_course on mini_assessments(student_id, course_id);
```

---

## 8. MVP 단순화 원칙

- `users`, `roles`, `organizations` 테이블은 이번 대회에서 제외
- 인증 없이 샘플 데모 기준으로 충분
- 멀티 코스 지원은 구조상 열어두되 UI는 단일 코스로 시작

---

## Cross-references

- 위험도 계산 규칙 → [`001-domain/risk-scoring.md`](./risk-scoring.md)
- AI 출력 스키마 → [`001-domain/ai-contracts.md`](./ai-contracts.md)
- CSV 업로드 API → [`004-backend/upload-parser-spec.md`](../004-backend/upload-parser-spec.md)
- 저장 계층 → [`004-backend/persistence-spec.md`](../004-backend/persistence-spec.md)
