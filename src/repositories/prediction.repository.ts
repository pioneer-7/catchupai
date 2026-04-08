// Prediction Repository — Supabase 데이터 접근
// SSOT: specs/005-ai/prediction-spec.md

import { db } from '@/lib/supabase';
import type { RiskPrediction } from '@/types';

export const predictionRepository = {
  async findLatestByStudent(studentId: string): Promise<RiskPrediction | null> {
    const { data } = await db.from('risk_predictions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data as RiskPrediction | null;
  },

  async findAllByStudent(studentId: string): Promise<RiskPrediction[]> {
    const { data } = await db.from('risk_predictions')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    return (data || []) as RiskPrediction[];
  },

  async save(prediction: Omit<RiskPrediction, 'id' | 'created_at'>): Promise<RiskPrediction> {
    const { data } = await db.from('risk_predictions')
      .insert(prediction)
      .select()
      .single();
    return data as RiskPrediction;
  },
};
