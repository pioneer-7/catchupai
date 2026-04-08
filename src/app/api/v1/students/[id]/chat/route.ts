// POST /api/v1/students/[id]/chat — AI 코칭 (v1, 인증 필요)
// SSOT: specs/005-ai/chat-spec.md, specs/004-backend/api-auth-spec.md

import { type NextRequest } from 'next/server';
import { chatService } from '@/services/chat.service';
import { validateApiKey } from '@/lib/api-auth';
import { errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { id } = await params;

  try {
    const body = await request.json();
    const { message, session_id } = body as { message: string; session_id?: string };

    if (!message?.trim()) {
      return errorResponse('VALIDATION_ERROR', '메시지를 입력해주세요', 400);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatService.streamMessage(id, message, session_id)) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch {
          controller.enqueue(encoder.encode('응답 중 오류가 발생했습니다.'));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-API-Version': 'v1',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Chat v1 error:', error);
    return errorResponse('INTERNAL_ERROR', '채팅 중 오류가 발생했습니다', 500);
  }
}
