# CatchUp AI Specs Index

> 이 문서는 모든 spec 파일의 위치, 목적, 상호 참조를 정리한 인덱스다.
> **SSOT 원칙**: 모든 개발은 이 specs를 기준으로 진행한다.

---

## 디렉토리 구조

```
specs/
├── INDEX.md                          ← 이 파일
├── 000-product/
│   ├── overview.md                   — 제품 정의, 핵심 가치, 포지셔닝
│   ├── goals-and-scope.md            — MVP 목표, In/Out Scope, 우선순위, 일정
│   └── personas.md                   — 대상 사용자, 페인 포인트, 사용자 스토리
├── 001-domain/
│   ├── data-model.md                 — 6개 테이블 DDL, 관계도, CSV 스키마, TS 타입
│   ├── risk-scoring.md               — 규칙기반 위험도 산식, 레벨 구간, 테스트 케이스
│   └── ai-contracts.md               — AI 활용 원칙, 4가지 생성 타입, 입출력 계약
├── 002-ux/
│   ├── ia-and-screens.md             — 7개 화면 목록, 컴포넌트, 완료 기준
│   ├── user-flows.md                 — 운영자/교강사/학습자 동선, 데모 핵심 동선
│   └── copy-guidelines.md            — 디자인 톤, 금지 표현, 상태 라벨, 색상
├── 003-frontend/
│   ├── dashboard-spec.md             — /dashboard KPI 카드, Top N, 데이터 요구
│   ├── student-list-spec.md          — /students 테이블, 검색, 필터, 정렬
│   ├── student-detail-spec.md        — /students/[id] 상세, 액션 버튼, AI 결과 표시
│   └── recovery-plan-spec.md         — 회복학습 결과 카드 레이아웃
├── 004-backend/
│   ├── upload-parser-spec.md         — CSV/PDF 업로드, 파싱, 저장, 샘플 데이터
│   ├── api-spec.md                   — 전체 API 엔드포인트, 요청/응답, 에러 코드
│   └── persistence-spec.md           — Supabase 설정, 접근 패턴, 마이그레이션
├── 005-ai/
│   ├── prompts.md                    — 시스템 프롬프트, 4개 user prompt 템플릿
│   ├── output-schema.md              — JSON Schema 정의 (검증용)
│   └── guardrails.md                 — 금지 사항, 톤 규칙, fallback 정책
└── 006-qa/
    ├── acceptance-criteria.md        — 기능별/비기능/데모 수용 기준 체크리스트
    ├── demo-scenario.md              — 3분 데모 흐름, 체크리스트, 실패 대응
    └── edge-cases.md                 — 입력 검증, AI 실패, 경계값, UI 예외
```

---

## Cross-Reference Map

### 개발 시 참조 경로

| 작업 | 1차 참조 | 2차 참조 |
|------|----------|----------|
| 프로젝트 이해 | `000-product/overview.md` | `000-product/goals-and-scope.md` |
| DB 마이그레이션 | `001-domain/data-model.md` | `004-backend/persistence-spec.md` |
| 위험도 로직 구현 | `001-domain/risk-scoring.md` | `006-qa/edge-cases.md` |
| AI 프롬프트 작성 | `005-ai/prompts.md` | `001-domain/ai-contracts.md` |
| AI 응답 검증 | `005-ai/output-schema.md` | `005-ai/guardrails.md` |
| 프론트엔드 페이지 | `003-frontend/*` | `002-ux/ia-and-screens.md` |
| API 엔드포인트 | `004-backend/api-spec.md` | `001-domain/data-model.md` |
| CSV 업로드 | `004-backend/upload-parser-spec.md` | `001-domain/data-model.md` 섹션 5 |
| 테스트/QA | `006-qa/acceptance-criteria.md` | `006-qa/edge-cases.md` |
| 데모 준비 | `006-qa/demo-scenario.md` | `002-ux/user-flows.md` |
| UI 톤/스타일 | `002-ux/copy-guidelines.md` | `005-ai/guardrails.md` |

### 에이전트별 참조 경로

| 에이전트 | 필수 참조 |
|----------|----------|
| Frontend Agent | `002-ux/*`, `003-frontend/*`, `002-ux/copy-guidelines.md` |
| Backend Agent | `004-backend/*`, `001-domain/data-model.md`, `001-domain/risk-scoring.md` |
| AI Agent | `005-ai/*`, `001-domain/ai-contracts.md` |
| QA Agent | `006-qa/*`, `002-ux/user-flows.md` |
| Product Agent | `000-product/*` |

---

## 원본 문서

이 specs는 `catch_up_ai_spec_v_0.md`에서 구조화 분리되었다. 원본은 참고용으로 유지하되, **개발 시에는 항상 `/specs` 내 개별 문서를 SSOT로 사용한다.**
