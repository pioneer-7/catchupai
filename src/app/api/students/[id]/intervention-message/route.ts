// POST /api/students/[id]/intervention-message — 개입 메시지 생성
import { type NextRequest } from 'next/server';
import { messageService } from '@/services/message.service';
import { MessageTypeSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    let messageType: 'teacher' | 'operator' | 'student_support' = 'teacher';
    try {
      const body = await request.json();
      const parsed = MessageTypeSchema.safeParse(body);
      if (parsed.success) messageType = parsed.data.message_type;
    } catch { /* no body — use default */ }

    const msg = await messageService.generate(id, messageType);
    return successResponse(msg);
  } catch (error) {
    if (error instanceof Error && error.message === 'STUDENT_NOT_FOUND') {
      return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);
    }
    console.error('Intervention message error:', error);
    return errorResponse('INTERNAL_ERROR', '메시지 생성 중 오류가 발생했습니다', 500);
  }
}
