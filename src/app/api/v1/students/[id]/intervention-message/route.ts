// POST /api/v1/students/[id]/intervention-message
// SSOT: specs/004-backend/api-versioning-spec.md

import { type NextRequest } from 'next/server';
import { messageService } from '@/services/message.service';
import { validateApiKey } from '@/lib/api-auth';
import { MessageTypeSchema } from '@/lib/validation';
import { errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { id } = await params;
  try {
    let messageType: 'teacher' | 'operator' | 'student_support' = 'teacher';
    try {
      const body = await request.json();
      const parsed = MessageTypeSchema.safeParse(body);
      if (parsed.success) messageType = parsed.data.message_type;
    } catch { /* default */ }

    const msg = await messageService.generate(id, messageType);
    return new Response(JSON.stringify({ success: true, data: msg }), {
      headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'STUDENT_NOT_FOUND')
      return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    return errorResponse('INTERNAL_ERROR', '메시지 생성 중 오류가 발생했습니다', 500);
  }
}
