# CatchUp AI Specs Index

> 이 문서는 모든 spec 파일의 위치, 목적, 상호 참조를 정리한 인덱스다.
> **SSOT 원칙**: 모든 개발은 이 specs를 기준으로 진행한다. 코드 작성 전 해당 spec이 존재해야 한다.

---

## 디렉토리 구조

```
specs/
├── INDEX.md                              ← 이 파일
├── 000-product/
│   ├── overview.md                       — 제품 정의, 핵심 가치, 포지셔닝
│   ├── goals-and-scope.md                — MVP 목표, In/Out Scope, 우선순위, 일정
│   └── personas.md                       — 대상 사용자, 페인 포인트, 사용자 스토리
├── 001-domain/
│   ├── data-model.md                     — 6개 테이블 DDL, 관계도, CSV 스키마, TS 타입
│   ├── risk-scoring.md                   — 규칙기반 위험도 산식, 레벨 구간, 테스트 케이스
│   └── ai-contracts.md                   — AI 활용 원칙, 4가지 생성 타입, 입출력 계약
├── 002-ux/
│   ├── ia-and-screens.md                 — 7개 화면 목록, 컴포넌트, 완료 기준
│   ├── user-flows.md                     — 운영자/교강사/학습자 동선, 데모 핵심 동선
│   └── copy-guidelines.md                — 디자인 톤, 금지 표현, 상태 라벨, 색상
├── 003-frontend/
│   ├── dashboard-spec.md                 — /dashboard KPI 카드, Top N, 차트
│   ├── student-list-spec.md              — /students 테이블, 검색, 필터, 정렬
│   ├── student-detail-spec.md            — /students/[id] 상세, 액션 버튼, AI 결��
│   ├── recovery-plan-spec.md             — 회복학습 결과 카드 레이아웃
│   ├── widget-spec.md                    — 임베더블 위젯 (iframe), 통합 가이드, Mock LMS
│   └── analytics-spec.md                — 이탈 퍼널, 코호트 분포, 개입 효과 시각화 ★P2
├── 004-backend/
│   ├── architecture-spec.md              — 3-Layer Clean Architecture, Repository/Service ★NEW
│   ├── validation-spec.md                — Zod 스키마 4개, 검증 위치, 에러 형식 ★NEW
│   ├── api-spec.md                       — 전체 API 엔드포인트, 요청/응답, 에러 코드
│   ├── api-versioning-spec.md            — /api/v1/ 버전 전략, 마이그레이션 ★NEW
│   ├── api-auth-spec.md                  — API 키 인증, 면제 조건, 향후 확장 ★NEW
│   ├── openapi-spec.md                   — OpenAPI 3.0, Swagger UI, 스키마 매핑 ★NEW
│   ├── webhook-spec.md                   — 이벤트 4개, 구독 API, HMAC, 재시도 ★NEW
│   ├── upload-parser-spec.md             — CSV/PDF 업로드, 파싱, 저장, 샘플 데이터
│   └── persistence-spec.md               — Supabase 설정, 접근 패턴, 마이그레이션
├── 005-ai/
│   ├── prompts.md                        — 시스템 프롬프트, 4개 user prompt 템플릿
│   ├── output-schema.md                  — JSON Schema 정의 (검증용)
│   ├── guardrails.md                     — 금지 사항, 톤 규칙, fallback 정책
│   ├── chat-spec.md                      — AI 학습 코칭 챗봇, 스트리밍, 세션 ★P2
│   └── prediction-spec.md               — AI 이탈 위험 예측, 구조화 출력, 궤적 ★P2
��── 006-qa/
    ├── acceptance-criteria.md            — 기능별/비기능/데모 수용 기준 체크리스트
    ├── demo-scenario.md                  — 3분 데모 흐름, 체크리스트, 실패 대응
    └── edge-cases.md                     — 입력 검증, AI 실패, 경계값, UI 예외
```

**총 32개 spec 파일** (기존 22개 + Phase 1 신규 7개 + Phase 2 신규 3개)

---

## Cross-Reference Map

### 개발 시 참조 경로

| 작업 | 1차 참조 | 2차 참조 |
|------|----------|----------|
| 프로젝트 이해 | `000-product/overview.md` | `000-product/goals-and-scope.md` |
| 아키텍처 이해 | `004-backend/architecture-spec.md` | `004-backend/api-spec.md` |
| DB 마이그레이션 | `001-domain/data-model.md` | `004-backend/persistence-spec.md` |
| 위험도 로직 | `001-domain/risk-scoring.md` | `006-qa/edge-cases.md` |
| AI 프롬프트 | `005-ai/prompts.md` | `001-domain/ai-contracts.md` |
| API 엔드포인트 | `004-backend/api-spec.md` | `004-backend/api-versioning-spec.md` |
| API 인증 | `004-backend/api-auth-spec.md` | `004-backend/api-versioning-spec.md` |
| API 문서화 | `004-backend/openapi-spec.md` | `004-backend/api-spec.md` |
| 입력 검증 | `004-backend/validation-spec.md` | `004-backend/architecture-spec.md` |
| Webhook | `004-backend/webhook-spec.md` | `004-backend/validation-spec.md` |
| 위젯 통합 | `003-frontend/widget-spec.md` | `004-backend/api-auth-spec.md` |
| CSV 업로드 | `004-backend/upload-parser-spec.md` | `001-domain/data-model.md` |
| 프론트엔드 | `003-frontend/*` | `002-ux/ia-and-screens.md` |
| 테스트/QA | `006-qa/acceptance-criteria.md` | `006-qa/edge-cases.md` |
| 데모 | `006-qa/demo-scenario.md` | `002-ux/user-flows.md` |

### 구현 순서 (Spec → Code)

| Day | 선행 Spec | 구현 대상 |
|-----|----------|----------|
| Day 2 | `api-versioning-spec`, `api-auth-spec`, `openapi-spec` | API v1 + Swagger + Auth |
| Day 3 | `webhook-spec` | Webhook 시스템 |
| Day 4 | `widget-spec` | 임베더블 ��젯 + Mock LMS |
| Day 5 | INDEX.md 최종 | 문서 + 검증 + 배포 |

---

## 원본 문서

이 specs는 `catch_up_ai_spec_v_0.md`에서 구조화 분리되었다. 원본은 참고용으로 유지하되, **개발 시에는 항상 `/specs` 내 개별 문서를 SSOT로 사용한다.**
