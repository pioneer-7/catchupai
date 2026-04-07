# AI 가드레일

> **SSOT 문서** — AI 생성 시 금지 사항, 안전 규칙, fallback 정책

---

## 1. 금지 사항 (CRITICAL)

### 절대 금지 추측

- 질병, 우울, ADHD, 가정환경 등 추측 금지
- 학생 의지 부족으로 단정 금지
- 성격이나 태도에 대한 판단 금지

### 절대 금지 표현

- 협박, 비난, 비교 표현 금지
- 공포심 유발 금지
- `반드시`, `심각하다`, `문제 학생` 같은 낙인형 표현 금지
- 학생을 부정적으로 단정하는 모든 문장 금지

### 데이터 제한

- 오직 제공된 학습 데이터만 사용한다.
- 입력 데이터에 없는 사실을 추측하지 않는다.
- 불필요하게 장문 생성 금지.

---

## 2. 톤 규칙

| 허용 | 금지 |
|------|------|
| 격려형 | 비난형 |
| 실행 유도 | 협박 |
| 부담 완화 | 압박 |
| 데이터 기반 설명 | 주관적 판단 |
| 전문적이고 차분한 | 감정적이거나 과장된 |

---

## 3. 출력 안전성

### 3.1 JSON 유효성

- 모든 AI 출력은 valid JSON이어야 한다.
- 파싱 실패 시 fallback 처리.

### 3.2 길이 제한

| 생성 타입 | 제한 |
|-----------|------|
| risk_explanation | 2~4문장 |
| recovery_plan | 각 step description 2문장 이내 |
| mini_quiz | 문항당 1문장 |
| intervention_message | 3~6문장 |

### 3.3 내용 검증

- 생성 결과에 금지 표현 포함 시 fallback 전환
- `risk_score`나 `risk_level` 값을 AI가 자체 생성하면 무시

---

## 4. Fallback 정책

AI 실패 시에도 데모가 끊기면 안 된다.

### 4.1 risk_explanation fallback

```json
{
  "summary": "출결, 과제, 퀴즈, 최근 활동 데이터를 기반으로 현재 학습 상태에 주의가 필요한 것으로 확인됩니다. 세부 지표를 확인하고 적절한 지원을 제공해주세요."
}
```

### 4.2 recovery_plan fallback

```json
{
  "missed_concepts_summary": "최근 수업에서 다룬 핵심 개념을 다시 확인할 필요가 있습니다.",
  "recovery_steps": [
    { "step": 1, "title": "강의자료 재확인", "description": "최근 수업 자료를 다시 읽어봅니다." },
    { "step": 2, "title": "핵심 개념 정리", "description": "주요 개념과 용어를 정리합니다." },
    { "step": 3, "title": "연습 문제 풀기", "description": "간단한 문제를 풀어 이해도를 확인합니다." }
  ],
  "action_plan_text": "15분 동안 강의자료를 다시 읽고, 핵심 개념을 노트에 정리한 뒤, 간단한 문제를 풀어보세요.",
  "caution_points_text": "한꺼번에 모든 내용을 따라잡으려 하지 마세요. 하나씩 단계별로 진행하는 것이 효과적입니다."
}
```

### 4.3 intervention_message fallback

```json
{
  "message": "최근 학습에 조금 공백이 생긴 것 같아요. 부담 갖지 않아도 됩니다. 짧은 복습 자료를 준비해두었으니, 시간이 될 때 가볍게 확인해보세요. 한 걸음씩 다시 시작하면 충분히 따라잡을 수 있어요."
}
```

### 4.4 mini_quiz fallback

```json
{
  "questions": [
    { "id": 1, "type": "multiple_choice", "question": "이번 단원의 핵심 목표는 무엇인가요?", "options": ["분석", "예측", "분류", "변환"] },
    { "id": 2, "type": "short_answer", "question": "이번 단원에서 가장 중요한 개념을 한 문장으로 설명하세요." },
    { "id": 3, "type": "multiple_choice", "question": "다음 중 올바른 설명은?", "options": ["A", "B", "C", "D"] }
  ],
  "answer_key": [
    { "id": 1, "answer": "예측" },
    { "id": 2, "answer": "핵심 개념에 대한 요약 문장" },
    { "id": 3, "answer": "B" }
  ],
  "explanations": [
    { "id": 1, "explanation": "이번 단원의 핵심 목표는 예측 능력 향상입니다." },
    { "id": 2, "explanation": "핵심 개념을 자신의 말로 설명할 수 있어야 합니다." },
    { "id": 3, "explanation": "올바른 개념 이해를 확인하는 문항입니다." }
  ]
}
```

---

## 5. 모니터링

- AI 생성 성공/실패 비율 로깅
- fallback 전환 빈도 추적
- 생성된 메시지에 금지 표현 포함 여부 사후 검증

---

## Cross-references

- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 프롬프트 → [`005-ai/prompts.md`](./prompts.md)
- 출력 스키마 → [`005-ai/output-schema.md`](./output-schema.md)
- 카피 가이드라인 → [`002-ux/copy-guidelines.md`](../002-ux/copy-guidelines.md)
