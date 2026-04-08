# AI 이탈 위험 예측 명세

> **SSOT 문서** — Claude 구조화 출력 기반 위험 평가, 궤적 시각화, 개입 효과 예측

---

## 1. 개요

기존 규칙기반 risk_score(0-100)를 보완하여, Claude AI가 학생 데이터를 종합 분석한 **구조화된 위험 평가**를 제공한다. "ML 모델"이 아닌 **"AI 전문가 위험 평가"**로 프레이밍한다.

---

## 2. API

### `POST /api/v1/students/[id]/prediction`

**요청**: Body 없음 (서버에서 학생 데이터 조회)

**응답**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "student_id": "uuid",
    "dropout_risk_score": 0.78,
    "risk_level": "critical",
    "primary_risk_factors": ["출석 급감 (2주간 30%)", "과제 3회 연속 미제출"],
    "trajectory": "critical_decline",
    "weeks_to_likely_dropout": 2,
    "confidence_basis": "behavioral_signals_only",
    "intervention_impact": "지금 개입 시 위험도 약 25% 감소 예상",
    "recommended_actions": ["즉시 1:1 상담 안내", "간소화 복습 자료 제공", "동료 학습 연결"],
    "created_at": "2026-04-08T..."
  }
}
```

---

## 3. Claude 프롬프트

```
You are an educational risk assessment specialist.
Analyze the following student behavioral data and output a structured JSON risk assessment.

<student_data>
  name: {{student_name}}
  attendance_rate: {{attendance_rate}} (trend: {{trend}})
  assignment_completion: {{assignment_rate}}
  quiz_average: {{avg_quiz_score}}
  days_since_last_login: {{last_active_days_ago}}
  risk_factors: {{risk_factors}}
  course: {{course_title}}
</student_data>

Output JSON matching this exact schema:
{
  "dropout_risk_score": 0.0-1.0,
  "risk_level": "critical|high|medium|low",
  "primary_risk_factors": ["string", max 3],
  "trajectory": "improving|stable|declining|critical_decline",
  "weeks_to_likely_dropout": integer or null,
  "confidence_basis": "behavioral_signals_only|insufficient_data",
  "intervention_impact": "string (한국어, 개입 시 예상 효과)",
  "recommended_actions": ["string", max 3, 한국어]
}

Respond in Korean for string fields. Return valid JSON only.
```

---

## 4. 출력 스키마

| 필드 | 타입 | 설명 |
|------|------|------|
| `dropout_risk_score` | float 0-1 | 이탈 위험 점수 (0=안전, 1=매우 위험) |
| `risk_level` | enum | critical / high / medium / low |
| `primary_risk_factors` | string[] | 주요 위험 요인 (최대 3개) |
| `trajectory` | enum | 위험 궤적 방향 |
| `weeks_to_likely_dropout` | int? | 예상 이탈 시점 (주) |
| `confidence_basis` | enum | 평가 근거 유형 |
| `intervention_impact` | string | 개입 시 예상 효과 |
| `recommended_actions` | string[] | 권장 조치 (최대 3개) |

---

## 5. 시각화

### 위험 궤적 차트 (`RiskTrajectoryChart.tsx`)

- **라이브러리**: Recharts `AreaChart`
- **X축**: 주차 (Week 1-4+)
- **Y축**: risk_score (0-100)
- **그라디언트**: `--chart-series-2`(녹) → `--chart-series-4`(빨강)
- **마커**: 개입 시점에 플래그 아이콘
- **데이터**: 현재 스냅샷 + 예측 궤적 (점선)

### 예측 카드 (`PredictionCard.tsx`)

- dropout_risk_score를 게이지 또는 큰 숫자로 표시
- risk_level 배지
- primary_risk_factors 태그
- intervention_impact 강조 텍스트
- recommended_actions 체크리스트

---

## 6. Supabase 테이블

```sql
create table risk_predictions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  dropout_risk_score numeric(3,2) not null,
  risk_level text not null,
  primary_risk_factors jsonb not null,
  trajectory text not null,
  weeks_to_likely_dropout integer,
  confidence_basis text not null,
  intervention_impact text,
  recommended_actions jsonb not null,
  created_at timestamptz not null default now()
);
```

---

## 7. Fallback

```json
{
  "dropout_risk_score": 0.5,
  "risk_level": "medium",
  "primary_risk_factors": ["데이터 분석 기반 종합 평가"],
  "trajectory": "stable",
  "weeks_to_likely_dropout": null,
  "confidence_basis": "insufficient_data",
  "intervention_impact": "추가 데이터 수집 후 정밀 평가 권장",
  "recommended_actions": ["학습 상태 모니터링 지속", "1주 후 재평가"]
}
```

---

## Cross-references

- 기존 위험도 계산 → [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md)
- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 분석 대시보드 → [`003-frontend/analytics-spec.md`](../003-frontend/analytics-spec.md)
