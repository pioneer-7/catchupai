'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RiskBadge } from '@/components/RiskBadge';
import type { StudentListData } from '@/types';

export default function RiskSummaryContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('api_key');
  const [data, setData] = useState<StudentListData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const validationError = apiKey ? null : 'API 키가 필요합니다';

  useEffect(() => {
    if (validationError || !apiKey) return;
    fetch('/api/v1/students?sort=risk_score&order=desc', { headers: { 'X-API-Key': apiKey } })
      .then(r => r.json())
      .then(json => { if (json.success) { setData(json.data); setError(null); } else setError(json.error?.message || '오류'); })
      .catch(() => setError('연결 오류'));
  }, [apiKey, validationError]);

  if (validationError || error) return <div className="p-6 text-center"><p className="text-sm text-[var(--status-risk)]">{validationError || error}</p></div>;
  if (!data) return <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-8 rounded bg-[var(--bg-warm)] animate-pulse" />)}</div>;

  const topStudents = data.students.slice(0, 3);
  const total = data.total;
  const segments = [
    { label: '위험', count: data.summary.at_risk, color: 'var(--status-risk)' },
    { label: '주의', count: data.summary.warning, color: 'var(--status-warning)' },
    { label: '안정', count: data.summary.stable, color: 'var(--status-stable)' },
  ];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)]">전체 학생</p>
          <p className="text-2xl font-bold num-display">{total}</p>
        </div>
        <div className="flex gap-3">
          {segments.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold num-display" style={{ color: s.color }}>{s.count}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-[var(--bg-warm)]">
        {segments.map(s => s.count > 0 && <div key={s.label} style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }} />)}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-secondary)]">위험도 상위</p>
        {topStudents.map(s => (
          <div key={s.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2"><span className="font-medium">{s.name}</span><RiskBadge level={s.risk_level} size="sm" /></div>
            <span className="font-bold num-display">{s.risk_score}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--text-muted)] text-center pt-1">Powered by CatchUp AI</p>
    </div>
  );
}
