# AI 출력 스키마

> **SSOT 문서** — 각 생성 타입의 JSON 스키마 정의 (검증용)

---

## 1. risk_explanation 스키마

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["summary"],
  "properties": {
    "summary": {
      "type": "string",
      "description": "위험 원인 요약, 2~4문장",
      "minLength": 10,
      "maxLength": 500
    }
  },
  "additionalProperties": false
}
```

---

## 2. recovery_plan 스키마

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["missed_concepts_summary", "recovery_steps", "action_plan_text", "caution_points_text"],
  "properties": {
    "missed_concepts_summary": {
      "type": "string",
      "minLength": 10
    },
    "recovery_steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["step", "title", "description"],
        "properties": {
          "step": { "type": "integer", "minimum": 1, "maximum": 3 },
          "title": { "type": "string" },
          "description": { "type": "string" }
        }
      },
      "minItems": 3,
      "maxItems": 3
    },
    "action_plan_text": {
      "type": "string",
      "minLength": 10
    },
    "caution_points_text": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

---

## 3. mini_quiz 스키마

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["questions", "answer_key", "explanations"],
  "properties": {
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "type", "question"],
        "properties": {
          "id": { "type": "integer" },
          "type": { "type": "string", "enum": ["multiple_choice", "short_answer"] },
          "question": { "type": "string" },
          "options": {
            "type": "array",
            "items": { "type": "string" }
          }
        }
      },
      "minItems": 3,
      "maxItems": 3
    },
    "answer_key": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "answer"],
        "properties": {
          "id": { "type": "integer" },
          "answer": { "type": "string" }
        }
      },
      "minItems": 3,
      "maxItems": 3
    },
    "explanations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "explanation"],
        "properties": {
          "id": { "type": "integer" },
          "explanation": { "type": "string" }
        }
      },
      "minItems": 3,
      "maxItems": 3
    }
  },
  "additionalProperties": false
}
```

---

## 4. intervention_message 스키마

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["message"],
  "properties": {
    "message": {
      "type": "string",
      "description": "개입 메시지, 3~6문장",
      "minLength": 20,
      "maxLength": 1000
    }
  },
  "additionalProperties": false
}
```

---

## 5. 검증 규칙

| 생성 타입 | 검증 포인트 |
|-----------|------------|
| `risk_explanation` | summary가 2~4문장인지 |
| `recovery_plan` | recovery_steps가 정확히 3개인지 |
| `mini_quiz` | questions, answer_key, explanations 각각 3개인지 |
| `intervention_message` | message가 3~6문장인지 |

AI 응답이 스키마를 만족하지 않으면 fallback 처리 (→ [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md) 섹션 6)

---

## Cross-references

- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 프롬프트 → [`005-ai/prompts.md`](./prompts.md)
- 가드레일 → [`005-ai/guardrails.md`](./guardrails.md)
- 데이터 타입 → [`001-domain/data-model.md`](../001-domain/data-model.md) 섹션 6
