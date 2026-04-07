# 위험도 계산 규칙

> **SSOT 문서** — 규칙기반 위험도 산식, 레벨 구간, 복합 보정, 예외 처리, 테스트 케이스

---

## 1. 설계 원칙

- 계산 결과는 항상 동일 입력에 대해 동일해야 한다 **(deterministic)**.
- 설명 가능해야 한다.
- MVP에서는 **정확한 예측 모델**이 아니라 **합리적 조기 탐지 모델**을 목표로 한다.
- 위험도 계산 로직과 AI 생성 로직은 분리한다.
- **IMPORTANT**: AI는 위험도를 계산하지 않는다.

### 출력값

- `risk_score`: 0~100 정수
- `risk_level`: `stable | warning | at_risk`
- `risk_factors`: 점수에 기여한 원인 목록

---

## 2. 입력 필드 정의

### 필수 입력

| 필드 | 타입 | 범위 |
|------|------|------|
| `attendance_rate` | number | 0~100 |
| `missed_sessions` | integer | 0 이상 |
| `assignment_submission_rate` | number | 0~100 |
| `avg_quiz_score` | number | 0~100 |
| `last_active_days_ago` | integer | 0 이상 |

### 선택 입력

| 필드 | 설명 |
|------|------|
| `manual_flag` | 운영자 수동 플래그 (MVP 미사용 가능) |
| `notes` | 설명 생성용 참고 메모 (위험도 계산 미반영) |

---

## 3. 기본 점수 규칙

### 3.1 출결 관련

#### 규칙 A1. 결석 횟수

| 조건 | 점수 |
|------|------|
| `missed_sessions >= 3` | +30 |
| `missed_sessions == 2` | +25 |
| `missed_sessions == 1` | +10 |
| `missed_sessions == 0` | +0 |

#### 규칙 A2. 출석률

| 조건 | 점수 |
|------|------|
| `attendance_rate < 50` | +25 |
| `50 <= attendance_rate < 70` | +15 |
| `70 <= attendance_rate < 85` | +8 |
| `attendance_rate >= 85` | +0 |

### 3.2 과제 관련

#### 규칙 B1. 과제 제출률

| 조건 | 점수 |
|------|------|
| `assignment_submission_rate < 40` | +30 |
| `40 <= assignment_submission_rate < 60` | +25 |
| `60 <= assignment_submission_rate < 80` | +10 |
| `assignment_submission_rate >= 80` | +0 |

### 3.3 퀴즈/이해도 관련

#### 규칙 C1. 평균 퀴즈 점수

| 조건 | 점수 |
|------|------|
| `avg_quiz_score < 40` | +25 |
| `40 <= avg_quiz_score < 60` | +20 |
| `60 <= avg_quiz_score < 75` | +10 |
| `avg_quiz_score >= 75` | +0 |

### 3.4 최근 활동 관련

#### 규칙 D1. 최근 활동 공백

| 조건 | 점수 |
|------|------|
| `last_active_days_ago > 14` | +25 |
| `8 <= last_active_days_ago <= 14` | +20 |
| `4 <= last_active_days_ago <= 7` | +10 |
| `0 <= last_active_days_ago <= 3` | +0 |

---

## 4. 복합 악화 보정 규칙

### 규칙 E1. 동시 악화 보정

다음 조건 중 **2개 이상**이면 +10 추가:

- `missed_sessions >= 2`
- `assignment_submission_rate < 60`
- `avg_quiz_score < 60`
- `last_active_days_ago > 7`

### 규칙 E2. 고위험 집중 보정

다음 조건 중 **3개 이상**이면 +10 추가:

- `attendance_rate < 70`
- `assignment_submission_rate < 60`
- `avg_quiz_score < 60`
- `last_active_days_ago > 7`

### 점수 상한

총합이 100을 넘으면 `risk_score = 100`으로 clamp 처리한다.

---

## 5. 상태 레벨 구간

