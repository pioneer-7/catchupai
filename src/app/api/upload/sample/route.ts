// POST /api/upload/sample — 샘플 데이터 로드
import { uploadService } from '@/services/upload.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST() {
  try {
    const result = await uploadService.loadSampleData();
    return successResponse({ ...result, processed: result.total_rows, skipped: 0 });
  } catch (error) {
    console.error('Sample data load error:', error);
    return errorResponse('INTERNAL_ERROR', '샘플 데이터 로드 중 오류가 발생했습니다', 500);
  }
}
