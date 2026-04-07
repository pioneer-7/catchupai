# 대시보드 화면 명세

> **SSOT 문서** — `/dashboard` 페이지 컴포넌트, 데이터, 인터랙션

---

## 1. 경로

`/dashboard`

## 2. 목적

전체 상태와 우선 개입 대상을 빠르게 파악한다.

---

## 3. 컴포넌트 구조

### 3.1 KPI 카드 섹션 (4개)

| 카드 | 데이터 소스 | 표시 |
|------|------------|------|
| 전체 학생 수 | `count(student_progress)` | 숫자 |
| 안정 학생 수 | `count where risk_level = 'stable'` | 숫자 + 녹색 |
| 주의 학생 수 | `count where risk_level = 'warning'` | 숫자 + 주황색 |
| 위험 학생 수 | `count where risk_level = 'at_risk'` | 숫자 + 빨간색 |

### 3.2 위험 학생 Top N 카드

- `student_progress` 테이블에서 `risk_score desc` 상위 N명
- 표시: 이름, 상태 배지, 위험 점수
- 클릭 시 `/students/[id]`로 이동

### 3.3 과정/기수 정보 배지

- 현재 로드된 과정명 및 기수명 표시

### 3.4 `학생 전체 보기` 버튼

- `/students`로 이동

---

## 4. 데이터 요구사항

```
GET /api/students + aggregate
```

필요 집계:
- 전체 학생 수
- risk_level별 학생 수
- risk_score 상위 N명 학생 목록 (이름, risk_score, risk_level)

---

## 5. 상태 처리

| 상태 | 표시 |
|------|------|
| loading | 스켈레톤 UI 또는 스피너 |
| empty | "아직 업로드된 데이터가 없습니다" + 업로드 페이지 이동 링크 |
| error | 에러 메시지 |

---

## Cross-references

- 화면 구조 전체 → [`002-ux/ia-and-screens.md`](../002-ux/ia-and-screens.md)
- API 명세 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
- 상태 배지 디자인 → [`002-ux/copy-guidelines.md`](../002-ux/copy-guidelines.md)
