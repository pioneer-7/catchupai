'use client';

// 학생 상세 페이지 — SSOT: specs/003-frontend/student-detail-spec.md

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RiskBadge } from '@/components/RiskBadge';
import { MetricCard } from '@/components/MetricCard';
import { RiskFactorTag } from '@/components/RiskFactorTag';
import type { StudentDetailData } from '@/types';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<StudentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-[#f6f5f4] animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-[#f6f5f4] animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !data) {
    return (
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
        <div className="rounded-xl border border-black/10 bg-[#f6f5f4] p-12 text-center">
          <p className="text-[#615d59] text-lg">학생을 찾을 수 없습니다</p>
          <Link href="/students" className="mt-4 inline-block text-[#0075de] font-semibold hover:underline">
            학생 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const { student, progress } = data;
  const p = progress;

  return (
    <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
      {/* Back link */}
      <Link href="/students" className="text-sm text-[#0075de] font-semibold hover:underline mb-4 inline-block">
        &larr; 학생 목록
      </Link>

      {/* Header Card */}
      <div
        className="rounded-xl border border-black/10 bg-white p-6 mb-6"
        style={{
          boxShadow: 'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            {student.cohort_name && (
              <p className="mt-1 text-sm text-[#615d59]">{student.cohort_name}</p>
            )}
          </div>
          <div className="text-right">
            <RiskBadge level={p.risk_level} />
            <p className="mt-2 text-3xl font-bold tracking-tight">{p.risk_score}</p>
            <p className="text-xs text-[#a39e98]">위험 점수</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="출석률"
          value={p.attendance_rate}
          unit={`% (${p.missed_sessions}회 결석)`}
          alert={p.attendance_rate < 70}
        />
        <MetricCard
          title="과제 제출률"
          value={p.assignment_submission_rate}
          unit="%"
          alert={p.assignment_submission_rate < 60}
        />
        <MetricCard
          title="퀴즈 평균"
          value={p.avg_quiz_score}
          unit="점"
          alert={p.avg_quiz_score < 60}
        />
        <MetricCard
          title="최근 활동"
          value={p.last_active_days_ago}
          unit="일 전"
          alert={p.last_active_days_ago > 7}
        />
      </div>

      {/* Risk Factors */}
      {p.risk_factors_json.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#615d59] mb-3">위험 요인</h2>
          <div className="flex flex-wrap gap-2">
            {p.risk_factors_json.map((f, i) => (
              <RiskFactorTag key={i} factor={f} />
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-black/10 pt-6">
        <h2 className="text-sm font-semibold text-[#615d59] mb-4">AI 지원 액션</h2>
        <div className="flex flex-wrap gap-3">
          <button
            disabled
            className="px-5 py-2.5 bg-[#0075de] text-white rounded font-semibold opacity-60 cursor-not-allowed"
          >
            회복학습 생성
          </button>
          <button
            disabled
            className="px-5 py-2.5 bg-black/5 text-black/95 rounded font-semibold opacity-60 cursor-not-allowed"
          >
            개입 메시지 생성
          </button>
          <button
            disabled
            className="px-5 py-2.5 bg-black/5 text-black/95 rounded font-semibold opacity-60 cursor-not-allowed"
          >
            미니 진단 생성
          </button>
        </div>
        <p className="mt-2 text-xs text-[#a39e98]">AI 기능은 다음 단계에서 연결됩니다</p>
      </div>
    </main>
  );
}
