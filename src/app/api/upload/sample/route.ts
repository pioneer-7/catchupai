// POST /api/upload/sample — 샘플 데이터 로드
// SSOT: specs/004-backend/upload-parser-spec.md 섹션 4

import { loadSampleData } from '@/lib/store';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST() {
  try {
    const result = loadSampleData();
    return successResponse({
      total_rows: result.total_rows,
      processed: result.total_rows,
      skipped: 0,
      course_id: result.course_id,
    });
  } catch (error) {
    console.error('Sample data load error:', error);
    return errorResponse('INTERNAL_ERROR', '샘플 데이터 로드 중 오류가 발생했습니다', 500);
  }
}
