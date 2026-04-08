// API 키 인증 미들웨어
// SSOT: specs/004-backend/api-auth-spec.md

const SELF_DOMAINS = ['carchupai.vercel.app', 'localhost'];

export function validateApiKey(request: Request): { valid: boolean; error?: string } {
  const apiKey = process.env.CATCHUP_API_KEY;

  // 개발 모드: API 키 미설정이면 인증 건너뜀
  if (!apiKey) return { valid: true };

  // same-origin 면제: Referer가 자체 도메인이면 건너뜀
  const referer = request.headers.get('referer') || '';
  if (SELF_DOMAINS.some(d => referer.includes(d))) return { valid: true };

  const origin = request.headers.get('origin') || '';
  if (SELF_DOMAINS.some(d => origin.includes(d))) return { valid: true };

  // X-API-Key 헤더 또는 ?api_key 쿼리 파라미터 확인
  const headerKey = request.headers.get('x-api-key');
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('api_key');

  const providedKey = headerKey || queryKey;

  if (!providedKey) {
    return { valid: false, error: '유효한 API 키가 필요합니다. X-API-Key 헤더를 확인해주세요.' };
  }

  if (providedKey !== apiKey) {
    return { valid: false, error: 'API 키가 올바르지 않습니다.' };
  }

  return { valid: true };
}
