// 랜딩 페이지 — Notion Hero 스타일 + 기능 소개
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
      <section className="flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center max-w-2xl">
          <h1
            className="text-5xl md:text-[64px] font-bold leading-none tracking-tight"
            style={{ letterSpacing: '-2.125px' }}
          >
            CatchUp AI
          </h1>
          <p
            className="mt-6 text-xl font-semibold leading-relaxed text-[#615d59]"
            style={{ letterSpacing: '-0.125px' }}
          >
            수업을 놓친 학생이 완전히 이탈하기 전에,
            교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는
            회복학습 AI 코파일럿
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <SampleDataButton />
            <Link
              href="/upload"
              className="px-6 py-3 rounded font-semibold bg-black/5 text-black/95 hover:bg-black/10 transition"
            >
              파일 업로드
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f6f5f4] px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl font-bold tracking-tight text-center mb-12"
            style={{ letterSpacing: '-1.5px' }}
          >
            학습 이탈, 더 빠르게 발견하고 더 정밀하게 대응
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-black/10 bg-white p-6"
                style={{
                  boxShadow:
                    'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px',
                }}
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-[#615d59] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <p className="text-[#a39e98] text-sm">
          샘플 데이터로 3분 안에 전체 기능을 체험해보세요
        </p>
      </section>
    </main>
  );
}
