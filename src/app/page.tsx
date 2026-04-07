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

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <p className="text-[var(--text-muted)] text-sm">
          샘플 데이터로 3분 안에 전체 기능을 체험해보세요
        </p>
      </section>
    </main>
  );
}
