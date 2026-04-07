# CatchUp AI Spec v0.1

## 0. 문서 목적
이 문서는 **CatchUp AI**의 제품 정의, MVP 범위, 기능 요구사항, 데이터 구조, AI 활용 방식, 화면 구조, 개발 우선순위, Claude Code 기반 spec-driven 개발 구조를 정리한 **SSOT(Single Source of Truth)** 문서다.

이 문서의 목표는 다음 3가지다.

1. 공모전 제출 기간 내에 **작고 날카로운 MVP**를 완성한다.
2. Claude Code와 에이전틱 코딩을 활용해 **기능 단위로 병렬 개발 가능 구조**를 만든다.
3. 제품 설명, 개발, 데모, AI 리포트 작성이 모두 이 문서를 기반으로 일관되게 진행되도록 한다.

---

# 1. 제품 개요

## 1.1 제품명
**CatchUp AI**

## 1.2 한 줄 정의
수업을 놓치거나 과제를 미제출한 학습자를 조기에 발견하고, 개인 맞춤형 회복학습 경로를 생성해주는 **교육 현장용 AI 코파일럿**.

## 1.3 해결하려는 핵심 문제
교육 현장에서는 다음 문제가 반복된다.

- 결석 또는 지각 이후 학습자가 빠르게 뒤처진다.
- 과제 미제출, 퀴즈 저성적, 학습 참여 저하가 누적되어도 교강사와 운영자가 즉시 개입하기 어렵다.
- 학생마다 왜 위험한지 원인이 다르지만, 이를 빠르게 파악하고 맞춤 대응하기 어렵다.
- 뒤처진 학생이 다시 따라잡기 위한 **회복학습 자료**를 매번 사람이 만들어야 한다.

## 1.4 핵심 가치 제안
CatchUp AI는 아래를 제공한다.

- **위험 학습자 조기 탐지**
- **위험 원인 설명형 요약**
- **개인 맞춤 회복학습 킷 자동 생성**
- **교강사/운영자용 개입 메시지 초안 생성**
- **미니 진단을 통한 회복 여부 확인**

---

# 2. 대상 사용자

## 2.1 1차 타깃
### A. 교강사
- 어떤 학생이 위험한지 빠르게 알고 싶다.
- 왜 위험한지 요약된 설명이 필요하다.
- 학생별 보강 자료를 직접 만드는 시간이 부족하다.

### B. 교육 운영자
- 수강생 이탈률과 미수료율을 낮추고 싶다.
- 결석/미제출 학생을 미리 파악하고 개입하고 싶다.
- 여러 반/과정을 한눈에 보고 우선순위를 정하고 싶다.

## 2.2 2차 타깃
### C. 학습자
- 내가 어디서부터 밀렸는지 모르겠다.
- 지금 뭘 먼저 공부해야 할지 모르겠다.
- 짧고 명확한 따라잡기 플랜이 필요하다.

---

# 3. 제품 포지셔닝

## 3.1 우리가 아닌 것
CatchUp AI는 다음을 지향하지 않는다.

- 대형 LMS
- 실시간 화상수업 플랫폼
- 전 과목 자동 채점 시스템
- 전체 교육 운영 ERP

## 3.2 우리가 되는 것
CatchUp AI는 **학습 이탈 직전 순간**을 해결하는 도구다.

> 학생이 한 번 밀리기 시작했을 때, 교강사와 운영자가 늦기 전에 알아차리고, 학생이 빠르게 복귀하도록 돕는 AI 코파일럿

---

# 4. 문제 정의

## 4.1 현장 페인 포인트

### 교강사 관점
- 학생별 상태를 계속 확인하기 어렵다.
- 출결/과제/퀴즈 데이터를 보더라도 어떤 학생부터 개입해야 할지 판단이 어렵다.
- 1:1 보강 자료를 만드는 데 시간이 많이 든다.

### 운영자 관점
- 이탈 가능성이 높은 학습자를 뒤늦게 발견한다.
- 과정별/반별 위험 학생을 빠르게 스캔하기 어렵다.
- 개입 메시지를 사람 손으로 반복 작성해야 한다.

### 학습자 관점
- 결석 이후 무엇이 비는지 모른다.
- 짧은 시간 안에 무엇부터 따라잡아야 할지 모른다.
- 부담이 커져 수강 포기 가능성이 높아진다.

## 4.2 제품 가설
다음이 맞다면 제품 가설이 성립한다.

- 출결, 과제, 퀴즈, 참여 로그를 조합하면 위험 학습자를 조기 탐지할 수 있다.
- 위험 원인을 설명형으로 보여주면 교강사와 운영자의 개입 속도가 빨라진다.
- 강의자료 기반 맞춤형 회복학습 킷을 자동 생성하면 학생의 복귀 가능성이 높아진다.

---

# 5. MVP 목표

## 5.1 MVP 목표
공모전 기간 내에 아래 한 가지 시나리오를 완성도 높게 보여준다.

> 운영자가 강의자료와 학습자 데이터를 업로드하면, CatchUp AI가 위험 학습자를 탐지하고, 특정 학생의 회복학습 킷과 개입 메시지를 생성하며, 미니 진단 결과에 따라 위험 상태를 업데이트한다.

## 5.2 MVP 성공 조건
다음이 가능해야 한다.

1. 샘플 데이터 업로드 가능
2. 위험 학습자 목록 확인 가능
3. 특정 학생 클릭 시 위험 원인 설명 확인 가능
4. 회복학습 킷 생성 가능
5. 개입 메시지 생성 가능
6. 미니 진단 생성 및 제출 가능
7. 제출 결과에 따라 상태 변경 가능

---

# 6. 범위 정의

## 6.1 In Scope
- 강의자료 업로드(PDF 또는 텍스트)
- 학습자 데이터 업로드(CSV)
- 위험도 계산
- 위험 원인 설명
- 회복학습 킷 생성
- 미니 진단 문제 생성
- 개입 메시지 생성
- 학생 상세 화면
- 간단한 대시보드

## 6.2 Out of Scope
- 실제 학교 시스템/LMS 연동
- 실시간 출결 자동 수집
- 학부모 알림 시스템
- 장기 성적 예측 모델
- 고도화된 추천 엔진
- 모바일 앱 네이티브 버전
- 다국어 지원
- 다중 기관 멀티테넌시

---

# 7. 핵심 사용자 스토리

## 7.1 운영자
- 운영자로서, 나는 위험 학생이 많은 반을 빠르게 확인하고 싶다.
- 운영자로서, 나는 누가 지금 가장 위험한지 우선순위를 보고 싶다.
- 운영자로서, 나는 학생에게 보낼 리마인드 메시지 초안을 바로 복사하고 싶다.

## 7.2 교강사
- 교강사로서, 나는 특정 학생이 왜 위험 상태인지 한눈에 이해하고 싶다.
- 교강사로서, 나는 학생 맞춤 회복학습 플랜을 자동으로 받고 싶다.
- 교강사로서, 나는 이해 확인용 미니 문제를 빠르게 만들고 싶다.

