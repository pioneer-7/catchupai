# 학생 상세 화면 명세

> **SSOT 문서** — `/students/[id]` 페이지 컴포넌트, 액션 버튼, AI 결과 표시

---

## 1. 경로

`/students/[id]`

## 2. 목적

학생 상태와 개입 액션을 한 곳에서 처리한다.

---

## 3. 컴포넌트 구조

### 3.1 학생 헤더 카드

- 이름
- 상태 배지 (risk_level)
- 위험 점수 (risk_score)

### 3.2 위험 원인 요약 카드

- AI 생성 `risk_explanation` 표시 (2~4문장)
- 데이터 로드 시 자동 생성 또는 "설명 생성" 버튼

### 3.3 학습 상태 카드 4종

| 카드 | 값 | 단위 |
|------|------|------|
| 출결 | `attendance_rate` / `missed_sessions` | %회 |
| 과제 제출률 | `assignment_submission_rate` | % |
| 퀴즈 평균 | `avg_quiz_score` | 점 |
| 최근 활동일 | `last_active_days_ago` | 일 전 |

### 3.4 위험 요인 태그

- `risk_factors` 배열을 태그/칩 형태로 표시
- 각 태그에 type + label + score 표시

### 3.5 액션 버튼 3개

| 버튼 | API 호출 | 결과 표시 |
|------|----------|----------|
| `회복학습 생성` | `POST /api/students/:id/recovery-plan` | 회복학습 결과 섹션 |
| `개입 메시지 생성` | `POST /api/students/:id/intervention-message` | 메시지 복사 블록 |
| `미니 진단 생성` | `POST /api/students/:id/mini-assessment` | 진단 화면/모달 |

---

## 4. AI 결과 표시 영역

### 4.1 회복학습 결과 (→ [`recovery-plan-spec.md`](./recovery-plan-spec.md))

- 놓친 개념 요약 카드
- 3단계 회복 순서 카드
- 액션 플랜 카드
- 주의 포인트 카드

### 4.2 개입 메시지 결과

- 메시지 텍스트 블록
- 복사 버튼

### 4.3 미니 진단 결과

- 3문항 목록
- 답안 입력 UI
- 제출 버튼
- 결과/해설
- 재계산된 상태 표시

---

## 5. 상태 처리

| 상태 | 표시 |
|------|------|
| loading (학생 데이터) | 스켈레톤 |
| loading (AI 생성 중) | 스피너 + "생성 중..." 메시지 |
| error (학생 없음) | 404 + 목록으로 돌아가기 |
| error (AI 실패) | fallback 메시지 표시 |

---

## 6. 데이터 요구사항

```
GET /api/students/:id
```

응답에 포함:
- 학생 기본 정보
- student_progress (risk_score, risk_level, risk_factors, 학습 지표)
- 기존 recovery_plans (있으면)
- 기존 intervention_messages (있으면)
- 기존 mini_assessments (있으면)

---

## Cross-references

- 화면 구조 → [`002-ux/ia-and-screens.md`](../002-ux/ia-and-screens.md)
- 회복학습 상세 → [`003-frontend/recovery-plan-spec.md`](./recovery-plan-spec.md)
- AI 출력 스키마 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- API 명세 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
