-- CatchUp AI — 테이블 생성 마이그레이션
-- SSOT: specs/001-domain/data-model.md

-- 1. courses
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  uploaded_material_text text,
  created_at timestamptz not null default now()
);

-- 2. students
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  cohort_name text,
  created_at timestamptz not null default now()
);

-- 3. student_progress
create table if not exists student_progress (
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

-- 4. recovery_plans
create table if not exists recovery_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  missed_concepts_summary text not null,
  recovery_steps_json jsonb not null,
  action_plan_text text not null,
  caution_points_text text,
  created_at timestamptz not null default now()
);

-- 5. intervention_messages
create table if not exists intervention_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  message_type text not null check (message_type in ('teacher','operator','student_support')),
  content text not null,
  created_at timestamptz not null default now()
);

-- 6. mini_assessments
create table if not exists mini_assessments (
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
