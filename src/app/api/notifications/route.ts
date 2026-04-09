// GET /api/notifications — 알림 목록
// POST /api/notifications/read — 읽음 처리
// SSOT: specs/004-backend/notification-spec.md

import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notificationService } from '@/services/notification.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  const user = await getUser();
  if (!user) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', '로그인이 필요합니다', 401);

  const notifications = await notificationService.getRecent(user.id);
  const unreadCount = await notificationService.getUnreadCount(user.id);

  return successResponse({ notifications, unread_count: unreadCount });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', '로그인이 필요합니다', 401);

  const body = await request.json();

  if (body.action === 'mark_read' && body.id) {
    await notificationService.markAsRead(body.id, user.id);
  } else if (body.action === 'mark_all_read') {
    await notificationService.markAllAsRead(user.id);
  }

  return successResponse({ ok: true });
}
