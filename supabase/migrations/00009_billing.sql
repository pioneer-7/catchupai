-- 과금 테이블
-- SSOT: specs/004-backend/billing-spec.md 섹션 4

create table if not exists billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free','pro','api')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  portone_billing_key text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_billing_org on billing_subscriptions(org_id);

-- RLS
alter table billing_subscriptions enable row level security;
create policy "org_billing" on billing_subscriptions for all
  using (org_id = get_user_org_id());
