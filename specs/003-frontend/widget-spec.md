# 임베더블 위젯 명세

> **SSOT 문서** — iframe 위젯 타입, 파라미터, 통합 가이드, Mock LMS 데모

---

## 1. 개요

CatchUp AI 위젯은 외부 웹사이트(LMS, ERP, 교육 대시보드)에 iframe으로 삽입할 수 있는 독립 뷰다. 기존 시스템을 수정하지 않고 CatchUp의 위험 탐지 기능을 통합할 수 있다.

---

## 2. 위젯 타입

### 2.1 risk-summary — 코스 위험 요약

**경로**: `/widget/risk-summary`

**표시 내용**:
- 전체/안정/주의/위험 학생 수 (KPI 미니 카드)
- 도넛 차트 (위험도 분포)
- 상위 3명 위험 학생

**파라미터**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `api_key` | string | 예 | API 키 |

### 2.2 student-card — 개별 학생 카드

**경로**: `/widget/student-card`

**표시 내용**:
- 학생 이름 + 상태 배지
- 위험 점수 + 4개 지표 미니 바
- "상세 보기" 링크 (새 탭)

**파라미터**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `student_id` | uuid | 예 | 학생 ID |
| `api_key` | string | 예 | API 키 |

---

## 3. iframe 계약

### embed 코드

```html
<iframe
  src="https://carchupai.vercel.app/widget/risk-summary?api_key=YOUR_KEY"
  width="400"
  height="300"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);"
></iframe>
```

### 크기 가이드

| 위젯 | 최소 폭 | 권장 높이 |
|------|---------|----------|
| risk-summary | 360px | 300px |
| student-card | 300px | 200px |

### 보안

- `X-Frame-Options` 미설정 (iframe 허용)
- API 키 필수 (`api_key` 쿼리 파라미터)
- 키 없으면 "API 키가 필요합니다" 메시��� 표시

---

## 4. 위젯 레이아웃

- NavHeader 없음 (독립 뷰)
- `body` 배경: 투명 또는 `#ffffff`
- 폰트: Inter (시스템과 동일)
- 카드 스타일: 기존 디자인 토큰 사용

---

## 5. 통합 가이드 페이지

**경로**: `/integration`

**내용**:
- 위젯 타입 선택 (드롭다운)
- API 키 입력 필드
- 실시간 미리보기 (iframe)
- embed 코드 복사 버튼
- API 문서 링크 (`/docs`)

---

## 6. Mock LMS 데모 페이지

**경로**: `/demo/lms`

**내용**:
- 가상 LMS 레이아웃 (사이드바 + 메인 콘텐츠)
- CatchUp 위젯 2개 삽입:
  - risk-summary 위젯 (사이드바)
  - student-card 위젯 (메인 콘텐츠)
- "이렇게 기존 LMS에 통합됩니다" 설명 텍스트

---

## Cross-references

- API 인증 (api_key) → [`004-backend/api-auth-spec.md`](../004-backend/api-auth-spec.md)
- API 엔드포인트 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
- 디자인 토큰 → 글로벌 CSS (`src/app/globals.css`)
