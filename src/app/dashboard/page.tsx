'use client';

// 대시보드 페이지 — SSOT: specs/003-frontend/dashboard-spec.md

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KpiCard } from '@/components/KpiCard';
import { RiskBadge } from '@/components/RiskBadge';
import { FadeIn } from '@/components/FadeIn';
import { RiskChart } from '@/components/RiskChart';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonCard } from '@/components/Skeleton';
import { Users, CheckCircle, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
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
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!data || data.total === 0) {
    return (
      <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl heading-md mb-8">대시보드</h1>
        <EmptyState
          icon="upload"
          title="아직 업로드된 데이터가 없습니다"
          description="학생 데이터를 업로드하면 위험도 분석과 AI 회복학습을 시작할 수 있습니다."
          actionLabel="데이터 업로드하기"
          actionHref="/upload"
        />
      </main>
    );
  }

  const topStudents = data.students.slice(0, 5);

  return (
    <main className="flex-1 px-6 py-12 max-w-6xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-8">대시보드</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <FadeIn delay={0}><KpiCard title="전체 학생" value={data.total} color="gray" icon={Users} /></FadeIn>
        <FadeIn delay={60}><KpiCard title="안정" value={data.summary.stable} color="green" icon={CheckCircle} /></FadeIn>
        <FadeIn delay={120}><KpiCard title="주의" value={data.summary.warning} color="amber" icon={AlertTriangle} /></FadeIn>
        <FadeIn delay={180}><KpiCard title="위험" value={data.summary.at_risk} color="red" icon={XCircle} /></FadeIn>
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
        className="btn-secondary inline-flex items-center gap-2"
      >
        학생 전체 보기 <ArrowRight size={14} />
      </Link>
    </main>
  );
}
