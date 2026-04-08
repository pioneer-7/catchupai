# CatchUp AI

> 수업을 놓친 학생이 완전히 이탈하기 전에, 교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는 **회복학습 AI 코파일럿**

## 해결하는 문제

교육 현장에서는 결석, 과제 미제출, 퀴즈 저성적이 누적되어도 교강사가 즉시 개입하기 어렵습니다. CatchUp AI는 학습 데이터를 분석해 **위험 학습자를 조기 탐지**하고, AI가 **맞춤형 회복학습 플랜과 개입 메시지를 자동 생성**합니다.

## 핵심 기능

| 기능 | 설명 |
|------|------|
| **위험 학습자 탐지** | 출결/과제/퀴즈/활동 데이터를 규칙 기반으로 분석해 위험도 자동 계산 (0~100점) |
| **AI 이탈 예측** | Claude AI 구조화 출력으로 이탈 확률, 궤적, 개입 효과 예측 |
| **회복학습 킷 생성** | AI가 강의자료와 학생 상태를 기반으로 3단계 맞춤 복습 플랜 생성 + PDF |
| **개입 메시지 생성** | 교강사/운영자가 학생에게 보낼 격려형 메시지 초안 자동 작성 |
| **미니 진단** | 회복 여부 확인용 3문항 자동 생성 + 채점 + 위험도 재계산 |
| **AI 교육 어시스턴트** | 교강사용 실시간 AI 상담 — 개입 전략, 교수법 조언 (스트리밍) |
| **교육 분석** | 이탈 퍼널, 코호트 위험 분포, 개입 효과 시각화 (Recharts) |
| **대시보드** | KPI 카드 + 위험도 분포 도넛 차트 + Top-N 위험 학생 |

## 플랫폼 통합

CatchUp AI는 독립 앱뿐 아니라, **기존 LMS/ERP에 통합 가능한 API 플랫폼**입니다.

| 기능 | 설명 | 링크 |
|------|------|------|
| **REST API v1** | 11개 엔드포인트, API 키 인증, OpenAPI 3.0 | [`/docs`](https://carchupai.vercel.app/docs) |
| **Webhook** | 이벤트 구독 (risk 변경, 회복학습 생성 등), HMAC 서명 | `POST /api/v1/webhooks` |
| **임베더블 위젯** | iframe으로 LMS에 삽입 가능한 위험 요약/학생 카드 | [`/integration`](https://carchupai.vercel.app/integration) |
| **LMS 통합 데모** | 가상 LMS에 위젯이 삽입된 모습 시연 | [`/demo/lms`](https://carchupai.vercel.app/demo/lms) |

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes (서버리스), Clean Architecture (Repository → Service → Route)
- **AI**: Claude API (@anthropic-ai/sdk) — 회복학습/메시지/진단 생성
- **Database**: Supabase (PostgreSQL)
- **Design**: Notion 디자인 시스템 기반 (따뜻한 중성 톤, whisper 보더)
- **Validation**: Zod, **API Docs**: OpenAPI 3.0 + Redoc

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

## 데모 시나리오 (5분)

1. 랜딩 → "샘플 데이터로 시작" 클릭
2. **대시보드** — KPI 카드 + 도넛 차트로 위험 현황 파악
3. **분석** — 이탈 퍼널 + 코호트 분포 + 개입 효과 차트
4. 가장 위험한 학생 클릭 → **학생 상세 (탭 UI)**
5. 📚 회복학습 탭 → AI 3단계 플랜 생성 → PDF 내보내기
6. 🔮 이탈 예측 탭 → AI 위험 평가 (이탈 확률 + 궤적 + 권장 조치)
7. 🎓 AI 어시스턴트 탭 → "이 학생에게 어떻게 개입?" 실시간 상담
8. 💬 메시지 탭 → 격려형 메시지 생성 + 복사
9. ✏️ 미니 진단 탭 → 3문항 응시 → 채점 → 위험도 변화 확인

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│  Client (Next.js App Router)                            │
│  Landing │ Dashboard │ Students │ Upload │ Widget/Demo  │
├─────────────────────────────────────────────────────────┤
│  API Routes (/api + /api/v1)  ←  Zod Validation        │
├─────────────────────────────────────────────────────────┤
│  Service Layer (5)            ←  Business Logic + AI    │
├─────────────────────────────────────────────────────────┤
│  Repository Layer (6)         ←  Supabase Queries       │
├─────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)  │  Claude AI  │  Webhook Dispatch│
└─────────────────────────────────────────────────────────┘
```

**위험도 계산은 AI가 아닌 규칙 기반 (deterministic)**으로 동작합니다. AI는 설명 생성, 학습 플랜, 문항 생성에만 활용됩니다.

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

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # 랜딩
│   ├── dashboard/              # 대시보드 (KPI + 차트)
│   ├── students/               # 학생 목록 + 상세 + AI 액션
│   ├── upload/                 # CSV/강의자료 업로드
│   ├── docs/                   # Swagger UI (API 문서)
│   ├── integration/            # 위젯 통합 가이드
│   ├── demo/lms/               # Mock LMS 데모
│   ├── widget/                 # 임베더블 위젯 (iframe)
│   ├── api/                    # API 라우트 (프론트엔드용)
│   └── api/v1/                 # API v1 (외부 통합용, 인증 필요)
├── services/                   # 비즈니스 로직 (5개)
├── repositories/               # 데이터 접근 (6개)
├── components/                 # UI 컴포넌트 (12개)
├── lib/                        # 공유 유틸리티
│   ├── ai.ts                   # Claude AI + fallback
│   ├── risk-scoring.ts         # 위험도 계산 (규칙 기반)
│   ├── validation.ts           # Zod 스키마
│   ├── api-auth.ts             # API 키 인증
│   ├── webhook-dispatcher.ts   # HMAC Webhook 발송
│   └── events.ts               # 도메인 이벤트 타입
└── types/                      # TypeScript 타입

specs/                          # SSOT 명세 문서 (29개)
supabase/migrations/            # DB 마이그레이션 SQL (3개)
scripts/                        # E2E 검증 스크립트
```

## 라이선스

이 프로젝트는 2026 KIT 바이브코딩 공모전 출품작입니다.
