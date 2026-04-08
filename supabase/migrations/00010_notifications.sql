-- 알림 테이블
-- SSOT: specs/004-backend/notification-spec.md

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid references organizations(id),
  type text not null,
  title text not null,
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_unread
  on notifications(user_id, read, created_at desc);

-- RLS
alter table notifications enable row level security;
create policy "own_notifications" on notifications for all
  using (user_id = auth.uid());
