# 인증 시스템 명세

> **SSOT 문서** — Supabase Auth, 이메일/Google 로그인, AuthModal UX, 보호 라우트

---

## 1. 인증 방식

- **Provider**: Supabase Auth (내장)
- **방법**: 이메일/비밀번호 + Google OAuth
- **패키지**: `@supabase/ssr`

---

## 2. UX 플로우

### 2.1 NavHeader 상태

| 상태 | 우상단 표시 |
|------|-----------|
| 미로그인 | "Sign Up" 버튼 (primary) + "Login" 버튼 (ghost) |
| 로그인 | 사용자 이니셜 아바타 + 드롭다운 (설정, 로그아웃) |

### 2.2 기능 사용 시 인증 요구

다음 액션 클릭 시, 미로그인이면 **AuthModal** 표시:
- 샘플 데이터 로드
- CSV/강의자료 업로드
- AI 생성 (회복학습, 메시지, 진단, 예측, 코칭)
- 분석 페이지 접근

### 2.3 AuthModal (한 화면 인증)

```
┌─────────────────────────────────┐
│  CatchUp AI 로고                 │
├────────────┬────────────────────┤
│  [로그인]   │  [회원가입]         │  ← 탭 전환
├────────────┴────────────────────┤
│  이메일: [________________]      │
│  비밀번호: [________________]    │
│  [로그인 / 가입하기] 버튼        │
│  ─────── 또는 ───────           │
│  [Google로 계속하기] 버튼        │
└─────────────────────────────────┘
```

- 모달 닫기: 배경 클릭 또는 X 버튼
- 인증 완료 → 모달 닫힘 → **원래 액션 자동 실행**
- 에러: 폼 하단에 인라인 메시지

---

## 3. 라우트 보호

### middleware.ts

| 라우트 | 보호 | 미인증 시 |
|--------|------|----------|
| `/` (랜딩) | 공개 | - |
| `/pricing` | 공개 | - |
| `/docs` | 공개 | - |
| `/dashboard` | 보호 | 리다이렉트 → `/` |
| `/students/*` | 보호 | 리다이렉트 → `/` |
| `/analytics` | 보호 | 리다이렉트 → `/` |
| `/upload` | 보호 | 리다이렉트 → `/` |
| `/onboarding` | 보호 | 리다이렉트 → `/` |
| `/settings/*` | 보호 | 리다이렉트 → `/` |
| `/api/*` | 공개 (기존 로직 유지) | - |
| `/widget/*` | 공개 (API 키 인증) | - |

---

## 4. 데이터 모델

### `user_profiles` 테이블

```sql
create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  org_id uuid,
  role text not null default 'teacher' check (role in ('admin','teacher','operator')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 5. Supabase 클라이언트

### 서버 (SSR)

```typescript
// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
```

### 브라우저

```typescript
// src/lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr';
```

---

## 6. OAuth 콜백

**경로**: `/auth/callback`

- Google OAuth 리다이렉트 수신
- 코드 → 세션 교환
- `user_profiles` 자동 생성 (없으면)
- 리다이렉트 → `/onboarding` (첫 로그인) 또는 `/dashboard`

---

## Cross-references

- 멀티테넌트 → [`004-backend/multi-tenant-spec.md`](./multi-tenant-spec.md)
- 과금 → [`004-backend/billing-spec.md`](./billing-spec.md)
- 온보딩 → [`003-frontend/onboarding-spec.md`](../003-frontend/onboarding-spec.md)
