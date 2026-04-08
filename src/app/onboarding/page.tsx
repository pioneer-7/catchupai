'use client';

// 온보딩 3단계 위자드
// SSOT: specs/003-frontend/onboarding-spec.md

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, BarChart3, Sparkles, Check, ArrowRight, SkipForward } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: '데이터 업로드',
    description: '학생 데이터를 업로드하거나 샘플 데이터로 시작하세요.',
    icon: Upload,
    tint: 'var(--tint-blue)',
    tintText: 'var(--tint-blue-text)',
  },
  {
    id: 2,
    title: '대시보드 확인',
    description: '학생 위험도 현황과 분석 결과를 확인하세요.',
    icon: BarChart3,
    tint: 'var(--tint-purple)',
    tintText: 'var(--tint-purple-text)',
  },
  {
    id: 3,
    title: 'AI 기능 체험',
    description: '회복학습 플랜을 AI로 자동 생성해보세요.',
    icon: Sparkles,
    tint: 'var(--tint-teal)',
    tintText: 'var(--tint-teal-text)',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const router = useRouter();

  async function handleStep1() {
    setLoading(true);
    try {
      await fetch('/api/upload/sample', { method: 'POST' });
      setCompleted(prev => new Set(prev).add(1));
      setCurrentStep(2);
    } catch {
      alert('데이터 로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  function handleStep2() {
    setCompleted(prev => new Set(prev).add(2));
    setCurrentStep(3);
  }

  async function handleStep3() {
    setLoading(true);
    try {
      // 가장 위험한 학생 찾기
      const res = await fetch('/api/students?sort=risk_score&order=desc');
      const json = await res.json();
      if (json.success && json.data.students.length > 0) {
        const studentId = json.data.students[0].id;
        await fetch(`/api/students/${studentId}/recovery-plan`, { method: 'POST' });
      }
      setCompleted(prev => new Set(prev).add(3));
    } catch {
      // 실패해도 완료 처리
      setCompleted(prev => new Set(prev).add(3));
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    // onboarding_completed 업데이트 (향후 user_profiles 연동)
    router.push('/dashboard');
  }

  function handleSkip() {
    router.push('/dashboard');
  }

  const allDone = completed.size === 3;

  return (
    <main className="flex-1 px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <h1 className="text-2xl heading-lg mb-2">CatchUp AI에 오신 것을 환영합니다</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            3단계만 따라하면 바로 시작할 수 있습니다.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--bg-warm)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: completed.has(step.id) ? '100%' : currentStep === step.id ? '50%' : '0%',
                    background: completed.has(step.id) ? 'var(--status-stable)' : 'var(--accent)',
                  }}
                />
              </div>
              {i < STEPS.length - 1 && <div className="w-1" />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map(step => {
            const isDone = completed.has(step.id);
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`card p-6 transition-all ${
                  isCurrent ? 'border-[var(--accent)] border-2 shadow-lg' : isDone ? 'opacity-70' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isDone ? 'var(--status-stable-bg)' : step.tint }}
                  >
                    {isDone ? (
                      <Check size={20} style={{ color: 'var(--status-stable)' }} strokeWidth={2.5} />
                    ) : (
                      <Icon size={20} style={{ color: step.tintText }} strokeWidth={1.8} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--text-muted)]" style={{ fontWeight: 510 }}>STEP {step.id}</span>
                      {isDone && <span className="text-[11px] text-[var(--status-stable)]" style={{ fontWeight: 510 }}>완료</span>}
                    </div>
                    <h3 className="text-[15px] mt-0.5" style={{ fontWeight: 510 }}>{step.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">{step.description}</p>
                  </div>

                  {isCurrent && !isDone && (
                    <button
                      onClick={step.id === 1 ? handleStep1 : step.id === 2 ? handleStep2 : handleStep3}
                      disabled={loading}
                      className="btn-primary flex items-center gap-2 flex-shrink-0 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {step.id === 1 ? '샘플 로드' : step.id === 2 ? '확인' : 'AI 생성'}
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-10">
          <button onClick={handleSkip} className="btn-ghost flex items-center gap-1 text-[var(--text-muted)]">
            <SkipForward size={14} /> 건너뛰기
          </button>

          {allDone && (
            <button onClick={handleComplete} className="btn-primary flex items-center gap-2">
              대시보드로 이동 <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
