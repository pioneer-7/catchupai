'use client';

// 학생 목록 페이지 — Notion 테이블 + 디자인 토큰
// SSOT: specs/003-frontend/student-list-spec.md

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { RiskBadge } from '@/components/RiskBadge';
import { EmptyState } from '@/components/EmptyState';
import type { StudentListData, RiskLevel } from '@/types';

const RISK_FILTERS: { value: RiskLevel | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'stable', label: '안정' },
  { value: 'warning', label: '주의' },
  { value: 'at_risk', label: '위험' },
];

export default function StudentsPage() {
  const [data, setData] = useState<StudentListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [sortKey, setSortKey] = useState('risk_score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort: sortKey, order: sortOrder });
    if (riskFilter !== 'all') params.set('risk_level', riskFilter);
    if (search) params.set('search', search);

    const res = await fetch(`/api/students?${params}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, [search, riskFilter, sortKey, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  }

  function SortIcon({ column }: { column: string }) {
    if (sortKey !== column) return <span className="text-[var(--text-muted)] ml-1">&#x2195;</span>;
    return <span className="text-[var(--accent)] ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>;
  }

  return (
    <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-8">학생 목록</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="학생 이름 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-[var(--radius-input)] border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 placeholder:text-[var(--text-muted)] focus-ring"
        />
        <div className="flex gap-2">
          {RISK_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setRiskFilter(f.value)}
              className={`px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-button)] transition btn-press focus-ring ${
                riskFilter === f.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--bg-warm)] text-[var(--text-primary)] hover:bg-[var(--bg-warm-hover)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse" />
          ))}
        </div>
      ) : !data || data.students.length === 0 ? (
        <EmptyState
          icon={search || riskFilter !== 'all' ? 'search' : 'students'}
          title={search || riskFilter !== 'all' ? '검색 결과가 없습니다' : '학생 데이터가 없습니다'}
          description={search || riskFilter !== 'all'
            ? '다른 검색어나 필터를 사용해보세요.'
            : '샘플 데이터를 로드하거나 CSV를 업로드해주세요.'
          }
          actionLabel={search || riskFilter !== 'all' ? undefined : '데이터 업로드하기'}
          actionHref={search || riskFilter !== 'all' ? undefined : '/upload'}
        />
      ) : (
        <div className="overflow-x-auto card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-warm)] text-left text-[var(--text-secondary)]">
                <th className="px-5 py-4 font-semibold">이름</th>
                <th className="px-5 py-4 font-semibold">상태</th>
                <th className="px-5 py-4 font-semibold cursor-pointer select-none" onClick={() => toggleSort('risk_score')}>
                  위험 점수<SortIcon column="risk_score" />
                </th>
                <th className="px-5 py-4 font-semibold cursor-pointer select-none" onClick={() => toggleSort('missed_sessions')}>
                  결석<SortIcon column="missed_sessions" />
                </th>
                <th className="px-5 py-4 font-semibold">과제 제출률</th>
                <th className="px-5 py-4 font-semibold">퀴즈 평균</th>
                <th className="px-5 py-4 font-semibold cursor-pointer select-none" onClick={() => toggleSort('last_active_days_ago')}>
                  최근 활동<SortIcon column="last_active_days_ago" />
                </th>
                <th className="px-5 py-4 font-semibold text-right">액션</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-t border-[var(--border)] hover:bg-[var(--bg-warm)] transition-colors ${
                    i % 2 === 1 ? 'bg-[var(--bg-warm)]/40' : ''
                  }`}
                >
                  <td className="px-5 py-4 font-semibold">{s.name}</td>
                  <td className="px-5 py-4"><RiskBadge level={s.risk_level} size="sm" /></td>
                  <td className="px-5 py-4 font-bold num-display">{s.risk_score}</td>
                  <td className="px-5 py-4">{s.missed_sessions}회</td>
                  <td className="px-5 py-4">{s.assignment_submission_rate}%</td>
                  <td className="px-5 py-4">{s.avg_quiz_score}점</td>
                  <td className="px-5 py-4">{s.last_active_days_ago}일 전</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/students/${s.id}`}
                      className="text-[var(--accent)] font-semibold hover:underline focus-ring rounded"
                    >
                      상세 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
