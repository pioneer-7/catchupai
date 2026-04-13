'use client';

// 샘플 데이터 로드 버튼 — POST /api/upload/sample → /dashboard 이동
// 데모용: 인증 없이 동작 (심사위원 접근성)

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
      router.refresh();
    } catch {
      alert('샘플 데이터 로드에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`btn-primary disabled:opacity-60 ${className || ''}`}
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
