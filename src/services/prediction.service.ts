// Prediction Service — AI 이탈 예측 비즈니스 로직
// SSOT: specs/005-ai/prediction-spec.md

import { studentService } from '@/services/student.service';
import { courseRepository } from '@/repositories/course.repository';
import { predictionRepository } from '@/repositories/prediction.repository';
import { buildAiContext, generateRiskPrediction } from '@/lib/ai';
import type { RiskPrediction } from '@/types';

export const predictionService = {
  async generate(studentId: string): Promise<RiskPrediction> {
    const data = await studentService.getStudentDetail(studentId);
    if (!data) throw new Error('STUDENT_NOT_FOUND');

    const course = await courseRepository.findFirst();
    const ctx = buildAiContext(data.student, data.progress, course);
    const result = await generateRiskPrediction(ctx);

    const prediction = await predictionRepository.save({
      student_id: studentId,
      dropout_risk_score: result.dropout_risk_score,
      risk_level: result.risk_level,
      primary_risk_factors: result.primary_risk_factors,
      trajectory: result.trajectory,
      weeks_to_likely_dropout: result.weeks_to_likely_dropout,
      confidence_basis: result.confidence_basis,
      intervention_impact: result.intervention_impact,
      recommended_actions: result.recommended_actions,
    });

    return prediction;
  },

  async getLatest(studentId: string): Promise<RiskPrediction | null> {
    return predictionRepository.findLatestByStudent(studentId);
  },
};
