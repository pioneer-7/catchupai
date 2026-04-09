# CatchUp AI — AI 활용 리포트

> 2026 KIT 바이브코딩 공모전 제출용

---

## 1. 프로젝트 개요

**CatchUp AI**는 학습 이탈 위험 학생을 조기에 탐지하고, Claude AI를 활용해 맞춤형 회복학습 플랜을 자동 생성하는 **교육 현장용 AI 코파일럿**입니다.

**핵심 가치**: 교강사가 수십 명의 학생을 일일이 파악하기 어려운 현실에서, AI가 데이터 기반으로 위험 학생을 발견하고 즉시 활용 가능한 개입 도구를 제공합니다.

---

## 2. AI 활용 전략

### 2.1 설계 철학: 규칙 기반 + AI 생성 분리

CatchUp AI는 AI를 "만능 도구"로 쓰지 않습니다. **결정론적 판단**과 **생성형 AI**의 역할을 명확히 분리했습니다.

| 영역 | 방식 | 이유 |
|------|------|------|
| **위험도 계산** (0~100점) | 규칙 기반 (5개 카테고리 + 보정) | 일관성, 설명 가능성, AI 비용 절감 |
| **회복학습 플랜 생성** | Claude AI (구조화 출력) | 학생 상태 + 강의자료 기반 맞춤 필요 |
| **개입 메시지 작성** | Claude AI (톤 선택) | 교강사/운영자별 어조 맞춤 필요 |
| **미니 진단 문항** | Claude AI (강의 기반) | 강의 내용 이해도 확인 문항 자동 생성 |
| **이탈 예측** | Claude AI (구조화 분석) | 패턴 기반 정성 분석 + 개입 효과 예측 |
| **교육 상담** | Claude AI (스트리밍) | 교강사의 실시간 질의응답 |

### 2.2 Claude API 6가지 활용

#### (1) 회복학습 킷 생성 (`generateRecoveryPlan`)
- **입력**: 학생 위험 프로필 + 강의자료 발췌
- **출력**: 놓친 개념 요약 + 3단계 복습 플랜 + 실행 계획 + 주의사항
- **프롬프트 전략**: 학생을 비난하지 않고, 실행 가능한 단계로 구성하도록 지시
- **출력 형식**: JSON (`recovery_steps: [{step, title, description}]`)

#### (2) 개입 메시지 생성 (`generateInterventionMessage`)
- **입력**: 학생 상태 + 메시지 유형 (교강사용/운영자용)
- **출력**: 격려형 메시지 초안
- **프롬프트 전략**: 학생의 상황을 구체적으로 언급하되, 압박감 주지 않는 톤

#### (3) 미니 진단 자동 생성 (`generateMiniAssessment`)
- **입력**: 강의 주제 + 학생 수준
- **출력**: 3문항 (객관식/주관식) + 정답 + 해설
- **프롬프트 전략**: 단순 암기가 아닌 이해도를 확인하는 문항으로 구성

#### (4) 이탈 예측 분석 (`generateRiskPrediction`)
- **입력**: 학습 패턴 데이터 (출결/과제/퀴즈/활동 추이)
- **출력**: 이탈 확률(%) + 궤적(improving/declining/critical) + 핵심 요인 + 개입 효과 예측
- **프롬프트 전략**: 구조화된 JSON으로 정량적 예측 요청

#### (5) AI 교육 어시스턴트 (`streamChatResponse`)
- **입력**: 교강사 질문 + 학생 컨텍스트 (스트리밍)
- **출력**: 실시간 마크다운 응답 (Server-Sent Events)
- **프롬프트 전략**: 교강사 관점의 시스템 프롬프트 — 개입 전략, 교수법 조언

#### (6) 자동 채점 (`generateMiniAssessment` 채점 모드)
- **입력**: 문항 + 학생 답변
- **출력**: 정오답 판정 + 해설 + 위험도 점수 갱신
- **프롬프트 전략**: 정답 키 기반 판정 + 학생에게 도움이 되는 해설 생성

---

## 3. 프롬프트 엔지니어링

### 3.1 System Prompt 설계

```
You are an educational recovery learning assistant.
Your job is to help teachers and operators support students who are at risk of falling behind.
Use only the provided course material and student progress data.
Do not speculate about personality, family, health, or private circumstances.
Do not shame or label the student.
Be concise, practical, and supportive.
Return output in the exact requested format.
```

**설계 원칙**:
- **역할 한정**: "교육 회복학습 보조" — 범용 AI가 아닌 특정 역할
- **데이터 제한**: "제공된 데이터만 사용" — 환각(hallucination) 방지
- **윤리 가드레일**: 학생 비난 금지, 사생활 추측 금지
- **출력 형식 강제**: "정확히 요청된 형식으로 반환" — JSON 구조화 보장

### 3.2 컨텍스트 구성 (`buildAiContext`)

AI에 전달되는 학생 컨텍스트를 구조화된 객체로 구성:

```typescript
{
  course_title: "데이터 분석 입문",
  course_material_excerpt: "3주차: 회귀분석 기초...",
  student_name: "김민수",
  risk_level: "at_risk",
  risk_score: 72,
  attendance_rate: 62,
  missed_sessions: 2,
  assignment_submission_rate: 45,
  avg_quiz_score: 58,
  last_active_days_ago: 9,
  risk_factors: "출석률 70% 미만, 과제 제출률 60% 미만, ..."
}
```

