# CatchUp AI

> 수업을 놓친 학생이 완전히 이탈하기 전에, 교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는 **회복학습 AI 코파일럿**

## 해결하는 문제

교육 현장에서는 결석, 과제 미제출, 퀴즈 저성적이 누적되어도 교강사가 즉시 개입하기 어렵습니다. CatchUp AI는 학습 데이터를 분석해 **위험 학습자를 조기 탐지**하고, AI가 **맞춤형 회복학습 플랜과 개입 메시지를 자동 생성**합니다.

## 핵심 기능

| 기능 | 설명 |
|------|------|
| **위험 학습자 탐지** | 출결/과제/퀴즈/활동 데이터를 규칙 기반으로 분석해 위험도 자동 계산 (0~100점) |
| **회복학습 킷 생성** | AI가 강의자료와 학생 상태를 기반으로 3단계 맞춤 복습 플랜 생성 |
| **개입 메시지 생성** | 교강사/운영자가 학생에게 보낼 격려형 메시지 초안 자동 작성 |
| **미니 진단** | 회복 여부 확인용 3문항 자동 생성 + 채점 + 위험도 재계산 |
| **대시보드** | 전체 학생 현황 한눈에 파악, 위험도별 필터/정렬 |

## 기술 스택

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes (서버리스)
- **AI**: Claude API (@anthropic-ai/sdk) — 회복학습/메시지/진단 생성
- **Database**: Supabase (PostgreSQL) — MVP에서는 인메모리 스토어 병행
- **Design**: Notion 디자인 시스템 기반 (따뜻한 중성 톤, whisper 보더)

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

## 데모 시나리오 (3분)

1. 랜딩 → "샘플 데이터로 시작" 클릭
2. 대시보드에서 위험 학생 수 확인 (KPI 카드 4개)
3. 가장 위험한 학생 클릭 → 학생 상세
4. "회복학습 생성" → AI가 3단계 복습 플랜 생성
5. "개입 메시지 생성" → 격려형 메시지 + 복사 버튼
6. "미니 진단 생성" → 3문항 응시 → 제출
7. 채점 결과 확인 → 위험 점수 변화 확인

## 아키텍처

```
사용자
  │
  ├── CSV 업로드 ──→ 파싱 + 위험도 계산 (규칙 기반) ──→ 인메모리 스토어
  │
  ├── 대시보드 ──→ GET /api/students ──→ KPI 집계 + 학생 목록
  │
  └── 학생 상세 ──→ POST /api/students/[id]/recovery-plan ──→ Claude AI
                 ──→ POST /api/students/[id]/intervention-message ──→ Claude AI
                 ──→ POST /api/students/[id]/mini-assessment ──→ Claude AI
                 ──→ POST /api/students/[id]/mini-assessment/submit ──→ 채점 + 위험도 갱신
```

**위험도 계산은 AI가 아닌 규칙 기반 (deterministic)**으로 동작합니다. AI는 설명 생성, 학습 플랜, 문항 생성에만 활용됩니다.

## 환경변수

| 변수 | 용도 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 선택* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 키 | 선택* |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 서버 전용 키 | 선택* |
| `ANTHROPIC_API_KEY` | Claude API 키 | 선택** |

\* MVP에서는 인메모리 스토어로 Supabase 없이 동작  
\*\* 없으면 fallback 템플릿으로 AI 기능 대체

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx            # 랜딩
│   ├── dashboard/          # 대시보드
│   ├── students/           # 학생 목록 + 상세
│   ├── upload/             # 데이터 업로드
│   └── api/                # API 라우트 (9개 엔드포인트)
├── components/             # 공유 UI 컴포넌트
├── lib/                    # 비즈니스 로직
│   ├── risk-scoring.ts     # 위험도 계산 (규칙 기반)
│   ├── ai.ts               # Claude AI 통합 + fallback
│   ├── store.ts            # 인메모리 데이터 스토어
│   └── sample-data.ts      # 샘플 데이터
└── types/                  # TypeScript 타입 정의

specs/                      # SSOT 명세 문서 (22개 파일)
supabase/migrations/        # DB 마이그레이션 SQL
```

## 라이선스

이 프로젝트는 2026 KIT 바이브코딩 공모전 출품작입니다.
