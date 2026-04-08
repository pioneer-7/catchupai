// Notification Repository
// SSOT: specs/004-backend/notification-spec.md

import { db } from '@/lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  org_id: string | null;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  created_at: string;
}

export const notificationRepository = {
  async findUnreadByUser(userId: string, limit = 10): Promise<Notification[]> {
    const { data } = await db.from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data || []) as Notification[];
  },

  async findRecentByUser(userId: string, limit = 10): Promise<Notification[]> {
    const { data } = await db.from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data || []) as Notification[];
  },

  async countUnread(userId: string): Promise<number> {
    const { count } = await db.from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);
    return count || 0;
  },

  async create(notification: Omit<Notification, 'id' | 'read' | 'created_at'>): Promise<Notification> {
    const { data } = await db.from('notifications').insert(notification).select().single();
    return data as Notification;
  },

  async markAsRead(id: string): Promise<void> {
    await db.from('notifications').update({ read: true }).eq('id', id);
  },

  async markAllAsRead(userId: string): Promise<void> {
    await db.from('notifications').update({ read: true }).eq('user_id', userId).eq('read', false);
  },
};
