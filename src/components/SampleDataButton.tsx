'use client';

// 샘플 데이터 로드 버튼 — POST /api/upload/sample 후 /dashboard 이동

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SampleDataButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch('/api/upload/sample', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to load sample data');
      router.push('/dashboard');
    } catch {
      alert('샘플 데이터 로드에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-6 py-3 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring disabled:opacity-60 ${className || ''}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          데이터 로딩 중...
        </span>
      ) : (
        '샘플 데이터로 시작'
      )}
    </button>
  );
}
