// Supabase 클라이언트 설정
// SSOT: specs/004-backend/persistence-spec.md 섹션 5

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 (브라우저 + 서버 컴포넌트)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 전용 클라이언트 (API routes, Server Actions)
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    // MVP: service role key 없으면 anon key 사용
    return supabase;
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
