# 교육 분석 대시보드 명세

> **SSOT 문서** — 이탈 퍼널, 코호트 분석, 개입 효과 시각화

---

## 1. 개요

교육 운영자를 위한 분석 대시보드. 학생 이탈 과정을 시각화하고 개입 효과를 측정한다.

**경로**: `/analytics`

---

## 2. 차트 구성 (3개)

### 2.1 이탈 퍼널 (`DropoutFunnel.tsx`)

학생이 각 단계에 몇 명 있는지 퍼널 형태로 시각화.

| 단계 | 설명 | 색상 |
|------|------|------|
| 등록 | 전체 학생 수 | `--chart-series-1` (파랑) |
| 위험 감지 | at_risk + warning | `--chart-series-3` (주황) |
| 개입 진행 | 회복학습 또는 메시지 생성된 학생 | `--chart-series-5` (보라) |
| 회복 | 진단 후 risk_level 개선 | `--chart-series-2` (녹) |
| 이탈 | 여전히 at_risk | `--chart-series-4` (빨강) |

**구현**: 수평 바 차트 (Recharts `BarChart` horizontal) 또는 커스텀 SVG 퍼널

### 2.2 코호트 위험 분포 (`CohortRiskChart.tsx`)

주차별 학생 위험 분포 변화.

- **차트**: Recharts `BarChart` (stacked)
- **X축**: Week 1, 2, 3, 4
- **Y축**: 학생 수
- **스택**: stable(녹) / warning(주황) / at_risk(빨강)
- **데이터**: 합성 시계열 (sample-data.ts)

### 2.3 개입 효과 (`InterventionEffectChart.tsx`)

개입 전/후 risk_score 변화.

- **차트**: Recharts `ScatterChart` 또는 커스텀 dot plot
- **각 점**: 한 학생 (이름 라벨)
- **X축**: 개입 전 risk_score
- **Y축**: 개입 후 risk_score
- **대각선**: y=x (변화 없음 기준선)
- **대각선 아래**: 개선, **위**: 악화

---

## 3. 데이터 소스

### API: `GET /api/v1/analytics`

```json
{
  "success": true,
  "data": {
    "funnel": {
      "enrolled": 8,
      "risk_detected": 5,
      "intervention_sent": 4,
      "recovered": 2,
      "still_at_risk": 2,
      "dropped": 1
    },
    "cohort_weekly": [
      { "week": "1주차", "stable": 5, "warning": 2, "at_risk": 1 },
      { "week": "2주차", "stable": 4, "warning": 2, "at_risk": 2 },
      { "week": "3주차", "stable": 3, "warning": 2, "at_risk": 3 },
      { "week": "4주차", "stable": 3, "warning": 2, "at_risk": 3 }
    ],
    "intervention_effect": [
      { "name": "김민수", "before": 100, "after": 80 },
      { "name": "최수아", "before": 100, "after": 90 },
      { "name": "한예린", "before": 83, "after": 60 }
    ]
  }
}
```

---

## 4. 라이브러리

- **Recharts** (`npm install recharts`)
- 차트 토큰: `--chart-series-*`, `--chart-grid`, `--chart-tooltip-*`
- 래핑: `.chart-container` 클래스

---

## 5. 레이아웃

```
/analytics
├── 페이지 제목: "교육 분석"
├── 이탈 퍼널 (전체 폭)
├── 2-column grid:
│   ├── 코호트 위험 분포
│   └── 개입 효과
└── 요약 stat-box 카드 3개:
    ├── 회복률: recovered/intervention_sent * 100%
    ├── 평균 risk 감소: mean(before - after)
    └── 가장 개선된 학생
```

---

## 6. NavHeader 메뉴

"분석" 항목을 메인 메뉴에 추가 (대시보드와 학생 목록 사이).

---

## Cross-references

- 대시보드 → [`003-frontend/dashboard-spec.md`](./dashboard-spec.md)
- 위험도 계산 → [`001-domain/risk-scoring.md`](../001-domain/risk-scoring.md)
- AI 예측 → [`005-ai/prediction-spec.md`](../005-ai/prediction-spec.md)
- 디자인 토큰 → `src/app/globals.css`
