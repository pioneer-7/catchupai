# API 명세

> **SSOT 문서** — 전체 API 엔드포인트, 요청/응답 형식, 에러 코드

---

## 1. 기본 규칙

- 모든 응답은 JSON
- 성공 시: `{ "success": true, "data": { ... } }`
- 실패 시: `{ "success": false, "error": { "code": "...", "message": "..." } }`

### 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| `VALIDATION_ERROR` | 400 | 입력값 유효성 실패 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `RATE_LIMITED` | 429 | 요청 제한 초과 |
| `INTERNAL_ERROR` | 500 | 서버 내부 에러 |

---

## 2. 엔드포인트 목록

### 2.1 데이터 업로드

| Method | Path | 설명 | 상세 |
|--------|------|------|------|
| POST | `/api/upload/students` | CSV 업로드 | → [`upload-parser-spec.md`](./upload-parser-spec.md) |
| POST | `/api/upload/material` | 강의자료 업로드 | → [`upload-parser-spec.md`](./upload-parser-spec.md) |
| POST | `/api/upload/sample` | 샘플 데이터 로드 | → [`upload-parser-spec.md`](./upload-parser-spec.md) |

### 2.2 학생 조회

#### `GET /api/students`

학생 목록 조회

**Query Parameters**:

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `risk_level` | string | (전체) | `stable`, `warning`, `at_risk` 필터 |
| `search` | string | - | 이름 검색 |
| `sort` | string | `risk_score` | 정렬 기준 |
| `order` | string | `desc` | 정렬 방향 |
| `course_id` | uuid | - | 과정 필터 (P1) |

**응답**:
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "uuid",
        "name": "김민수",
        "email": "minsu@example.com",
        "cohort_name": "데이터분석 1기",
        "risk_score": 100,
        "risk_level": "at_risk",
        "attendance_rate": 62,
        "missed_sessions": 2,
        "assignment_submission_rate": 45,
        "avg_quiz_score": 58,
        "last_active_days_ago": 9
      }
    ],
    "total": 4,
    "summary": {
      "stable": 1,
      "warning": 1,
      "at_risk": 2
    }
  }
}
```

#### `GET /api/students/:id`

학생 상세 조회

**응답**:
```json
{
  "success": true,
  "data": {
    "student": { "id": "uuid", "name": "string", ... },
    "progress": {
      "attendance_rate": 62,
      "missed_sessions": 2,
      "assignment_submission_rate": 45,
      "avg_quiz_score": 58,
      "last_active_days_ago": 9,
      "risk_score": 100,
      "risk_level": "at_risk",
      "risk_factors_json": [...]
    },
    "recovery_plans": [...],
    "intervention_messages": [...],
    "mini_assessments": [...]
  }
}
```

### 2.3 AI 생성

#### `POST /api/students/:id/recovery-plan`

회복학습 킷 생성

**요청 Body**: (없음 — 서버에서 학생/과정 데이터 자동 조회)

**응답**: → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md) 섹션 4.2 참조
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "missed_concepts_summary": "...",
    "recovery_steps": [...],
    "action_plan_text": "...",
    "caution_points_text": "..."
  }
}
```

#### `POST /api/students/:id/intervention-message`

개입 메시지 생성

**요청 Body**:
```json
{
  "message_type": "teacher | operator | student_support"
}
```

**응답**: → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md) 섹션 4.4 참조
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "message": "..."
  }
}
```

#### `POST /api/students/:id/mini-assessment`

미니 진단 생성

**응답**: → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md) 섹션 4.3 참조
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "questions": [...],
    "answer_key": [...],
    "explanations": [...]
  }
}
```

#### `POST /api/students/:id/mini-assessment/submit`

미니 진단 응답 제출

**요청 Body**:
```json
{
  "assessment_id": "uuid",
  "answers": [
    { "id": 1, "answer": "예측" },
    { "id": 2, "answer": "입력 변수는..." },
    { "id": 3, "answer": "입력 데이터" }
  ]
}
```

**처리 로직**:
1. 정답 채점 (3문항 중 정답 수 계산)
2. `mini_assessments` 업데이트 (submitted_answers_json, score, submitted_at)
3. risk_score 갱신 (→ [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md) 섹션 9)
4. risk_level 재계산

**응답**:
```json
{
  "success": true,
  "data": {
    "score": 2,
    "total": 3,
    "correct_answers": [...],
    "explanations": [...],
    "risk_score_before": 100,
    "risk_score_after": 90,
    "risk_level_before": "at_risk",
    "risk_level_after": "at_risk"
  }
}
```

---

## Cross-references

- 업로드 상세 → [`004-backend/upload-parser-spec.md`](./upload-parser-spec.md)
- 저장 계층 → [`004-backend/persistence-spec.md`](./persistence-spec.md)
- AI 출력 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 위험도 계산 → [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md)
- 데이터 모델 → [`001-domain/data-model.md`](../001-domain/data-model.md)