| 점수 범위 | risk_level | UI 라벨 |
|-----------|-----------|---------|
| 0 ~ 29 | `stable` | 안정 |
| 30 ~ 59 | `warning` | 주의 |
| 60 ~ 100 | `at_risk` | 위험 |

---

## 6. risk_factors 생성 규칙

위험도 계산 시 점수 기여 항목을 함께 저장한다.

### 허용 타입

- `attendance`
- `assignment`
- `quiz`
- `activity`
- `compound`

### 예시 배열

```json
[
  {
    "type": "attendance",
    "label": "최근 결석 2회",
    "score": 25
  },
  {
    "type": "assignment",
    "label": "과제 제출률 60% 미만",
    "score": 25
  }
]
```

---

## 7. 계산 의사코드

```ts
export function calculateRisk(input: {
  attendance_rate: number
  missed_sessions: number
  assignment_submission_rate: number
  avg_quiz_score: number
  last_active_days_ago: number
}) {
  let score = 0;
  const riskFactors = [];

  // A1. 결석 횟수
  if (input.missed_sessions >= 3) {
    score += 30;
    riskFactors.push({ type: 'attendance', label: '최근 결석 3회 이상', score: 30 });
  } else if (input.missed_sessions === 2) {
    score += 25;
    riskFactors.push({ type: 'attendance', label: '최근 결석 2회', score: 25 });
  } else if (input.missed_sessions === 1) {
    score += 10;
    riskFactors.push({ type: 'attendance', label: '최근 결석 1회', score: 10 });
  }

  // A2. 출석률
  if (input.attendance_rate < 50) {
    score += 25;
    riskFactors.push({ type: 'attendance', label: '출석률 50% 미만', score: 25 });
  } else if (input.attendance_rate < 70) {
    score += 15;
    riskFactors.push({ type: 'attendance', label: '출석률 70% 미만', score: 15 });
  } else if (input.attendance_rate < 85) {
    score += 8;
    riskFactors.push({ type: 'attendance', label: '출석률 85% 미만', score: 8 });
  }

  // B1. 과제 제출률
  if (input.assignment_submission_rate < 40) {
    score += 30;
    riskFactors.push({ type: 'assignment', label: '과제 제출률 40% 미만', score: 30 });
  } else if (input.assignment_submission_rate < 60) {
    score += 25;
    riskFactors.push({ type: 'assignment', label: '과제 제출률 60% 미만', score: 25 });
  } else if (input.assignment_submission_rate < 80) {
    score += 10;
    riskFactors.push({ type: 'assignment', label: '과제 제출률 80% 미만', score: 10 });
  }

  // C1. 퀴즈 평균
  if (input.avg_quiz_score < 40) {
    score += 25;
    riskFactors.push({ type: 'quiz', label: '퀴즈 평균 40점 미만', score: 25 });
  } else if (input.avg_quiz_score < 60) {
    score += 20;
    riskFactors.push({ type: 'quiz', label: '퀴즈 평균 60점 미만', score: 20 });
  } else if (input.avg_quiz_score < 75) {
    score += 10;
    riskFactors.push({ type: 'quiz', label: '퀴즈 평균 75점 미만', score: 10 });
  }

  // D1. 최근 활동
  if (input.last_active_days_ago > 14) {
    score += 25;
    riskFactors.push({ type: 'activity', label: '최근 활동 없음 14일 초과', score: 25 });
  } else if (input.last_active_days_ago >= 8) {
    score += 20;
    riskFactors.push({ type: 'activity', label: '최근 활동 없음 8일 이상', score: 20 });
  } else if (input.last_active_days_ago >= 4) {
    score += 10;
    riskFactors.push({ type: 'activity', label: '최근 활동 없음 4일 이상', score: 10 });
  }

  // E1. 동시 악화 보정
  const compoundFlags = [
    input.missed_sessions >= 2,
    input.assignment_submission_rate < 60,
    input.avg_quiz_score < 60,
    input.last_active_days_ago > 7,
  ].filter(Boolean).length;

  if (compoundFlags >= 2) {
    score += 10;
    riskFactors.push({ type: 'compound', label: '여러 위험 지표 동시 악화', score: 10 });
  }

  // E2. 고위험 집중 보정
  const severeFlags = [
    input.attendance_rate < 70,
    input.assignment_submission_rate < 60,
    input.avg_quiz_score < 60,
    input.last_active_days_ago > 7,
  ].filter(Boolean).length;

  if (severeFlags >= 3) {
    score += 10;
    riskFactors.push({ type: 'compound', label: '고위험 지표 집중 발생', score: 10 });
  }

  const risk_score = Math.min(100, score);
  const risk_level = risk_score >= 60 ? 'at_risk' : risk_score >= 30 ? 'warning' : 'stable';

  return { risk_score, risk_level, risk_factors: riskFactors };
}
```

