// Chat Repository — Supabase 데이터 접근
// SSOT: specs/005-ai/chat-spec.md 섹션 5
import { db } from '@/lib/supabase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  student_id: string;
  messages: ChatMessage[];
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export const chatRepository = {
  async findLatestByStudent(studentId: string): Promise<ChatSession | null> {
    const { data } = await db.from('chat_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data as ChatSession | null;
  },

  async create(studentId: string): Promise<ChatSession> {
    const { data } = await db.from('chat_sessions')
      .insert({ student_id: studentId, messages: [] })
      .select()
      .single();
    return data as ChatSession;
  },

  async updateMessages(sessionId: string, messages: ChatMessage[]): Promise<void> {
    await db.from('chat_sessions')
      .update({ messages, updated_at: new Date().toISOString() })
      .eq('id', sessionId);
  },
};
