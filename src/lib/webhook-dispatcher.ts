// Webhook Dispatcher — HMAC 서명 + 발송 + 재시도
// SSOT: specs/004-backend/webhook-spec.md 섹션 4

import { db } from '@/lib/supabase';
import type { DomainEvent } from '@/lib/events';

async function hmacSign(secret: string, body: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256=${hex}`;
}

async function deliver(
  subscriptionId: string,
  url: string,
  secret: string | null,
  event: DomainEvent
): Promise<void> {
  const payload = JSON.stringify(event);

  // 발송 기록 생성
  const { data: delivery } = await db.from('webhook_deliveries').insert({
    subscription_id: subscriptionId,
    event: event.event,
    payload: event,
    status: 'pending',
    attempts: 0,
  }).select('id').single();

  const deliveryId = delivery?.id;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret) headers['X-CatchUp-Signature'] = await hmacSign(secret, payload);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: payload,
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        await db.from('webhook_deliveries').update({
          status: 'success',
          response_status: res.status,
          attempts: attempt,
          last_attempt_at: new Date().toISOString(),
        }).eq('id', deliveryId);
        return;
      }

      // 비-2xx 응답
      await db.from('webhook_deliveries').update({
        response_status: res.status,
        attempts: attempt,
        last_attempt_at: new Date().toISOString(),
      }).eq('id', deliveryId);
    } catch {
      await db.from('webhook_deliveries').update({
        attempts: attempt,
        last_attempt_at: new Date().toISOString(),
      }).eq('id', deliveryId);
    }

    // 1차 실패 시 30초 대기 후 재시도 (서버리스에서는 즉시 재시도)
    if (attempt === 1) await new Promise(r => setTimeout(r, 1000));
  }

  // 2회 모두 실패
  await db.from('webhook_deliveries').update({ status: 'failed' }).eq('id', deliveryId);
}

export async function dispatchEvent(event: DomainEvent): Promise<void> {
  // 해당 이벤트를 구독하는 active webhook 조회
  const { data: subscriptions } = await db
    .from('webhook_subscriptions')
    .select('*')
    .eq('active', true)
    .contains('events', [event.event]);

  if (!subscriptions?.length) return;

  // 비동기로 병렬 발송 (응답 대기하지 않음)
  const promises = subscriptions.map(sub =>
    deliver(sub.id, sub.url, sub.secret, event).catch(err =>
      console.error(`[Webhook] Delivery failed for ${sub.url}:`, err)
    )
  );

  // 서버리스에서는 Promise.allSettled로 완료 대기
  await Promise.allSettled(promises);
}
