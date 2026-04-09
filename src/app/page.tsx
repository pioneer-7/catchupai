// 랜딩 페이지 — Notion+Linear 하이브리드 디자인
// SSOT: specs/002-ux/ia-and-screens.md

import Link from 'next/link';
import { SampleDataButton } from '@/components/SampleDataButton';
import { Sparkles, TrendingDown, MessageSquare, BarChart3, FileCode, Puzzle, Bell, ArrowRight } from 'lucide-react';

const FEATURES = [
  {
    title: 'AI 이탈 예측',
    description: 'Claude AI가 학생 데이터를 종합 분석해 이탈 확률과 위험 궤적을 예측합니다.',
    icon: TrendingDown,
    tint: 'var(--tint-red)',
    tintText: 'var(--tint-red-text)',
  },
  {
    title: 'AI 교육 어시스턴트',
    description: '교강사를 위한 실시간 AI 상담. 개입 전략과 교수법 조언을 제공합니다.',
    icon: Sparkles,
    tint: 'var(--tint-purple)',
    tintText: 'var(--tint-purple-text)',
  },
  {
    title: '교육 분석 대시보드',
    description: '이탈 퍼널, 코호트 분포, 개입 효과를 시각화하여 데이터 기반 의사결정.',
    icon: BarChart3,
    tint: 'var(--tint-blue)',
    tintText: 'var(--tint-blue-text)',
  },
  {
    title: '맞춤 회복학습 & 진단',
    description: '3단계 복습 플랜, 격려 메시지, 미니 진단까지 AI가 자동 생성합니다.',
    icon: MessageSquare,
    tint: 'var(--tint-teal)',
    tintText: 'var(--tint-teal-text)',
  },
];

const PLATFORM = [
  { title: 'REST API + Swagger', desc: 'OpenAPI 3.0 문서화된 11개 엔드포인트', href: '/docs', icon: FileCode },
  { title: '임베더블 위젯', desc: 'iframe으로 기존 LMS에 즉시 삽입', href: '/integration', icon: Puzzle },
  { title: 'Webhook 이벤트', desc: '위험도 변경을 실시간으로 외부 시스템에 전달', href: '/docs', icon: Bell },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center px-6 py-32 md:py-44"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-xs mb-8" style={{ fontWeight: 510 }}>
            <Sparkles size={12} />
            AI 기반 학습 이탈 방지 플랫폼
          </div>
          <h1 className="text-5xl md:text-[64px] heading-xl">
            CatchUp AI
          </h1>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-[var(--text-secondary)] max-w-lg mx-auto">
            학생이 이탈하기 전에, 교육 현장이 먼저 개입할 수 있도록.
          </p>
          <div className="mt-10 flex gap-3 justify-center flex-wrap">
            <SampleDataButton />
            <Link href="/upload" className="btn-secondary flex items-center gap-2">
              파일 업로드
            </Link>
            <Link href="/pricing" className="btn-ghost flex items-center gap-1 text-[var(--accent)]">
              가격 보기 →
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex justify-center gap-8 md:gap-14">
            {[
              { num: '6', label: 'AI 기능' },
              { num: '14', label: '페이지' },
              { num: '36', label: '테스트' },
              { num: '11', label: 'API' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl heading-lg text-[var(--accent)]">{num}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1" style={{ fontWeight: 510 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--bg-warm)] px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl heading-lg text-center mb-4">
            AI로 학습 이탈을 선제적으로 방지
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-16 max-w-xl mx-auto">
            위험 탐지부터 회복까지, 교강사의 모든 개입을 AI가 지원합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card card-hover p-7 cursor-default group">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: f.tint }}
                >
                  <f.icon size={20} style={{ color: f.tintText }} strokeWidth={1.8} />
                </div>
                <h3 className="text-[15px] mb-2" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl heading-lg text-center mb-4">
            기존 LMS에 통합되는 API 플랫폼
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-16 max-w-xl mx-auto">
            독립 앱이 아닌, 기존 시스템에 위험 탐지를 추가하는 플랫폼.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLATFORM.map((item) => (
              <Link key={item.title} href={item.href} className="card card-hover p-7 block group">
                <item.icon size={20} className="text-[var(--accent)] mb-3" strokeWidth={1.8} />
                <h3 className="text-[15px] mb-2" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{item.desc}</p>
                <span className="text-[13px] text-[var(--accent)] flex items-center gap-1 group-hover:gap-2 transition-all" style={{ fontWeight: 510 }}>
                  자세히 보기 <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LMS CTA */}
      <section className="bg-[var(--bg-warm)] px-6 py-16 text-center">
        <h3 className="text-xl heading-md mb-3">LMS 통합 데모를 확인하세요</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">가상 LMS에 CatchUp AI 위젯이 삽입된 모습을 시연합니다.</p>
        <Link href="/demo/lms" className="btn-primary inline-flex items-center gap-2">
          LMS 데모 보기 <ArrowRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <section className="px-6 py-16 text-center">
        <p className="text-[var(--text-muted)] text-sm">
          샘플 데이터로 3분 안에 전체 기능을 체험해보세요
        </p>
      </section>
    </main>
  );
}
