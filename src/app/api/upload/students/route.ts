// POST /api/upload/students — CSV 업로드
import { uploadService } from '@/services/upload.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return errorResponse('VALIDATION_ERROR', 'CSV 파일이 필요합니다', 400);
    }

    const text = await file.text();
    const result = await uploadService.importFromCSV(text);
    return successResponse(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : '';
    if (msg === 'EMPTY_CSV') return errorResponse('VALIDATION_ERROR', '데이터가 없습니다', 400);
    if (msg.startsWith('MISSING_COLUMNS:')) {
      return errorResponse('VALIDATION_ERROR', `필수 컬럼이 누락되었습니다: ${msg.split(':')[1]}`, 400);
    }
    console.error('CSV upload error:', error);
    return errorResponse('INTERNAL_ERROR', '업로드 처리 중 오류가 발생했습니다', 500);
  }
}
