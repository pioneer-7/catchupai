'use client';

// 학생 목록 페이지 — Notion 테이블 스타일
// SSOT: specs/003-frontend/student-list-spec.md

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { RiskBadge } from '@/components/RiskBadge';
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
    if (sortKey !== column) return <span className="text-[#a39e98] ml-1">&#x2195;</span>;
    return <span className="text-[#0075de] ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>;
  }

  return (
    <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-tight mb-6">학생 목록</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="학생 이름 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded border border-[#ddd] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0075de]/30 placeholder:text-[#a39e98]"
        />
        <div className="flex gap-2">
          {RISK_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setRiskFilter(f.value)}
              className={`px-4 py-2 text-sm font-semibold rounded transition ${
                riskFilter === f.value
                  ? 'bg-[#0075de] text-white'
                  : 'bg-black/5 text-black/95 hover:bg-black/10'
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
            <div key={i} className="h-14 rounded-lg bg-[#f6f5f4] animate-pulse" />
          ))}
        </div>
      ) : !data || data.students.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-[#f6f5f4] p-12 text-center">
          <p className="text-[#615d59]">
            {search || riskFilter !== 'all' ? '검색 결과가 없습니다' : '학생 데이터가 없습니다'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f5f4] text-left text-[#615d59]">
                <th className="px-4 py-3 font-semibold">이름</th>
                <th className="px-4 py-3 font-semibold">상태</th>
                <th className="px-4 py-3 font-semibold cursor-pointer select-none" onClick={() => toggleSort('risk_score')}>
                  위험 점수<SortIcon column="risk_score" />
                </th>
                <th className="px-4 py-3 font-semibold cursor-pointer select-none" onClick={() => toggleSort('missed_sessions')}>
                  결석<SortIcon column="missed_sessions" />
                </th>
                <th className="px-4 py-3 font-semibold">과제 제출률</th>
                <th className="px-4 py-3 font-semibold">퀴즈 평균</th>
                <th className="px-4 py-3 font-semibold cursor-pointer select-none" onClick={() => toggleSort('last_active_days_ago')}>
                  최근 활동<SortIcon column="last_active_days_ago" />
                </th>
                <th className="px-4 py-3 font-semibold text-right">액션</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s, i) => (
                <tr
                  key={s.id}
                  className={`border-t border-black/10 hover:bg-[#f6f5f4] transition ${
                    i % 2 === 1 ? 'bg-[#fafaf9]' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">{s.name}</td>
                  <td className="px-4 py-3"><RiskBadge level={s.risk_level} size="sm" /></td>
                  <td className="px-4 py-3 font-bold">{s.risk_score}</td>
                  <td className="px-4 py-3">{s.missed_sessions}회</td>
                  <td className="px-4 py-3">{s.assignment_submission_rate}%</td>
                  <td className="px-4 py-3">{s.avg_quiz_score}점</td>
                  <td className="px-4 py-3">{s.last_active_days_ago}일 전</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/students/${s.id}`}
                      className="text-[#0075de] font-semibold hover:underline"
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
