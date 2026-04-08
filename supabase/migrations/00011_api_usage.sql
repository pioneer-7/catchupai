-- API 사용량 추적 테이블
-- SSOT: specs/004-backend/rate-limit-spec.md

create table if not exists api_usage (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  endpoint text not null,
  count integer not null default 0,
  date date not null default current_date,
  unique(org_id, endpoint, date)
);

create index if not exists idx_api_usage_org_date on api_usage(org_id, date);

-- RLS
alter table api_usage enable row level security;
create policy "org_usage" on api_usage for all
  using (org_id = get_user_org_id());
