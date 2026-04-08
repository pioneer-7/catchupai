-- 조직 테이블 + 데이터 테이블에 org_id 추가
-- SSOT: specs/004-backend/multi-tenant-spec.md

-- 1. organizations 테이블
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id),
  plan text not null default 'free' check (plan in ('free','pro','api')),
  created_at timestamptz not null default now()
);

-- 2. 데이터 테이블에 org_id 컬럼 추가
alter table courses add column if not exists org_id uuid references organizations(id);
alter table students add column if not exists org_id uuid references organizations(id);
alter table student_progress add column if not exists org_id uuid references organizations(id);
alter table recovery_plans add column if not exists org_id uuid references organizations(id);
alter table intervention_messages add column if not exists org_id uuid references organizations(id);
alter table mini_assessments add column if not exists org_id uuid references organizations(id);
alter table chat_sessions add column if not exists org_id uuid references organizations(id);
alter table risk_predictions add column if not exists org_id uuid references organizations(id);
alter table webhook_subscriptions add column if not exists org_id uuid references organizations(id);

-- 3. user_profiles에 org_id FK 추가 (이미 컬럼 존재하면 FK만)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'user_profiles_org_id_fkey'
  ) then
    alter table user_profiles
      add constraint user_profiles_org_id_fkey
      foreign key (org_id) references organizations(id);
  end if;
end $$;

-- 4. 인덱스
create index if not exists idx_organizations_owner on organizations(owner_id);
create index if not exists idx_courses_org on courses(org_id);
create index if not exists idx_students_org on students(org_id);
