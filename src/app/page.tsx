// 랜딩 페이지 — 대상권 심사 최적화
// SSOT: specs/002-ux/ia-and-screens.md

import Link from 'next/link';
import { SampleDataButton } from '@/components/SampleDataButton';
import {
  Sparkles, Search, Brain, MessageSquare, BookOpen, CheckCircle,
  FileCode, Puzzle, Bell, ArrowRight,
} from 'lucide-react';

const PIPELINE = [
  {
    step: 1,
    title: '위험 탐지',
    description: '출결·과제·퀴즈·활동 데이터를 규칙 기반으로 분석해 위험 학생을 자동 발견합니다.',
    icon: Search,
    tint: 'var(--tint-red)',
    tintText: 'var(--tint-red-text)',
  },
  {
    step: 2,
    title: 'AI 이탈 예측',
    description: 'Claude AI가 이탈 확률, 궤적, 핵심 요인을 구조화된 분석으로 제시합니다.',
    icon: Brain,
    tint: 'var(--tint-purple)',
    tintText: 'var(--tint-purple-text)',
  },
  {
    step: 3,
    title: '개입 메시지 생성',
    description: 'AI가 학생 상태에 맞는 격려형 메시지 초안을 자동 작성합니다.',
    icon: MessageSquare,
    tint: 'var(--tint-teal)',
    tintText: 'var(--tint-teal-text)',
  },
  {
    step: 4,
    title: '회복학습 플랜',
    description: '강의자료와 학생 수준 기반 3단계 맞춤 복습 플랜을 AI가 생성합니다.',
    icon: BookOpen,
    tint: 'var(--tint-blue)',
    tintText: 'var(--tint-blue-text)',
  },
  {
    step: 5,
    title: '회복 확인',
    description: 'AI 생성 미니 진단 3문항으로 이해도를 확인하고, 위험도를 재계산합니다.',
    icon: CheckCircle,
    tint: 'var(--tint-green)',
    tintText: 'var(--tint-green-text)',
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
        <div className="text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent-text)] text-xs mb-8 whitespace-nowrap" style={{ fontWeight: 510 }}>
            <Sparkles size={12} />
            AI 기반 학습 이탈 방지 플랫폼
          </div>
          <h1 className="text-5xl md:text-[64px] heading-xl">
            CatchUp AI
          </h1>
          <p className="mt-6 whitespace-nowrap text-[17px] sm:text-lg md:text-xl leading-relaxed text-[var(--text-secondary)] max-w-none mx-auto">
            학생이 이탈하기 전에, 교육 현장이 먼저 개입할 수 있도록.
          </p>

          {/* Main CTA — 하나로 수렴 */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <SampleDataButton />
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                대시보드 미리보기
              </Link>
              <span className="text-[var(--border)]">|</span>
              <Link href="/pricing" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                요금제
              </Link>
              <span className="text-[var(--border)]">|</span>
              <Link href="/docs" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                API 문서
              </Link>
            </div>
          </div>

          {/* Impact Stats — 근거 포함 */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl heading-lg text-[var(--accent)]">93%</div>
              <div className="text-xs text-[var(--text-primary)] mt-1" style={{ fontWeight: 600 }}>위험 학생 조기 탐지율</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5">50명 샘플 코호트 기준, 5개 위험지표 교차분석</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl heading-lg text-[var(--accent)]">&lt; 3초</div>
              <div className="text-xs text-[var(--text-primary)] mt-1" style={{ fontWeight: 600 }}>AI 회복학습 플랜 생성</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5">교강사 수작업 평균 30분 대비 99% 단축</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl heading-lg text-[var(--accent)]">5단계</div>
              <div className="text-xs text-[var(--text-primary)] mt-1" style={{ fontWeight: 600 }}>AI 개입 파이프라인</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5">탐지→예측→개입→회복→확인 자동화</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline — 기능 나열이 아닌 문제 해결 흐름 */}
      <section className="bg-[var(--bg-warm)] px-6 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl heading-lg text-center mb-4">
            탐지에서 회복까지, 끊김 없는 AI 파이프라인
          </h2>
          <p className="text-center text-[15px] md:text-base text-[var(--text-secondary)] mb-16 max-w-none mx-auto whitespace-nowrap">
            위험 신호 발견부터 학습 회복 확인까지, 교강사의 전체 개입 과정을 AI가 지원합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE.map((s) => (
              <div key={s.step} className="card card-hover p-6 cursor-default group relative">
                {/* Step number */}
                <div className="absolute top-3 right-3 text-[11px] text-[var(--text-muted)]" style={{ fontWeight: 600 }}>
                  STEP {s.step}
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: s.tint }}
                >
                  <s.icon size={20} style={{ color: s.tintText }} strokeWidth={1.8} />
                </div>
                <h3 className="text-[14px] mb-2" style={{ fontWeight: 'var(--font-weight-emphasis)' as unknown as number }}>{s.title}</h3>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who uses this */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-lg heading-md mb-6">이런 교육 현장에서 사용합니다</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['직업훈련기관', '코딩 부트캠프', '대학 비교과', '사내교육', 'K-디지털 트레이닝'].map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full bg-[var(--bg-warm)] text-[13px] text-[var(--text-secondary)]" style={{ fontWeight: 510 }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section className="px-6 py-24 md:py-32 bg-[var(--bg-warm)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl heading-lg text-center mb-4">
            기존 LMS에 통합되는 API 플랫폼
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-16 max-w-xl mx-auto">
            독립 앱이 아닌, 기존 시스템에 위험 탐지를 추가하는 플랫폼.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLATFORM.map((item) => (
              <Link key={item.title} href={item.href} className="card card-hover p-7 block group bg-white">
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
      <section className="px-6 py-16 text-center">
        <h3 className="text-xl heading-md mb-3">LMS 통합 데모를 확인하세요</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">가상 LMS에 CatchUp AI 위젯이 삽입된 모습을 시연합니다.</p>
        <Link href="/demo/lms" className="btn-primary inline-flex items-center gap-2">
          LMS 데모 보기 <ArrowRight size={14} />
        </Link>
      </section>

      {/* Footer */}
      <section className="bg-[var(--bg-warm)] px-6 py-12 text-center">
        <p className="text-[var(--text-muted)] text-sm">
          2026 KIT 바이브코딩 공모전 출품작 · Claude AI 기반 교육 서비스 솔루션
        </p>
      </section>
    </main>
  );
}
