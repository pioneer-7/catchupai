// POST /api/upload/students — CSV 업로드 + 파싱 + risk 계산
// SSOT: specs/004-backend/upload-parser-spec.md

import Papa from 'papaparse';
import { getOrCreateDefaultCourse, upsertStudentWithProgress } from '@/lib/store';
import { successResponse, errorResponse } from '@/lib/api-helpers';

const REQUIRED_COLUMNS = [
  'student_name',
  'attendance_rate',
  'missed_sessions',
  'assignment_submission_rate',
  'avg_quiz_score',
  'last_active_days_ago',
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return errorResponse('VALIDATION_ERROR', 'CSV 파일이 필요합니다', 400);
    }

    const text = await file.text();
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (!parsed.data.length) {
      return errorResponse('VALIDATION_ERROR', '데이터가 없습니다', 400);
    }

    // Validate required columns
    const headers = Object.keys(parsed.data[0]);
    const missing = REQUIRED_COLUMNS.filter(c => !headers.includes(c));
    if (missing.length > 0) {
      return errorResponse('VALIDATION_ERROR', `필수 컬럼이 누락되었습니다: ${missing.join(', ')}`, 400);
    }

    const course = await getOrCreateDefaultCourse();
    let processed = 0;
    let skipped = 0;

    for (const row of parsed.data) {
      const attendance_rate = Number(row.attendance_rate);
      const missed_sessions = Number(row.missed_sessions);
      const assignment_submission_rate = Number(row.assignment_submission_rate);
      const avg_quiz_score = Number(row.avg_quiz_score);
      const last_active_days_ago = Number(row.last_active_days_ago);

      // Validate ranges
      if (
        !row.student_name ||
        isNaN(attendance_rate) || attendance_rate < 0 || attendance_rate > 100 ||
        isNaN(missed_sessions) || missed_sessions < 0 ||
        isNaN(assignment_submission_rate) || assignment_submission_rate < 0 || assignment_submission_rate > 100 ||
        isNaN(avg_quiz_score) || avg_quiz_score < 0 || avg_quiz_score > 100 ||
        isNaN(last_active_days_ago) || last_active_days_ago < 0
      ) {
        skipped++;
        continue;
      }

      await upsertStudentWithProgress({
        name: row.student_name,
        email: row.email || undefined,
        cohort_name: row.cohort_name || undefined,
        attendance_rate,
        missed_sessions,
        assignment_submission_rate,
        avg_quiz_score,
        last_active_days_ago,
      }, course.id);

      processed++;
    }

    return successResponse({
      total_rows: parsed.data.length,
      processed,
      skipped,
      course_id: course.id,
    });
  } catch (error) {
    console.error('CSV upload error:', error);
    return errorResponse('INTERNAL_ERROR', '업로드 처리 중 오류가 발생했습니다', 500);
  }
}
