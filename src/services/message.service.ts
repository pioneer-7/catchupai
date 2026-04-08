// Message Service — 개입 메시지 생성 비즈니스 로직
import { studentService } from '@/services/student.service';
import { courseRepository } from '@/repositories/course.repository';
import { interventionMessageRepository } from '@/repositories/intervention-message.repository';
import { buildAiContext, generateInterventionMessage } from '@/lib/ai';
import type { InterventionMessage } from '@/types';

export const messageService = {
  async generate(
    studentId: string,
    messageType: 'teacher' | 'operator' | 'student_support' = 'teacher'
  ): Promise<InterventionMessage> {
    const data = await studentService.getStudentDetail(studentId);
    if (!data) throw new Error('STUDENT_NOT_FOUND');

    const course = await courseRepository.findFirst();
    const ctx = buildAiContext(data.student, data.progress, course);
    const conceptsSummary = data.recovery_plans[0]?.missed_concepts_summary;
    const result = await generateInterventionMessage(ctx, conceptsSummary);

    const msg: InterventionMessage = {
      id: crypto.randomUUID(),
      student_id: studentId,
      course_id: course?.id || '',
      message_type: messageType,
      content: result.message,
      created_at: new Date().toISOString(),
    };

    await interventionMessageRepository.save(msg);
    return msg;
  },
};
