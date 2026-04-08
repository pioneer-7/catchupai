-- Row Level Security 정책
-- SSOT: specs/004-backend/multi-tenant-spec.md 섹션 2

-- RLS 활성화
alter table courses enable row level security;
alter table students enable row level security;
alter table student_progress enable row level security;
alter table recovery_plans enable row level security;
alter table intervention_messages enable row level security;
alter table mini_assessments enable row level security;
alter table chat_sessions enable row level security;
alter table risk_predictions enable row level security;
alter table user_profiles enable row level security;
alter table organizations enable row level security;

-- org 기반 격리 정책 (데이터 테이블)
-- 사용자의 org_id와 일치하는 행만 접근
create or replace function get_user_org_id()
returns uuid as $$
  select org_id from user_profiles where id = auth.uid();
$$ language sql security definer stable;

-- courses
create policy "org_isolation" on courses for all
  using (org_id = get_user_org_id() or org_id is null);

-- students
create policy "org_isolation" on students for all
  using (org_id = get_user_org_id() or org_id is null);

-- student_progress
create policy "org_isolation" on student_progress for all
  using (org_id = get_user_org_id() or org_id is null);

-- recovery_plans
create policy "org_isolation" on recovery_plans for all
  using (org_id = get_user_org_id() or org_id is null);

-- intervention_messages
create policy "org_isolation" on intervention_messages for all
  using (org_id = get_user_org_id() or org_id is null);

-- mini_assessments
create policy "org_isolation" on mini_assessments for all
  using (org_id = get_user_org_id() or org_id is null);

-- chat_sessions
create policy "org_isolation" on chat_sessions for all
  using (org_id = get_user_org_id() or org_id is null);

-- risk_predictions
create policy "org_isolation" on risk_predictions for all
  using (org_id = get_user_org_id() or org_id is null);

-- notifications 정책은 테이블 생성 시 추가 (Day 5)

-- user_profiles (본인만)
create policy "own_profile" on user_profiles for all
  using (id = auth.uid());

-- organizations (소속 org만)
create policy "own_org" on organizations for all
  using (id = get_user_org_id() or owner_id = auth.uid());

-- service_role은 RLS 우회 (API routes에서 사용)