## 7.3 학습자
- 학습자로서, 나는 놓친 내용을 짧게 요약받고 싶다.
- 학습자로서, 나는 지금 무엇부터 공부해야 할지 단계별로 안내받고 싶다.
- 학습자로서, 나는 짧은 진단을 통해 내가 어느 정도 따라잡았는지 알고 싶다.

---

# 8. 핵심 기능 요구사항

## 8.1 데이터 업로드
### 기능 설명
운영자는 강의자료와 학습자 CSV를 업로드할 수 있다.

### 입력
- 강의자료 PDF 또는 텍스트
- 학습자 CSV
  - student_name
  - attendance_rate
  - missed_sessions
  - assignment_submission_rate
  - avg_quiz_score
  - last_active_days_ago
  - optional notes

### 출력
- 파싱 완료 상태
- 업로드 성공 여부
- 처리 가능한 데이터 구조로 저장

### 수용 기준
- 샘플 CSV 업로드 시 1분 내 목록에 반영된다.
- PDF 업로드 시 텍스트가 추출된다.

## 8.2 위험도 계산
### 기능 설명
규칙기반 방식으로 학생 위험도를 계산한다.

### 기본 규칙 예시
- 결석 2회 이상: +25
- 과제 제출률 60% 미만: +25
- 평균 퀴즈 점수 50점 미만: +20
- 최근 활동일 7일 초과: +20
- 여러 지표 동시 악화: +10 보정

### 위험도 구간
- 0~29: 안정
- 30~59: 주의
- 60~100: 위험

### 수용 기준
- 학생별 risk_score가 계산된다.
- risk_level이 stable / warning / at_risk 중 하나로 표기된다.

## 8.3 위험 원인 설명
### 기능 설명
학생의 데이터에 기반해 왜 위험 상태인지 자연어로 설명한다.

### 예시 출력
- 최근 2회 결석했고, 과제 제출률이 낮으며, 최근 학습 활동이 8일간 없어 빠른 개입이 필요합니다.

### 수용 기준
- 학생 상세 화면에서 2~4문장 내 요약이 보인다.
- 설명은 실제 데이터와 모순되지 않는다.

## 8.4 회복학습 킷 생성
### 기능 설명
강의자료와 학생 상태를 기반으로 개인 맞춤 보강 학습 플랜을 생성한다.

### 구성 요소
- 놓친 핵심 개념 요약
- 우선 복습 순서 3단계
- 10~15분 분량의 액션 플랜
- 주의해야 할 오개념 또는 포인트

### 수용 기준
- 학생별로 상이한 회복 플랜이 생성된다.
- 강의자료 내용과 연결된 학습 문장이 포함된다.

## 8.5 미니 진단 생성
### 기능 설명
회복 여부 확인을 위해 3문항 내외의 짧은 문제를 생성한다.

### 문제 유형
- 객관식
- 단답형

### 수용 기준
- 회복학습 킷과 연관된 문항이 생성된다.
- 정답과 해설이 함께 저장된다.

## 8.6 개입 메시지 생성
### 기능 설명
교강사/운영자 관점에서 학생에게 보낼 메시지 초안을 생성한다.

### 톤 가이드
- 낙인 금지
- 비난 금지
- 부담 완화
- 실행 유도 중심

### 예시
- 최근 학습 공백이 조금 생긴 것으로 보여서, 부담 없이 다시 시작할 수 있도록 짧은 따라잡기 플랜을 준비했어요.

### 수용 기준
- 메시지 길이는 3~6문장
- 격려형 톤 유지
- 회복학습 링크 또는 액션 유도 포함 가능

## 8.7 상태 업데이트
### 기능 설명
미니 진단 결과에 따라 학생 상태를 임시 갱신한다.

### 예시 규칙
- 3문항 중 3개 정답: risk_score -20
- 2개 정답: risk_score -10
- 1개 이하: 유지

### 수용 기준
- 진단 제출 이후 risk_score가 다시 계산된다.
- 상태 배지가 즉시 갱신된다.

---

# 9. 화면 구조(IA)

## 9.1 화면 목록
1. 랜딩 / 소개
2. 데이터 업로드 화면
3. 대시보드 화면
4. 학생 목록 화면
5. 학생 상세 화면
6. 회복학습 결과 화면
7. 미니 진단 응시 화면

## 9.2 주요 화면 설명

### A. 랜딩
- 제품 소개
- 데모 시작 버튼
- 샘플 데이터 불러오기 버튼

### B. 업로드
- 강의자료 업로드
- 학습자 CSV 업로드
- 업로드 상태 표시

### C. 대시보드
- 전체 학생 수
- 위험 학생 수
- 주의 학생 수
- 반/과정별 분포
- 우선 개입 필요 학생 Top N

### D. 학생 목록
- 이름
- 상태 배지
- 위험 점수
- 결석 횟수
- 과제 제출률
- 최근 활동일
- 상세 보기 버튼

### E. 학생 상세
- 학생 기본 정보
- 위험 원인 요약
- 데이터 요약 카드
- 회복학습 생성 버튼
- 개입 메시지 생성 버튼
- 미니 진단 생성 버튼

### F. 회복학습 화면
- 놓친 개념 요약
- 3단계 복습 순서
- 짧은 액션 플랜
- 개입 메시지 복사 버튼

### G. 미니 진단 화면
- 3문항
- 답안 제출
- 결과 및 해설
- 위험도 재계산 결과 표시

---

# 10. 핵심 사용자 흐름

## 10.1 운영자 흐름
1. 샘플 데이터 또는 CSV 업로드
2. 대시보드에서 위험 학생 확인
3. 특정 학생 클릭
4. 위험 원인 확인
5. 개입 메시지 생성
6. 학생에게 안내

## 10.2 교강사 흐름
1. 특정 학생 상세 진입
2. 회복학습 킷 생성
3. 미니 진단 생성
4. 학생에게 제공
5. 결과 확인

## 10.3 학습자 흐름(데모용 간략화)
1. 회복학습 내용 확인
2. 미니 진단 응시
3. 피드백 확인
4. 상태 개선 확인

---

# 11. 데이터 모델 초안

## 11.1 entities

### Course
- id
- title
- description
- uploaded_material_text
- created_at

### Student
- id
- name
- email(optional)
- cohort_name(optional)
- created_at

### StudentProgress
- id
- student_id
- course_id
- attendance_rate
- missed_sessions
- assignment_submission_rate
- avg_quiz_score
- last_active_days_ago
- risk_score
- risk_level
- created_at
- updated_at

### RecoveryPlan
- id
- student_id
- course_id
- missed_concepts_summary
- recovery_steps_json
- action_plan_text
- caution_points_text
- created_at

### InterventionMessage
- id
- student_id
- course_id
- message_type
- content
- created_at

### MiniAssessment
- id
- student_id
- course_id
- questions_json
- answer_key_json
- explanation_json
- score
- submitted_at

## 11.2 questions_json 예시
```json
[
  {
    "question": "회귀분석의 기본 목적은 무엇인가요?",
    "type": "multiple_choice",
    "options": ["분류", "예측", "정렬", "압축"],
    "answer": "예측"
  }
]
```

---

# 12. AI 시스템 설계

