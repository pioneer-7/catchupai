# 테스트 + CI/CD 명세

> **SSOT 문서** — Vitest, 테스트 대상, 커버리지, GitHub Actions

---

## 1. 프레임워크

- **유닛 테스트**: Vitest
- **커버리지**: 80% 목표
- **실행**: `npm test`

---

## 2. 테스트 대상

| 파일 | 테스트 내용 |
|------|-----------|
| `src/lib/risk-scoring.ts` | calculateRisk 규칙 + 경계값 + clamp + 진단 후 delta |
| `src/lib/validation.ts` | Zod 스키마 valid/invalid 케이스 |
| `src/lib/api-auth.ts` | API 키 검증, same-origin 면제, 없는 경우 |
| `src/services/student.service.ts` | getStudentList 필터/정렬, getStudentDetail null |
| `src/services/assessment.service.ts` | 채점 로직, risk score 갱신 |
| `src/services/upload.service.ts` | CSV 파싱, 검증 실패, 빈 파일 |
| `src/lib/feature-gate.ts` | 티어별 기능 접근 체크 |

---

## 3. 테스트 구조

```
tests/
├── lib/
│   ├── risk-scoring.test.ts
│   ├── validation.test.ts
│   ├── api-auth.test.ts
│   └── feature-gate.test.ts
└── services/
    ├── student.service.test.ts
    ├── assessment.service.test.ts
    └── upload.service.test.ts
```

---

## 4. CI/CD (GitHub Actions)

### `.github/workflows/ci.yml`

```yaml
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx next build
      - run: npm test
```

---

## Cross-references

- 아키텍처 → [`004-backend/architecture-spec.md`](./architecture-spec.md)
- 검증 규칙 → [`004-backend/validation-spec.md`](./validation-spec.md)
