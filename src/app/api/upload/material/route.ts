// POST /api/upload/material — 강의자료 업로드
import { courseRepository } from '@/repositories/course.repository';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return errorResponse('VALIDATION_ERROR', '강의자료 파일이 필요합니다', 400);
    }

    let existing = await courseRepository.findFirst();
    if (!existing) {
      existing = await courseRepository.save({ title: '기본 과정', description: null, uploaded_material_text: null });
    }

    const materialText = file.type === 'application/pdf'
      ? `[PDF 업로드됨: ${file.name}] — 텍스트 추출은 추후 지원됩니다.`
      : await file.text();

    await courseRepository.updateMaterial(existing.id, materialText);

    return successResponse({ course_id: existing.id, material_length: materialText.length });
  } catch (error) {
    console.error('Material upload error:', error);
    return errorResponse('INTERNAL_ERROR', '강의자료 업로드 중 오류가 발생했습니다', 500);
  }
}
