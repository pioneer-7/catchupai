// Chat Service — AI 코칭 챗봇 비즈니스 로직
// SSOT: specs/005-ai/chat-spec.md

import { studentService } from '@/services/student.service';
import { courseRepository } from '@/repositories/course.repository';
import { chatRepository, type ChatMessage } from '@/repositories/chat.repository';
import { buildChatSystemPrompt, streamChatResponse } from '@/lib/ai';

export const chatService = {
  async getOrCreateSession(studentId: string) {
    let session = await chatRepository.findLatestByStudent(studentId);

    // 세션이 없거나 메시지 20개 초과면 새 세션
    if (!session || session.messages.length >= 20) {
      session = await chatRepository.create(studentId);
    }

    return session;
  },

  async buildContext(studentId: string) {
    const data = await studentService.getStudentDetail(studentId);
    if (!data) throw new Error('STUDENT_NOT_FOUND');

    const course = await courseRepository.findFirst();
    const riskFactors = data.progress.risk_factors_json.map(f => f.label).join(', ');
    const recoveryPlan = data.recovery_plans[0]?.missed_concepts_summary || '아직 회복학습 플랜이 생성되지 않았습니다.';

    const systemPrompt = buildChatSystemPrompt(
      data.student.name,
      data.progress.risk_level,
      data.progress.risk_score,
      riskFactors,
      recoveryPlan,
      course?.title || '기본 과정',
      course?.uploaded_material_text || ''
    );

    return { systemPrompt, session: await this.getOrCreateSession(studentId) };
  },

  async* streamMessage(
    studentId: string,
    userMessage: string,
    sessionId?: string
  ): AsyncGenerator<string> {
    const { systemPrompt, session } = await this.buildContext(studentId);

    // 사용자 메시지 추가
    const messages: ChatMessage[] = [
      ...session.messages,
      { role: 'user' as const, content: userMessage, timestamp: new Date().toISOString() },
    ];

    // AI 스트리밍
    let fullResponse = '';
    for await (const chunk of streamChatResponse(systemPrompt, messages)) {
      fullResponse += chunk;
      yield chunk;
    }

    // 완성된 응답 저장
    messages.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date().toISOString(),
    });

    await chatRepository.updateMessages(sessionId || session.id, messages);
  },
};
