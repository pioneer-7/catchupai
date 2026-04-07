'use client';

// 네비게이션 헤더 — Notion 스타일 (흰 배경, whisper border)
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

  if (pathname === '/') return null;

  async function handleReset() {
    setResetting(true);
    await fetch('/api/upload/sample', { method: 'POST' });
    setResetting(false);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <header className="border-b border-black/10 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-black/95">
          CatchUp AI
        </Link>
        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-[15px] font-semibold transition-colors ${
                pathname.startsWith(href)
                  ? 'text-[#0075de]'
                  : 'text-black/95 hover:text-[#0075de]'
              }`}
            >
              {label}
            </Link>
          ))}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="text-xs px-3 py-1.5 rounded bg-[#f6f5f4] text-[#615d59] font-medium hover:bg-black/10 transition disabled:opacity-50"
            title="샘플 데이터로 초기화"
          >
            {resetting ? '리셋 중...' : '데모 리셋'}
          </button>
        </div>
      </nav>
    </header>
  );
}
