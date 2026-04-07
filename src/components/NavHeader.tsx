'use client';

// 네비게이션 헤더 — Notion 스타일 (흰 배경, whisper border)
// 랜딩 페이지(/)에서는 숨김

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/students', label: '학생 목록' },
  { href: '/upload', label: '업로드' },
];

export function NavHeader() {
  const pathname = usePathname();

  // 랜딩 페이지에서는 숨김
  if (pathname === '/') return null;

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
        </div>
      </nav>
    </header>
  );
}