## 12.1 AI 활용 원칙
- 위험도 자체는 **규칙기반**으로 계산한다.
- AI는 **설명 생성**, **회복학습 생성**, **문항 생성**, **개입 메시지 생성**에 사용한다.
- 판단의 근거가 되는 숫자는 deterministic하게 관리한다.

## 12.2 AI 입력 컨텍스트
AI 호출 시 다음 정보를 넣는다.

- 강의자료 요약 또는 원문 일부
- 학생의 progress 데이터
- 현재 risk_level / risk_score
- 생성 목적(type)
  - risk_explanation
  - recovery_plan
  - mini_quiz
  - intervention_message

## 12.3 AI 출력 계약
### risk_explanation
- 2~4문장
- 학생 상태를 낙인 없이 설명
- 데이터 기반 요약만 허용

### recovery_plan
- 놓친 개념 요약
- 3단계 복습 순서
- 10~15분 액션 플랜
- 주의 포인트

### mini_quiz
- 3문항
- 각 문항의 정답
- 짧은 해설

### intervention_message
- 격려형 메시지
- 실행 유도
- 부담 완화형 표현 사용

## 12.4 프롬프트 가드레일
- 학생을 부정적으로 단정하지 않는다.
- 민감한 추측을 하지 않는다.
- 성격/질병/가정환경 추론 금지
- 오직 제공된 학습 데이터만 사용한다.
- 불필요하게 장문 생성 금지

---

# 13. 비기능 요구사항

## 13.1 성능
- 샘플 데이터 기준 주요 화면 로딩 2초 이내
- AI 생성 응답 10초 내외 목표

## 13.2 보안
- API Key는 서버 환경변수로만 관리
- public GitHub에 비밀키 노출 금지
- 데모 데이터는 가명 또는 샘플 데이터만 사용

## 13.3 신뢰성
- AI 응답 실패 시 fallback 문구 제공
- 데이터 파싱 실패 시 명확한 에러 안내

## 13.4 사용성
- 비전문가도 3클릭 내 주요 기능 접근 가능
- 상태 배지와 우선순위가 시각적으로 명확해야 함

---

# 14. 디자인 원칙

## 14.1 톤
- 차분함
- 교육적 신뢰감
- 과장 없는 AI 보조도구 느낌

## 14.2 UI 원칙
- 위험도는 배지와 점수 모두 표시
- 데이터 카드 중심 레이아웃
- 교강사/운영자가 빠르게 훑을 수 있어야 함
- 학생을 비난하는 표현 금지

## 14.3 핵심 시각 요소
- 상태 배지: 안정 / 주의 / 위험
- 우선순위 카드
- 회복학습 단계 카드
- 복사 가능한 메시지 블록

---

# 15. 공모전 관점 차별점

## 15.1 왜 이 아이디어가 좋은가
- LMS가 아니라 **학습 이탈 복귀**라는 좁고 강한 문제를 다룬다.
- 교강사, 운영자, 학습자 세 주체 모두에게 가치가 있다.
- AI가 억지로 들어간 것이 아니라 실제 업무 병목을 줄인다.
- 시연이 명확하고 짧은 시간 안에 이해된다.

## 15.2 발표용 포지셔닝 문장
> CatchUp AI는 수업을 놓친 학생이 완전히 이탈하기 전에, 교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는 회복학습 AI 코파일럿입니다.

---

# 16. 개발 우선순위

## 16.1 P0 (반드시)
- 업로드
- 대시보드
- 학생 목록
- 학생 상세
- 위험도 계산
- 회복학습 생성
- 개입 메시지 생성
- 미니 진단 및 결과 반영

## 16.2 P1 (여유 시)
- 과정별 필터
- 샘플 데이터 템플릿 다운로드
- 회복학습 PDF 내보내기
- 학생별 히스토리 타임라인

## 16.3 P2 (이번 대회 제외 권장)
- 실시간 연동
- 관리자 권한 체계
- 멀티 코스 지원 확장
- 정교한 ML 예측 모델

---

# 17. 7일 개발 일정

## Day 1
- 문서 확정
- 와이어프레임 작성
- 데이터 모델 확정
- 기술 스택 세팅

## Day 2
- 업로드 기능
- 샘플 데이터 시드
- 대시보드 기본 UI

## Day 3
- 학생 목록
- 학생 상세
- 위험도 계산 로직

## Day 4
- 강의자료 파싱
- 위험 원인 설명 생성
- 회복학습 생성

## Day 5
- 미니 진단 생성
- 개입 메시지 생성
- 결과 저장

## Day 6
- 상태 업데이트
- UI 폴리싱
- 에러 처리
- README 작성

## Day 7
- 데모 리허설
- 버그 수정
- 제출 산출물 정리
- AI 리포트 PDF 작성

---

# 18. Claude Code용 spec-driven 개발 구조

## 18.1 추천 폴더 구조
```text
/specs
  /000-product
    overview.md
    goals-and-scope.md
    personas.md
  /001-domain
    data-model.md
    risk-scoring.md
    ai-contracts.md
  /002-ux
    ia-and-screens.md
    user-flows.md
    copy-guidelines.md
  /003-frontend
    dashboard-spec.md
    student-list-spec.md
    student-detail-spec.md
    recovery-plan-spec.md
  /004-backend
    upload-parser-spec.md
    api-spec.md
    persistence-spec.md
  /005-ai
    prompts.md
    output-schema.md
    guardrails.md
  /006-qa
    acceptance-criteria.md
    demo-scenario.md
    edge-cases.md
```

## 18.2 각 문서의 역할

### overview.md
- 제품 정의
- 한 줄 가치 제안
- 문제 정의
- 성공 기준

### goals-and-scope.md
- In Scope / Out of Scope
- MVP 기준
- 공모전 제출 기준

### personas.md
- 운영자 / 교강사 / 학습자 페르소나
- JTBD

### data-model.md
- 엔티티 정의
- 필드 정의
- 관계 정의

### risk-scoring.md
- 위험도 계산 규칙
- 레벨 구간
- 예외 처리

### ai-contracts.md
- AI 호출 타입별 입력/출력 계약
- JSON 스키마
- 실패 시 fallback

### ia-and-screens.md
- 화면 목록
- 컴포넌트 구조
- 페이지별 목적

### user-flows.md
- 업로드 → 탐지 → 개입 → 회복 흐름

### prompts.md
- 프롬프트 템플릿
- 시스템 역할
- 토큰 절약 전략

### acceptance-criteria.md
- 기능별 테스트 기준
- 데모 기준

### demo-scenario.md
- 발표 시연 순서
- 클릭 경로
- 말할 포인트

---

# 19. 에이전틱 코딩 운영 구조

## 19.1 권장 역할 분리

### Agent A — Product/Spec Agent
- 문서 정리
- 요구사항 충돌 체크
- 스코프 통제

### Agent B — Frontend Agent
- UI 구현
- 상태 배지/리스트/상세화면
- 상호작용 구현

### Agent C — Backend/Data Agent
- CSV 파싱
- DB 모델
- API 구현
- risk scoring 로직

### Agent D — AI Agent
- 프롬프트 작성
- output schema 정의
- 회복학습/메시지/퀴즈 생성 품질 개선

