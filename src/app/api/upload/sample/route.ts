// POST /api/upload/sample — 샘플 데이터 로드
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { uploadService } from '@/services/upload.service';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST() {
  try {
    // 인증 확인 — 미인증 시 데이터 삭제 방지
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return errorResponse('UNAUTHORIZED' as 'VALIDATION_ERROR', '로그인이 필요합니다', 401);

    const result = await uploadService.loadSampleData();
    return successResponse({ ...result, processed: result.total_rows, skipped: 0 });
  } catch (error) {
    console.error('Sample data load error:', error);
    return errorResponse('INTERNAL_ERROR', '샘플 데이터 로드 중 오류가 발생했습니다', 500);
  }
}
