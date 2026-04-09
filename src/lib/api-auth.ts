// API 키 인증 미들웨어
// SSOT: specs/004-backend/api-auth-spec.md

export function validateApiKey(request: Request): { valid: boolean; error?: string } {
  const apiKey = process.env.CATCHUP_API_KEY;

  // 개발 모드: API 키 미설정이면 인증 건너뜀
  if (!apiKey) return { valid: true };

  // X-API-Key 헤더만 허용 (query string은 보안상 허용하지 않음)
  const headerKey = request.headers.get('x-api-key');

  if (!headerKey) {
    return { valid: false, error: '유효한 API 키가 필요합니다. X-API-Key 헤더를 확인해주세요.' };
  }

  if (headerKey !== apiKey) {
    return { valid: false, error: 'API 키가 올바르지 않습니다.' };
  }

  return { valid: true };
}
