'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RiskBadge } from '@/components/RiskBadge';
import type { StudentDetailData } from '@/types';

export default function StudentCardContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get('student_id');
  const apiKey = searchParams.get('api_key');
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const validationError = !apiKey
    ? 'API 키가 필요합니다'
    : !studentId
      ? 'student_id가 필요합니다'
      : null;

  useEffect(() => {
    if (validationError || !apiKey || !studentId) return;
    fetch(`/api/v1/students/${studentId}`, { headers: { 'X-API-Key': apiKey } })
      .then(r => r.json())
      .then(json => { if (json.success) { setData(json.data); setError(null); } else setError(json.error?.message || '학생을 찾을 수 없습니다'); })
      .catch(() => setError('연결 오류'));
  }, [studentId, apiKey, validationError]);

  if (validationError || error) return <div className="p-6 text-center"><p className="text-sm text-[var(--status-risk)]">{validationError || error}</p></div>;
  if (!data) return <div className="p-5 space-y-3"><div className="h-6 w-24 rounded bg-[var(--bg-warm)] animate-pulse" /><div className="h-10 rounded bg-[var(--bg-warm)] animate-pulse" /></div>;

  const { student, progress: p } = data;
  const metrics = [
    { label: '출석', value: p.attendance_rate, alert: p.attendance_rate < 70 },
    { label: '과제', value: p.assignment_submission_rate, alert: p.assignment_submission_rate < 60 },
    { label: '퀴즈', value: p.avg_quiz_score, alert: p.avg_quiz_score < 60 },
  ];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-base">{student.name}</p>
          {student.cohort_name && <p className="text-xs text-[var(--text-muted)]">{student.cohort_name}</p>}
        </div>
        <div className="text-right">
          <RiskBadge level={p.risk_level} />
          <p className="text-xl font-bold num-display mt-1">{p.risk_score}</p>
        </div>
      </div>
      <div className="space-y-2">
        {metrics.map(m => (
          <div key={m.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)]">{m.label}</span>
              <span className={`font-semibold num-display ${m.alert ? 'text-[var(--status-risk)]' : ''}`}>{m.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-warm)] overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.alert ? 'var(--status-risk)' : 'var(--status-stable)' }} />
            </div>
          </div>
        ))}
      </div>
      <a href={`/students/${student.id}`} target="_blank" rel="noopener" className="block text-center text-xs text-[var(--accent)] font-semibold hover:underline">상세 보기 →</a>
      <p className="text-[10px] text-[var(--text-muted)] text-center">Powered by CatchUp AI</p>
    </div>
  );
}
