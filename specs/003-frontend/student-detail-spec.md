# 학생 상세 화면 명세

> **SSOT 문서** — `/students/[id]` 페이지 레이아웃, 탭 UI, AI 액션

---

## 1. 경로

`/students/[id]`

## 2. 목적

학생 상태 확인 + AI 지원 액션을 **탭 전환**으로 한 화면에서 처리한다.

---

## 3. 페이지 레이아웃 (2-Zone)

```
┌──────────────────────────────────────────┐
│  뒤로가기 링크                              │
├──────────────────────────────────────────┤
│  Zone A: 학생 정보 (항상 노출)              │
│  ├── 헤더 카드 (이름, 배지, 점수)           │
│  ├── 지표 카드 4종 (출결/과제/퀴즈/활동)    │
│  └── 위험 요인 태그                        │
├──────────────────────────────────────────┤
│  Zone B: 탭 영역                          │
│  ┌──────┬──────┬──────┬──────┬──────┐   │
│  │회복학습│메시지│미니진단│AI코칭│활동기록│   │
│  └──────┴──────┴──────┴──────┴──────┘   │
│  [선택된 탭의 콘텐츠]                       │
└──────────────────────────────────────────┘
```

**핵심**: Zone A는 스크롤 없이 항상 보이고, Zone B의 탭만 전환된다. 세로 누적 → 수평 탭.

---

## 4. Zone A: 학생 정보 (항상 노출)

### 4.1 학생 헤더 카드

- 이름, 상태 배지 (risk_level), 위험 점수 (risk_score)
- 반/기수명

### 4.2 학습 상태 카드 4종

| 카드 | 값 | alert 조건 |
|------|------|-----------|
| 출석률 | `attendance_rate` % (`missed_sessions`회 결석) | < 70% |
| 과제 제출률 | `assignment_submission_rate` % | < 60% |
| 퀴즈 평균 | `avg_quiz_score` 점 | < 60 |
| 최근 활동 | `last_active_days_ago` 일 전 | > 7일 |

### 4.3 위험 요인 태그

- `risk_factors_json` 배열 → pill 태그
- 디자인: `RiskFactorTag` 컴포넌트 (warm tint 팔레트)

---

## 5. Zone B: 탭 UI

### 5.1 탭 목록

| 탭 | 라벨 | 아이콘 | 내용 |
|----|------|--------|------|
| 1 | 회복학습 | 📚 | 회복학습 생성 버튼 + 결과 카드 (3단계 + 액션플랜 + PDF) |
| 2 | 개입 메시지 | 💬 | 메시지 생성 버튼 + 결과 텍스트 + 복사 |
| 3 | 미니 진단 | ✏️ | 진단 생성 버튼 + 3문항 폼 + 제출 + 채점 결과 |
| 4 | AI 어시스턴트 | 🎓 | 교강사용 AI 상담 — 개입 전략, 교수법 조언 (ChatBox) |
| 5 | 활동 기록 | 📋 | ActivityTimeline 컴포넌트 |

### 5.2 탭 디자인

- **활성 탭**: `border-bottom: 2px solid var(--accent)`, `font-weight: 600`, `color: var(--accent)`
- **비활성 탭**: `color: var(--text-secondary)`, hover 시 `color: var(--accent)`
- **탭 바**: 하단 `border-bottom: 1px solid var(--border)`, horizontal scroll on mobile
- **기본 선택**: 첫 번째 탭 (회복학습)

### 5.3 탭 내 "생성" 버튼

각 AI 탭(1-3) 상단에 생성 버튼:
- 아직 결과 없으면: "[기능명] 생성" 버튼 (primary)
- 이미 결과 있으면: 결과 표시 + "(재생성)" 버튼 (secondary, 우상단)
- 로딩 중: 스피너 + 스켈레톤
- 생성 시간: "X.X초 만에 생성" 표시

### 5.4 "전체 생성" 버튼

탭 바 우측에 "전체 생성" outline 버튼. 클릭 시 회복학습 → 메시지 → 진단 순차 생성.

---

## 6. 탭별 콘텐츠

### 탭 1: 회복학습 (→ [`recovery-plan-spec.md`](./recovery-plan-spec.md))

- 놓친 개념 요약 카드
- 3단계 회복 순서 (스텝퍼)
- 액션 플랜 + 주의 포인트
- PDF 내보내기 버튼

### 탭 2: 개입 메시지

- 메시지 텍스트 블록 (`bg-warm` 배경)
- 복사 버튼

### 탭 3: 미니 진단

- 3문항 카드 (객관식 radio + 단답 input)
- 답안 제출 버튼
- 제출 후: 점수 + before/after risk score + 문항별 해설

### 탭 4: AI 코칭 (→ [`../005-ai/chat-spec.md`](../005-ai/chat-spec.md))

- ChatBox 컴포넌트 (스트리밍 + 마크다운)
- 높이: 탭 영역 내에서 최대 480px

### 탭 5: 활동 기록

- ActivityTimeline 컴포넌트
- 시간순 이벤트 로그

---

## 7. 상태 처리

| 상태 | 표시 |
|------|------|
| loading (학생 데이터) | Zone A + Zone B 전체 스켈레톤 |
| loading (AI 생성 중) | 해당 탭 내 스피너 + 스켈레톤 |
| error (학생 없음) | 404 + 목록 돌아가기 |
| error (AI 실패) | 해당 탭 내 에러 메시지 + 재시도 버튼 |

---

## 8. 데이터 요구사항

```
GET /api/students/:id
```

응답에 포함:
- 학생 기본 정보 + progress + risk_factors
- recovery_plans, intervention_messages, mini_assessments (기존 결과)

---

## Cross-references

- 회복학습 상세 → [`003-frontend/recovery-plan-spec.md`](./recovery-plan-spec.md)
- AI 코칭 → [`005-ai/chat-spec.md`](../005-ai/chat-spec.md)
- AI 예측 → [`005-ai/prediction-spec.md`](../005-ai/prediction-spec.md)
- 분석 대시보드 → [`003-frontend/analytics-spec.md`](./analytics-spec.md)
- API 명세 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
