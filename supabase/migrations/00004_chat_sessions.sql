-- AI 코칭 챗봇 세션 테이블
-- SSOT: specs/005-ai/chat-spec.md 섹션 5

create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  messages jsonb not null default '[]',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chat_sessions_student
  on chat_sessions(student_id, created_at desc);
