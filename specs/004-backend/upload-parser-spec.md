# 업로드 및 파서 명세

> **SSOT 문서** — CSV/PDF 업로드, 파싱, 저장 로직

---

## 1. 기능 설명

운영자는 강의자료와 학습자 CSV를 업로드할 수 있다.

---

## 2. 학생 CSV 업로드

### 2.1 엔드포인트

```
POST /api/upload/students
Content-Type: multipart/form-data
```

### 2.2 입력

- CSV 파일 (→ 컬럼 스키마는 [`001-domain/data-model.md`](../001-domain/data-model.md) 섹션 5 참조)

### 2.3 처리 로직

1. CSV 파일 파싱
2. 필수 컬럼 존재 확인 (`student_name`, `attendance_rate`, `missed_sessions`, `assignment_submission_rate`, `avg_quiz_score`, `last_active_days_ago`)
3. 각 행에 대해 값 범위 검증
   - 퍼센트 값: 0~100
   - 정수 값: 0 이상
4. 기본 `course` 생성 (없는 경우)
5. 각 학생에 대해:
   - `students` 테이블에 upsert (이름 기준)
   - `calculateRisk()` 실행 (→ [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md))
   - `student_progress` 테이블에 upsert (student_id + course_id 기준)

### 2.4 출력

```json
{
  "success": true,
  "data": {
    "total_rows": 4,
    "processed": 4,
    "skipped": 0,
    "course_id": "uuid"
  }
}
```

### 2.5 에러 처리

| 에러 | 코드 | 응답 |
|------|------|------|
| 파일 없음 | 400 | `{ "error": "CSV 파일이 필요합니다" }` |
| 필수 컬럼 누락 | 400 | `{ "error": "필수 컬럼이 누락되었습니다", "missing": [...] }` |
| 값 범위 초과 | 400 | `{ "error": "유효하지 않은 값", "rows": [...] }` |
| 서버 에러 | 500 | `{ "error": "업로드 처리 중 오류가 발생했습니다" }` |

---

## 3. 강의자료 업로드

### 3.1 엔드포인트

```
POST /api/upload/material
Content-Type: multipart/form-data
```

### 3.2 입력

- PDF 파일 또는 텍스트 파일

### 3.3 처리 로직

1. PDF인 경우 텍스트 추출
2. 텍스트인 경우 직접 사용
3. `courses` 테이블의 `uploaded_material_text` 컬럼 업데이트

### 3.4 출력

```json
{
  "success": true,
  "data": {
    "course_id": "uuid",
    "material_length": 5432
  }
}
```

### 3.5 에러 처리

| 에러 | 코드 | 응답 |
|------|------|------|
| 파일 없음 | 400 | `{ "error": "강의자료 파일이 필요합니다" }` |
| PDF 파싱 실패 | 400 | `{ "error": "PDF 텍스트 추출에 실패했습니다" }` |

---

## 4. 샘플 데이터 로드

### 4.1 엔드포인트

```
POST /api/upload/sample
```

### 4.2 처리 로직

1. 사전 정의된 샘플 CSV 데이터 로드
2. 사전 정의된 샘플 강의자료 텍스트 로드
3. 위 업로드 로직과 동일하게 처리

### 4.3 수용 기준

- 샘플 CSV 업로드 시 1분 내 목록에 반영
- PDF 업로드 시 텍스트가 추출된다

---

## Cross-references

- CSV 스키마 → [`001-domain/data-model.md`](../001-domain/data-model.md) 섹션 5
- 위험도 계산 → [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md)
- API 전체 → [`004-backend/api-spec.md`](./api-spec.md)
- 저장 계층 → [`004-backend/persistence-spec.md`](./persistence-spec.md)
