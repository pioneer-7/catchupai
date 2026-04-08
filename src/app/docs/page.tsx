'use client';

// API 문서 페이지 — Redoc 동적 로드
// SSOT: specs/004-backend/openapi-spec.md

import { useEffect, useRef } from 'react';

export default function DocsPage() {
  const redocRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
    script.onload = () => {
      if (redocRef.current && (window as unknown as Record<string, unknown>).Redoc) {
        (window as unknown as { Redoc: { init: (specUrl: string, options: Record<string, unknown>, element: HTMLElement) => void } }).Redoc.init(
          '/api/v1/openapi.json',
          {
            hideDownloadButton: true,
            theme: {
              colors: { primary: { main: '#0075de' } },
              typography: {
                fontFamily: 'Inter, -apple-system, sans-serif',
                headings: { fontFamily: 'Inter, -apple-system, sans-serif' },
              },
              sidebar: { backgroundColor: '#f6f5f4' },
            },
          },
          redocRef.current
        );
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <main className="flex-1">
      {/* Header */}
      <div className="bg-[var(--bg-warm)] px-6 py-8 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl heading-md">API Documentation</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            CatchUp AI REST API v1 — 학습 이탈 방지 AI 코파일럿
          </p>
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--accent-light)] text-[var(--accent-text)]">
              v1.0.0
            </span>
            <a
              href="/api/v1/openapi.json"
              target="_blank"
              className="px-3 py-1 text-xs font-semibold rounded-full bg-[var(--bg-warm-hover)] text-[var(--text-secondary)] hover:text-[var(--accent)]"
            >
              OpenAPI JSON →
            </a>
          </div>
        </div>
      </div>

      {/* Redoc 렌더링 영역 */}
      <div ref={redocRef} id="redoc-container">
        <div className="flex items-center justify-center py-24">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <span className="h-5 w-5 border-2 border-[var(--text-muted)]/30 border-t-[var(--text-muted)] rounded-full animate-spin" />
            API 문서 로딩 중...
          </div>
        </div>
      </div>
    </main>
  );
}
