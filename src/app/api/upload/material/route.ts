// POST /api/upload/material — 강의자료 업로드
// SSOT: specs/004-backend/upload-parser-spec.md 섹션 3

import { getOrCreateDefaultCourse, updateCourseMaterial } from '@/lib/store';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return errorResponse('VALIDATION_ERROR', '강의자료 파일이 필요합니다', 400);
    }

    const course = getOrCreateDefaultCourse();
    let materialText: string;

    if (file.type === 'application/pdf') {
      // MVP: PDF 텍스트 추출은 Day 5+ 범위
      materialText = `[PDF 업로드됨: ${file.name}] — 텍스트 추출은 추후 지원됩니다.`;
    } else {
      materialText = await file.text();
    }

    updateCourseMaterial(course.id, materialText);

    return successResponse({
      course_id: course.id,
      material_length: materialText.length,
    });
  } catch (error) {
    console.error('Material upload error:', error);
    return errorResponse('INTERNAL_ERROR', '강의자료 업로드 중 오류가 발생했습니다', 500);
  }
}
