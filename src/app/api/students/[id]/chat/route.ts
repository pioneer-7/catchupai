// POST /api/students/[id]/chat — AI 코칭 챗봇 (스트리밍)
// SSOT: specs/005-ai/chat-spec.md

import { type NextRequest } from 'next/server';
import { chatService } from '@/services/chat.service';
import { errorResponse } from '@/lib/api-helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
        } catch (error) {
          const msg = error instanceof Error ? error.message : '';
          if (msg === 'STUDENT_NOT_FOUND') {
            controller.enqueue(encoder.encode('학생 정보를 찾을 수 없습니다.'));
          } else {
            controller.enqueue(encoder.encode('응답 중 오류가 발생했습니다.'));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return errorResponse('INTERNAL_ERROR', '채팅 중 오류가 발생했습니다', 500);
  }
}
