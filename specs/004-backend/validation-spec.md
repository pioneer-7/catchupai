# 입력 검증 명세

> **SSOT 문서** — Zod 스키마 정의, 검증 위치, 에러 응답 형식

---

## 1. 검증 원칙

- **모든 외부 입력**은 Zod 스키마로 검증한다.
- 검증은 **Route Handler에서만** 실행한다 (Service/Repository는 이미 검증된 데이터를 받는다).
- 검증 실패 시 `400 VALIDATION_ERROR` + 첫 번째 에러 메시지를 반환한다.

---

## 2. 스키마 정의

**위치**: `src/lib/validation.ts`

### 2.1 AssessmentSubmitSchema

미니 진단 제출 시 요청 body 검증.

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `assessment_id` | string | UUID 형식 | 진단 ID |
| `answers` | array | 최소 1개 | 답변 배열 |
| `answers[].id` | number | - | 문항 번호 |
| `answers[].answer` | string | 최소 1자 | 답변 내용 |

**사용 엔드포인트**: `POST /api/students/:id/mini-assessment/submit`

### 2.2 StudentUploadRowSchema

CSV 업로드 시 각 행 검증.

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `student_name` | string | 최소 1자 | 학생명 (필수) |
| `email` | string | 이메일 형식 또는 빈 문자열 | 선택 |
| `cohort_name` | string | - | 선택 |
| `attendance_rate` | number | 0~100 | 출석률 |
| `missed_sessions` | integer | 0 이상 | 결석 횟수 |
| `assignment_submission_rate` | number | 0~100 | 과제 제출률 |
| `avg_quiz_score` | number | 0~100 | 퀴즈 평균 |
| `last_active_days_ago` | integer | 0 이상 | 활동 공백일 |
| `notes` | string | - | 선택 |

**사용 위치**: `upload.service.ts` (Service 내부에서 행별 검증)

### 2.3 MessageTypeSchema

개입 메시지 생성 시 요청 body 검증.

| 필드 | 타입 | 허용 값 | 기본값 |
|------|------|---------|--------|
| `message_type` | enum | `teacher`, `operator`, `student_support` | `teacher` |

**사용 엔드포인트**: `POST /api/students/:id/intervention-message`

### 2.4 WebhookRegisterSchema

Webhook 등록 시 요청 body 검증. → [`webhook-spec.md`](./webhook-spec.md) 참조

| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| `url` | string | 유효한 URL | Webhook 수신 URL |
| `events` | array | 최소 1개, 허용된 이벤트 타입만 | 구독 이벤트 |
| `secret` | string | 최소 8자 | HMAC 서명 키 (선택) |

**허용 이벤트 타입**: `student.risk_level_changed`, `recovery_plan.created`, `assessment.submitted`, `student.imported`

---

## 3. 검증 실패 응답

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "답변을 입력해주세요"
  }
}
```

HTTP 상태: `400`

---

## Cross-references

- 아키텍처 (검증 위치) → [`004-backend/architecture-spec.md`](./architecture-spec.md)
- API 응답 형식 → [`004-backend/api-spec.md`](./api-spec.md)
- 데이터 모델 필드 → [`001-domain/data-model.md`](../001-domain/data-model.md)
- Webhook 이벤트 → [`004-backend/webhook-spec.md`](./webhook-spec.md)
