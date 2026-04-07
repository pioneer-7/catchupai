'use client';

// 학생 상세 페이지 — AI 액션 + 결과 표시 + UX 폴리싱
// SSOT: specs/003-frontend/student-detail-spec.md

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RiskBadge } from '@/components/RiskBadge';
import { MetricCard } from '@/components/MetricCard';
import { RiskFactorTag } from '@/components/RiskFactorTag';
import { Toast, useToast } from '@/components/Toast';
import type {
  StudentDetailData, RecoveryPlan, InterventionMessage,
  MiniAssessment, AssessmentSubmitData,
} from '@/types';

type GenState = 'idle' | 'loading' | 'done' | 'error';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { message: toastMsg, toast } = useToast();

  // AI generation states + timing
  const [recoveryState, setRecoveryState] = useState<GenState>('idle');
  const [messageState, setMessageState] = useState<GenState>('idle');
  const [assessmentState, setAssessmentState] = useState<GenState>('idle');
  const [submitState, setSubmitState] = useState<GenState>('idle');
  const [recoveryTime, setRecoveryTime] = useState<number | null>(null);
  const [messageTime, setMessageTime] = useState<number | null>(null);
  const [assessmentTime, setAssessmentTime] = useState<number | null>(null);

  // AI results
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [interventionMsg, setInterventionMsg] = useState<InterventionMessage | null>(null);
  const [assessment, setAssessment] = useState<MiniAssessment | null>(null);
  const [submitResult, setSubmitResult] = useState<AssessmentSubmitData | null>(null);

  // Assessment answers
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          if (json.data.recovery_plans[0]) {
            setRecoveryPlan(json.data.recovery_plans[0]);
            setRecoveryState('done');
          }
          if (json.data.intervention_messages[0]) {
            setInterventionMsg(json.data.intervention_messages[0]);
            setMessageState('done');
          }
          if (json.data.mini_assessments[0]) {
            const a = json.data.mini_assessments[0];
            setAssessment(a);
            setAssessmentState('done');
            if (a.score !== null) setSubmitState('done');
          }
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Handlers ───

  async function handleGenerateRecovery() {
    setRecoveryState('loading');
    const start = Date.now();
    try {
      const res = await fetch(`/api/students/${id}/recovery-plan`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setRecoveryPlan(json.data);
        setRecoveryState('done');
        setRecoveryTime((Date.now() - start) / 1000);
        toast('회복학습 플랜이 생성되었습니다');
      } else setRecoveryState('error');
    } catch { setRecoveryState('error'); }
  }

  async function handleGenerateMessage() {
    setMessageState('loading');
    const start = Date.now();
    try {
      const res = await fetch(`/api/students/${id}/intervention-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_type: 'teacher' }),
      });
      const json = await res.json();
      if (json.success) {
        setInterventionMsg(json.data);
        setMessageState('done');
        setMessageTime((Date.now() - start) / 1000);
        toast('개입 메시지가 생성되었습니다');
      } else setMessageState('error');
    } catch { setMessageState('error'); }
  }

  async function handleGenerateAssessment() {
    setAssessmentState('loading');
    setSubmitState('idle');
    setSubmitResult(null);
    setAnswers({});
    const start = Date.now();
    try {
      const res = await fetch(`/api/students/${id}/mini-assessment`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setAssessment(json.data);
        setAssessmentState('done');
        setAssessmentTime((Date.now() - start) / 1000);
        toast('미니 진단이 생성되었습니다');
      } else setAssessmentState('error');
    } catch { setAssessmentState('error'); }
  }

  async function handleGenerateAll() {
    await handleGenerateRecovery();
    await handleGenerateMessage();
    await handleGenerateAssessment();
  }

  async function handleSubmitAssessment() {
    if (!assessment) return;
    setSubmitState('loading');
    try {
      const res = await fetch(`/api/students/${id}/mini-assessment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_id: assessment.id,
          answers: Object.entries(answers).map(([qId, answer]) => ({ id: Number(qId), answer })),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitResult(json.data);
        setSubmitState('done');
        if (data) {
          setData({
            ...data,
            progress: {
              ...data.progress,
              risk_score: json.data.risk_score_after,
              risk_level: json.data.risk_level_after,
            },
          });
        }
        toast(`채점 완료 — ${json.data.score}/${json.data.total} 정답`);
      } else setSubmitState('error');
    } catch { setSubmitState('error'); }
  }

  async function handleCopy() {
    if (!interventionMsg) return;
    await navigator.clipboard.writeText(interventionMsg.content);
    toast('메시지가 클립보드에 복사되었습니다');
  }

  // ─── Loading / Not Found ───

  if (loading) {
    return (
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-[var(--bg-warm)] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-[var(--bg-warm)] animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !data) {
    return (
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="rounded-xl border border-black/10 bg-[var(--bg-warm)] p-12 text-center">
          <p className="text-[var(--text-secondary)] text-lg">학생을 찾을 수 없습니다</p>
          <Link href="/students" className="mt-4 inline-block text-[var(--accent)] font-semibold hover:underline">
            학생 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const { student, progress: p } = data;
  const allAnswered = assessment?.questions_json.every(q => answers[q.id]?.trim());
  const anyLoading = recoveryState === 'loading' || messageState === 'loading' || assessmentState === 'loading';

  return (
    <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full space-y-8">
      <Toast message={toastMsg} />

      <Link href="/students" className="text-sm text-[var(--accent)] font-semibold hover:underline">
        &larr; 학생 목록
      </Link>

      {/* ─── Header Card ─── */}
      <section className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            {student.cohort_name && <p className="mt-1 text-sm text-[var(--text-secondary)]">{student.cohort_name}</p>}
          </div>
          <div className="text-right">
            <RiskBadge level={p.risk_level} />
            <p className="mt-2 text-3xl font-bold tracking-tight">{p.risk_score}</p>
            <p className="text-xs text-[var(--text-muted)]">위험 점수</p>
          </div>
        </div>
      </section>

      {/* ─── Metric Cards ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard title="출석률" value={p.attendance_rate} unit={`% (${p.missed_sessions}회 결석)`} alert={p.attendance_rate < 70} />
        <MetricCard title="과제 제출률" value={p.assignment_submission_rate} unit="%" alert={p.assignment_submission_rate < 60} />
        <MetricCard title="퀴즈 평균" value={p.avg_quiz_score} unit="점" alert={p.avg_quiz_score < 60} />
        <MetricCard title="최근 활동" value={p.last_active_days_ago} unit="일 전" alert={p.last_active_days_ago > 7} />
      </div>

      {/* ─── Risk Factors ─── */}
      {p.risk_factors_json.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">위험 요인</h2>
          <div className="flex flex-wrap gap-2">
            {p.risk_factors_json.map((f, i) => <RiskFactorTag key={i} factor={f} />)}
          </div>
        </section>
      )}

      {/* ─── Action Buttons ─── */}
      <section className="border-t border-black/10 pt-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">AI 지원 액션</h2>
        <p className="text-xs text-[var(--text-muted)] mb-4">AI 생성에는 약 5~10초가 소요됩니다</p>
        <div className="flex flex-wrap gap-3">
          <ActionButton label="회복학습 생성" state={recoveryState} onClick={handleGenerateRecovery} primary loadingText="플랜 생성 중..." />
          <ActionButton label="개입 메시지 생성" state={messageState} onClick={handleGenerateMessage} loadingText="메시지 작성 중..." />
          <ActionButton label="미니 진단 생성" state={assessmentState} onClick={handleGenerateAssessment} loadingText="진단 생성 중..." />
          <button
            onClick={handleGenerateAll}
            disabled={anyLoading}
            className="px-5 py-2.5 rounded font-semibold transition border border-[#0075de] text-[var(--accent)] hover:bg-[#0075de]/5 disabled:opacity-60"
          >
            {anyLoading ? '생성 중...' : '전체 생성'}
          </button>
        </div>
      </section>

      {/* ─── Loading Skeleton (AI 생성 중) ─── */}
      {(recoveryState === 'loading' || messageState === 'loading' || assessmentState === 'loading') && (
        <section className="space-y-4">
          <div className="h-20 rounded-xl bg-[var(--bg-warm)] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-[var(--bg-warm)] animate-pulse" />
            ))}
          </div>
        </section>
      )}

      {/* ─── Recovery Plan Display ─── */}
      {recoveryState === 'done' && recoveryPlan && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight">회복학습 플랜</h2>
            {recoveryTime && <span className="text-xs text-[var(--text-muted)]">{recoveryTime.toFixed(1)}초 만에 생성</span>}
          </div>
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-[var(--accent)] mb-2">놓친 개념 요약</h3>
            <p className="text-sm leading-relaxed">{recoveryPlan.missed_concepts_summary}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recoveryPlan.recovery_steps_json.map(step => (
              <div key={step.step} className="card p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0075de] text-white text-xs font-bold">
                    {step.step}
                  </span>
                  <h4 className="font-bold text-sm">{step.title}</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">액션 플랜</h3>
              <p className="text-sm leading-relaxed">{recoveryPlan.action_plan_text}</p>
            </div>
            <div className="card p-6 border-l-4 border-l-[#dd5b00]">
              <h3 className="text-sm font-semibold text-[var(--status-warning)] mb-2">주의 포인트</h3>
              <p className="text-sm leading-relaxed">{recoveryPlan.caution_points_text}</p>
            </div>
          </div>
        </section>
      )}

      {/* ─── Intervention Message Display ─── */}
      {messageState === 'done' && interventionMsg && (
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight">개입 메시지</h2>
            {messageTime && <span className="text-xs text-[var(--text-muted)]">{messageTime.toFixed(1)}초 만에 생성</span>}
          </div>
          <div className="rounded-xl bg-[var(--bg-warm)] p-5">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{interventionMsg.content}</p>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-sm font-semibold rounded bg-black/5 hover:bg-black/10 transition"
          >
            메시지 복사
          </button>
        </section>
      )}

      {/* ─── Mini Assessment Display ─── */}
      {assessmentState === 'done' && assessment && submitState !== 'done' && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight">미니 진단</h2>
            {assessmentTime && <span className="text-xs text-[var(--text-muted)]">{assessmentTime.toFixed(1)}초 만에 생성</span>}
          </div>
          {assessment.questions_json.map(q => (
            <div key={q.id} className="card p-6">
              <p className="font-semibold text-sm mb-3">
                <span className="text-[var(--accent)] mr-2">Q{q.id}.</span>
                {q.question}
              </p>
              {q.type === 'multiple_choice' && q.options ? (
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                        className="accent-[#0075de]"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="답변을 입력하세요"
                  className="w-full px-3 py-2 rounded border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[#0075de]/30 placeholder:text-[var(--text-muted)]"
                />
              )}
            </div>
          ))}
          <button
            onClick={handleSubmitAssessment}
            disabled={!allAnswered || submitState === 'loading'}
            className="px-6 py-3 bg-[#0075de] text-white rounded font-semibold hover:bg-[#005bab] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitState === 'loading' ? '채점 중...' : '답안 제출'}
          </button>
        </section>
      )}

      {/* ─── Assessment Results ─── */}
      {submitState === 'done' && submitResult && assessment && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight">진단 결과</h2>
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold tracking-tight">
              {submitResult.score} <span className="text-lg text-[var(--text-muted)]">/ {submitResult.total}</span>
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">정답 수</p>
          </div>
          <div className="card p-6 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-sm text-[var(--text-muted)]">변경 전</p>
              <p className="text-2xl font-bold">{submitResult.risk_score_before}</p>
              <RiskBadge level={submitResult.risk_level_before} size="sm" />
            </div>
            <span className="text-2xl text-[var(--text-muted)]">&rarr;</span>
            <div className="text-center">
              <p className="text-sm text-[var(--text-muted)]">변경 후</p>
              <p className="text-2xl font-bold text-[var(--status-stable)]">{submitResult.risk_score_after}</p>
              <RiskBadge level={submitResult.risk_level_after} size="sm" />
            </div>
          </div>
          {assessment.questions_json.map(q => {
            const correct = submitResult.correct_answers.find(a => a.id === q.id);
            const explanation = submitResult.explanations.find(e => e.id === q.id);
            const userAnswer = assessment.submitted_answers_json?.find(a => a.id === q.id);
            const isCorrect = userAnswer && correct && userAnswer.answer.trim() === correct.answer.trim();
            return (
              <div key={q.id} className="card p-6">
                <p className="font-semibold text-sm mb-2">
                  <span className="text-[var(--accent)] mr-2">Q{q.id}.</span>{q.question}
                </p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className={isCorrect ? 'text-[var(--status-stable)]' : 'text-[var(--status-risk)]'}>
                      {isCorrect ? '✓' : '✗'} 내 답: {userAnswer?.answer || answers[q.id] || '(미답)'}
                    </span>
                  </p>
                  {!isCorrect && <p className="text-[var(--status-stable)]">정답: {correct?.answer}</p>}
                  {explanation && <p className="text-[var(--text-secondary)] mt-1">{explanation.explanation}</p>}
                </div>
              </div>
            );
          })}
        </section>
      )}

    </main>
  );
}

// ─── Sub-component ───

function ActionButton({
  label, state, onClick, primary = false, loadingText,
}: {
  label: string; state: GenState; onClick: () => void; primary?: boolean; loadingText: string;
}) {
  const isLoading = state === 'loading';
  const base = primary
    ? 'bg-[#0075de] text-white hover:bg-[#005bab]'
    : 'bg-black/5 text-black/95 hover:bg-black/10';
  return (
    <div>
      <button onClick={onClick} disabled={isLoading}
        className={`px-5 py-2.5 rounded font-semibold transition disabled:opacity-60 ${base}`}>
        {isLoading ? loadingText : state === 'done' ? `${label} (재생성)` : label}
      </button>
      {state === 'error' && (
        <p className="mt-1 text-xs text-[var(--status-risk)]">생성 실패 — 다시 시도해주세요</p>
      )}
    </div>
  );
}
