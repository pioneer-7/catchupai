'use client';

// 네비게이션 — Notion+Linear 하이브리드
// SSOT: specs/003-frontend/student-detail-spec.md

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { GraduationCap, LayoutDashboard, Users, BarChart3, Upload, Code2, ChevronDown, Menu, X, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { NotificationBell } from '@/components/NotificationBell';

const MAIN_LINKS = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/students', label: '학생 목록', icon: Users },
  { href: '/analytics', label: '분석', icon: BarChart3 },
  { href: '/upload', label: '업로드', icon: Upload },
];

const DEV_LINKS = [
  { href: '/docs', label: 'API 문서', desc: 'REST API v1 Swagger' },
  { href: '/integration', label: '통합 가이드', desc: '위젯 embed 코드 생성' },
  { href: '/demo/lms', label: 'LMS 데모', desc: '가상 LMS 통합 시연' },
];

export function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, requireAuth, signOut } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const devRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (devRef.current && !devRef.current.contains(e.target as Node)) setDevOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (pathname === '/') return null;

  function handleReset() {
    requireAuth(async () => {
      setResetting(true);
      await fetch('/api/upload/sample', { method: 'POST' });
      setResetting(false);
      setMobileOpen(false);
      router.push('/dashboard');
      router.refresh();
    });
  }

  const isDevPage = ['/docs', '/integration', '/demo'].some(p => pathname.startsWith(p));

  return (
    <header className="border-b border-[var(--border)] bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[var(--gradient-accent)] flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight group-hover:text-[var(--accent)] transition" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>
            CatchUp AI
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {MAIN_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-[var(--radius-button)] transition-all ${
                  active
                    ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-warm)]'
                }`}
                style={{ fontWeight: 510 }}
              >
                <Icon size={14} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}

          {/* 개발자 드롭다운 */}
          <div ref={devRef} className="relative">
            <button
              onClick={() => setDevOpen(!devOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-[var(--radius-button)] transition-all ${
                isDevPage
                  ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-warm)]'
              }`}
              style={{ fontWeight: 510 }}
            >
              <Code2 size={14} strokeWidth={1.8} />
              개발자
              <ChevronDown size={12} className={`transition-transform ${devOpen ? 'rotate-180' : ''}`} />
            </button>

            {devOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 card card-deep p-1.5 bg-white border border-[var(--border)]">
                {DEV_LINKS.map(({ href, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDevOpen(false)}
                    className={`block px-3 py-2.5 rounded-[var(--radius-button)] transition-all ${
                      pathname.startsWith(href)
                        ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'hover:bg-[var(--bg-warm)]'
                    }`}
                  >
                    <p className="text-[13px]" style={{ fontWeight: 510 }}>{label}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{desc}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-[var(--border)] mx-1.5" />

          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-[var(--radius-button)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-warm)] transition-all disabled:opacity-50"
            style={{ fontWeight: 510 }}
          >
            <RefreshCw size={12} className={resetting ? 'animate-spin' : ''} />
            {resetting ? '리셋 중' : '데모 리셋'}
          </button>

          <div className="w-px h-5 bg-[var(--border)] mx-1.5" />

          {/* Notifications + Auth */}
          <NotificationBell />
          {user ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white transition-transform hover:scale-105"
                style={{ background: 'var(--gradient-accent)' }}
              >
                {user.email?.[0]?.toUpperCase() || 'U'}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 card card-deep p-1.5 bg-white border border-[var(--border)]">
                  <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                    <p className="text-[12px] text-[var(--text-muted)]" style={{ fontWeight: 510 }}>로그인됨</p>
                    <p className="text-[13px] truncate">{user.email}</p>
                  </div>
                  <button onClick={() => { setUserMenuOpen(false); signOut(); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-[13px] rounded-[var(--radius-button)] text-[var(--status-risk)] hover:bg-[var(--status-risk-bg)] transition-all text-left"
                    style={{ fontWeight: 510 }}>
                    <LogOut size={14} /> 로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => requireAuth()} className="btn-ghost text-[13px] py-1.5 px-3">Login</button>
              <button onClick={() => requireAuth()} className="btn-primary text-[13px] py-1.5 px-3">Sign Up</button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-[var(--radius-button)] hover:bg-[var(--bg-warm)] transition focus-ring"
          aria-label="메뉴 열기"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-6 py-3 space-y-0.5" style={{ animation: 'slideDown 200ms ease-out' }}>
          {MAIN_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-[14px] rounded-[var(--radius-button)] transition-all ${
                pathname.startsWith(href) ? 'text-[var(--accent)] bg-[var(--accent-light)]' : 'hover:bg-[var(--bg-warm)]'
              }`} style={{ fontWeight: 510 }}>
              <Icon size={16} strokeWidth={1.8} />{label}
            </Link>
          ))}
          <div className="border-t border-[var(--border)] pt-2 mt-2">
            <p className="px-3 py-1 text-[11px] text-[var(--text-muted)] uppercase tracking-wider" style={{ fontWeight: 510 }}>개발자</p>
            {DEV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-[13px] rounded-[var(--radius-button)] ${
                  pathname.startsWith(href) ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)]'
                }`} style={{ fontWeight: 510 }}>{label}</Link>
            ))}
          </div>
          <button onClick={handleReset} disabled={resetting}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-2 text-[13px] rounded-[var(--radius-button)] bg-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm-hover)] transition disabled:opacity-50"
            style={{ fontWeight: 510 }}>
            <RefreshCw size={13} className={resetting ? 'animate-spin' : ''} />
            {resetting ? '리셋 중...' : '데모 리셋'}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
