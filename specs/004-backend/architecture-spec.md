# 백엔드 아키��처 명세

> **SSOT 문서** — 3-Layer Clean Architecture, 의존성 방향, 에러 핸들링, 파일 구조

---

## 1. 아키텍처 개요

CatchUp AI 백엔드는 **3-Layer Clean Architecture** ��턴을 따른다.

```
┌─────────────────────────────────┐
│  Route Handler (API Controller) │  ← 입력 검증 (Zod), 응답 변환
├─���───────────────────────────────┤
│  Service (Use Case / Business)  │  ��� 비즈니��� 로직 조합, AI 호출
├───────────────────��─────────────┤
│  Repository (Data Access)       │  ← Supabase 쿼리, CRUD 연산
└─────���───────────────────────────┘
```

---

## 2. 의존성 규칙

| 규칙 | 설명 |
|------|------|
| Route → Service | Route는 Service만 호출한다 |
| Service → Repository | Service��� Repository만 호출한다 |
| Service → lib | Service는 AI(`lib/ai.ts`), 위험도 계산(`lib/risk-scoring.ts`) 호출 가능 |
| Repository → Supabase | Repository는 `lib/supabase.ts`의 `db` 인스턴스만 사용 |
| **역방향 금지** | Repository가 Service를 호출하거나, Service가 Route를 참조하면 안 된다 |

---

## 3. Repository 레이어

**위치**: `src/repositories/`

각 Repository는 단일 Supabase 테이블의 CRUD를 캡슐화한다.

| Repository | 테이블 | 주요 메서드 |
|-----------|--------|-----------|
| `student.repository.ts` | `students` | `findById`, `findByName`, `save`, `update`, `deleteAll` |
| `course.repository.ts` | `courses` | `findFirst`, `save`, `updateMaterial`, `deleteAll` |
| `progress.repository.ts` | `student_progress` | `findByStudent`, `findAllWithStudents(filters)`, `countByRiskLevel`, `save`, `update`, `deleteAll` |
| `recovery-plan.repository.ts` | `recovery_plans` | `findByStudent`, `save`, `deleteAll` |
| `intervention-message.repository.ts` | `intervention_messages` | `findByStudent`, `save`, `deleteAll` |
| `assessment.repository.ts` | `mini_assessments` | `findById`, `findByStudent`, `save`, `update`, `deleteAll` |

### Repository 규칙

- Repository 메서드는 **항상 async**이다.
- `null` 반환은 "찾을 수 없음"을 의미한다 (에러를 던지지 않음).
- `deleteAll()`은 `neq('id', '00000000-...')` 패턴으로 전체 삭제한다.
- 필터링/정렬은 Repository에서 Supabase 쿼리로 처리한다.

---

## 4. Service 레이어

**위치**: `src/services/`

�� Service는 하나의 비즈니스 도메인을 담당하며, Repository들을 조합하고 비즈니스 로직을 실행한다.

| Service | 책임 | 호출하는 Repository |
|---------|------|------------------|
| `student.service.ts` | 학생 목록/상세 조회 | student, progress, recovery-plan, intervention-message, assessment |
| `recovery.service.ts` | 회복학습 생성 | student(via studentService), course, recovery-plan + AI |
| `message.service.ts` | 개입 메��지 생성 | student(via studentService), course, intervention-message + AI |
| `assessment.service.ts` | 진단 생성 + 채점 + risk 갱신 | student(via studentService), course, assessment, progress + AI |
| `upload.service.ts` | CSV 업로드 + 샘플 데이터 로드 | student, course, progress + 전체 repository(deleteAll) |

### Service 규칙

- Service는 에러를 `throw new Error('ERROR_CODE')` 형태로 던진다.
- 에러 코드: `STUDENT_NOT_FOUND`, `ASSESSMENT_NOT_FOUND`, `EMPTY_CSV`, `MISSING_COLUMNS:...`
- Service는 HTTP 상태 코드를 알지 못한다 (Route에서 매핑).

---

## 5. Route Handler (API Controller)

**위치**: `src/app/api/`

Route Handler는 **thin controller**로, 세 가지만 한다:

```
1. 입력 검증 (Zod schema)
2. Service 호출
3. 응답 변환 (successResponse / errorResponse)
```

### 에러 핸들링 패턴

```typescript
try {
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return errorResponse('VALIDATION_ERROR', message, 400);
  
  const result = await service.execute(parsed.data);
  return successResponse(result);
} catch (error) {
  if (error.message === 'STUDENT_NOT_FOUND') return errorResponse('NOT_FOUND', '...', 404);
  return errorResponse('INTERNAL_ERROR', '...', 500);
}
```

---

## 6. 공유 라이브러리

**위치**: `src/lib/`

| 파일 | 역할 | 호출 위치 |
|------|------|----------|
| `supabase.ts` | `db` 인스턴스 export | Repository만 |
| `ai.ts` | Claude AI 호출 + fallback | Service만 |
| `risk-scoring.ts` | 위험도 계산 (deterministic) | Service만 |
| `validation.ts` | Zod 스키마 | Route만 |
| `api-helpers.ts` | `successResponse()` / `errorResponse()` | Route만 |
| `sample-data.ts` | 샘플 ���이터 상수 | upload.service만 |

---

## 7. 파일 구조

```
src/
├── app/api/              # Route Handlers (thin controllers)
│   ├── students/
│   │   ├── route.ts      # GET /api/students
│   │   └── [id]/
│   │       ├── route.ts  # GET /api/students/:id
│   │       ├── recovery-plan/route.ts
│   │       ├── intervention-message/route.ts
│   │       └── mini-assessment/
│   │           ├��─ route.ts
│   │           └── submit/route.ts
│   └── upload/
│       ├── sample/route.ts
│       ├── students/route.ts
│       └── material/route.ts
├── services/             # Business Logic
├── repositories/         # Data Access
├── lib/                  # Shared Utilities
└── types/                # TypeScript 타입
```

---

## Cross-references

- API 엔드포인트 → [`004-backend/api-spec.md`](./api-spec.md)
- 입력 검증 → [`004-backend/validation-spec.md`](./validation-spec.md)
- 데이터 모델 → [`001-domain/data-model.md`](../001-domain/data-model.md)
- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 위험도 계산 → [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md)
