// 가격 페이지
// SSOT: specs/004-backend/billing-spec.md 섹션 2

import Link from 'next/link';
import { PLANS } from '@/lib/feature-gate';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const plans = Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][];

  return (
    <main className="flex-1 px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl heading-lg mb-4">
            단순하고 투명한 가격
          </h1>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
            무료로 시작하고, 팀이 성장하면 Pro로 업그레이드하세요.
            API가 필요하면 종량제로 사용하세요.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(([key, plan]) => (
            <div
              key={key}
              className={`card p-8 relative ${
                plan.popular ? 'border-[var(--accent)] border-2 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] text-white" style={{ background: 'var(--gradient-accent)', fontWeight: 600 }}>
                    <Sparkles size={11} /> 추천
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg mb-2" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">{plan.priceLabel}</span>
                  {plan.period && <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={15} className="text-[var(--status-stable)] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {key === 'api' ? (
                <Link href="/docs" className="btn-secondary w-full flex items-center justify-center gap-2">
                  {plan.cta} <ArrowRight size={14} />
                </Link>
              ) : key === 'pro' ? (
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  {plan.cta} <ArrowRight size={14} />
                </button>
              ) : (
                <Link href="/" className="btn-secondary w-full flex items-center justify-center gap-2">
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ or note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            모든 플랜은 14일 무료 체험을 포함합니다. 언제든 취소 가능합니다.
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-2">
            결제는 포트원을 통해 안전하게 처리됩니다. (카드/계좌이체/간편결제)
          </p>
        </div>
      </div>
    </main>
  );
}
