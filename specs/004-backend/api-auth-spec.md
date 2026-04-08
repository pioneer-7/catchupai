# API 인증 명세

> **SSOT 문서** — API 키 인증, 인증 면제, 에러 응답, 향�� 확장

---

## 1. 인증 방식

**MVP**: API 키 기반 인증 (`X-API-Key` 헤더)

---

## 2. API 키 관리

| 항목 | 값 |
|------|------|
| 헤더 이름 | `X-API-Key` |
| 키 저장 | 환경변수 `CATCHUP_API_KEY` |
| 키 형식 | 임의 문자열 (최소 32자 권장) |
| 키 개수 | MVP에서는 1개 (향후 테이블 기반 복수 키) |

---

## 3. 인증 대상

| 경로 | 인증 필요 | 이유 |
|------|----------|------|
| `/api/v1/*` (외부) | **필요** | 외부 클라이언트 식별 |
| `/api/*` (프론트엔드) | **면제** | same-origin 요청, Referer 확인 |
| `/widget/*` | **필요** (쿼리 파라미터) | `?api_key=xxx` |

### 인증 면제 조건

다음 중 하나를 만족하면 인증을 건너뛴다:
- `Referer` 헤더가 자체 도메인 (`carchupai.vercel.app`)
- `X-API-Key`가 없고 `Origin`이 same-origin
- `CATCHUP_API_KEY` 환경변수가 미설정 (개발 모드)

---

## 4. 미인증 응답

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "유효한 API 키가 필요합니다. X-API-Key ���더를 확인해주세요."
  }
}
```

HTTP 상태: `401`

---

## 5. 구현 위치

**파일**: `src/lib/api-auth.ts`

```typescript
export function validateApiKey(request: Request): boolean
```

Route Handler에서 Service 호출 전에 검증한다.

---

## 6. 향후 확장

| 단계 | 방식 | 시기 |
|------|------|------|
| MVP | 단일 API 키 (환경변수) | 현재 |
| Phase 2 | 복수 API 키 (Supabase `api_keys` 테이블) | 멀티테넌트 |
| Phase 3 | OAuth 2.0 + JWT | B2B SaaS |

---

## Cross-references

- API 버전닝 → [`004-backend/api-versioning-spec.md`](./api-versioning-spec.md)
- Webhook 인증 (HMAC) → [`004-backend/webhook-spec.md`](./webhook-spec.md)
- 위젯 인증 → [`003-frontend/widget-spec.md`](../003-frontend/widget-spec.md)
