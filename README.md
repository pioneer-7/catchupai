# CatchUp AI

> 수업을 놓친 학생이 완전히 이탈하기 전에, 교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는 **회복학습 AI 코파일럿**

[![Tests](https://img.shields.io/badge/tests-36%20passed-brightgreen)](#테스트)
[![Pages](https://img.shields.io/badge/pages-14-blue)](#페이지-구성)
[![API](https://img.shields.io/badge/REST%20API-11%20endpoints-orange)](#플랫폼-통합)
[![AI](https://img.shields.io/badge/AI%20features-5-purple)](#ai-활용-전략)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-yellow)](#cicd)

**Live Demo**: [https://carchupai.vercel.app](https://carchupai.vercel.app)

---

## 해결하는 문제

교육 현장에서는 결석, 과제 미제출, 퀴즈 저성적이 누적되어도 교강사가 즉시 개입하기 어렵습니다. CatchUp AI는 학습 데이터를 분석해 **위험 학습자를 조기 탐지**하고, AI가 **맞춤형 회복학습 플랜과 개입 메시지를 자동 생성**합니다.

---

## 핵심 기능

| 기능 | 설명 |
|------|------|
| **위험 학습자 탐지** | 출결/과제/퀴즈/활동 데이터를 규칙 기반으로 분석해 위험도 자동 계산 (0~100점) |
| **AI 이탈 예측** | Claude AI 구조화 출력으로 이탈 확률, 궤적, 개입 효과 예측 |
| **회복학습 킷 생성** | AI가 강의자료와 학생 상태를 기반으로 3단계 맞춤 복습 플랜 생성 + PDF |
| **개입 메시지 생성** | 교강사/운영자가 학생에게 보낼 격려형 메시지 초안 자동 작성 |
| **미니 진단** | 회복 여부 확인용 3문항 자동 생성 + 채점 + 위험도 재계산 |
| **AI 교육 어시스턴트** | 교강사용 실시간 AI 상담 — 개입 전략, 교수법 조언 (스트리밍 + 마크다운) |
| **교육 분석** | 이탈 퍼널, 코호트 위험 분포, 개입 효과 시각화 (Recharts) |
| **대시보드** | KPI 카드 + 위험도 분포 도넛 차트 + Top-N 위험 학생 |

---

## SaaS 기능

| 기능 | 설명 |
|------|------|
| **인증** | Supabase Auth (이메일/비밀번호 + Google OAuth), SSR 미들웨어 라우트 보호 |
| **멀티테넌시** | 조직 기반 데이터 격리 (org_id + RLS 정책) |
| **요금제** | Free / Pro (₩15,900) / API 3-tier, Feature Gate 기반 접근 제어 |
| **알림 시스템** | 인앱 알림 벨 — 위험 감지, 이탈 예측, 회복학습 생성, 채점 완료 이벤트 |
| **온보딩** | 3단계 가이드 (업로드 → 대시보드 → AI 생성), 첫 로그인 자동 시작 |
| **레이트 리밋** | 티어별 AI 호출 한도 (Free 5회/일), 사용량 대시보드 |

---

## AI 활용 전략

CatchUp AI는 **규칙 기반 분석(deterministic)** 과 **AI 생성(generative)** 을 명확히 분리합니다.

### 규칙 기반 (risk-scoring.ts)

위험도 점수(0~100)는 출결/과제/퀴즈/활동 데이터를 5개 카테고리 + 보정 규칙으로 **결정론적**으로 계산합니다. AI에 의존하지 않아 일관성과 설명 가능성을 보장합니다.

### AI 생성 (ai.ts — Claude API)

| AI 기능 | 프롬프트 전략 | 출력 형식 |
|---------|-------------|----------|
| **회복학습 플랜** | 학생 상태 + 강의자료 컨텍스트 → 3단계 플랜 | JSON (steps[]) |
| **개입 메시지** | 위험 요인 + 교강사/운영자 톤 선택 | JSON (messages[]) |
| **미니 진단** | 강의 주제 기반 3문항 + 보기 + 정답 | JSON (questions[]) |
| **이탈 예측** | 학습 패턴 + 위험 요인 → 확률/궤적/개입효과 | JSON (structured) |
| **AI 채팅** | 교강사용 시스템 프롬프트 + 학생 컨텍스트 | 스트리밍 마크다운 |
| **채점 + 위험도 재계산** | 정답 키 비교(규칙 기반) → 위험도 점수 보정 | 규칙 기반 |

### 프롬프트 엔지니어링 핵심

- **구조화 출력**: 모든 AI 응답을 JSON으로 요청 → `extractJson()`으로 안전 파싱
- **System Prompt 분리**: 역할 정의 + 학생 컨텍스트 + 출력 형식 지시를 구분
- **Fallback 체계**: API 키 없거나 에러 시 → 템플릿 기반 fallback으로 전체 플로우 보장
- **스트리밍 UX**: `messages.stream()` → Server-Sent Events → 실시간 타이핑 효과
- **마크다운 렌더링**: AI 응답을 react-markdown으로 구조화 표시

---

## 플랫폼 통합

CatchUp AI는 독립 앱뿐 아니라, **기존 LMS/ERP에 통합 가능한 API 플랫폼**입니다.

| 기능 | 설명 | 링크 |
|------|------|------|
| **REST API v1** | 11개 엔드포인트, API 키 인증, OpenAPI 3.0 | [`/docs`](https://carchupai.vercel.app/docs) |
| **Webhook** | 이벤트 구독 (risk 변경, 회복학습 생성 등), HMAC-SHA256 서명 | `POST /api/v1/webhooks` |
| **임베더블 위젯** | iframe으로 LMS에 삽입 가능한 위험 요약/학생 카드 | [`/integration`](https://carchupai.vercel.app/integration) |
| **LMS 통합 데모** | 가상 LMS에 위젯이 삽입된 모습 시연 | [`/demo/lms`](https://carchupai.vercel.app/demo/lms) |

---

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Next.js API Routes (서버리스), Clean Architecture (Repository → Service → Route) |
| **AI** | Claude API (`@anthropic-ai/sdk`) — 스트리밍, 구조화 출력, fallback 체계 |
| **Database** | Supabase (PostgreSQL), Row Level Security, 11개 마이그레이션 |
| **Auth** | Supabase Auth (`@supabase/ssr`), 이메일/비밀번호 + Google OAuth |
| **Design** | Notion + Linear 하이브리드 디자인 시스템 (따뜻한 중성 톤, lucide-react 아이콘) |
| **Validation** | Zod 스키마 검증 |
| **API Docs** | OpenAPI 3.0 + Redoc |
| **Testing** | Vitest (36 unit tests), Playwright (E2E) |
| **CI/CD** | GitHub Actions (lint → typecheck → test → build) |
| **Deploy** | Vercel (자동 배포) |

---

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 파일에 Supabase URL/Key와 Anthropic API Key 입력

# 3. 개발 서버 시작
npm run dev
```

http://localhost:3000 접속 → **"샘플 데이터로 시작"** 클릭으로 즉시 데모

> **API 키 없이도 동작합니다.** AI 기능은 fallback 템플릿으로 대체되어 전체 플로우를 체험할 수 있습니다.

---

## 데모 시나리오 (5분)

1. 랜딩 → "샘플 데이터로 시작" 클릭
2. **대시보드** — KPI 카드 + 도넛 차트로 위험 현황 파악
3. **분석** — 이탈 퍼널 + 코호트 분포 + 개입 효과 차트
4. 가장 위험한 학생 클릭 → **학생 상세 (6탭 UI)**
5. 회복학습 탭 → AI 3단계 플랜 생성 → PDF 내보내기
6. 이탈 예측 탭 → AI 위험 평가 (이탈 확률 + 궤적 + 권장 조치)
7. AI 어시스턴트 탭 → "이 학생에게 어떻게 개입?" 실시간 스트리밍 상담
8. 메시지 탭 → 격려형 메시지 생성 + 복사
9. 미니 진단 탭 → 3문항 응시 → 채점 → 위험도 변화 확인
10. **가격 페이지** → Free / Pro / API 요금제 확인
11. **알림 벨** → 위험 감지/예측/생성 완료 알림 확인

---

## 아키텍처

```
┌──────────────────────────────────────────────────────────────┐
│  Client (Next.js 16 App Router)                              │
│  Landing │ Dashboard │ Students │ Analytics │ Upload │ Docs  │
│  Pricing │ Onboarding │ Settings │ Widget │ Demo             │
├──────────────────────────────────────────────────────────────┤
│  Middleware (Auth Guard)     ←  Supabase SSR Session          │
├──────────────────────────────────────────────────────────────┤
│  API Routes (/api + /api/v1)  ←  Zod Validation + Rate Limit │
├──────────────────────────────────────────────────────────────┤
│  Service Layer (8)            ←  Business Logic + AI + Events │
├──────────────────────────────────────────────────────────────┤
│  Repository Layer (11)        ←  Supabase Queries + RLS       │
├──────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)  │  Claude AI  │  Webhook  │  Notify  │
│  Auth + RLS + Multi-tenant              │  HMAC     │  In-App  │
└──────────────────────────────────────────────────────────────┘
```

**설계 원칙**: 위험도 계산은 AI가 아닌 **규칙 기반(deterministic)** 으로 동작합니다. AI는 설명 생성, 학습 플랜, 문항 생성, 예측에만 활용됩니다.

---

## 테스트

```bash
# Unit Tests (Vitest)
npm test          # 36 tests pass

# E2E Tests (Playwright)
npx playwright test
```

### Unit Test 커버리지

| 모듈 | 테스트 수 | 내용 |
|------|----------|------|
| `risk-scoring` | 14 | stable/warning/at_risk 판정, clamp, 경계값, 점수 보정 |
| `validation` | 9 | Zod 스키마 (AssessmentSubmit, StudentUpload, MessageType) |
| `feature-gate` | 13 | Free/Pro/API 플랜별 기능 접근 제어 |

### CI/CD

GitHub Actions가 `main` push/PR마다 자동 실행:

```
lint → typecheck → test (36) → build
```

---

## 페이지 구성

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 랜딩 | 히어로 + 기능 소개 + CTA |
| `/dashboard` | 대시보드 | KPI 카드 + 도넛 차트 + Top-N |
| `/students` | 학생 목록 | 정렬/검색 + 위험 배지 |
| `/students/[id]` | 학생 상세 | 6탭 (회복학습/메시지/진단/예측/AI챗/활동) |
| `/analytics` | 분석 | 이탈 퍼널 + 코호트 + 개입 효과 |
| `/upload` | 업로드 | CSV 드래그앤드롭 + 강의자료 |
| `/pricing` | 가격 | Free/Pro/API 3-tier 카드 |
| `/onboarding` | 온보딩 | 3단계 가이드 위저드 |
| `/settings/usage` | 사용량 | API 사용량 + 한도 |
| `/docs` | API 문서 | Redoc (OpenAPI 3.0) |
| `/integration` | 통합 가이드 | 위젯 embed 코드 생성 |
| `/demo/lms` | LMS 데모 | 가상 LMS + 위젯 삽입 시연 |
| `/widget/*` | 위젯 | iframe 임베드용 (2종) |

---

## 환경변수

| 변수 | 용도 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 예 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | 예 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서버 전용 키 | 예 |
| `ANTHROPIC_API_KEY` | Claude API 키 | 선택* |
| `CATCHUP_API_KEY` | 외부 API 인증 키 | 선택** |

\* 없으면 fallback 템플릿으로 AI 기능 대체
\*\* 미설정 시 API 인증 건너뜀 (개발 모드)

---

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router (14 pages)
│   ├── page.tsx                # 랜딩
│   ├── dashboard/              # 대시보드 (KPI + 차트)
│   ├── students/               # 학생 목록 + 상세 (6탭 AI 액션)
│   ├── analytics/              # 교육 분석 (퍼널 + 코호트 + 개입효과)
│   ├── upload/                 # CSV/강의자료 업로드
│   ├── pricing/                # 가격 페이지 (3-tier)
│   ├── onboarding/             # 온보딩 위저드 (3단계)
│   ├── settings/usage/         # 사용량 대시보드
│   ├── docs/                   # API 문서 (Redoc)
│   ├── integration/            # 위젯 통합 가이드
│   ├── demo/lms/               # Mock LMS 데모
│   ├── widget/                 # 임베더블 위젯 (iframe)
│   ├── auth/callback/          # OAuth 리다이렉트
│   ├── api/                    # API 라우트 (프론트엔드용)
│   └── api/v1/                 # API v1 (외부 통합용, 인증 필요)
├── services/ (8)               # 비즈니스 로직 + AI 호출
├── repositories/ (11)          # 데이터 접근 (Supabase)
├── components/ (23)            # UI 컴포넌트 (Notion+Linear 디자인)
├── lib/                        # 공유 유틸리티
│   ├── ai.ts                   # Claude AI 통합 (5 기능 + fallback)
│   ├── risk-scoring.ts         # 위험도 계산 (규칙 기반)
│   ├── validation.ts           # Zod 스키마
│   ├── feature-gate.ts         # 요금제별 기능 제어
│   ├── rate-limiter.ts         # API 사용량 제한
│   ├── api-auth.ts             # API 키 인증
│   ├── webhook-dispatcher.ts   # HMAC Webhook 발송
│   └── events.ts               # 도메인 이벤트 타입
└── types/                      # TypeScript 타입

specs/ (39)                     # SSOT 명세 문서
supabase/migrations/ (11)       # DB 마이그레이션 SQL
tests/lib/ (3)                  # Unit tests (Vitest)
.github/workflows/              # CI/CD (GitHub Actions)
```

---

## 라이선스

이 프로젝트는 2026 KIT 바이브코딩 공모전 출품작입니다.
