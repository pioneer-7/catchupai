// 랜딩 페이지 — Notion Hero + 기능 소개
// SSOT: specs/002-ux/ia-and-screens.md 섹션 2.1

import Link from 'next/link';
import { SampleDataButton } from '@/components/SampleDataButton';

const FEATURES = [
  {
    title: '위험 학습자 조기 탐지',
    description: '출결, 과제, 퀴즈, 활동 데이터를 분석해 위험도를 자동 계산하고 우선 개입 대상을 식별합니다.',
    icon: '🔍',
  },
  {
    title: 'AI 맞춤 회복학습',
    description: '강의자료와 학생 상태를 기반으로 3단계 복습 플랜과 액션 플랜을 AI가 자동 생성합니다.',
    icon: '📚',
  },
  {
    title: '개입 메시지 & 미니 진단',
    description: '격려형 메시지 초안 생성, 3문항 이해도 진단, 채점 후 위험도 자동 재계산까지.',
    icon: '💬',
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 md:py-40">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-[64px] heading-xl">
            CatchUp AI
          </h1>
          <p className="mt-8 text-xl heading-sm text-[var(--text-secondary)] leading-relaxed">
            수업을 놓친 학생이 완전히 이탈하기 전에,
            교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는
            회복학습 AI 코파일럿
          </p>
          <div className="mt-12 flex gap-4 justify-center">
            <SampleDataButton />
            <Link
              href="/upload"
              className="px-6 py-3 rounded-[var(--radius-button)] font-semibold bg-[var(--bg-warm)] text-[var(--text-primary)] hover:bg-[var(--bg-warm-hover)] transition btn-press focus-ring"
            >
              파일 업로드
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--bg-warm)] px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl heading-lg text-center mb-16">
            학습 이탈, 더 빠르게 발견하고 더 정밀하게 대응
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="card card-hover p-8 cursor-default"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-lg heading-md">{f.title}</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl heading-lg text-center mb-6">
            기존 LMS에 통합되는 API 플랫폼
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-16 max-w-2xl mx-auto">
            CatchUp AI는 독립 앱이 아닙니다. REST API, Webhook, 임베더블 위젯으로
            기존 교육 시스템에 위험 탐지 기능을 바로 추가할 수 있습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'REST API + Swagger', desc: 'OpenAPI 3.0 문서화된 11개 엔드포인트. API 키 인증, 버전닝 지원.', href: '/docs', cta: 'API 문서 보기' },
              { title: '임베더블 위젯', desc: 'iframe 한 줄로 LMS에 위험 요약 카드를 삽입. 실시간 미리보기와 코드 생성.', href: '/integration', cta: '통합 가이드' },
              { title: 'Webhook 이벤트', desc: '위험도 변경, 회복학습 생성 등 이벤트를 실시간으로 외부 시스템에 전달.', href: '/docs', cta: '이벤트 목록' },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="card card-hover p-8 block"
              >
                <h3 className="text-lg heading-md">{item.title}</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--accent)]">{item.cta} →</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* LMS Demo CTA */}
      <section className="bg-[var(--bg-warm)] px-6 py-16 text-center">
        <h3 className="text-xl heading-md mb-3">LMS 통합이 어떻게 보이는지 궁금하세요?</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">가상 LMS 대시보드에서 CatchUp AI 위젯이 동작하는 모습을 확인해보세요.</p>
        <a
          href="/demo/lms"
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring"
        >
          LMS 데모 보기
        </a>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-20 text-center">
        <p className="text-[var(--text-muted)] text-sm">
          샘플 데이터로 3분 안에 전체 기능을 체험해보세요
        </p>
      </section>
    </main>
  );
}
