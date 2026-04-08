-- Webhook 시스템 테이블
-- SSOT: specs/004-backend/webhook-spec.md 섹션 5

create table if not exists webhook_subscriptions (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  events text[] not null,
  secret text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references webhook_subscriptions(id) on delete cascade,
  event text not null,
  payload jsonb not null,
  status text not null check (status in ('pending','success','failed')),
  response_status integer,
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_webhook_deliveries_subscription
  on webhook_deliveries(subscription_id);

create index if not exists idx_webhook_deliveries_status
  on webhook_deliveries(status);
