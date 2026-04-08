// Webhook 구독 관리 API
// SSOT: specs/004-backend/webhook-spec.md 섹션 3

import { type NextRequest } from 'next/server';
import { db } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api-auth';
import { WebhookRegisterSchema } from '@/lib/validation';
import { successResponse, errorResponse } from '@/lib/api-helpers';

// POST /api/v1/webhooks — 등록
export async function POST(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  try {
    const body = await request.json();
    const parsed = WebhookRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.issues[0].message, 400);
    }

    const { data } = await db.from('webhook_subscriptions').insert({
      url: parsed.data.url,
      events: parsed.data.events,
      secret: parsed.data.secret || null,
    }).select().single();

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
    });
  } catch (error) {
    console.error('Webhook register error:', error);
    return errorResponse('INTERNAL_ERROR', 'Webhook 등록 중 오류가 발생했습니다', 500);
  }
}

// GET /api/v1/webhooks — 목록 조회
export async function GET(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const { data } = await db.from('webhook_subscriptions')
    .select('id, url, events, active, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false });

  return new Response(JSON.stringify({ success: true, data: data || [] }), {
    headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
  });
}

// DELETE /api/v1/webhooks?id=xxx — 해제
export async function DELETE(request: NextRequest) {
  const auth = validateApiKey(request);
  if (!auth.valid) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', auth.error!, 401);

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return errorResponse('VALIDATION_ERROR', 'Webhook ID가 필요합니다', 400);

  await db.from('webhook_subscriptions').update({ active: false }).eq('id', id);

  return new Response(JSON.stringify({ success: true, data: { id, deactivated: true } }), {
    headers: { 'Content-Type': 'application/json', 'X-API-Version': 'v1' },
  });
}
