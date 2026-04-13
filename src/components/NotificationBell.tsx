'use client';

// 알림 벨 — NavHeader 우측
// SSOT: specs/004-backend/notification-spec.md 섹션 4

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
  relative_time: string;
}

function formatTimeAgo(iso: string, now: number) {
  const diff = now - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '방금';
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('mousedown', handleClick); document.removeEventListener('keydown', handleKeyDown); };
  }, []);

  useEffect(() => {
    if (!user || !open) return;
    const controller = new AbortController();
    fetch('/api/notifications', { signal: controller.signal })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const now = Date.now();
          setNotifications(json.data.notifications.map((item: Omit<NotificationItem, 'relative_time'>) => ({
            ...item,
            relative_time: formatTimeAgo(item.created_at, now),
          })));
          setUnreadCount(json.data.unread_count);
        }
      })
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort();
  }, [user, open]);

  if (!user) return null;

  async function markAllRead() {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read' }),
    });
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function handleClick(n: NotificationItem) {
    if (!n.read) {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark_read', id: n.id }),
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
    }
    if (n.link) router.push(n.link);
    setOpen(false);
  }

  const TYPE_ICONS: Record<string, string> = {
    risk_detected: '🔴',
    prediction_critical: '⚠️',
    recovery_created: '📚',
    assessment_graded: '✏️',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`알림${unreadCount > 0 ? ` (${unreadCount}개 읽지 않음)` : ''}`}
        className="relative p-2 rounded-[var(--radius-button)] hover:bg-[var(--bg-warm)] transition"
      >
        <Bell size={16} strokeWidth={1.8} className="text-[var(--text-secondary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: 'var(--status-risk)' }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-80 card card-deep bg-white border border-[var(--border)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <span className="text-[13px]" style={{ fontWeight: 510 }}>알림</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] text-[var(--accent)] hover:underline" style={{ fontWeight: 510 }}>
                <Check size={12} /> 모두 읽음
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={20} className="mx-auto text-[var(--text-muted)] mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-[var(--text-muted)]">새 알림이 없습니다</p>
              </div>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 border-b border-[var(--border)] hover:bg-[var(--bg-warm)] transition ${
                    !n.read ? 'bg-[var(--accent-light)]/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm mt-0.5">{TYPE_ICONS[n.type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] truncate" style={{ fontWeight: n.read ? 400 : 510 }}>{n.title}</p>
                      <p className="text-[12px] text-[var(--text-secondary)] truncate">{n.message}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">{n.relative_time}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--accent)' }} />}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
