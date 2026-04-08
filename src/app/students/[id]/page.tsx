'use client';

// 학생 상세 페이지 — 2-Zone 레이아웃 (정보 + 탭)
// SSOT: specs/003-frontend/student-detail-spec.md

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RiskBadge } from '@/components/RiskBadge';
import { MetricCard } from '@/components/MetricCard';
import { RiskFactorTag } from '@/components/RiskFactorTag';
import { ToastContainer, useToast } from '@/components/Toast';
import { TabBar } from '@/components/TabBar';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { ChatBox } from '@/components/ChatBox';
import { PredictionCard } from '@/components/PredictionCard';
import { exportRecoveryPlanPDF } from '@/lib/pdf-export';
import type { RiskPrediction } from '@/types';
import type {
  StudentDetailData, RecoveryPlan, InterventionMessage,
  MiniAssessment, AssessmentSubmitData,
} from '@/types';

type GenState = 'idle' | 'loading' | 'done' | 'error';

const TABS = [
  { id: 'recovery', label: '회복학습', icon: '📚' },
  { id: 'message', label: '메시지', icon: '💬' },
  { id: 'assessment', label: '미니 진단', icon: '✏️' },
  { id: 'prediction', label: '이탈 예측', icon: '🔮' },
  { id: 'coaching', label: 'AI 어시스턴트', icon: '🎓' },
  { id: 'timeline', label: '활동 기록', icon: '📋' },
];

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState('recovery');
  const { items: toastItems, toast, dismiss: dismissToast } = useToast();

  // AI states
  const [recoveryState, setRecoveryState] = useState<GenState>('idle');
  const [messageState, setMessageState] = useState<GenState>('idle');
  const [assessmentState, setAssessmentState] = useState<GenState>('idle');
  const [submitState, setSubmitState] = useState<GenState>('idle');
  const [recoveryTime, setRecoveryTime] = useState<number | null>(null);
  const [messageTime, setMessageTime] = useState<number | null>(null);
  const [assessmentTime, setAssessmentTime] = useState<number | null>(null);
  const [predictionState, setPredictionState] = useState<GenState>('idle');
  const [predictionTime, setPredictionTime] = useState<number | null>(null);

  // AI results
  const [prediction, setPrediction] = useState<RiskPrediction | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [interventionMsg, setInterventionMsg] = useState<InterventionMessage | null>(null);
  const [assessment, setAssessment] = useState<MiniAssessment | null>(null);
  const [submitResult, setSubmitResult] = useState<AssessmentSubmitData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
          if (json.data.recovery_plans[0]) { setRecoveryPlan(json.data.recovery_plans[0]); setRecoveryState('done'); }
          if (json.data.intervention_messages[0]) { setInterventionMsg(json.data.intervention_messages[0]); setMessageState('done'); }
          if (json.data.mini_assessments[0]) {
            const a = json.data.mini_assessments[0];
            setAssessment(a); setAssessmentState('done');
            if (a.score !== null) setSubmitState('done');
          }
        } else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Handlers ───
  async function handleGenerate(type: 'recovery' | 'message' | 'assessment') {
    const setters = {
      recovery: { setState: setRecoveryState, setTime: setRecoveryTime, url: `/api/students/${id}/recovery-plan`, onDone: (d: RecoveryPlan) => { setRecoveryPlan(d); toast('회복학습 플랜 생성 완료'); } },
      message: { setState: setMessageState, setTime: setMessageTime, url: `/api/students/${id}/intervention-message`, onDone: (d: InterventionMessage) => { setInterventionMsg(d); toast('개입 메시지 생성 완료'); } },
      assessment: { setState: setAssessmentState, setTime: setAssessmentTime, url: `/api/students/${id}/mini-assessment`, onDone: (d: MiniAssessment) => { setAssessment(d); setSubmitState('idle'); setSubmitResult(null); setAnswers({}); toast('미니 진단 생성 완료'); } },
    };
    const s = setters[type];
    s.setState('loading');
    const start = Date.now();
    try {
      const res = await fetch(s.url, { method: 'POST', headers: type === 'message' ? { 'Content-Type': 'application/json' } : {}, body: type === 'message' ? JSON.stringify({ message_type: 'teacher' }) : undefined });
      const json = await res.json();
      if (json.success) { s.onDone(json.data); s.setState('done'); s.setTime((Date.now() - start) / 1000); }
      else s.setState('error');
    } catch { s.setState('error'); }
  }

  async function handleGenerateAll() {
    await handleGenerate('recovery');
    await handleGenerate('message');
    await handleGenerate('assessment');
  }

  async function handleSubmitAssessment() {
    if (!assessment) return;
    setSubmitState('loading');
    try {
      const res = await fetch(`/api/students/${id}/mini-assessment/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment_id: assessment.id, answers: Object.entries(answers).map(([qId, answer]) => ({ id: Number(qId), answer })) }),
      });
      const json = await res.json();
      if (json.success) {
        setSubmitResult(json.data); setSubmitState('done');
        if (data) setData({ ...data, progress: { ...data.progress, risk_score: json.data.risk_score_after, risk_level: json.data.risk_level_after } });
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
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          <div className="h-28 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse" />)}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !data) {
    return (
      <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="card p-16 text-center">
          <p className="text-[var(--text-secondary)] text-lg">학생을 찾을 수 없습니다</p>
          <Link href="/students" className="mt-4 inline-block text-[var(--accent)] font-semibold hover:underline">학생 목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  const { student, progress: p } = data;
  const allAnswered = assessment?.questions_json.every(q => answers[q.id]?.trim());
  const anyLoading = recoveryState === 'loading' || messageState === 'loading' || assessmentState === 'loading';

  return (
    <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
      <ToastContainer items={toastItems} onDismiss={dismissToast} />

      <Link href="/students" className="text-sm text-[var(--accent)] font-semibold hover:underline">
        &larr; 학생 목록
      </Link>

      {/* ═══ Zone A: 학생 정보 (항상 노출) ═══ */}
      <section className="card p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            {student.cohort_name && <p className="mt-1 text-sm text-[var(--text-secondary)]">{student.cohort_name}</p>}
          </div>
          <div className="text-right">
            <RiskBadge level={p.risk_level} />
            <p className="mt-2 text-3xl font-bold tracking-tight num-display">{p.risk_score}</p>
            <p className="text-xs text-[var(--text-muted)]">위험 점수</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        <MetricCard title="출석률" value={p.attendance_rate} unit={`% (${p.missed_sessions}회 결석)`} alert={p.attendance_rate < 70} />
        <MetricCard title="과제 제출률" value={p.assignment_submission_rate} unit="%" alert={p.assignment_submission_rate < 60} />
        <MetricCard title="퀴즈 평균" value={p.avg_quiz_score} unit="점" alert={p.avg_quiz_score < 60} />
        <MetricCard title="최근 활동" value={p.last_active_days_ago} unit="일 전" alert={p.last_active_days_ago > 7} />
      </div>

      {p.risk_factors_json.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">위험 요인</h2>
          <div className="flex flex-wrap gap-2">
            {p.risk_factors_json.map((f, i) => <RiskFactorTag key={i} factor={f} />)}
          </div>
        </div>
      )}

      {/* ═══ Zone B: 탭 UI ═══ */}
      <div className="card mt-8 overflow-hidden">
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          trailing={
            <button
              onClick={handleGenerateAll}
              disabled={anyLoading}
              className="px-4 py-1.5 text-xs font-semibold rounded-[var(--radius-button)] border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-light)] transition btn-press focus-ring disabled:opacity-40"
            >
              {anyLoading ? '생성 중...' : '전체 생성'}
            </button>
          }
        />

        <div className="p-6">
          {/* ── 탭 1: 회복학습 ── */}
          {activeTab === 'recovery' && (
            <div className="space-y-6">
              <GenButton label="회복학습 생성" state={recoveryState} time={recoveryTime} onClick={() => handleGenerate('recovery')} />
              {recoveryState === 'loading' && <Skeleton />}
              {recoveryState === 'done' && recoveryPlan && (
                <>
                  <div className="flex justify-end">
                    <button onClick={() => exportRecoveryPlanPDF(student, p, recoveryPlan)} className="text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-button)] bg-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm-hover)] transition btn-press">PDF 내보내기</button>
                  </div>
                  <div className="card p-6"><h3 className="text-sm font-semibold text-[var(--accent)] mb-2">놓친 개념 요약</h3><p className="text-sm leading-relaxed">{recoveryPlan.missed_concepts_summary}</p></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recoveryPlan.recovery_steps_json.map(step => (
                      <div key={step.step} className="card p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-white text-xs font-bold">{step.step}</span>
                          <h4 className="font-bold text-sm">{step.title}</h4>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card p-6"><h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">액션 플랜</h3><p className="text-sm leading-relaxed">{recoveryPlan.action_plan_text}</p></div>
                    <div className="card p-6 border-l-4 border-l-[var(--status-warning)]"><h3 className="text-sm font-semibold text-[var(--status-warning)] mb-2">주의 포인트</h3><p className="text-sm leading-relaxed">{recoveryPlan.caution_points_text}</p></div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── 탭 2: 개입 메시지 ── */}
          {activeTab === 'message' && (
            <div className="space-y-4">
              <GenButton label="개입 메시지 생성" state={messageState} time={messageTime} onClick={() => handleGenerate('message')} />
              {messageState === 'loading' && <Skeleton />}
              {messageState === 'done' && interventionMsg && (
                <>
                  <div className="rounded-[var(--radius-card)] bg-[var(--bg-warm)] p-6"><p className="text-sm leading-relaxed whitespace-pre-wrap">{interventionMsg.content}</p></div>
                  <button onClick={handleCopy} className="px-4 py-2 text-sm font-semibold rounded-[var(--radius-button)] bg-[var(--bg-warm)] hover:bg-[var(--bg-warm-hover)] transition btn-press">메시지 복사</button>
                </>
              )}
            </div>
          )}

          {/* ── 탭 3: 미니 진단 ── */}
          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <GenButton label="미니 진단 생성" state={assessmentState} time={assessmentTime} onClick={() => handleGenerate('assessment')} />
              {assessmentState === 'loading' && <Skeleton />}
              {assessmentState === 'done' && assessment && submitState !== 'done' && (
                <>
                  {assessment.questions_json.map(q => (
                    <div key={q.id} className="card p-6">
                      <p className="font-semibold text-sm mb-3"><span className="text-[var(--accent)] mr-2">Q{q.id}.</span>{q.question}</p>
                      {q.type === 'multiple_choice' && q.options ? (
                        <div className="space-y-2">{q.options.map(opt => (
                          <label key={opt} className="flex items-center gap-3 cursor-pointer text-sm">
                            <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === opt} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))} className="accent-[var(--accent)]" />{opt}
                          </label>
                        ))}</div>
                      ) : (
                        <input type="text" value={answers[q.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))} placeholder="답변을 입력하세요" className="w-full input-base" />
                      )}
                    </div>
                  ))}
                  <button onClick={handleSubmitAssessment} disabled={!allAnswered || submitState === 'loading'}
                    className="px-6 py-3 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitState === 'loading' ? '채점 중...' : '답안 제출'}
                  </button>
                </>
              )}
              {submitState === 'done' && submitResult && assessment && (
                <div className="space-y-4">
                  <div className="card p-6 text-center">
                    <p className="text-4xl font-bold tracking-tight num-display">{submitResult.score} <span className="text-lg text-[var(--text-muted)]">/ {submitResult.total}</span></p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">정답 수</p>
                  </div>
                  <div className="card p-6 flex items-center justify-center gap-6">
                    <div className="text-center"><p className="text-sm text-[var(--text-muted)]">변경 전</p><p className="text-2xl font-bold num-display">{submitResult.risk_score_before}</p><RiskBadge level={submitResult.risk_level_before} size="sm" /></div>
                    <span className="text-2xl text-[var(--text-muted)]">&rarr;</span>
                    <div className="text-center"><p className="text-sm text-[var(--text-muted)]">변경 후</p><p className="text-2xl font-bold text-[var(--status-stable)] num-display">{submitResult.risk_score_after}</p><RiskBadge level={submitResult.risk_level_after} size="sm" /></div>
                  </div>
                  {assessment.questions_json.map(q => {
                    const correct = submitResult.correct_answers.find(a => a.id === q.id);
                    const explanation = submitResult.explanations.find(e => e.id === q.id);
                    const userAnswer = assessment.submitted_answers_json?.find(a => a.id === q.id);
                    const isCorrect = userAnswer && correct && userAnswer.answer.trim() === correct.answer.trim();
                    return (
                      <div key={q.id} className="card p-6">
                        <p className="font-semibold text-sm mb-2"><span className="text-[var(--accent)] mr-2">Q{q.id}.</span>{q.question}</p>
                        <div className="space-y-1 text-sm">
                          <p><span className={isCorrect ? 'text-[var(--status-stable)]' : 'text-[var(--status-risk)]'}>{isCorrect ? '✓' : '✗'} 내 답: {userAnswer?.answer || answers[q.id] || '(미답)'}</span></p>
                          {!isCorrect && <p className="text-[var(--status-stable)]">정답: {correct?.answer}</p>}
                          {explanation && <p className="text-[var(--text-secondary)] mt-1">{explanation.explanation}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── 탭 4: 이탈 예측 ── */}
          {activeTab === 'prediction' && (
            <div className="space-y-6">
              <GenButton label="이탈 위험 평가" state={predictionState} time={predictionTime} onClick={async () => {
                setPredictionState('loading');
                const start = Date.now();
                try {
                  const res = await fetch(`/api/students/${id}/prediction`, { method: 'POST' });
                  const json = await res.json();
                  if (json.success) { setPrediction(json.data); setPredictionState('done'); setPredictionTime((Date.now() - start) / 1000); toast('이탈 위험 평가 완료'); }
                  else setPredictionState('error');
                } catch { setPredictionState('error'); }
              }} />
              {predictionState === 'loading' && <Skeleton />}
              {predictionState === 'done' && prediction && <PredictionCard prediction={prediction} />}
            </div>
          )}

          {/* ── 탭 5: AI 어시스턴트 ── */}
          {activeTab === 'coaching' && <ChatBox studentId={id} />}

          {/* ── 탭 5: 활동 기록 ── */}
          {activeTab === 'timeline' && (
            <ActivityTimeline
              recoveryPlans={data.recovery_plans.concat(recoveryPlan ? [recoveryPlan] : [])}
              interventionMessages={data.intervention_messages.concat(interventionMsg ? [interventionMsg] : [])}
              miniAssessments={data.mini_assessments.concat(assessment ? [assessment] : [])}
            />
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Sub-components ───

function GenButton({ label, state, time, onClick }: { label: string; state: GenState; time: number | null; onClick: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onClick} disabled={state === 'loading'}
        className={`px-5 py-2.5 rounded-[var(--radius-button)] font-semibold transition btn-press focus-ring disabled:opacity-60 ${
          state === 'done' ? 'bg-[var(--bg-warm)] text-[var(--text-primary)] hover:bg-[var(--bg-warm-hover)]' : 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]'
        }`}>
        {state === 'loading' ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />생성 중...</span>
          : state === 'done' ? `${label} (재생성)` : label}
      </button>
      {time && <span className="text-xs text-[var(--text-muted)]">{time.toFixed(1)}초 만에 생성</span>}
      {state === 'error' && <span className="text-xs text-[var(--status-risk)]">생성 실패 — 다시 시도해주세요</span>}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      <div className="card p-6 space-y-3"><div className="h-4 w-32 rounded bg-[var(--bg-warm)] animate-pulse" /><div className="h-4 w-full rounded bg-[var(--bg-warm)] animate-pulse" /><div className="h-4 w-3/4 rounded bg-[var(--bg-warm)] animate-pulse" /></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="card p-6 space-y-3"><div className="h-6 w-6 rounded-full bg-[var(--bg-warm)] animate-pulse" /><div className="h-4 w-full rounded bg-[var(--bg-warm)] animate-pulse" /></div>)}</div>
    </div>
  );
}
