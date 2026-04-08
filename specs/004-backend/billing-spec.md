# 과금 시스템 명세

> **SSOT 문서** — 요금제, 포트원 결제, Feature Gate, 가격 페이지

---

## 1. 요금제

| 플랜 | 가격 | 포함 |
|------|------|------|
| **Free** | ₩0 | 1과정, 50학생, AI 5회/일, 기본 대시보드 |
| **Pro** | ₩15,900/월 | 무제한 과정/학생, AI 무제한, 분석, PDF, 알림 |
| **API** | 종량제 | REST API 접근, Webhook, 위젯, 1000호출/일 |

---

## 2. 가격 페이지 (`/pricing`)

3-column 카드 레이아웃:
- Free: 기본 기능 나열 + "무료로 시작" CTA
- Pro: 추천 배지 + 전체 기능 + "Pro 시작하기" CTA (primary)
- API: 개발자용 + API 문서 링크 + "문의하기" CTA

---

## 3. 결제 연동: 포트원 (PortOne)

- **SDK**: `@portone/browser-sdk`
- **결제 플로우**:
  1. 사용자가 Pro "시작하기" 클릭
  2. 포트원 결제 모달 표시 (카드/계좌이체/간편결제)
  3. 결제 완료 → `POST /api/billing/confirm` 검증
  4. `billing_subscriptions` 업데이트
  5. 기능 해금

- **정기결제**: 포트원 정기결제 API (billing key)
- **Webhook**: `/api/webhooks/portone` — 결제 이벤트 수신

---

## 4. 데이터 모델

### `billing_subscriptions`

```sql
create table billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id),
  plan text not null default 'free' check (plan in ('free','pro','api')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  portone_billing_key text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

---

## 5. Feature Gate

```typescript
// src/lib/feature-gate.ts
export function checkAccess(plan: string, feature: string): boolean
```

| 기능 | Free | Pro | API |
|------|------|-----|-----|
| 대시보드 | ✓ | ✓ | - |
| 학생 관리 (50명) | ✓ | ✓ | - |
| 학생 관리 (무제한) | - | ✓ | - |
| AI 생성 (5회/일) | ✓ | ✓ | - |
| AI 생성 (무제한) | - | ✓ | - |
| 분석 대시보드 | - | ✓ | - |
| PDF 내보내기 | - | ✓ | - |
| 알림 | - | ✓ | - |
| REST API | - | - | ✓ |
| Webhook | - | - | ✓ |
| 위젯 | - | - | ✓ |

---

## Cross-references

- 인증 → [`004-backend/auth-spec.md`](./auth-spec.md)
- 멀티테넌트 → [`004-backend/multi-tenant-spec.md`](./multi-tenant-spec.md)
- 레이트 리밋 → [`004-backend/rate-limit-spec.md`](./rate-limit-spec.md)
