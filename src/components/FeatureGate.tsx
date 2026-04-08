'use client';

// Feature Gate UI 래퍼 — 티어 미달 시 업그레이드 CTA
// SSOT: specs/004-backend/billing-spec.md 섹션 5

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function FeatureGate({
  allowed,
  message,
  children,
}: {
  allowed: boolean;
  message?: string;
  children: ReactNode;
}) {
  if (allowed) return <>{children}</>;

  return (
    <div className="card p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--bg-warm)] flex items-center justify-center mx-auto mb-4">
        <Lock size={20} className="text-[var(--text-muted)]" strokeWidth={1.8} />
      </div>
      <h3 className="text-[15px] mb-2" style={{ fontWeight: 510 }}>
        Pro 플랜이 필요합니다
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
        {message || 'Pro 플랜으로 업그레이드하면 이 기능을 사용할 수 있습니다.'}
      </p>
      <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
        플랜 업그레이드 <ArrowRight size={14} />
      </Link>
    </div>
  );
}
