// Assessment Service — 미니 진단 생성 + 제출 비즈니스 로직
import { studentService } from '@/services/student.service';
import { courseRepository } from '@/repositories/course.repository';
import { assessmentRepository } from '@/repositories/assessment.repository';
import { progressRepository } from '@/repositories/progress.repository';
import { buildAiContext, generateMiniAssessment } from '@/lib/ai';
import { calculateScoreDelta, recalculateLevel } from '@/lib/risk-scoring';
import type { MiniAssessment, AssessmentSubmitData, SubmittedAnswer } from '@/types';

export const assessmentService = {
  async generate(studentId: string): Promise<MiniAssessment> {
    const data = await studentService.getStudentDetail(studentId);
    if (!data) throw new Error('STUDENT_NOT_FOUND');

    const course = await courseRepository.findFirst();
    const ctx = buildAiContext(data.student, data.progress, course);
    const conceptsSummary = data.recovery_plans[0]?.missed_concepts_summary || '최근 수업에서 다룬 핵심 개념';
    const result = await generateMiniAssessment(ctx, conceptsSummary);

    const assessment: MiniAssessment = {
      id: crypto.randomUUID(),
      student_id: studentId,
      course_id: course?.id || '',
      questions_json: result.questions as MiniAssessment['questions_json'],
      answer_key_json: result.answer_key,
      explanation_json: result.explanations,
      submitted_answers_json: null,
      score: null,
      submitted_at: null,
      created_at: new Date().toISOString(),
    };

    await assessmentRepository.save(assessment);
    return assessment;
  },

  async submit(
    studentId: string,
    assessmentId: string,
    answers: SubmittedAnswer[]
  ): Promise<AssessmentSubmitData> {
    const data = await studentService.getStudentDetail(studentId);
    if (!data) throw new Error('STUDENT_NOT_FOUND');

    const assessment = await assessmentRepository.findById(studentId, assessmentId);
    if (!assessment) throw new Error('ASSESSMENT_NOT_FOUND');

    // Grade
    let correctCount = 0;
    for (const key of assessment.answer_key_json) {
      const submitted = answers.find(a => a.id === key.id);
      if (submitted && submitted.answer.trim() === key.answer.trim()) {
        correctCount++;
      }
    }

    // Update assessment
    await assessmentRepository.update(studentId, assessmentId, {
      submitted_answers_json: answers,
      score: correctCount,
      submitted_at: new Date().toISOString(),
    });

    // Recalculate risk
    const delta = calculateScoreDelta(correctCount);
    const riskScoreBefore = data.progress.risk_score;
    const riskLevelBefore = data.progress.risk_level;
    const riskScoreAfter = Math.max(0, riskScoreBefore + delta);
    const riskLevelAfter = recalculateLevel(riskScoreAfter);

    await progressRepository.update(studentId, data.progress.course_id, {
      risk_score: riskScoreAfter,
      risk_level: riskLevelAfter,
    });

    return {
      score: correctCount,
      total: 3,
      correct_answers: assessment.answer_key_json,
      explanations: assessment.explanation_json,
      risk_score_before: riskScoreBefore,
      risk_score_after: riskScoreAfter,
      risk_level_before: riskLevelBefore,
      risk_level_after: riskLevelAfter,
    };
  },
};
