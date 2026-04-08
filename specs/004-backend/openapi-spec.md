# OpenAPI/Swagger 문서 명세

> **SSOT 문서** — OpenAPI 3.0 스펙 전략, Swagger UI, 스키마 매핑

---

## 1. 개요

CatchUp AI REST API는 OpenAPI 3.0 표준으로 문서화한다.

---

## 2. 엔드포인트

| 경로 | 설명 |
|------|------|
| `GET /api/v1/openapi.json` | OpenAPI 3.0 JSON 스펙 반환 |
| `/docs` | Swagger UI 웹 페이지 (인터랙티브) |

---

## 3. 스펙 생성 전략

- **수동 JSON**: 의존성 없이 `openapi.json` route에서 직접 JSON 객체를 반환한다.
- 자동 생성 라이브러리(swagger-jsdoc 등)는 사용하지 않는다 (번들 절약).
- 엔드포인트 추가/변경 시 JSON 객체를 직접 수정한다.

---

## 4. 스펙 구조

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "CatchUp AI API",
    "version": "1.0.0",
    "description": "학습 이탈 방지 AI 코파일럿 — 위험 학습자 탐지, 회복학습 생성, 개입 메시지"
  },
  "servers": [
    { "url": "https://carchupai.vercel.app/api/v1" }
  ],
  "paths": { ... },
  "components": {
    "schemas": { ... },
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key"
      }
    }
  }
}
```

---

## 5. 포함할 엔드포인트

| Method | Path | 태그 |
|--------|------|------|
| GET | `/students` | Students |
| GET | `/students/{id}` | Students |
| POST | `/students/{id}/recovery-plan` | AI Generation |
| POST | `/students/{id}/intervention-message` | AI Generation |
| POST | `/students/{id}/mini-assessment` | AI Generation |
| POST | `/students/{id}/mini-assessment/submit` | Assessment |
| POST | `/upload/students` | Upload |
| POST | `/upload/material` | Upload |
| POST | `/upload/sample` | Upload |
| POST | `/webhooks` | Webhooks |
| GET | `/webhooks` | Webhooks |
| DELETE | `/webhooks/{id}` | Webhooks |

---

## 6. Swagger UI 페이지

**경로**: `/docs`

- Redoc CDN 사용 (가벼움, 설치 불필요)
- `<script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js">`
- `/api/v1/openapi.json` 을 spec URL로 사용
- "Try it out" 기능으로 라이브 API 테스트 가능

---

## Cross-references

- API 엔드포인트 상세 → [`004-backend/api-spec.md`](./api-spec.md)
- API 인증 → [`004-backend/api-auth-spec.md`](./api-auth-spec.md)
- 입력 검증 스키마 ��� [`004-backend/validation-spec.md`](./validation-spec.md)