### Agent E — QA/Demo Agent
- acceptance check
- edge case 정리
- 데모 동선 정리

## 19.2 작업 단위 원칙
- 한 번에 큰 기능 전체를 맡기지 않는다.
- spec 문서를 기준으로 **작은 계약 단위**로 끊는다.
- 각 agent는 입력/출력/완료 기준이 명확해야 한다.

## 19.3 예시 태스크 단위
- 학생 목록 페이지 UI만 구현
- risk_score 계산 함수만 구현
- recovery_plan API route만 구현
- mini_quiz output schema만 정의

---

# 20. API 초안

## 20.1 POST /api/upload/students
- CSV 업로드
- 학생 진행 데이터 저장

## 20.2 POST /api/upload/material
- 강의자료 업로드
- 텍스트 추출 및 저장

## 20.3 GET /api/students
- 학생 목록 조회
- 필터(optional)

## 20.4 GET /api/students/:id
- 학생 상세 조회

## 20.5 POST /api/students/:id/recovery-plan
- 회복학습 킷 생성

## 20.6 POST /api/students/:id/intervention-message
- 개입 메시지 생성

## 20.7 POST /api/students/:id/mini-assessment
- 미니 진단 생성

## 20.8 POST /api/students/:id/mini-assessment/submit
- 응답 제출
- 점수 계산
- 상태 갱신

---

# 21. 수용 기준(acceptance criteria)

## 21.1 전체 시스템
- 샘플 데이터만으로 전체 데모가 끊기지 않는다.
- 주요 기능이 최소 1회 이상 end-to-end로 동작한다.
- 더미 데이터여도 실사용처럼 설득력 있게 보인다.

## 21.2 기능별
### 업로드
- CSV 업로드 후 학생 목록 반영

### 위험 탐지
- 학생별 risk_score 노출
- 위험도 상위 학생 정렬 가능

### 회복학습
- 특정 학생에 대해 회복 플랜 생성 성공

### 개입 메시지
- 복사 가능한 메시지 출력

### 미니 진단
- 3문항 생성 및 결과 저장

### 상태 갱신
- 제출 후 점수 기반 상태 변동 확인 가능

---

# 22. 데모 시나리오

## 22.1 3분 데모 흐름
1. 랜딩에서 CatchUp AI 소개
2. 샘플 데이터 로드
3. 대시보드에서 위험 학생 수 확인
4. 학생 목록에서 가장 위험한 학생 클릭
5. 위험 원인 설명 확인
6. 회복학습 생성 클릭
7. 생성된 보강 플랜 확인
8. 개입 메시지 생성 및 복사 시연
9. 미니 진단 생성 및 1회 제출
10. 결과에 따라 위험 상태 업데이트 확인

## 22.2 데모에서 강조할 포인트
- 단순 대시보드가 아니라 **개입 액션**까지 연결된다는 점
- AI가 설명과 회복 플랜을 만든다는 점
- 교육 현장의 반복 업무를 줄인다는 점

---

# 23. 리스크 및 대응

## 23.1 리스크
- AI 응답 품질이 들쭉날쭉할 수 있음
- 강의자료 파싱 품질이 낮을 수 있음
- 범위를 넓히면 완성도가 떨어질 수 있음

## 23.2 대응
- 회복학습/퀴즈/메시지 생성 포맷을 고정
- 샘플 강의자료를 직접 통제된 형태로 준비
- 규칙기반 핵심 로직 유지
- 기능 추가보다 polish 우선

---

# 24. 제출물 체크리스트

## 24.1 필수 제출물
- public GitHub repo
- 배포 URL
- AI 리포트 PDF
- 개인정보 수집/이용 동의서 및 참가 각서 PDF

## 24.2 코드/배포 체크
- API Key 노출 없음
- .env.example 정리
- README 포함
- 샘플 데이터 포함 여부 점검
- 제출 이후 commit 방지

---

# 25. 다음 문서화 우선순위
이 문서 이후 바로 분리 작성할 문서는 아래 순서가 좋다.

1. `risk-scoring.md`
2. `data-model.md`
3. `ia-and-screens.md`
4. `prompts.md`
5. `acceptance-criteria.md`
6. `demo-scenario.md`

---

# 26. 최종 정리
CatchUp AI의 MVP 핵심은 아래 한 문장으로 요약된다.

> CatchUp AI는 결석, 미제출, 저참여로 학습 이탈 위험이 높아진 학생을 조기에 발견하고, 교육 현장이 바로 개입할 수 있도록 개인 맞춤 회복학습과 메시지를 생성해주는 AI 코파일럿이다.

이번 공모전에서는 **기능 수 확장**보다 **문제 정의의 날카로움**, **한 흐름의 완성도**, **AI가 실제 업무 병목을 줄이는 설계**가 더 중요하다.

이 문서는 그 방향을 유지하기 위한 기준 문서다.


---

# Appendix A. `/specs/001-domain/risk-scoring.md`

## 목적
이 문서는 CatchUp AI의 **위험도 계산 규칙**을 정의한다.
위험도 계산은 AI가 아닌 **규칙기반(deterministic)** 으로 처리하며, 결과는 학생 목록, 상세 화면, 우선 개입 정렬, 상태 배지에 사용된다.

---

## 1. 설계 원칙

### 1.1 원칙
- 계산 결과는 항상 동일 입력에 대해 동일해야 한다.
- 설명 가능해야 한다.
- 공모전 MVP에서는 **정확한 예측 모델**이 아니라 **합리적 조기 탐지 모델**을 목표로 한다.
- 위험도 계산 로직과 AI 생성 로직은 분리한다.

### 1.2 출력값
- `risk_score`: 0~100 정수
- `risk_level`: `stable | warning | at_risk`
- `risk_factors`: 점수에 기여한 원인 목록

---

## 2. 입력 필드 정의

### 필수 입력
- `attendance_rate` (0~100)
- `missed_sessions` (0 이상 정수)
- `assignment_submission_rate` (0~100)
- `avg_quiz_score` (0~100)
- `last_active_days_ago` (0 이상 정수)

### 선택 입력
- `manual_flag` (운영자 수동 플래그, MVP에서는 미사용 가능)
- `notes` (설명 생성용 참고 메모, 위험도 계산에는 미반영)

---

## 3. 기본 점수 규칙

### 3.1 출결 관련
#### 규칙 A1. 결석 횟수
- `missed_sessions >= 3` → +30
- `missed_sessions == 2` → +25
- `missed_sessions == 1` → +10
- `missed_sessions == 0` → +0

#### 규칙 A2. 출석률
- `attendance_rate < 50` → +25
- `50 <= attendance_rate < 70` → +15
- `70 <= attendance_rate < 85` → +8
- `attendance_rate >= 85` → +0

### 3.2 과제 관련
#### 규칙 B1. 과제 제출률
- `assignment_submission_rate < 40` → +30
- `40 <= assignment_submission_rate < 60` → +25
- `60 <= assignment_submission_rate < 80` → +10
- `assignment_submission_rate >= 80` → +0

