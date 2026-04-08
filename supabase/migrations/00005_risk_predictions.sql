-- AI 이탈 위험 예측 테이블
-- SSOT: specs/005-ai/prediction-spec.md 섹션 6

create table if not exists risk_predictions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  dropout_risk_score numeric(3,2) not null,
  risk_level text not null check (risk_level in ('critical','high','medium','low')),
  primary_risk_factors jsonb not null,
  trajectory text not null check (trajectory in ('improving','stable','declining','critical_decline')),
  weeks_to_likely_dropout integer,
  confidence_basis text not null,
  intervention_impact text,
  recommended_actions jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_risk_predictions_student
  on risk_predictions(student_id, created_at desc);
