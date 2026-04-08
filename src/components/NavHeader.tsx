'use client';

// 네비게이션 헤더 — 메인 메뉴 + 개발자 서브메뉴 + 모바일 햄버거
// 랜딩 페이지(/)에서는 숨김

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const MAIN_LINKS = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/students', label: '학생 목록' },
  { href: '/analytics', label: '분석' },
  { href: '/upload', label: '업로드' },
];

const DEV_LINKS = [
  { href: '/docs', label: 'API 문서', desc: 'REST API v1 Swagger' },
  { href: '/integration', label: '통합 가이드', desc: '위젯 embed 코드 생성' },
  { href: '/demo/lms', label: 'LMS 데모', desc: '가상 LMS 통합 시연' },
];

export function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const devRef = useRef<HTMLDivElement>(null);

  // 서브메뉴 외부 클릭 닫기 — Hooks는 반드시 조건문 전에 호출
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (devRef.current && !devRef.current.contains(e.target as Node)) setDevOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (pathname === '/') return null;

  async function handleReset() {
    setResetting(true);
    await fetch('/api/upload/sample', { method: 'POST' });
    setResetting(false);
    setMobileOpen(false);
    router.push('/dashboard');
    router.refresh();
  }

  const isDevPage = ['/docs', '/integration', '/demo'].some(p => pathname.startsWith(p));

  return (
    <header className="border-b border-[var(--border)] bg-white sticky top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          CatchUp AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[15px] font-semibold transition-colors focus-ring rounded ${
                pathname.startsWith(href) ? 'text-[var(--accent)]' : 'hover:text-[var(--accent)]'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* 개발자 서브메뉴 드롭다운 */}
          <div ref={devRef} className="relative">
            <button
              onClick={() => setDevOpen(!devOpen)}
              className={`text-[15px] font-semibold transition-colors focus-ring rounded flex items-center gap-1 ${
                isDevPage ? 'text-[var(--accent)]' : 'hover:text-[var(--accent)]'
              }`}
            >
              개발자
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className={`transition-transform ${devOpen ? 'rotate-180' : ''}`}>
                <polyline points="3 5 6 8 9 5" />
              </svg>
            </button>

            {devOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 card card-deep p-2 bg-white">
                {DEV_LINKS.map(({ href, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDevOpen(false)}
                    className={`block px-3 py-2.5 rounded-[var(--radius-button)] transition-colors ${
                      pathname.startsWith(href)
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'hover:bg-[var(--bg-warm)]'
                    }`}
                  >
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="text-xs px-3 py-1.5 rounded-[var(--radius-button)] bg-[var(--bg-warm)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-warm-hover)] transition btn-press focus-ring disabled:opacity-50"
          >
            {resetting ? '리셋 중...' : '데모 리셋'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-[var(--radius-button)] hover:bg-[var(--bg-warm)] transition focus-ring"
          aria-label="메뉴 열기"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {mobileOpen ? (
              <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></>
            ) : (
              <><line x1="3" y1="5" x2="17" y2="5" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="15" x2="17" y2="15" /></>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-6 py-4 space-y-1">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`block text-[15px] font-semibold py-2.5 transition-colors ${pathname.startsWith(href) ? 'text-[var(--accent)]' : 'hover:text-[var(--accent)]'}`}>
              {label}
            </Link>
          ))}

          <div className="border-t border-[var(--border)] pt-2 mt-2">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">개발자</p>
            {DEV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium py-2 pl-2 transition-colors ${pathname.startsWith(href) ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'}`}>
                {label}
              </Link>
            ))}
          </div>

          <button onClick={handleReset} disabled={resetting}
            className="w-full text-sm py-2.5 mt-2 rounded-[var(--radius-button)] bg-[var(--bg-warm)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-warm-hover)] transition btn-press disabled:opacity-50">
            {resetting ? '리셋 중...' : '데모 리셋'}
          </button>
        </div>
      )}
    </header>
  );
}
