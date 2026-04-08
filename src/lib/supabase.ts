// Supabase 클라이언트 설정
// SSOT: specs/004-backend/persistence-spec.md

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 (브라우저 + 서버 컴포넌트)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버 전용 DB 인스턴스 (API routes, repositories)
// service_role_key 우선, 없으면 anon key fallback
const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
export const db = createClient(supabaseUrl, serverKey);
