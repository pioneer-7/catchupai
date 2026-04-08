# API 버전닝 명세

> **SSOT 문서** — URL 기반 버전 전략, 마이그레이션, 하위호환

---

## 1. 버전 전략

- **방식**: URL prefix 기반 (`/api/v1/*`)
- **현재 버전**: `v1`
- **향후 확장**: `/api/v2/*` 추가 시 v1은 최소 6개월 유지

---

## 2. 엔드포인트 매핑

| 기존 (비버전) | v1 | 설명 |
|--------------|-----|------|
| `/api/students` | `/api/v1/students` | ���생 목록 |
| `/api/students/:id` | `/api/v1/students/:id` | 학생 상세 |
| `/api/students/:id/recovery-plan` | `/api/v1/students/:id/recovery-plan` | 회복학습 |
| `/api/students/:id/intervention-message` | `/api/v1/students/:id/intervention-message` | 개�� 메시지 |
| `/api/students/:id/mini-assessment` | `/api/v1/students/:id/mini-assessment` | 미니 진단 |
| `/api/students/:id/mini-assessment/submit` | `/api/v1/students/:id/mini-assessment/submit` | 진단 제출 |
| `/api/upload/students` | `/api/v1/upload/students` | CSV 업로드 |
| `/api/upload/material` | `/api/v1/upload/material` | 강의자료 |
| `/api/upload/sample` | `/api/v1/upload/sample` | 샘플 데이터 |
| (없음) | `/api/v1/webhooks` | Webhook 관리 |
| (없음) | `/api/v1/openapi.json` | OpenAPI 스펙 |

---

## 3. 프론트엔드 전환 규칙

- 프론트엔드 `fetch()` 호출은 `/api/v1/` prefix를 사용한다.
- 기존 `/api/*` 경로는 **유지하되**, 동일한 Service를 호출한다 (redirect 불필요 — 같은 코드).
- 외부 API 소비자는 반드시 `/api/v1/` 을 사용해야 한다.

---

## 4. 응답 헤더

모든 v1 응답에 버전 헤더 포함:

```
X-API-Version: v1
```

---

## Cross-references

- API ��드포인트 상세 → [`004-backend/api-spec.md`](./api-spec.md)
- API 인증 → [`004-backend/api-auth-spec.md`](./api-auth-spec.md)
- OpenAPI 문서 → [`004-backend/openapi-spec.md`](./openapi-spec.md)
