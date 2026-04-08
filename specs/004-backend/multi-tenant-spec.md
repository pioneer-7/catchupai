# 멀티테넌트 명세

> **SSOT 문서** — 조직 관리, org_id 격리, RLS 정책

---

## 1. 데이터 모델

### `organizations`

```sql
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id),
  plan text not null default 'free',
  created_at timestamptz not null default now()
);
```

### 기존 테이블에 `org_id` 추가

`courses`, `students`, `student_progress`, `recovery_plans`, `intervention_messages`, `mini_assessments`, `chat_sessions`, `risk_predictions` 모두에:

```sql
ALTER TABLE {table} ADD COLUMN org_id uuid REFERENCES organizations(id);
```

---

## 2. RLS 정책

모든 데이터 테이블에:

```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_isolation" ON {table}
  FOR ALL
  USING (org_id = (
    SELECT org_id FROM user_profiles WHERE id = auth.uid()
  ));
```

---

## 3. 자동 org 생성

회원가입 시:
1. `organizations` 생성 (이름 = 사용자 이메일 도메인 또는 "나의 기관")
2. `user_profiles.org_id` 할당

---

## Cross-references

- 인증 → [`004-backend/auth-spec.md`](./auth-spec.md)
- 과금 → [`004-backend/billing-spec.md`](./billing-spec.md)
