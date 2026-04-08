// Mock LMS 통합 데모 — CatchUp AI 위젯이 삽입된 가상 LMS
// SSOT: specs/003-frontend/widget-spec.md 섹션 6

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LMS 통합 데모 — CatchUp AI',
};

export default function LmsDemoPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-warm)]">
      {/* Mock LMS Header */}
      <header className="bg-white border-b border-[var(--border)] px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">L</div>
            <span className="text-lg font-bold text-[var(--text-primary)]">EduLMS</span>
            <span className="text-xs bg-[var(--bg-warm)] text-[var(--text-muted)] px-2 py-1 rounded">Demo</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span>대시보드</span>
            <span>과정 관리</span>
            <span>학생 관리</span>
            <span className="text-indigo-600 font-semibold">CatchUp AI</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 안내 배너 */}
        <div className="bg-[var(--accent-light)] border border-[var(--accent)]/20 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔌</span>
            <div>
              <h2 className="font-bold text-[var(--accent)]">CatchUp AI 통합 데모</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                아래는 가상 LMS 대시보드에 CatchUp AI 위젯이 iframe으로 삽입된 모습입니다.
                기존 시스템을 수정하지 않고, embed 코드 한 줄로 위험 학습자 탐지 기능을 추가할 수 있습니다.
              </p>
              <a href="/integration" className="text-sm text-[var(--accent)] font-semibold hover:underline mt-2 inline-block">
                통합 가이드 보기 →
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LMS 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mock 과정 카드 */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">📋 과정: 데이터분석 기초</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[var(--bg-warm)] rounded-lg p-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
                  <p className="text-xs text-[var(--text-muted)]">전체 차시</p>
                </div>
                <div className="bg-[var(--bg-warm)] rounded-lg p-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">8</p>
                  <p className="text-xs text-[var(--text-muted)]">수강생</p>
                </div>
                <div className="bg-[var(--bg-warm)] rounded-lg p-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">67%</p>
                  <p className="text-xs text-[var(--text-muted)]">평균 진도</p>
                </div>
              </div>
            </div>

            {/* CatchUp AI 학생 카드 위젯 (데모용 — 실제 iframe) */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs bg-[var(--accent-light)] text-[var(--accent)] px-2 py-1 rounded-full font-semibold">
                  CatchUp AI Widget
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">위험 학생 상세</h3>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">가장 위험도가 높은 학생의 실시간 상태입니다.</p>
              <iframe
                src="/widget/student-card?api_key=demo"
                width="100%"
                height="260"
                className="rounded-xl border border-[var(--border)]"
              />
            </div>
          </div>

          {/* LMS 사이드바 — CatchUp 위젯 */}
          <div className="space-y-6">
            {/* CatchUp AI 위험 요약 위젯 */}
            <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="bg-[var(--accent)] px-4 py-2 flex items-center gap-2">
                <span className="text-white text-sm font-semibold">🎯 CatchUp AI</span>
                <span className="text-white/70 text-xs">위험도 모니터링</span>
              </div>
              <iframe
                src="/widget/risk-summary?api_key=demo"
                width="100%"
                height="320"
                className="border-0"
              />
            </div>

            {/* Mock LMS 기존 사이드 카드들 */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-5">
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">📅 이번 주 일정</h4>
              <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                <p>• 월 10:00 — 3차시 강의</p>
                <p>• 수 14:00 — 과제 마감</p>
                <p>• 금 10:00 — 중간 퀴즈</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[var(--border)] p-5">
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-3">💬 최근 공지</h4>
              <p className="text-sm text-[var(--text-secondary)]">3차시 강의자료가 업로드되었습니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--border)] mt-12 px-6 py-4">
        <p className="text-center text-xs text-[var(--text-muted)]">
          이 페이지는 CatchUp AI의 LMS 통합을 시연하기 위한 가상 데모입니다. |
          <a href="/integration" className="text-[var(--accent)] ml-1 hover:underline">통합 가이드</a> |
          <a href="/docs" className="text-[var(--accent)] ml-1 hover:underline">API 문서</a>
        </p>
      </footer>
    </div>
  );
}
