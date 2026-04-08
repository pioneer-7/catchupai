// Feature Gate 유닛 테스트
// SSOT: specs/004-backend/billing-spec.md 섹션 5

import { describe, it, expect } from 'vitest';
import { checkAccess } from '@/lib/feature-gate';

describe('checkAccess', () => {
  // Free 플랜
  it('free: dashboard 접근 가능', () => expect(checkAccess('free', 'dashboard')).toBe(true));
  it('free: ai_basic 접근 가능', () => expect(checkAccess('free', 'ai_basic')).toBe(true));
  it('free: analytics 접근 불가', () => expect(checkAccess('free', 'analytics')).toBe(false));
  it('free: ai_unlimited 접근 불가', () => expect(checkAccess('free', 'ai_unlimited')).toBe(false));
  it('free: rest_api 접근 불가', () => expect(checkAccess('free', 'rest_api')).toBe(false));

  // Pro 플랜
  it('pro: dashboard 접근 가능', () => expect(checkAccess('pro', 'dashboard')).toBe(true));
  it('pro: ai_unlimited 접근 가능', () => expect(checkAccess('pro', 'ai_unlimited')).toBe(true));
  it('pro: analytics 접근 가능', () => expect(checkAccess('pro', 'analytics')).toBe(true));
  it('pro: pdf_export 접근 가능', () => expect(checkAccess('pro', 'pdf_export')).toBe(true));
  it('pro: rest_api 접근 불가', () => expect(checkAccess('pro', 'rest_api')).toBe(false));

  // API 플랜
  it('api: rest_api 접근 가능', () => expect(checkAccess('api', 'rest_api')).toBe(true));
  it('api: webhook 접근 가능', () => expect(checkAccess('api', 'webhook')).toBe(true));
  it('api: dashboard 접근 불가', () => expect(checkAccess('api', 'dashboard')).toBe(false));
});
