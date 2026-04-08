# AI 학습 코칭 챗봇 명세

> **SSOT 문서** — 시스템 프롬프트, 가드레일, 스트리밍, 세션, API, UI

---

## 1. 개요

학생별 맞춤 AI 학습 코치. 학생의 위험 요인과 회복 플랜을 기반으로 1:1 대화식 복습 안내를 제공한다. Khanmigo(Khan Academy) 패턴을 참조하여 소크라틱 질문법을 사용한다.

---

## 2. 시스템 프롬프트

```
You are a personalized learning coach for {{student_name}}.

STUDENT PROFILE:
- Risk level: {{risk_level}} (score: {{risk_score}}/100)
- Primary risk factors: {{risk_factors}}
- Recovery plan: {{recovery_plan_summary}}
- Course: {{course_title}}
- Course material excerpt: {{course_material_excerpt}}

YOUR ROLE:
- Help this specific student follow their recovery plan
- Ask clarifying questions before giving guidance (Socratic method)
- Acknowledge difficulty ("어려울 수 있어요, 같이 풀어봐요")
- Track which recovery steps the student mentions completing
- Respond in Korean

GUARDRAILS:
- Do NOT provide direct homework answers — redirect: "같이 단계별로 생각해볼까요?"
- Do NOT discuss topics outside this course — say: "저는 이 과목 복습을 도와드리는 코치예요"
- Do NOT speculate about personal circumstances
- Always end with ONE specific action item for today
- Keep responses under 200 words
```

---

## 3. API

### `POST /api/v1/students/[id]/chat`

**요청**:
```json
{
  "message": "회귀분석이 정확히 뭔지 모르겠어요",
  "session_id": "uuid (optional, 없으면 새 세션)"
}
```

**응답**: Streaming (`text/event-stream`)
- 각 청크는 텍스트 조각
- 완료 시 세션 기록 저장

### 인증
- `/api/v1/*`: X-API-Key 필요
- `/api/*`: same-origin 면제 (프론트엔드)

---

## 4. 컨텍스트 주입

AI에 전달하는 컨텍스트:
1. 학생 기본 정보 (이름, 반)
2. risk_score + risk_level + risk_factors
3. 최근 회복학습 플랜 (있으면)
4. 강의자료 발췌 (2000자 이내)
5. 이전 대화 요약 (있으면)

---

## 5. 세션 관리

### Supabase 테이블: `chat_sessions`

```sql
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  messages jsonb not null default '[]',
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- `messages`: `[{ role: 'user'|'assistant', content: string, timestamp: string }]`
- `summary`: 이전 세션 요약 (다음 세션 시작 시 컨텍스트로 주입)
- 세션당 최대 20 메시지 (이후 새 세션 생성)

---

## 6. UI

**위치**: 학생 상세 페이지 (`/students/[id]`) 하단, "AI 코칭" 섹션

**컴포넌트**: `ChatBox.tsx`

| 요소 | 스타일 |
|------|--------|
| 사용자 메시지 | `.msg-bubble-user` (파란 배경, 우측 정렬) |
| AI 메시지 | `.msg-bubble-assistant` (따뜻한 배경, 좌측 정렬) |
| 타이핑 인디케이터 | `.typing-indicator` (3-dot 애니메이션) |
| 입력 필드 | `.input-base` + 전송 버튼 |
| 영역 높이 | 최대 400px, 스크롤 |

---

## 7. Fallback

Claude API 실패 시:
```json
{
  "role": "assistant",
  "content": "지금 잠시 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요. 그동안 회복학습 플랜의 1단계를 먼저 읽어보면 좋아요!"
}
```

---

## Cross-references

- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 가드레일 → [`005-ai/guardrails.md`](./guardrails.md)
- 학생 상세 UI → [`003-frontend/student-detail-spec.md`](../003-frontend/student-detail-spec.md)
- 아키텍처 → [`004-backend/architecture-spec.md`](../004-backend/architecture-spec.md)
