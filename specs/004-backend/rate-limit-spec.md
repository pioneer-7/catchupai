# 레이트 리밋 + 사용량 추적 명세

> **SSOT 문서** — 티어별 한도, 사용량 카운팅, 429 응답, 대시보드

---

## 1. 티어별 한도

| 기능 | Free | Pro | API |
|------|------|-----|-----|
| AI 생성 | 5회/일 | 무제한 | - |
| API 호출 | - | - | 1,000회/일 |
| 학생 수 | 50명 | 무제한 | - |
| 과정 수 | 1개 | 무제한 | - |

---

## 2. 데이터 모델

### `api_usage`

```sql
create table api_usage (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  endpoint text not null,
  count integer not null default 0,
  date date not null default current_date,
  unique(org_id, endpoint, date)
);

create index idx_api_usage_org_date on api_usage(org_id, date);
```

---

## 3. 카운팅 로직

각 AI 생성 API 호출 시:
1. `api_usage` UPSERT (org_id + endpoint + date)
2. count + 1
3. 한도 초과 시 429 반환

---

## 4. 초과 응답

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "일일 AI 생성 한도(5회)를 초과했습니다. Pro로 업그레이드하세요.",
    "upgrade_url": "/pricing"
  }
}
```

---

## 5. 사용량 대시보드 (`/settings/usage`)

- 오늘 AI 생성 횟수 / 한도
- 7일 사용량 차트 (Recharts bar)
- 현재 플랜 표시 + 업그레이드 CTA

---

## Cross-references

- 과금 → [`004-backend/billing-spec.md`](./billing-spec.md)
- API 인증 → [`004-backend/api-auth-spec.md`](./api-auth-spec.md)