### 3.3 퀴즈/이해도 관련
#### 규칙 C1. 평균 퀴즈 점수
- `avg_quiz_score < 40` → +25
- `40 <= avg_quiz_score < 60` → +20
- `60 <= avg_quiz_score < 75` → +10
- `avg_quiz_score >= 75` → +0

### 3.4 최근 활동 관련
#### 규칙 D1. 최근 활동 공백
- `last_active_days_ago > 14` → +25
- `8 <= last_active_days_ago <= 14` → +20
- `4 <= last_active_days_ago <= 7` → +10
- `0 <= last_active_days_ago <= 3` → +0

---

## 4. 복합 악화 보정 규칙

### 규칙 E1. 동시 악화 보정
다음 조건 중 **2개 이상**이면 +10 추가한다.
- `missed_sessions >= 2`
- `assignment_submission_rate < 60`
- `avg_quiz_score < 60`
- `last_active_days_ago > 7`

### 규칙 E2. 고위험 집중 보정
다음 조건 중 **3개 이상**이면 +10 추가한다.
- `attendance_rate < 70`
- `assignment_submission_rate < 60`
- `avg_quiz_score < 60`
- `last_active_days_ago > 7`

### 점수 상한
- 총합이 100을 넘으면 `risk_score = 100` 으로 clamp 처리한다.

---

## 5. 상태 레벨 구간

- `0 ~ 29` → `stable`
- `30 ~ 59` → `warning`
- `60 ~ 100` → `at_risk`

### UI 라벨
- `stable` → 안정
- `warning` → 주의
- `at_risk` → 위험

---

## 6. risk_factors 생성 규칙

위험도 계산 시 점수 기여 항목을 함께 저장한다.

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

### 허용 타입
- `attendance`
- `assignment`
- `quiz`
- `activity`
- `compound`

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
입력값
- attendance_rate: 62
- missed_sessions: 2
- assignment_submission_rate: 45
- avg_quiz_score: 58
- last_active_days_ago: 9

계산
- 결석 2회: +25
- 출석률 70% 미만: +15
- 과제 제출률 60% 미만: +25
- 퀴즈 평균 60점 미만: +20
- 최근 활동 8일 이상: +20
- 동시 악화 보정: +10
- 고위험 집중 보정: +10

총점 = 125 → clamp → 100
결과 = `at_risk`

### 예시 2. 주의 학생
입력값
- attendance_rate: 82
- missed_sessions: 1
- assignment_submission_rate: 75
- avg_quiz_score: 68
- last_active_days_ago: 5

계산
- 결석 1회: +10
- 출석률 85% 미만: +8
- 과제 제출률 80% 미만: +10
- 퀴즈 평균 75점 미만: +10
- 최근 활동 4일 이상: +10

총점 = 48
결과 = `warning`

---

## 9. 예외 처리

### 누락값 처리 원칙
- 필수 입력값이 누락되면 계산하지 않는다.
- API는 400 에러와 함께 누락 필드를 반환한다.
- UI에서는 `데이터 부족` 상태로 표시한다.

### 비정상 범위 처리
- 퍼센트 값은 0~100 범위를 벗어나면 validation error
- 음수 일수는 validation error
- 결석 횟수 음수는 validation error

---

## 10. 테스트 케이스

### 필수 테스트
1. 모든 값이 양호한 경우 `stable`
2. 결석만 높은 경우 `warning`
3. 과제/퀴즈/활동이 함께 나쁜 경우 `at_risk`
4. 총점이 100 초과 시 clamp 되는지 확인
5. 누락값 입력 시 validation error 확인

---

## 11. 변경 금지 원칙 (공모전 기간)
- 위험도 산식은 Day 3 이후 큰 폭으로 바꾸지 않는다.
- UI/AI 품질 개선 중에도 위험도 계산 규칙은 고정해 데모 일관성을 유지한다.

---

# Appendix B. `/specs/001-domain/data-model.md`

## 목적
이 문서는 CatchUp AI MVP의 데이터 구조와 저장 계약을 정의한다.

---

## 1. 설계 원칙
- MVP에서는 **간단하고 설명 가능한 구조**를 유지한다.
- 학생, 과정, 진행상태, AI 산출물은 분리 저장한다.
- AI 결과물은 재생성 가능하지만, 데모 안정성을 위해 저장한다.

---

## 2. 엔티티 개요
- `courses`
- `students`
- `student_progress`
- `recovery_plans`
- `intervention_messages`
- `mini_assessments`

---

## 3. 테이블 정의

### 3.1 `courses`
과정 또는 수업 단위 정보

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  uploaded_material_text text,
  created_at timestamptz not null default now()
);
```

#### 필드 설명
- `title`: 강의/과정명
- `description`: 과정 설명
- `uploaded_material_text`: PDF 또는 텍스트 업로드 후 추출된 본문

---

### 3.2 `students`
학생 기본 정보

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  cohort_name text,
  created_at timestamptz not null default now()
);
```

#### 필드 설명
- `name`: 학생명
- `email`: 선택
- `cohort_name`: 반/기수명

---

### 3.3 `student_progress`
학생의 과정별 학습 상태

```sql
create table student_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  attendance_rate numeric(5,2) not null,
  missed_sessions integer not null,
  assignment_submission_rate numeric(5,2) not null,
  avg_quiz_score numeric(5,2) not null,
  last_active_days_ago integer not null,
  risk_score integer not null,
  risk_level text not null check (risk_level in ('stable','warning','at_risk')),
  risk_factors_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id, course_id)
);
```

#### 필드 설명
- `risk_factors_json`: 계산된 위험 요인 배열 저장

---

### 3.4 `recovery_plans`
학생별 회복학습 결과

```sql
create table recovery_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  missed_concepts_summary text not null,
  recovery_steps_json jsonb not null,
  action_plan_text text not null,
  caution_points_text text,
  created_at timestamptz not null default now()
);
```

#### `recovery_steps_json` 예시
```json
[
  {
    "step": 1,
    "title": "핵심 개념 다시 보기",
    "description": "회귀분석의 목적과 입력 변수를 먼저 복습합니다."
  },
  {
    "step": 2,
    "title": "짧은 예제로 확인",
    "description": "작은 데이터셋으로 예측 문제를 다시 풀어봅니다."
  }
]
```

---

### 3.5 `intervention_messages`
학생 대상 개입 메시지 초안

```sql
create table intervention_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  message_type text not null check (message_type in ('teacher','operator','student_support')),
  content text not null,
  created_at timestamptz not null default now()
);
```

---

### 3.6 `mini_assessments`
학생별 미니 진단

```sql
create table mini_assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  questions_json jsonb not null,
  answer_key_json jsonb not null,
  explanation_json jsonb not null,
  submitted_answers_json jsonb,
  score integer,
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);
```

---

## 4. 관계도
- 한 `course` 는 여러 `student_progress` 를 가진다.
- 한 `student` 는 여러 `student_progress` 를 가질 수 있다.
- 한 학생-과정 조합은 여러 `recovery_plan` 과 `mini_assessment` 를 가질 수 있다.
- 한 학생-과정 조합은 여러 `intervention_message` 를 가질 수 있다.

---

## 5. CSV 업로드 계약

### 파일명 예시
- `students_progress_sample.csv`

