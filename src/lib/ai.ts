// Claude AI 통합 레이어
// SSOT: specs/005-ai/prompts.md, specs/005-ai/guardrails.md, specs/001-domain/ai-contracts.md

import Anthropic from '@anthropic-ai/sdk';
import type { Course, Student, StudentProgress } from '@/types';

// ─── Types ───

export interface AiContext {
  course_title: string;
  course_material_excerpt: string;
  student_name: string;
  risk_level: string;
  risk_score: number;
  attendance_rate: number;
  missed_sessions: number;
  assignment_submission_rate: number;
  avg_quiz_score: number;
  last_active_days_ago: number;
  risk_factors: string;
}

export interface RecoveryPlanOutput {
  missed_concepts_summary: string;
  recovery_steps: { step: number; title: string; description: string }[];
  action_plan_text: string;
  caution_points_text: string;
}

export interface MiniAssessmentOutput {
  questions: { id: number; type: string; question: string; options?: string[] }[];
  answer_key: { id: number; answer: string }[];
  explanations: { id: number; explanation: string }[];
}

// ─── Constants ───

const SYSTEM_PROMPT = `You are an educational recovery learning assistant.
Your job is to help teachers and operators support students who are at risk of falling behind.
Use only the provided course material and student progress data.
Do not speculate about personality, family, health, or private circumstances.
Do not shame or label the student.
Be concise, practical, and supportive.
Return output in the exact requested format.`;

const MODEL = process.env.AI_MODEL || 'claude-sonnet-4-20250514';

// ─── Fallbacks (from specs/005-ai/guardrails.md) ───

const FALLBACK_RECOVERY_PLAN: RecoveryPlanOutput = {
  missed_concepts_summary: '최근 수업에서 다룬 핵심 개념을 다시 확인할 필요가 있습니다.',
  recovery_steps: [
    { step: 1, title: '강의자료 재확인', description: '최근 수업 자료를 다시 읽어봅니다.' },
    { step: 2, title: '핵심 개념 정리', description: '주요 개념과 용어를 정리합니다.' },
    { step: 3, title: '연습 문제 풀기', description: '간단한 문제를 풀어 이해도를 확인합니다.' },
  ],
  action_plan_text: '15분 동안 강의자료를 다시 읽고, 핵심 개념을 노트에 정리한 뒤, 간단한 문제를 풀어보세요.',
  caution_points_text: '한꺼번에 모든 내용을 따라잡으려 하지 마세요. 하나씩 단계별로 진행하는 것이 효과적입니다.',
};

const FALLBACK_MESSAGE = {
  message: '최근 학습에 조금 공백이 생긴 것 같아요. 부담 갖지 않아도 됩니다. 짧은 복습 자료를 준비해두었으니, 시간이 될 때 가볍게 확인해보세요. 한 걸음씩 다시 시작하면 충분히 따라잡을 수 있어요.',
};

const FALLBACK_ASSESSMENT: MiniAssessmentOutput = {
  questions: [
    { id: 1, type: 'multiple_choice', question: '이번 단원의 핵심 목표는 무엇인가요?', options: ['분석', '예측', '분류', '변환'] },
    { id: 2, type: 'short_answer', question: '이번 단원에서 가장 중요한 개념을 한 문장으로 설명하세요.' },
    { id: 3, type: 'multiple_choice', question: '다음 중 올바른 설명은?', options: ['독립변수는 예측 결과이다', '독립변수는 입력 데이터이다', '종속변수는 입력 데이터이다', '회귀분석은 분류 기법이다'] },
  ],
  answer_key: [
    { id: 1, answer: '예측' },
    { id: 2, answer: '핵심 개념에 대한 요약 문장' },
    { id: 3, answer: '독립변수는 입력 데이터이다' },
  ],
  explanations: [
    { id: 1, explanation: '이번 단원의 핵심 목표는 예측 능력 향상입니다.' },
    { id: 2, explanation: '핵심 개념을 자신의 말로 설명할 수 있어야 합니다.' },
    { id: 3, explanation: '독립변수는 모델이 참고하는 입력값입니다.' },
  ],
};

// ─── Client ───

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.log('[AI] No ANTHROPIC_API_KEY — using fallback mode');
    return null;
  }
  return new Anthropic({ apiKey: key });
}

// ─── Core call ───

