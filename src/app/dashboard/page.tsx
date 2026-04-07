'use client';

// 대시보드 페이지 — SSOT: specs/003-frontend/dashboard-spec.md

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KpiCard } from '@/components/KpiCard';
import { RiskBadge } from '@/components/RiskBadge';
import { FadeIn } from '@/components/FadeIn';
import { RiskChart } from '@/components/RiskChart';
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
      <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl heading-md mb-8">대시보드</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse" />
          ))}
        </div>
      </main>
    );
  }

  if (!data || data.total === 0) {
    return (
      <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl heading-md mb-8">대시보드</h1>
        <div className="card p-16 text-center">
          <p className="text-[var(--text-secondary)] text-lg">아직 업로드된 데이터가 없습니다</p>
          <Link
            href="/upload"
            className="mt-6 inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring"
          >
            데이터 업로드하기
          </Link>
        </div>
      </main>
    );
  }

  const topStudents = data.students.slice(0, 5);

  return (
    <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-8">대시보드</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <FadeIn delay={0}><KpiCard title="전체 학생" value={data.total} color="gray" /></FadeIn>
        <FadeIn delay={60}><KpiCard title="안정" value={data.summary.stable} color="green" /></FadeIn>
        <FadeIn delay={120}><KpiCard title="주의" value={data.summary.warning} color="amber" /></FadeIn>
        <FadeIn delay={180}><KpiCard title="위험" value={data.summary.at_risk} color="red" /></FadeIn>
      </div>

      {/* Risk Distribution Chart */}
      <FadeIn delay={240} className="mb-12">
        <RiskChart data={data.summary} total={data.total} />
      </FadeIn>

      {/* Top-N At Risk */}
      <div className="mb-10">
        <h2 className="text-lg heading-md mb-6">위험도 높은 학생</h2>
        <div className="space-y-3">
          {topStudents.map((student, i) => (
            <FadeIn key={student.id} delay={240 + i * 60}>
            <Link
              href={`/students/${student.id}`}
              className="card card-hover flex items-center justify-between p-5 block"
            >
              <div className="flex items-center gap-4">
                <span className="font-semibold">{student.name}</span>
                <RiskBadge level={student.risk_level} size="sm" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[var(--text-secondary)]">
                  위험 점수 <span className="font-bold text-[var(--text-primary)] num-display">{student.risk_score}</span>
                </span>
                <span className="text-[var(--text-muted)]">&rarr;</span>
              </div>
            </Link>
            </FadeIn>
          ))}
        </div>
      </div>

      <Link
        href="/students"
        className="inline-block px-6 py-3 rounded-[var(--radius-button)] font-semibold bg-[var(--bg-warm)] text-[var(--text-primary)] hover:bg-[var(--bg-warm-hover)] transition btn-press focus-ring"
      >
        학생 전체 보기
      </Link>
    </main>
  );
}