### 컬럼 스키마
| column | type | required | 설명 |
|---|---|---:|---|
| student_name | string | Y | 학생 이름 |
| email | string | N | 학생 이메일 |
| cohort_name | string | N | 반/기수 |
| attendance_rate | number | Y | 출석률(0~100) |
| missed_sessions | integer | Y | 결석 횟수 |
| assignment_submission_rate | number | Y | 과제 제출률(0~100) |
| avg_quiz_score | number | Y | 평균 퀴즈 점수(0~100) |
| last_active_days_ago | integer | Y | 마지막 활동 이후 경과일 |
| notes | string | N | 참고 메모 |

### 샘플 CSV
```csv
student_name,email,cohort_name,attendance_rate,missed_sessions,assignment_submission_rate,avg_quiz_score,last_active_days_ago,notes
김민수,minsu@example.com,데이터분석 1기,62,2,45,58,9,최근 과제 미제출이 이어짐
이지은,jieun@example.com,데이터분석 1기,88,0,92,81,1,안정적 수강 중
박서준,seojun@example.com,데이터분석 1기,79,1,70,66,5,기초 개념 복습 필요
최수아,sua@example.com,데이터분석 1기,48,3,30,35,16,결석 및 활동 공백 심함
```

---

## 6. 애플리케이션 타입 정의 초안

```ts
export type RiskLevel = 'stable' | 'warning' | 'at_risk';

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  uploaded_material_text?: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  email?: string | null;
  cohort_name?: string | null;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  course_id: string;
  attendance_rate: number;
  missed_sessions: number;
  assignment_submission_rate: number;
  avg_quiz_score: number;
  last_active_days_ago: number;
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors_json: RiskFactor[];
  created_at: string;
  updated_at: string;
}

export interface RiskFactor {
  type: 'attendance' | 'assignment' | 'quiz' | 'activity' | 'compound';
  label: string;
  score: number;
}
```

---

## 7. 인덱스 권장

```sql
create index idx_student_progress_course_id on student_progress(course_id);
create index idx_student_progress_risk_level on student_progress(risk_level);
create index idx_student_progress_risk_score on student_progress(risk_score desc);
create index idx_recovery_plans_student_course on recovery_plans(student_id, course_id);
create index idx_intervention_messages_student_course on intervention_messages(student_id, course_id);
create index idx_mini_assessments_student_course on mini_assessments(student_id, course_id);
```

---

## 8. MVP 단순화 원칙
- `users`, `roles`, `organizations` 테이블은 이번 대회에서 제외 가능
- 인증이 없더라도 샘플 데모 기준으로 충분
- 멀티 코스 지원은 구조상 열어두되 UI는 단일 코스로 시작 가능

---

# Appendix C. `/specs/002-ux/ia-and-screens.md`

## 목적
이 문서는 CatchUp AI MVP의 화면 구조와 각 페이지의 목적, 주요 컴포넌트, 사용자 액션, 완료 기준을 정의한다.

---

## 1. 전체 IA
1. 랜딩 페이지
2. 업로드 페이지
3. 대시보드 페이지
4. 학생 목록 페이지
5. 학생 상세 페이지
6. 회복학습 결과 섹션
7. 미니 진단 화면

---

## 2. 화면별 명세

### 2.1 랜딩 페이지 `/`
#### 목적
- 제품을 한 문장으로 이해시킨다.
- 바로 데모 시작이 가능해야 한다.

#### 주요 컴포넌트
- Hero 섹션
- 제품 설명 카드
- `샘플 데이터로 시작` 버튼
- `파일 업로드` 버튼

#### 사용자 액션
- 샘플 데이터 로드
- 업로드 페이지로 이동

#### 완료 기준
- 첫 화면에서 5초 내 제품 목적 이해 가능
- 버튼 2개만으로 다음 행동 유도 가능

---

### 2.2 업로드 페이지 `/upload`
#### 목적
- 강의자료와 학생 CSV를 업로드한다.

#### 주요 컴포넌트
- 강의자료 업로드 카드
- 학생 CSV 업로드 카드
- 업로드 상태 표시
- 샘플 CSV 다운로드 버튼(optional)
- `대시보드로 이동` 버튼

#### 사용자 액션
- PDF 업로드
- CSV 업로드
- 처리 상태 확인

#### 완료 기준
- 업로드 성공/실패가 명확히 보인다.
- 성공 시 다음 화면으로 이동 가능하다.

---

### 2.3 대시보드 페이지 `/dashboard`
#### 목적
- 전체 상태와 우선 개입 대상을 빠르게 파악한다.

#### 주요 컴포넌트
- KPI 카드 4개
  - 전체 학생 수
  - 안정 학생 수
  - 주의 학생 수
  - 위험 학생 수
- 위험 학생 Top N 카드
- 과정/기수 정보 배지
- `학생 전체 보기` 버튼

#### 사용자 액션
- 위험 학생 클릭
- 학생 목록 페이지로 이동

#### 완료 기준
- 우선순위가 시각적으로 즉시 구분된다.
- 가장 위험한 학생을 한 번에 찾을 수 있다.

---

### 2.4 학생 목록 페이지 `/students`
#### 목적
- 학생 상태를 테이블 또는 카드 형태로 검토한다.

#### 주요 컴포넌트
- 검색 입력
- risk level 필터
- 정렬 옵션 (`risk_score desc` 기본)
- 학생 테이블

#### 테이블 컬럼
- 이름
- 상태
- 위험 점수
- 결석 횟수
- 과제 제출률
- 평균 퀴즈 점수
- 최근 활동일
- 상세 보기

#### 사용자 액션
- 학생 검색
- 위험도 필터
- 상세 페이지 이동

#### 완료 기준
- 위험도 높은 학생이 상단에 보인다.
- 1클릭으로 상세 화면 이동 가능

---

### 2.5 학생 상세 페이지 `/students/[id]`
#### 목적
- 학생 상태와 개입 액션을 한 곳에서 처리한다.

#### 주요 컴포넌트
- 학생 헤더 카드
  - 이름
  - 상태 배지
  - 위험 점수
- 위험 원인 요약 카드
- 학습 상태 카드 4종
  - 출결
  - 과제 제출률
  - 퀴즈 평균
  - 최근 활동일
- 액션 버튼 3개
  - `회복학습 생성`
  - `개입 메시지 생성`
  - `미니 진단 생성`

#### 사용자 액션
- 회복학습 생성
- 메시지 생성
- 미니 진단 생성

#### 완료 기준
- 학생 상태를 숫자와 문장 둘 다로 이해 가능
- 세 액션이 모두 같은 화면에서 실행 가능

---

### 2.6 회복학습 결과 섹션
#### 목적
- 학생 맞춤형 보강 내용을 보여준다.

#### 주요 컴포넌트
- 놓친 개념 요약 카드
- 3단계 회복 순서 카드
- 10~15분 액션 플랜 카드
- 주의 포인트 카드
- 메시지 복사 버튼

#### 완료 기준
- 학생이 지금 무엇부터 해야 하는지 분명하다.
- 장문이 아니라 즉시 실행 가능한 수준으로 요약된다.

---

### 2.7 미니 진단 화면 또는 모달
#### 목적
- 회복 여부를 짧게 점검한다.

