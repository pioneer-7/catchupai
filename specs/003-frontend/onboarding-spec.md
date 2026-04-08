# 온보딩 플로우 명세

> **SSOT 문서** — 3단계 온보딩, 프로그레스, 첫 로그인 감지

---

## 1. 경로

`/onboarding`

## 2. 트리거

첫 로그인 시 `user_profiles.onboarding_completed = false` → 자동 리다이렉트

---

## 3. 3단계

### Step 1: 과정 설정

- 과정명 입력 또는 샘플 데이터 로드
- CSV 업로드 또는 "샘플로 시작" 버튼
- 완료 기준: 1개 이상 학생 데이터 존재

### Step 2: 첫 분석 확인

- 대시보드 미리보기 (KPI 카드 + 차트)
- "대시보드에서 학생 현황을 확인할 수 있습니다"
- 완료 기준: 대시보드 확인 (자동)

### Step 3: 첫 AI 생성

- 가장 위험한 학생 자동 선택
- "회복학습 생성" 버튼 → AI 결과 미리보기
- 완료 기준: AI 생성 1회

---

## 4. UI

- 프로그레스 바 (1/3, 2/3, 3/3)
- 각 단계: 카드 형태, 완료 시 ✓ 체크
- "건너뛰기" 링크 (하단)
- 완료 → `onboarding_completed = true` + 대시보드 리다이렉트

---

## Cross-references

- 인증 → [`004-backend/auth-spec.md`](../004-backend/auth-spec.md)
- 대시보드 → [`003-frontend/dashboard-spec.md`](./dashboard-spec.md)
