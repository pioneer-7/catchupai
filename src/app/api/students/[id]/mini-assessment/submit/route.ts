// POST /api/students/[id]/mini-assessment/submit — 미니 진단 제출 + 채점
// SSOT: specs/004-backend/api-spec.md 섹션 2.3, specs/001-domain/risk-scoring.md 섹션 9

import { type NextRequest } from 'next/server';
import { getStudentDetail, getMiniAssessment, updateMiniAssessment, updateProgress } from '@/lib/store';
import { calculateScoreDelta, recalculateLevel } from '@/lib/risk-scoring';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import type { SubmittedAnswer } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { assessment_id, answers } = body as {
      assessment_id: string;
      answers: SubmittedAnswer[];
    };

    if (!assessment_id || !Array.isArray(answers)) {
      return errorResponse('VALIDATION_ERROR', 'assessment_id와 answers가 필요합니다', 400);
    }

    const data = getStudentDetail(id);
    if (!data) return errorResponse('NOT_FOUND', '학생을 찾을 수 없습니다', 404);

    const assessment = getMiniAssessment(id, assessment_id);
    if (!assessment) return errorResponse('NOT_FOUND', '진단을 찾을 수 없습니다', 404);

    // Grade: exact match comparison
    let correctCount = 0;
    for (const key of assessment.answer_key_json) {
      const submitted = answers.find(a => a.id === key.id);
      if (submitted && submitted.answer.trim() === key.answer.trim()) {
        correctCount++;
      }
    }

    // Update assessment
    updateMiniAssessment(id, assessment_id, {
      submitted_answers_json: answers,
      score: correctCount,
      submitted_at: new Date().toISOString(),
    });

    // Recalculate risk score
    const delta = calculateScoreDelta(correctCount);
    const riskScoreBefore = data.progress.risk_score;
    const riskLevelBefore = data.progress.risk_level;
    const riskScoreAfter = Math.max(0, riskScoreBefore + delta);
    const riskLevelAfter = recalculateLevel(riskScoreAfter);

    updateProgress(id, data.progress.course_id, {
      risk_score: riskScoreAfter,
      risk_level: riskLevelAfter,
    });

    return successResponse({
      score: correctCount,
      total: 3,
      correct_answers: assessment.answer_key_json,
      explanations: assessment.explanation_json,
      risk_score_before: riskScoreBefore,
      risk_score_after: riskScoreAfter,
      risk_level_before: riskLevelBefore,
      risk_level_after: riskLevelAfter,
    });
  } catch (error) {
    console.error('Assessment submit error:', error);
    return errorResponse('INTERNAL_ERROR', '진단 제출 중 오류가 발생했습니다', 500);
  }
}
