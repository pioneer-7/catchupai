'use client';

// 대시보드 페이지 — SSOT: specs/003-frontend/dashboard-spec.md

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KpiCard } from '@/components/KpiCard';
import { RiskBadge } from '@/components/RiskBadge';
import type { StudentListData } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<StudentListData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/students?sort=risk_score&order=desc')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold tracking-tight mb-6">대시보드</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[#f6f5f4] animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!data || data.total === 0) {
    return (
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold tracking-tight mb-6">대시보드</h1>
        <div className="rounded-xl border border-black/10 bg-[#f6f5f4] p-12 text-center">
          <p className="text-[#615d59] text-lg">아직 업로드된 데이터가 없습니다</p>
          <Link
            href="/upload"
            className="mt-4 inline-block px-5 py-2 bg-[#0075de] text-white rounded font-semibold hover:bg-[#005bab] transition"
          >
            데이터 업로드하기
          </Link>
        </div>
      </main>
    );
  }

  const topStudents = data.students.slice(0, 5);

  return (
    <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-tight mb-6">대시보드</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard title="전체 학생" value={data.total} color="gray" />
        <KpiCard title="안정" value={data.summary.stable} color="green" />
        <KpiCard title="주의" value={data.summary.warning} color="amber" />
        <KpiCard title="위험" value={data.summary.at_risk} color="red" />
      </div>

      {/* Top-N At Risk */}
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tight mb-4">위험도 높은 학생</h2>
        <div className="space-y-3">
          {topStudents.map(student => (
            <Link
              key={student.id}
              href={`/students/${student.id}`}
              className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4 hover:bg-[#f6f5f4] transition"
              style={{
                boxShadow:
                  'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold">{student.name}</span>
                <RiskBadge level={student.risk_level} size="sm" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#615d59]">
                  위험 점수 <span className="font-bold text-black/95">{student.risk_score}</span>
                </span>
                <span className="text-[#a39e98]">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href="/students"
        className="inline-block px-5 py-2 rounded font-semibold bg-black/5 text-black/95 hover:bg-black/10 transition"
      >
        학생 전체 보기
      </Link>
    </main>
  );
}
