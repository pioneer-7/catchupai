'use client';

// 통합 가이드 페이지 — 위젯 embed 코드 생성기
// SSOT: specs/003-frontend/widget-spec.md 섹션 5

import { useState } from 'react';

const BASE = 'https://carchupai.vercel.app';

const WIDGET_TYPES = [
  { id: 'risk-summary', label: '코스 위험 요약', width: 400, height: 320, params: ['api_key'] },
  { id: 'student-card', label: '학생 카드', width: 360, height: 260, params: ['student_id', 'api_key'] },
];

export default function IntegrationPage() {
  const [widgetType, setWidgetType] = useState(WIDGET_TYPES[0]);
  const [apiKey, setApiKey] = useState('');
  const [studentId, setStudentId] = useState('');
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams();
  if (apiKey) params.set('api_key', apiKey);
  if (widgetType.id === 'student-card' && studentId) params.set('student_id', studentId);

  const widgetUrl = `${BASE}/widget/${widgetType.id}?${params}`;
  const embedCode = `<iframe
  src="${widgetUrl}"
  width="${widgetType.width}"
  height="${widgetType.height}"
  frameborder="0"
  style="border-radius: 12px; border: 1px solid rgba(0,0,0,0.1);"
></iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-2">통합 가이드</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        CatchUp AI 위젯을 기존 LMS, ERP, 교육 대시보드에 iframe으로 삽입하세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 설정 패널 */}
        <div className="space-y-6">
          {/* 위젯 타입 */}
          <div>
            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-2 block">위젯 타입</label>
            <div className="flex gap-3">
              {WIDGET_TYPES.map(w => (
                <button
                  key={w.id}
                  onClick={() => setWidgetType(w)}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-[var(--radius-button)] transition btn-press ${
                    widgetType.id === w.id
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-warm)] hover:bg-[var(--bg-warm-hover)]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* API 키 */}
          <div>
            <label className="text-sm font-semibold text-[var(--text-secondary)] mb-2 block">API 키</label>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="CATCHUP_API_KEY"
              className="w-full px-4 py-2.5 rounded-[var(--radius-input)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 placeholder:text-[var(--text-muted)]"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">개발 모드에서는 빈 값으로도 동작합니다</p>
          </div>

          {/* Student ID (student-card만) */}
          {widgetType.id === 'student-card' && (
            <div>
              <label className="text-sm font-semibold text-[var(--text-secondary)] mb-2 block">학생 ID</label>
              <input
                type="text"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="student UUID"
                className="w-full px-4 py-2.5 rounded-[var(--radius-input)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 placeholder:text-[var(--text-muted)]"
              />
            </div>
          )}

          {/* Embed 코드 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-[var(--text-secondary)]">Embed 코드</label>
              <button
                onClick={handleCopy}
                className="text-xs px-3 py-1.5 rounded-[var(--radius-button)] bg-[var(--bg-warm)] text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-warm-hover)] transition btn-press"
              >
                {copied ? '복사됨!' : '복사'}
              </button>
            </div>
            <pre className="bg-[var(--bg-warm)] rounded-[var(--radius-card)] p-4 text-xs overflow-x-auto whitespace-pre-wrap break-all">
              {embedCode}
            </pre>
          </div>

          {/* API 문서 링크 */}
          <div className="flex gap-3">
            <a href="/docs" className="text-sm text-[var(--accent)] font-semibold hover:underline">
              API 문서 →
            </a>
            <a href="/demo/lms" className="text-sm text-[var(--accent)] font-semibold hover:underline">
              LMS 통합 데모 →
            </a>
          </div>
        </div>

        {/* 미리보기 */}
        <div>
          <label className="text-sm font-semibold text-[var(--text-secondary)] mb-2 block">미리보기</label>
          <div className="card p-4 bg-[var(--bg-warm)]">
            <iframe
              src={widgetUrl}
              width={widgetType.width}
              height={widgetType.height}
              className="rounded-[var(--radius-card)] border border-[var(--border)] bg-white mx-auto block"
              style={{ maxWidth: '100%' }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