#### 주요 컴포넌트
- 3문항 리스트
- 객관식/단답형 입력
- 제출 버튼
- 결과/해설 카드
- 재계산된 상태 카드

#### 완료 기준
- 제출 후 점수 확인 가능
- 결과에 따라 상태 갱신이 보인다.

---

## 3. 공통 UI 원칙
- 상태 배지는 색상 + 텍스트 둘 다 사용
- 학생을 비난하는 문구 금지
- AI 결과물은 카드 블록으로 구분
- 복사 가능한 메시지는 별도 블록 UI 사용
- 로딩/에러/빈 상태를 반드시 만든다.

---

## 4. 공통 상태 정의

### loading
- 업로드 중
- AI 생성 중
- 미니 진단 제출 중

### empty
- 데이터 없음
- 아직 생성된 회복학습 없음
- 아직 생성된 메시지 없음

### error
- 업로드 실패
- AI 응답 실패
- 데이터 파싱 실패

---

## 5. 데모 기준 핵심 동선
- 랜딩 → 샘플 데이터 로드 → 대시보드 → 학생 목록 → 학생 상세 → 회복학습 생성 → 메시지 생성 → 미니 진단 제출

이 동선이 끊기지 않는 것이 UX 최우선 기준이다.

---

# Appendix D. `/specs/005-ai/prompts.md`

## 목적
이 문서는 CatchUp AI에서 사용하는 AI 프롬프트 구조와 출력 계약을 정의한다.

---

## 1. 공통 원칙
- AI는 위험도 계산을 하지 않는다.
- 입력 데이터에 없는 사실을 추측하지 않는다.
- 학생을 낙인찍지 않는다.
- 짧고 실행 가능한 결과를 생성한다.
- 결과는 UI에 그대로 렌더링할 수 있게 구조화한다.

---

## 2. 공통 시스템 프롬프트

```text
You are an educational recovery learning assistant.
Your job is to help teachers and operators support students who are at risk of falling behind.
Use only the provided course material and student progress data.
Do not speculate about personality, family, health, or private circumstances.
Do not shame or label the student.
Be concise, practical, and supportive.
Return output in the exact requested format.
```

---

## 3. 입력 컨텍스트 계약
모든 생성 작업에는 아래를 포함한다.

- `course_title`
- `course_material_excerpt`
- `student_name`
- `risk_level`
- `risk_score`
- `attendance_rate`
- `missed_sessions`
- `assignment_submission_rate`
- `avg_quiz_score`
- `last_active_days_ago`
- `risk_factors`

---

## 4. 위험 원인 설명 프롬프트

### 목적
학생이 왜 주의/위험 상태인지 2~4문장으로 설명한다.

### user prompt template
```text
Generate a short risk explanation for the student.

Course: {{course_title}}
Student name: {{student_name}}
Risk level: {{risk_level}}
Risk score: {{risk_score}}
Attendance rate: {{attendance_rate}}
Missed sessions: {{missed_sessions}}
Assignment submission rate: {{assignment_submission_rate}}
Average quiz score: {{avg_quiz_score}}
Last active days ago: {{last_active_days_ago}}
Risk factors: {{risk_factors}}

Requirements:
- 2 to 4 sentences
- Explain only using the provided data
- Use a supportive and professional tone
- Do not exaggerate
```

### 출력 형식
```json
{
  "summary": "최근 결석과 과제 제출 저하가 함께 나타나 학습 공백이 커질 가능성이 있습니다. 최근 활동도 줄어 빠른 개입이 필요한 상태입니다."
}
```

---

## 5. 회복학습 킷 생성 프롬프트

### 목적
학생 맞춤형 회복학습 플랜 생성

### user prompt template
```text
Create a recovery learning kit for the student.

Course: {{course_title}}
Course material excerpt:
{{course_material_excerpt}}

Student name: {{student_name}}
Risk level: {{risk_level}}
Risk score: {{risk_score}}
Attendance rate: {{attendance_rate}}
Missed sessions: {{missed_sessions}}
Assignment submission rate: {{assignment_submission_rate}}
Average quiz score: {{avg_quiz_score}}
Last active days ago: {{last_active_days_ago}}
Risk factors: {{risk_factors}}

Requirements:
- Focus on helping the student catch up quickly
- Summarize missed concepts in simple language
- Provide exactly 3 recovery steps
- Provide a short 10-15 minute action plan
- Provide caution points or common mistakes
- Return valid JSON only
```

### 출력 형식
```json
{
  "missed_concepts_summary": "학생은 회귀분석의 목적과 입력 변수의 의미를 다시 정리할 필요가 있습니다.",
  "recovery_steps": [
    {
      "step": 1,
      "title": "핵심 개념 다시 읽기",
      "description": "회귀분석이 무엇을 예측하는지와 입력 변수의 역할을 먼저 복습합니다."
    },
    {
      "step": 2,
      "title": "짧은 예제로 확인",
      "description": "작은 예제로 독립변수와 종속변수를 구분해봅니다."
    },
    {
      "step": 3,
      "title": "직접 한 문제 풀기",
      "description": "간단한 데이터를 보고 어떤 값을 예측해야 하는지 말해봅니다."
    }
  ],
  "action_plan_text": "먼저 5분 동안 핵심 개념을 다시 읽고, 5분 동안 예제를 확인한 뒤, 마지막 5분 동안 직접 한 문제를 풀어보세요.",
  "caution_points_text": "입력 변수와 예측 대상 변수를 혼동하지 않도록 주의하세요."
}
```

---

## 6. 미니 진단 생성 프롬프트

### 목적
회복 여부 확인용 3문항 생성

### user prompt template
```text
Create a mini assessment with exactly 3 questions.

Course: {{course_title}}
Course material excerpt:
{{course_material_excerpt}}

Student name: {{student_name}}
Recovery target summary: {{missed_concepts_summary}}

Requirements:
- Exactly 3 questions
- Mix multiple choice and short answer if appropriate
- Questions must match the recovery content
- Include answer key and short explanations
- Return valid JSON only
```

### 출력 형식
```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "회귀분석의 가장 기본 목적은 무엇인가요?",
      "options": ["분류", "예측", "정렬", "압축"]
    },
    {
      "id": 2,
      "type": "short_answer",
      "question": "입력 변수와 예측 대상 변수의 차이를 한 문장으로 설명하세요."
    },
    {
      "id": 3,
      "type": "multiple_choice",
      "question": "독립변수에 해당하는 것은 무엇인가요?",
      "options": ["예측 결과", "입력 데이터", "오차", "라벨 없음"]
    }
  ],
  "answer_key": [
    { "id": 1, "answer": "예측" },
    { "id": 2, "answer": "입력 변수는 예측에 사용하는 값이고 예측 대상 변수는 맞히려는 값입니다." },
    { "id": 3, "answer": "입력 데이터" }
  ],
  "explanations": [
    { "id": 1, "explanation": "회귀분석은 주로 연속적인 값을 예측하는 데 사용됩니다." },
    { "id": 2, "explanation": "두 변수의 역할을 구분하는 것이 기본입니다." },
    { "id": 3, "explanation": "독립변수는 모델이 참고하는 입력값입니다." }
  ]
}
```

