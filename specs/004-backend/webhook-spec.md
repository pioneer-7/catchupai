# Webhook 시스템 명세

> **SSOT 문서** — 이벤트 타입, 구독 API, HMAC 서명, 발송/재시도, 데이터 모델

---

## 1. 개요

CatchUp AI는 외부 시스템이 학생 위험도 변화, AI 산출물 생성 등의 이벤트를 실시간으로 수신할 수 있도록 Webhook 시스템을 제공한다.

---

## 2. 이벤트 타입

| 이벤트 | 발생 시점 | 포함 데이터 |
|--------|----------|------------|
| `student.risk_level_changed` | 진단 제출 후 risk_level 변경 시 | student_id, old_level, new_level, risk_score |
| `recovery_plan.created` | 회복학습 플랜 생성 시 | student_id, plan_id, missed_concepts_summary |
| `assessment.submitted` | 미니 진단 ���출 시 | student_id, assessment_id, score, total |
| `student.imported` | CSV 업로드로 학생 등록 시 | student_id, name, risk_level |

---

## 3. Webhook 구독 API

### POST `/api/v1/webhooks` — 등록

**요청**:
```json
{
  "url": "https://your-lms.com/webhooks/catchup",
  "events": ["student.risk_level_changed", "recovery_plan.created"],
  "secret": "your-webhook-secret-key"
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://your-lms.com/webhooks/catchup",
    "events": ["student.risk_level_changed", "recovery_plan.created"],
    "created_at": "2026-04-08T..."
  }
}
```

### GET `/api/v1/webhooks` — 목록 조회

### DELETE `/api/v1/webhooks/{id}` — 해제

---

## 4. Webhook 발송

### 4.1 페이로드 형식

```json
{
  "event": "student.risk_level_changed",
  "timestamp": "2026-04-08T12:00:00Z",
  "data": {
    "student_id": "uuid",
    "old_level": "warning",
    "new_level": "at_risk",
    "risk_score": 65
  }
}
```

### 4.2 HMAC 서명

등록 시 `secret`이 제공된 경우:

- 알고리즘: HMAC-SHA256
- 헤더: `X-CatchUp-Signature: sha256=<hex_digest>`
- 대상: request body 전체 (JSON 문자열)

```
signature = HMAC-SHA256(secret, JSON.stringify(payload))
```

### 4.3 재시도 정책

| 시도 | 대기 | 설명 |
|------|------|------|
| 1차 | 즉시 | 최초 발송 |
| 2차 | 30초 후 | 1차 실패 시 1회 재시도 |
| 실패 | - | `webhook_deliveries`에 실패 기록 |

성공 기준: HTTP 2xx 응답 (5초 타임아웃)

---

## 5. 데이터 모델 (Supabase)

### `webhook_subscriptions`

```sql
create table webhook_subscriptions (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  events text[] not null,
  secret text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
```

### `webhook_deliveries`

```sql
create table webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references webhook_subscriptions(id) on delete cascade,
  event text not null,
  payload jsonb not null,
  status text not null check (status in ('pending','success','failed')),
  response_status integer,
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 6. 이벤트 발행 위치

| 이벤트 | Service | 메서드 |
|--------|---------|--------|
| `student.risk_level_changed` | `assessment.service.ts` | `submit()` — risk_level 변경 시 |
| `recovery_plan.created` | `recovery.service.ts` | `generate()` — 저장 후 |
| `assessment.submitted` | `assessment.service.ts` | `submit()` — 채점 후 |
| `student.imported` | `upload.service.ts` | `upsertStudentWithProgress()` — 등록 후 |

---

## Cross-references

- API 인증 → [`004-backend/api-auth-spec.md`](./api-auth-spec.md)
- 이벤트 데이터 내 필드 → [`001-domain/data-model.md`](../001-domain/data-model.md)
- 입력 검증 (WebhookRegisterSchema) �� [`004-backend/validation-spec.md`](./validation-spec.md)