### 3.3 구조화 출력 (JSON)

모든 AI 응답을 JSON으로 요청하고, `extractJson()` 함수로 안전하게 파싱합니다:

```typescript
function extractJson(text: string): Record<string, unknown> | null {
  // 1. 마크다운 코드 블록 제거
  // 2. JSON 객체 추출 (정규식)
  // 3. JSON.parse 시도
  // 4. 실패 시 null 반환 → fallback 활성화
}
```

**이유**: LLM은 JSON 외에 설명 텍스트를 추가하는 경우가 있어, 정규식 기반 추출이 안정적입니다.

### 3.4 스트리밍 구현

AI 채팅은 Server-Sent Events(SSE)로 실시간 스트리밍합니다:

```
Client ←→ API Route ←→ Claude messages.stream()
                          ↓ (delta text)
                     SSE chunk 전송
                          ↓
                   react-markdown 실시간 렌더링
```

**UX 효과**: 사용자가 AI의 응답을 즉시 볼 수 있어 대기 시간 체감이 크게 줄어듭니다.

---

## 4. Fallback 체계

API 키 없거나, 크레딧 부족하거나, 네트워크 에러 발생 시 **전체 플로우가 중단되지 않도록** fallback 템플릿을 제공합니다.

```
Claude API 호출 시도
  ├── 성공 → AI 생성 결과 반환
  └── 실패 → 사전 정의된 fallback 템플릿 반환
              (회복학습 3단계 기본 플랜, 격려 메시지 기본 문구, 진단 기본 문항)
```

**이점**:
- 데모 환경에서 API 키 없이도 전체 기능 체험 가능
- 프로덕션에서 일시적 API 장애 시 서비스 중단 방지
- 비용 제어: 무료 티어 사용자는 fallback으로 기본 기능 제공

---

## 5. 비용 최적화

| 전략 | 설명 |
|------|------|
| **모델 선택** | claude-sonnet-4 (비용 대비 성능 최적) |
| **토큰 절약** | 구조화 출력으로 불필요한 텍스트 최소화 |
| **Fallback 우선** | 반복 요청은 캐시/fallback으로 처리 |
| **Rate Limit** | Free 티어: AI 5회/일 제한으로 과도한 사용 방지 |
| **컨텍스트 제한** | 강의자료는 발췌본(500자)만 전달 |

---

## 6. 기술적 구현 상세

### 6.1 Clean Architecture

```
Route Handler (요청 검증)
  → Service (비즈니스 로직 + AI 호출)
    → Repository (데이터 접근)
      → Supabase (PostgreSQL + RLS)
```

AI 호출은 Service 레이어에서만 발생하며, Repository는 순수한 데이터 접근만 담당합니다.

### 6.2 위험도 계산 (규칙 기반)

5개 카테고리 (결석 횟수, 출석률, 과제 제출률, 퀴즈 평균, 최근 활동) + 2개 보정 규칙 (동시 악화, 고위험 집중)으로 0~100점 산출:

- 0~29점: stable (안정)
- 30~59점: warning (주의)
- 60~100점: at_risk (위험)

### 6.3 테스트

- **Unit Test (Vitest)**: 위험도 계산 14개, Zod 검증 9개, Feature Gate 13개 = 36개
- **CI/CD (GitHub Actions)**: lint → typecheck → test → build 자동 실행

---

## 7. 바이브코딩 활용

이 프로젝트는 **Claude Code (Anthropic CLI)** 를 활용한 바이브코딩으로 개발되었습니다.

### 활용 방식

| 단계 | Claude Code 활용 |
|------|-----------------|
| **Spec 구조화** | 39개 명세 문서를 SSOT로 체계화 |
| **코드 생성** | Spec 기반 Repository → Service → Route 3-layer 코드 생성 |
| **UI 구현** | Notion + Linear 디자인 시스템 기반 23개 컴포넌트 |
| **AI 통합** | 프롬프트 설계, fallback 체계, 스트리밍 구현 |
| **테스트** | Vitest 테스트 36개 + Playwright E2E |
| **SaaS 전환** | Auth, RLS, Billing, Notification, Rate Limit 8일 스프린트 |

### Spec-Driven Development

모든 구현은 **specs 폴더의 명세 문서가 SSOT(Single Source of Truth)** 입니다:

1. 요구사항 → Spec 문서 작성 (39개)
2. Spec → 코드 구현 (Claude Code가 spec 참조)
3. 코드 → Spec 일치 검증

이 방식으로 일관된 품질과 추적 가능한 개발 히스토리를 유지합니다.

---

## 8. 결론

CatchUp AI는 Claude AI를 **6가지 교육 특화 기능**에 활용하면서, **규칙 기반 분석과 AI 생성을 분리**하는 하이브리드 아키텍처를 채택했습니다. Fallback 체계로 안정성을 확보하고, 스트리밍 UX로 사용자 경험을 극대화했습니다.

**핵심 차별점**:
- 위험도 계산은 deterministic → 설명 가능성과 일관성
- AI는 생성 작업에만 집중 → 비용 효율 + 품질
- Fallback 체계 → API 장애에도 서비스 무중단
- Spec-Driven → Claude Code 바이브코딩의 체계적 활용
