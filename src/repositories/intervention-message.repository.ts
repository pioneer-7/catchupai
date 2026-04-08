// InterventionMessage Repository — Supabase 데이터 접근
import { db } from '@/lib/supabase';
import type { InterventionMessage } from '@/types';

export const interventionMessageRepository = {
  async findByStudent(studentId: string): Promise<InterventionMessage[]> {
    const { data } = await db.from('intervention_messages')
      .select('*').eq('student_id', studentId).order('created_at', { ascending: false });
    return (data || []) as InterventionMessage[];
  },

  async save(msg: Omit<InterventionMessage, 'created_at'> & { id: string }): Promise<void> {
    await db.from('intervention_messages').insert({
      id: msg.id,
      student_id: msg.student_id,
      course_id: msg.course_id,
      message_type: msg.message_type,
      content: msg.content,
    });
  },

  async deleteAll(): Promise<void> {
    await db.from('intervention_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  },
};
