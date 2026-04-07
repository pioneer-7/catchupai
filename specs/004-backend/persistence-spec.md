# 저장 계층 명세

> **SSOT 문서** — Supabase 설정, 마이그레이션, 데이터 접근 패턴

---

## 1. 저장소

- **Supabase** (PostgreSQL)
- MVP에서는 인증 없이 anon key 사용
- RLS는 MVP에서 최소 수준 적용 (데모 안정성 우선)

---

## 2. 테이블 생성 순서

마이그레이션 순서:

1. `courses`
2. `students`
3. `student_progress` (FK: students, courses)
4. `recovery_plans` (FK: students, courses)
5. `intervention_messages` (FK: students, courses)
6. `mini_assessments` (FK: students, courses)
7. 인덱스 생성

→ DDL 상세: [`001-domain/data-model.md`](../001-domain/data-model.md) 섹션 3, 7

---

## 3. 데이터 접근 패턴

### 3.1 학생 목록 조회

```sql
SELECT s.*, sp.risk_score, sp.risk_level, sp.attendance_rate,
       sp.missed_sessions, sp.assignment_submission_rate,
       sp.avg_quiz_score, sp.last_active_days_ago
FROM students s
JOIN student_progress sp ON s.id = sp.student_id
WHERE sp.course_id = :course_id
ORDER BY sp.risk_score DESC;
```

### 3.2 학생 상세 조회

```sql
-- 기본 정보 + progress
SELECT * FROM students WHERE id = :id;
SELECT * FROM student_progress WHERE student_id = :id;

-- AI 결과물 (최신 순)
SELECT * FROM recovery_plans WHERE student_id = :id ORDER BY created_at DESC;
SELECT * FROM intervention_messages WHERE student_id = :id ORDER BY created_at DESC;
SELECT * FROM mini_assessments WHERE student_id = :id ORDER BY created_at DESC;
```

### 3.3 risk_score 갱신 (진단 제출 후)

```sql
UPDATE student_progress
SET risk_score = GREATEST(0, risk_score + :delta),
    risk_level = CASE
      WHEN GREATEST(0, risk_score + :delta) >= 60 THEN 'at_risk'
      WHEN GREATEST(0, risk_score + :delta) >= 30 THEN 'warning'
      ELSE 'stable'
    END,
    updated_at = now()
WHERE student_id = :student_id AND course_id = :course_id;
```

### 3.4 CSV 업로드 시 upsert

```sql
-- students upsert (이름 기준)
INSERT INTO students (name, email, cohort_name)
VALUES (:name, :email, :cohort_name)
ON CONFLICT ... DO UPDATE SET ...;

-- student_progress upsert (student_id + course_id 기준)
INSERT INTO student_progress (student_id, course_id, ...)
VALUES (...)
ON CONFLICT (student_id, course_id) DO UPDATE SET ...;
```

---

## 4. 샘플 데이터 시드

초기 데모용 데이터:

- 1개 과정 (예: "데이터분석 기초")
- 최소 4명 학생 (stable 1, warning 1, at_risk 2)
- 각 학생의 progress 데이터

→ 샘플 CSV: [`001-domain/data-model.md`](../001-domain/data-model.md) 섹션 5

---

## 5. Supabase 클라이언트 설정

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 필수 환경변수

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 공개키 |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 (절대 클라이언트 노출 금지) |

---

## Cross-references

- 데이터 모델 DDL → [`001-domain/data-model.md`](../001-domain/data-model.md)
- API 명세 → [`004-backend/api-spec.md`](./api-spec.md)
- 업로드 파서 → [`004-backend/upload-parser-spec.md`](./upload-parser-spec.md)
