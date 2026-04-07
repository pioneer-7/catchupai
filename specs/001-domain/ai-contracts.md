# AI 시스템 설계 및 계약

> **SSOT 문서** — AI 활용 원칙, 입출력 계약, 생성 타입별 스키마

---

## 1. AI 활용 원칙

- 위험도 자체는 **규칙기반**으로 계산한다 (→ [`risk-scoring.md`](./risk-scoring.md)).
- AI는 **설명 생성**, **회복학습 생성**, **문항 생성**, **개입 메시지 생성**에 사용한다.
- 판단의 근거가 되는 숫자는 deterministic하게 관리한다.
- **IMPORTANT**: AI는 risk_score를 계산하지 않는다.

---

## 2. AI 생성 타입

| 타입 | 용도 | 출력 |
|------|------|------|
| `risk_explanation` | 위험 원인 자연어 설명 | 2~4문장 요약 |
| `recovery_plan` | 맞춤 회복학습 킷 | 개념요약 + 3단계 + 액션플랜 + 주의점 |
| `mini_quiz` | 회복 확인 문항 | 3문항 + 정답 + 해설 |
| `intervention_message` | 교강사/운영자 개입 메시지 | 3~6문장 격려 메시지 |

---

## 3. 공통 입력 컨텍스트

모든 AI 호출에 포함되는 필드:

| 필드 | 설명 |
|------|------|
| `course_title` | 과정명 |
| `course_material_excerpt` | 강의자료 요약 또는 원문 일부 |
| `student_name` | 학생 이름 |
| `risk_level` | 현재 위험 레벨 |
| `risk_score` | 현재 위험 점수 |
| `attendance_rate` | 출석률 |
| `missed_sessions` | 결석 횟수 |
| `assignment_submission_rate` | 과제 제출률 |
| `avg_quiz_score` | 퀴즈 평균 |
| `last_active_days_ago` | 최근 활동 경과일 |
| `risk_factors` | 위험 요인 배열 |

---

## 4. 생성 타입별 출력 계약

### 4.1 risk_explanation

**목적**: 학생이 왜 주의/위험 상태인지 설명

**출력 스키마**:
```json
{
  "summary": "string (2~4문장)"
}
```

**규칙**:
- 데이터 기반 요약만 허용
- 학생 상태를 낙인 없이 설명

### 4.2 recovery_plan

**목적**: 개인 맞춤형 회복학습 플랜

**출력 스키마**:
```json
{
  "missed_concepts_summary": "string",
  "recovery_steps": [
    {
      "step": 1,
      "title": "string",
      "description": "string"
    }
  ],
  "action_plan_text": "string (10~15분 분량)",
  "caution_points_text": "string"
}
```

**규칙**:
- `recovery_steps`는 정확히 3단계
- 강의자료 내용과 연결
- 학생별로 상이한 플랜

### 4.3 mini_quiz

**목적**: 회복 여부 확인용 진단

**출력 스키마**:
```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice | short_answer",
      "question": "string",
      "options": ["string"] // multiple_choice만
    }
  ],
  "answer_key": [
    { "id": 1, "answer": "string" }
  ],
  "explanations": [
    { "id": 1, "explanation": "string" }
  ]
}
```

**규칙**:
- 정확히 3문항
- 회복학습 킷과 연관된 문항
- 정답과 해설 필수

### 4.4 intervention_message

**목적**: 학생에게 보낼 개입 메시지 초안

**출력 스키마**:
```json
{
  "message": "string (3~6문장)"
}
```

**규칙**:
- 격려형 톤
- 실행 유도
- 부담 완화형 표현

---

## 5. 프롬프트 가드레일

→ 상세 프롬프트 및 가드레일은 [`005-ai/guardrails.md`](../005-ai/guardrails.md)와 [`005-ai/prompts.md`](../005-ai/prompts.md) 참조

### 요약

- 학생을 부정적으로 단정하지 않는다.
- 민감한 추측을 하지 않는다.
- 성격/질병/가정환경 추론 금지.
- 오직 제공된 학습 데이터만 사용한다.
- 불필요하게 장문 생성 금지.

---

## 6. 실패 시 fallback 원칙

AI 실패 시에도 데모가 끊기면 안 된다.

| 생성 타입 | fallback |
|-----------|----------|
| `risk_explanation` | 템플릿형 규칙 설명 출력 |
| `recovery_plan` | 기본 3단계 템플릿 출력 |
| `intervention_message` | 기본 격려 메시지 템플릿 출력 |
| `mini_quiz` | 사전 정의된 기본 문항 3개 출력 |

---

## Cross-references

- 위험도 계산 → [`001-domain/risk-scoring.md`](./risk-scoring.md)
- 데이터 모델 → [`001-domain/data-model.md`](./data-model.md)
- 프롬프트 상세 → [`005-ai/prompts.md`](../005-ai/prompts.md)
- 출력 스키마 상세 → [`005-ai/output-schema.md`](../005-ai/output-schema.md)
- 가드레일 → [`005-ai/guardrails.md`](../005-ai/guardrails.md)
