// Feature Gate — 티어별 기능 접근 체크
// SSOT: specs/004-backend/billing-spec.md 섹션 5

type Plan = 'free' | 'pro' | 'api';
type Feature =
  | 'dashboard'
  | 'students_50'
  | 'students_unlimited'
  | 'ai_basic'
  | 'ai_unlimited'
  | 'analytics'
  | 'pdf_export'
  | 'notifications'
  | 'rest_api'
  | 'webhook'
  | 'widget';

const FEATURE_MATRIX: Record<Feature, Plan[]> = {
  dashboard: ['free', 'pro'],
  students_50: ['free', 'pro'],
  students_unlimited: ['pro'],
  ai_basic: ['free', 'pro'],
  ai_unlimited: ['pro'],
  analytics: ['pro'],
  pdf_export: ['pro'],
  notifications: ['pro'],
  rest_api: ['api'],
  webhook: ['api'],
  widget: ['api'],
};

export function checkAccess(plan: Plan, feature: Feature): boolean {
  return FEATURE_MATRIX[feature]?.includes(plan) ?? false;
}

export function getUpgradeMessage(feature: Feature): string {
  const messages: Partial<Record<Feature, string>> = {
    students_unlimited: 'Pro 플랜으로 업그레이드하면 무제한 학생을 관리할 수 있습니다.',
    ai_unlimited: 'Pro 플랜으로 업그레이드하면 AI 생성을 무제한 사용할 수 있습니다.',
    analytics: 'Pro 플랜으로 업그레이드하면 교육 분석 대시보드를 이용할 수 있습니다.',
    pdf_export: 'Pro 플랜으로 업그레이드하면 PDF 내보내기가 가능합니다.',
    rest_api: 'API 플랜을 구독하면 REST API에 접근할 수 있습니다.',
    webhook: 'API 플랜을 구독하면 Webhook 이벤트를 수신할 수 있습니다.',
  };
  return messages[feature] || 'Pro 플랜으로 업그레이드하세요.';
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceLabel: '₩0',
    period: '',
    features: [
      '1개 과정',
      '최대 50명 학생',
      'AI 생성 5회/일',
      '기본 대시보드',
      '위험도 자동 계산',
    ],
    cta: '무료로 시작',
    popular: false,
  },
  pro: {
    name: 'Pro',
    price: 15900,
    priceLabel: '₩15,900',
    period: '/월',
    features: [
      '무제한 과정 & 학생',
      'AI 생성 무제한',
      '교육 분석 대시보드',
      'PDF 내보내기',
      '알림 시스템',
      'AI 교육 어시스턴트',
      '이탈 예측',
      '우선 지원',
    ],
    cta: 'Pro 시작하기',
    popular: true,
  },
  api: {
    name: 'API',
    price: null,
    priceLabel: '종량제',
    period: '',
    features: [
      'REST API v1 접근',
      'Webhook 이벤트 구독',
      '임베더블 위젯',
      'OpenAPI 문서',
      'API 키 인증',
      '1,000 호출/일',
      '기술 지원',
    ],
    cta: '문의하기',
    popular: false,
  },
} as const;