async function callClaude(userPrompt: string): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const block = response.content[0];
    if (block.type === 'text') return block.text;
    return null;
  } catch (error) {
    console.error('[AI] Claude call failed:', error);
    return null;
  }
}

// ─── Chat (Streaming) ───
// SSOT: specs/005-ai/chat-spec.md

export function buildChatSystemPrompt(
  studentName: string,
  riskLevel: string,
  riskScore: number,
  riskFactors: string,
  recoveryPlanSummary: string,
  courseTitle: string,
  courseMaterial: string
): string {
  return `You are an AI teaching assistant helping an educator manage at-risk student "${studentName}".

STUDENT PROFILE:
- Risk level: ${riskLevel} (score: ${riskScore}/100)
- Primary risk factors: ${riskFactors}
- Recovery plan: ${recoveryPlanSummary}
- Course: ${courseTitle}
- Course material excerpt: ${courseMaterial.slice(0, 1500)}

YOUR ROLE:
- You are assisting the TEACHER/OPERATOR, not the student directly
- Provide actionable advice on how to intervene with this specific student
- Suggest personalized teaching strategies based on the student's risk factors
- Help the educator craft messages, simplify recovery plans, or plan interventions
- Offer data-driven insights ("출석률이 62%이므로, 먼저 출결 관련 대화를 권장합니다")
- Respond in Korean

RESPONSE FORMAT:
- Use markdown for structured responses
- Use **bold** for key recommendations and data points
- Use numbered lists (1. 2. 3.) for step-by-step intervention strategies
- Use bullet points (- ) for options or considerations
- Use > blockquote for key insights or suggested message drafts
- Use ### for section headers when covering multiple topics
- Keep paragraphs short (2-3 sentences max)
- Always end with "📌 **권장 다음 조치**:" followed by 1-2 specific actions

GUARDRAILS:
- Focus on pedagogical strategies, not personal speculation about the student
- Do NOT diagnose learning disabilities or personal issues
- Suggest evidence-based intervention approaches
- Keep responses under 250 words`;
}

export async function* streamChatResponse(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
): AsyncGenerator<string> {
  const client = getClient();
  if (!client) {
    yield '지금 잠시 연결이 원활하지 않아요. 잠시 후 다시 시도해주세요. 그동안 회복학습 플랜의 1단계를 먼저 읽어보면 좋아요!';
    return;
  }

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const delta = event.delta;
        if ('text' in delta) {
          yield delta.text;
        }
      }
    }
  } catch (error) {
    console.error('[AI] Chat stream failed:', error);
    yield '죄송해요, 응답 중 문제가 발생했어요. 다시 질문해주세요!';
  }
}

// ─── JSON parsing ───

