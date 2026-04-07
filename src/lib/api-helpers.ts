// API 응답 헬퍼
// SSOT: specs/004-backend/api-spec.md 섹션 1

export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(
  code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'RATE_LIMITED' | 'INTERNAL_ERROR',
  message: string,
  status: number
) {
  return Response.json({ success: false, error: { code, message } }, { status });
}