---

## 8. 예시 계산

### 예시 1. 위험 학생

**입력**: attendance_rate=62, missed_sessions=2, assignment_submission_rate=45, avg_quiz_score=58, last_active_days_ago=9

| 규칙 | 점수 |
|------|------|
| 결석 2회 (A1) | +25 |
| 출석률 70% 미만 (A2) | +15 |
| 과제 제출률 60% 미만 (B1) | +25 |
| 퀴즈 평균 60점 미만 (C1) | +20 |
| 최근 활동 8일 이상 (D1) | +20 |
| 동시 악화 보정 (E1) | +10 |
| 고위험 집중 보정 (E2) | +10 |
| **총점** | **125 → clamp → 100** |
| **결과** | **`at_risk`** |

### 예시 2. 주의 학생

**입력**: attendance_rate=82, missed_sessions=1, assignment_submission_rate=75, avg_quiz_score=68, last_active_days_ago=5

| 규칙 | 점수 |
|------|------|
| 결석 1회 (A1) | +10 |
| 출석률 85% 미만 (A2) | +8 |
| 과제 제출률 80% 미만 (B1) | +10 |
| 퀴즈 평균 75점 미만 (C1) | +10 |
| 최근 활동 4일 이상 (D1) | +10 |
| **총점** | **48** |
| **결과** | **`warning`** |

---

## 9. 미니 진단 후 상태 업데이트 규칙

| 정답 수 (3문항 중) | risk_score 변동 |
|---------------------|----------------|
| 3개 정답 | -20 |
| 2개 정답 | -10 |
| 1개 이하 | 유지 |

- 갱신 후 `risk_score`가 0 미만이면 0으로 clamp
- `risk_level`은 갱신된 점수 기준으로 재계산

---

## 10. 예외 처리

### 누락값 처리 원칙

- 필수 입력값이 누락되면 계산하지 않는다.
- API는 400 에러와 함께 누락 필드를 반환한다.
- UI에서는 `데이터 부족` 상태로 표시한다.

### 비정상 범위 처리

- 퍼센트 값은 0~100 범위를 벗어나면 validation error
- 음수 일수는 validation error
- 결석 횟수 음수는 validation error

---

## 11. 필수 테스트 케이스

1. 모든 값이 양호한 경우 → `stable`
2. 결석만 높은 경우 → `warning`
3. 과제/퀴즈/활동이 함께 나쁜 경우 → `at_risk`
4. 총점이 100 초과 시 clamp 되는지 확인
5. 누락값 입력 시 validation error 확인
6. 미니 진단 후 점수 감소 확인
7. 점수 감소 후 risk_level 재계산 확인

---

## 12. 변경 금지 원칙 (공모전 기간)

- 위험도 산식은 Day 3 이후 큰 폭으로 바꾸지 않는다.
- UI/AI 품질 개선 중에도 위험도 계산 규칙은 고정해 데모 일관성을 유지한다.

---

## Cross-references

- 데이터 모델 → [`001-domain/data-model.md`](./data-model.md)
- AI 계약 (위험 설명 생성) → [`001-domain/ai-contracts.md`](./ai-contracts.md)
- API 엔드포인트 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
- 테스트 기준 → [`006-qa/acceptance-criteria.md`](../006-qa/acceptance-criteria.md)
