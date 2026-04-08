// 라우트 보호 미들웨어
// SSOT: specs/004-backend/auth-spec.md 섹션 3

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/students', '/analytics', '/upload', '/onboarding', '/settings'];
const PUBLIC_ROUTES = ['/', '/pricing', '/docs', '/integration', '/demo', '/widget', '/api', '/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 라우트 체크
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return updateSession(request);
  }

  // 보호 라우트 체크
  const isProtected = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  if (!isProtected) {
    return updateSession(request);
  }

  // 세션 확인
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // 미인증 → 랜딩으로 리다이렉트 (returnTo 파라미터 포함)
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

// 세션 갱신 (모든 요청에서)
async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