---

## 7. 개입 메시지 생성 프롬프트

### 목적
교강사/운영자가 학생에게 보낼 짧은 메시지 초안 생성

### user prompt template
```text
Write a supportive intervention message for a student.

Student name: {{student_name}}
Risk level: {{risk_level}}
Risk score: {{risk_score}}
Risk factors: {{risk_factors}}
Recovery summary: {{missed_concepts_summary}}

Requirements:
- 3 to 6 sentences
- Warm, supportive, non-judgmental tone
- Encourage a small next step
- Do not shame the student
- Do not mention sensitive speculation
- Return valid JSON only
```

### 출력 형식
```json
{
  "message": "최근 학습 공백이 조금 생긴 것으로 보여서, 부담 없이 다시 시작할 수 있도록 짧은 따라잡기 플랜을 준비했어요. 먼저 핵심 개념 요약부터 10분 정도 가볍게 확인해보면 좋아요. 바로 모든 내용을 따라잡으려 하기보다, 오늘 한 단계만 진행해도 충분합니다."
}
```

---

## 8. 가드레일
- 질병, 우울, ADHD, 가정환경 등 추측 금지
- 학생 의지 부족으로 단정 금지
- 협박, 비난, 비교 표현 금지
- 공포심 유발 금지
- `반드시`, `심각하다`, `문제 학생` 같은 낙인형 표현 금지

---

## 9. 실패 시 fallback

### 원칙
AI 실패 시에도 데모가 끊기면 안 된다.

### fallback 예시
- 위험 설명 실패 → 템플릿형 규칙 설명 출력
- 회복학습 실패 → 기본 3단계 템플릿 출력
- 메시지 실패 → 기본 격려 메시지 템플릿 출력
- 퀴즈 실패 → 사전 정의된 기본 문항 3개 출력

---

# Appendix E. `/specs/006-qa/acceptance-criteria.md`

## 목적
이 문서는 CatchUp AI MVP가 완료되었다고 판단하기 위한 기능별 acceptance criteria를 정의한다.

---

## 1. 전체 완료 기준
다음이 모두 충족되어야 MVP 완료로 본다.

1. 샘플 데이터 기준 end-to-end 데모 가능
2. 위험 학생 탐지부터 상태 업데이트까지 흐름이 끊기지 않음
3. 주요 에러 상황에서 UI가 깨지지 않음
4. README와 데모 동선 설명 가능

---

## 2. 기능별 acceptance criteria

### 2.1 랜딩
- [ ] 제품 한 줄 설명이 보인다.
- [ ] `샘플 데이터로 시작` 버튼이 동작한다.
- [ ] `파일 업로드` 버튼이 업로드 페이지로 이동한다.

### 2.2 업로드
- [ ] 강의자료 업로드가 가능하다.
- [ ] CSV 업로드가 가능하다.
- [ ] 실패 시 에러 메시지가 보인다.
- [ ] 성공 시 대시보드 이동이 가능하다.

### 2.3 위험도 계산
- [ ] 업로드된 각 학생에 대해 `risk_score` 가 계산된다.
- [ ] `risk_level` 이 정확히 표시된다.
- [ ] 위험 점수 내림차순 정렬이 가능하다.
- [ ] `risk_factors` 가 생성된다.

### 2.4 대시보드
- [ ] 전체 학생 수가 보인다.
- [ ] 안정/주의/위험 학생 수가 구분된다.
- [ ] 위험 학생 Top N 이 보인다.
- [ ] 특정 학생 상세로 이동 가능하다.

### 2.5 학생 목록
- [ ] 학생 리스트가 보인다.
- [ ] 검색이 가능하다.
- [ ] 상태 필터가 동작한다.
- [ ] 상세 보기 버튼이 동작한다.

### 2.6 학생 상세
- [ ] 학생 기본 정보가 보인다.
- [ ] 위험 원인 요약이 보인다.
- [ ] 출결/과제/퀴즈/최근 활동 값이 보인다.
- [ ] 회복학습 생성 버튼이 동작한다.
- [ ] 개입 메시지 생성 버튼이 동작한다.
- [ ] 미니 진단 생성 버튼이 동작한다.

### 2.7 회복학습 생성
- [ ] 놓친 개념 요약이 생성된다.
- [ ] 정확히 3단계 복습 순서가 생성된다.
- [ ] 액션 플랜이 생성된다.
- [ ] 주의 포인트가 생성된다.
- [ ] UI에 카드 형태로 정상 출력된다.

### 2.8 개입 메시지
- [ ] 메시지가 3~6문장 범위 내로 생성된다.
- [ ] 비난/낙인 표현이 없다.
- [ ] 복사 버튼이 동작한다.

### 2.9 미니 진단
- [ ] 정확히 3문항이 생성된다.
- [ ] 정답/해설이 저장된다.
- [ ] 학생이 답안을 제출할 수 있다.
- [ ] 점수가 계산된다.

### 2.10 상태 업데이트
- [ ] 제출 결과에 따라 risk score가 갱신된다.
- [ ] 갱신 후 상태 배지가 즉시 반영된다.
- [ ] 변경 전/후가 눈으로 확인 가능하다.

---

## 3. 비기능 acceptance criteria

### 성능
- [ ] 주요 화면 첫 로딩이 샘플 데이터 기준 2초 내외다.
- [ ] AI 생성은 10초 내외에서 완료된다.

### 안정성
- [ ] AI 실패 시 fallback 이 표시된다.
- [ ] 업로드 실패 시 앱이 중단되지 않는다.

### 보안
- [ ] GitHub public repo 에 비밀키가 없다.
- [ ] `.env.example` 이 정리되어 있다.

### 사용성
- [ ] 첫 사용자가 3분 내 핵심 흐름을 따라갈 수 있다.
- [ ] 상태 라벨이 텍스트로도 명확하다.

---

## 4. 데모 acceptance criteria
- [ ] 랜딩 → 샘플 데이터 로드가 1회 성공한다.
- [ ] 대시보드 → 학생 목록 → 상세 흐름이 성공한다.
- [ ] 회복학습 생성이 성공한다.
- [ ] 메시지 생성이 성공한다.
- [ ] 미니 진단 생성 및 제출이 성공한다.
- [ ] 상태 갱신이 화면에서 보인다.

---

## 5. 제출 직전 체크리스트
- [ ] public GitHub URL 정상 동작
- [ ] 라이브 배포 URL 정상 동작
- [ ] README 작성 완료
- [ ] 샘플 데이터 포함 또는 사용법 명시
- [ ] AI 리포트 PDF 완료
- [ ] 동의서/참가 각서 PDF 준비 완료
- [ ] 제출 이후 commit 방지 계획 확인

---

## 6. 데모 실패 방지 우선순위
문제가 생길 경우 아래 순서로 지킨다.

1. 샘플 데이터 동선 유지
2. 위험도 계산 유지
3. 학생 상세 유지
4. 회복학습 생성 유지
5. 미니 진단 유지
6. 부가 기능 제거

즉, 애니메이션이나 부가 필터보다 핵심 플로우를 우선 보장한다.

