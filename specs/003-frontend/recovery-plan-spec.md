# 회복학습 결과 화면 명세

> **SSOT 문서** — 회복학습 킷 UI 구조, 카드 레이아웃, 표시 규칙

---

## 1. 위치

학생 상세 페이지 (`/students/[id]`) 내 섹션 또는 별도 모달/패널

## 2. 목적

학생 맞춤형 보강 내용을 보여준다. 즉시 실행 가능한 수준으로 요약.

---

## 3. 컴포넌트 구조

### 3.1 놓친 개념 요약 카드

- `missed_concepts_summary` 표시
- 강의자료 기반 핵심 내용

### 3.2 3단계 회복 순서 카드

- `recovery_steps` 배열 (정확히 3개)
- 각 step: 번호 + 제목 + 설명
- 시각적으로 단계가 구분되는 레이아웃 (스텝퍼 또는 카드)

### 3.3 액션 플랜 카드

- `action_plan_text` 표시
- 10~15분 분량의 구체적 행동 계획

### 3.4 주의 포인트 카드

- `caution_points_text` 표시
- 오개념이나 흔한 실수 안내

### 3.5 메시지 복사 버튼

- 개입 메시지가 함께 생성된 경우 복사 기능 제공

---

## 4. 데이터 소스

```
POST /api/students/:id/recovery-plan → RecoveryPlan
```

AI 출력 스키마 (→ [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)):
```json
{
  "missed_concepts_summary": "string",
  "recovery_steps": [{ "step": 1, "title": "string", "description": "string" }],
  "action_plan_text": "string",
  "caution_points_text": "string"
}
```

---

## 5. 상태 처리

| 상태 | 표시 |
|------|------|
| idle | 아직 생성되지 않음 + "회복학습 생성" 버튼 |
| loading | 스피너 + "회복학습 플랜을 만들고 있습니다..." |
| success | 4개 카드 표시 |
| error | fallback 기본 3단계 템플릿 표시 |

---

## Cross-references

- 학생 상세 → [`003-frontend/student-detail-spec.md`](./student-detail-spec.md)
- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 프롬프트 → [`005-ai/prompts.md`](../005-ai/prompts.md)
