'use client';

// 사용량 대시보드
// SSOT: specs/004-backend/rate-limit-spec.md 섹션 5

import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function UsagePage() {
  // MVP: 정적 표시 (향후 실제 API 연동)
  const plan = 'free';
  const aiUsed = 2;
  const aiLimit = 5;
  const pct = Math.round((aiUsed / aiLimit) * 100);

  return (
    <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-2">사용량</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">현재 플랜의 사용량과 한도를 확인하세요.</p>

      {/* Current Plan */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[var(--text-muted)] uppercase tracking-wider" style={{ fontWeight: 510 }}>현재 플랜</p>
            <p className="text-2xl mt-1" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>
              {plan === 'free' ? 'Free' : plan === 'pro' ? 'Pro' : 'API'}
            </p>
          </div>
          {plan === 'free' && (
            <Link href="/pricing" className="btn-primary flex items-center gap-2 text-sm">
              <Zap size={14} /> Pro 업그레이드 <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* AI Usage */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px]" style={{ fontWeight: 510 }}>AI 생성 (오늘)</p>
          <p className="text-[13px] text-[var(--text-secondary)]">
            <span className="num-display" style={{ fontWeight: 510 }}>{aiUsed}</span> / {aiLimit}회
          </p>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--bg-warm)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: pct >= 80 ? 'var(--status-risk)' : pct >= 50 ? 'var(--status-warning)' : 'var(--accent)',
            }}
          />
        </div>
        {pct >= 80 && (
          <p className="text-xs text-[var(--status-warning)] mt-2" style={{ fontWeight: 510 }}>
            일일 한도에 거의 도달했습니다. Pro로 업그레이드하면 무제한 사용 가능합니다.
          </p>
        )}
      </div>

      {/* Limits Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--bg-warm)]">
              <th className="px-5 py-3 text-left" style={{ fontWeight: 510, fontSize: 13 }}>기능</th>
              <th className="px-5 py-3 text-center" style={{ fontWeight: 510, fontSize: 13 }}>Free</th>
              <th className="px-5 py-3 text-center" style={{ fontWeight: 510, fontSize: 13 }}>Pro</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: '과정 수', free: '1개', pro: '무제한' },
              { feature: '학생 수', free: '50명', pro: '무제한' },
              { feature: 'AI 생성', free: '5회/일', pro: '무제한' },
              { feature: '분석 대시보드', free: '—', pro: '✓' },
              { feature: 'PDF 내보내기', free: '—', pro: '✓' },
              { feature: '알림', free: '—', pro: '✓' },
            ].map(row => (
              <tr key={row.feature} className="border-t border-[var(--border)]">
                <td className="px-5 py-3">{row.feature}</td>
                <td className="px-5 py-3 text-center text-[var(--text-secondary)]">{row.free}</td>
                <td className="px-5 py-3 text-center">{row.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
