# 학생 목록 화면 명세

> **SSOT 문서** — `/students` 페이지 컴포넌트, 테이블, 필터, 인터랙션

---

## 1. 경로

`/students`

## 2. 목적

학생 상태를 테이블 또는 카드 형태로 검토한다.

---

## 3. 컴포넌트 구조

### 3.1 검색 입력

- 학생 이름으로 검색
- 실시간 필터링 또는 debounce

### 3.2 risk level 필터

- 전체 / 안정 / 주의 / 위험
- 다중 선택 가능

### 3.3 정렬 옵션

- 기본: `risk_score desc` (위험도 높은 순)
- 추가: 이름순, 출석률순, 최근 활동순

### 3.4 학생 테이블

| 컬럼 | 데이터 |
|------|--------|
| 이름 | `student.name` |
| 상태 | `risk_level` 배지 (색상 + 텍스트) |
| 위험 점수 | `risk_score` |
| 결석 횟수 | `missed_sessions` |
| 과제 제출률 | `assignment_submission_rate` |
| 평균 퀴즈 점수 | `avg_quiz_score` |
| 최근 활동일 | `last_active_days_ago` |
| 액션 | 상세 보기 버튼 → `/students/[id]` |

---

## 4. 데이터 요구사항

```
GET /api/students?risk_level=...&sort=risk_score&order=desc&search=...
```

---

## 5. 상태 처리

| 상태 | 표시 |
|------|------|
| loading | 스켈레톤 테이블 |
| empty | "학생 데이터가 없습니다" |
| filtered empty | "검색 결과가 없습니다" |

---

## Cross-references

- 화면 구조 → [`002-ux/ia-and-screens.md`](../002-ux/ia-and-screens.md)
- API 명세 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
- 학생 상세 → [`003-frontend/student-detail-spec.md`](./student-detail-spec.md)
