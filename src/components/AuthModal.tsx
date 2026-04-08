'use client';

// AuthModal — 한 화면 로그인+가입 탭 전환
// SSOT: specs/004-backend/auth-spec.md 섹션 2.3

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { X, Mail, AlertCircle } from 'lucide-react';

type Tab = 'login' | 'signup';

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTab = 'login',
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        onClose();
        onSuccess?.();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
        onSuccess?.();
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 card card-deep p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
              <span className="text-white text-[10px] font-bold">C</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight">CatchUp AI</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-[var(--radius-button)] hover:bg-[var(--bg-warm)] transition">
            <X size={16} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] px-6">
          {(['login', 'signup'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`px-4 py-2.5 text-[13px] border-b-2 transition-all ${
                tab === t
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              style={{ fontWeight: 510 }}
            >
              {t === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[12px] text-[var(--text-secondary)] mb-1.5 block" style={{ fontWeight: 510 }}>이메일</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full input-base"
            />
          </div>
          <div>
            <label className="text-[12px] text-[var(--text-secondary)] mb-1.5 block" style={{ fontWeight: 510 }}>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={tab === 'signup' ? '8자 이상' : '••••••••'}
              required
              minLength={tab === 'signup' ? 8 : 1}
              className="w-full input-base"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[13px] text-[var(--status-risk)] p-3 rounded-[var(--radius-button)] bg-[var(--status-risk-bg)]">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? '처리 중...' : tab === 'login' ? '로그인' : '가입하기'}
          </button>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <span className="relative bg-white px-3 text-[12px] text-[var(--text-muted)]">또는</span>
          </div>

          <button type="button" onClick={handleGoogle} disabled={loading}
            className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50">
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google로 계속하기
          </button>
        </form>

        <div className="px-6 pb-5">
          <p className="text-[11px] text-[var(--text-muted)] text-center">
            {tab === 'login' ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
            <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')} className="text-[var(--accent)] hover:underline" style={{ fontWeight: 510 }}>
              {tab === 'login' ? '회원가입' : '로그인'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
