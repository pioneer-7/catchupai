'use client';

// API 문서 페이지 — Redoc 동적 로드
// SSOT: specs/004-backend/openapi-spec.md

import { useEffect, useRef, useState } from 'react';

export default function DocsPage() {
  const redocRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // 10초 타임아웃
    const timeout = setTimeout(() => {
      if (status === 'loading') setStatus('error');
    }, 10000);

    const script = document.createElement('script');
    script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
    script.onload = () => {
      clearTimeout(timeout);
      if (redocRef.current && (window as unknown as Record<string, unknown>).Redoc) {
        (window as unknown as { Redoc: { init: (specUrl: string, options: Record<string, unknown>, element: HTMLElement) => void } }).Redoc.init(
          '/api/v1/openapi.json',
          {
            hideDownloadButton: true,
            theme: {
              colors: { primary: { main: '#5B5BD6' } },
              typography: {
                fontFamily: 'Inter, -apple-system, sans-serif',
                headings: { fontFamily: 'Inter, -apple-system, sans-serif' },
              },
              sidebar: { backgroundColor: '#faf9f7' },
            },
          },
          redocRef.current
        );
        setStatus('ready');
      }
    };
    script.onerror = () => {
      clearTimeout(timeout);
      setStatus('error');
    };
    document.body.appendChild(script);

    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {status === 'loading' && (
          <div className="flex items-center justify-center py-24">
            <div className="flex items-center gap-3 text-[var(--text-muted)]">
              <span className="h-5 w-5 border-2 border-[var(--text-muted)]/30 border-t-[var(--text-muted)] rounded-full animate-spin" />
              API 문서 로딩 중...
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-[var(--text-secondary)]">API 문서 렌더링에 실패했습니다.</p>
            <a
              href="/api/v1/openapi.json"
              target="_blank"
              className="btn-primary text-sm"
            >
              OpenAPI JSON 직접 보기 →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