function extractJson(raw: string): unknown | null {
  // Try direct parse
  try {
    return JSON.parse(raw.trim());
  } catch {
    // Strip markdown fences
    const stripped = raw.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim();
    try {
      return JSON.parse(stripped);
    } catch {
      // Extract first {...} block
      const match = stripped.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}

// ─── Context builder ───

export function buildAiContext(student: Student, progress: StudentProgress, course: Course | null): AiContext {
  const factorLabels = progress.risk_factors_json.map(f => f.label).join(', ');
  return {
    course_title: course?.title || '기본 과정',
    course_material_excerpt: course?.uploaded_material_text?.slice(0, 2000) || '강의자료가 아직 업로드되지 않았습니다.',
    student_name: student.name,
    risk_level: progress.risk_level,
    risk_score: progress.risk_score,
    attendance_rate: progress.attendance_rate,
    missed_sessions: progress.missed_sessions,
    assignment_submission_rate: progress.assignment_submission_rate,
    avg_quiz_score: progress.avg_quiz_score,
    last_active_days_ago: progress.last_active_days_ago,
    risk_factors: factorLabels,
  };
}

// ─── Generators ───

export async function generateRecoveryPlan(ctx: AiContext): Promise<RecoveryPlanOutput> {
  const prompt = `Create a recovery learning kit for the student.

Course: ${ctx.course_title}
Course material excerpt:
${ctx.course_material_excerpt}

Student name: ${ctx.student_name}
Risk level: ${ctx.risk_level}
Risk score: ${ctx.risk_score}
Attendance rate: ${ctx.attendance_rate}
Missed sessions: ${ctx.missed_sessions}
Assignment submission rate: ${ctx.assignment_submission_rate}
Average quiz score: ${ctx.avg_quiz_score}
Last active days ago: ${ctx.last_active_days_ago}
Risk factors: ${ctx.risk_factors}

Requirements:
- Focus on helping the student catch up quickly
- Summarize missed concepts in simple language
- Provide exactly 3 recovery steps as objects with step, title, description fields
- Provide a short 10-15 minute action plan
- Provide caution points or common mistakes
- Respond in Korean
- Return valid JSON only matching this exact structure:
{"missed_concepts_summary":"string","recovery_steps":[{"step":1,"title":"string","description":"string"},{"step":2,"title":"string","description":"string"},{"step":3,"title":"string","description":"string"}],"action_plan_text":"string","caution_points_text":"string"}`;

  const raw = await callClaude(prompt);
  if (!raw) return FALLBACK_RECOVERY_PLAN;

  const parsed = extractJson(raw) as Record<string, unknown> | null;
  if (parsed && 'missed_concepts_summary' in parsed && 'recovery_steps' in parsed) {
    const steps = parsed.recovery_steps;
    // Normalize: if steps are strings, convert to objects
    if (Array.isArray(steps) && steps.length >= 3) {
      const normalizedSteps = steps.slice(0, 3).map((s, i) => {
        if (typeof s === 'string') {
          return { step: i + 1, title: `단계 ${i + 1}`, description: s };
        }
        return s as { step: number; title: string; description: string };
      });
      return {
        missed_concepts_summary: String(parsed.missed_concepts_summary),
        recovery_steps: normalizedSteps,
        action_plan_text: String(parsed.action_plan_text || ''),
        caution_points_text: String(parsed.caution_points_text || ''),
      };
    }
  }

  console.warn('[AI] Invalid recovery plan response, using fallback');
  return FALLBACK_RECOVERY_PLAN;
}

export async function generateInterventionMessage(
  ctx: AiContext,
  missedConceptsSummary?: string
): Promise<{ message: string }> {
  const prompt = `Write a supportive intervention message for a student.

Student name: ${ctx.student_name}
Risk level: ${ctx.risk_level}
Risk score: ${ctx.risk_score}
Risk factors: ${ctx.risk_factors}
Recovery summary: ${missedConceptsSummary || '최근 수업 내용 복습이 필요합니다'}

Requirements:
- 3 to 6 sentences
- Warm, supportive, non-judgmental tone
- Encourage a small next step
- Do not shame the student
- Do not mention sensitive speculation
- Respond in Korean
- Return valid JSON only`;

  const raw = await callClaude(prompt);
  if (!raw) return FALLBACK_MESSAGE;

  const parsed = extractJson(raw);
  if (
    parsed &&
    typeof parsed === 'object' &&
    'message' in (parsed as Record<string, unknown>) &&
    typeof (parsed as { message: unknown }).message === 'string'
  ) {
    return parsed as { message: string };
  }

  console.warn('[AI] Invalid intervention message response, using fallback');
  return FALLBACK_MESSAGE;
}

export async function generateMiniAssessment(
  ctx: AiContext,
  missedConceptsSummary: string
): Promise<MiniAssessmentOutput> {
  const prompt = `Create a mini assessment with exactly 3 questions.

Course: ${ctx.course_title}
Course material excerpt:
${ctx.course_material_excerpt}

Student name: ${ctx.student_name}
Recovery target summary: ${missedConceptsSummary}

Requirements:
- Exactly 3 questions
- Mix multiple choice and short answer if appropriate
- Questions must match the recovery content
- Include answer key and short explanations
- Respond in Korean
- Return valid JSON only`;

  const raw = await callClaude(prompt);
  if (!raw) return FALLBACK_ASSESSMENT;

  const parsed = extractJson(raw);
  if (
    parsed &&
    typeof parsed === 'object' &&
    'questions' in (parsed as Record<string, unknown>) &&
    Array.isArray((parsed as MiniAssessmentOutput).questions) &&
    (parsed as MiniAssessmentOutput).questions.length === 3
  ) {
    return parsed as MiniAssessmentOutput;
  }

  console.warn('[AI] Invalid assessment response, using fallback');
  return FALLBACK_ASSESSMENT;
}
