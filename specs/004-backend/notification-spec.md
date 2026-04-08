# 알림 시스템 명세

> **SSOT 문서** — 인앱 알림, 이메일, 이벤트 트리거, UI

---

## 1. 알림 이벤트

| 이벤트 | 트리거 | 메시지 예시 |
|--------|--------|-----------|
| `risk_detected` | risk_level이 at_risk로 변경 | "김민수 학생이 위험 상태로 전환되었습니다" |
| `prediction_critical` | 이탈 예측 critical | "최수아 학생의 이탈 확률이 78%입니다" |
| `recovery_created` | 회복학습 생성 완료 | "회복학습 플랜이 생성되었습니다" |
| `assessment_graded` | 진단 채점 완료 | "미니 진단 결과: 2/3 정답" |

---

## 2. 채널

- **인앱**: NavHeader 알림 벨 (🔔) + 드롭다운
- **이메일**: Resend API (향후)

---

## 3. 데이터 모델

### `notifications`

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id uuid not null references organizations(id),
  type text not null,
  title text not null,
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_notifications_user_unread
  on notifications(user_id, read, created_at desc);
```

---

## 4. UI: NotificationBell

NavHeader 우측, 사용자 아바타 왼쪽:
- 읽지 않은 알림 수 배지 (빨강 원형)
- 클릭 → 드롭다운 (최근 10개)
- 각 항목: 제목 + 시간 + 클릭 시 link 이동
- "모두 읽음" 버튼

---

## Cross-references

- Webhook → [`004-backend/webhook-spec.md`](./webhook-spec.md)
- 인증 → [`004-backend/auth-spec.md`](./auth-spec.md)
