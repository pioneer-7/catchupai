// Supabase 브라우저 클라이언트 (Auth 포함)
// SSOT: specs/004-backend/auth-spec.md 섹션 5

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
