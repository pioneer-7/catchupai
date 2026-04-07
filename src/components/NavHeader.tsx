'use client';

// 네비게이션 헤더 — Notion 스타일 + 모바일 햄버거
// 랜딩 페이지(/)에서는 숨김

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/students', label: '학생 목록' },
  { href: '/upload', label: '업로드' },
];

export function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [resetting, setResetting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/') return null;

  async function handleReset() {
    setResetting(true);
    await fetch('/api/upload/sample', { method: 'POST' });
    setResetting(false);
    setMobileOpen(false);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--border)] bg-white sticky top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          CatchUp AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[15px] font-semibold transition-colors focus-ring rounded ${
                pathname.startsWith(href)
                  ? 'text-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
            >
              {label}
            </Link>
          ))}
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
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="17" y2="5" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="15" x2="17" y2="15" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-6 py-4 space-y-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block text-[15px] font-semibold py-2 transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="w-full text-sm py-2.5 rounded-[var(--radius-button)] bg-[var(--bg-warm)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-warm-hover)] transition btn-press disabled:opacity-50"
          >
            {resetting ? '리셋 중...' : '데모 리셋'}
          </button>
        </div>
      )}
    </header>
  );
}
