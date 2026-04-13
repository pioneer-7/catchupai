'use client';

// API documentation page with Redoc embedded on the client.
// SSOT: specs/004-backend/openapi-spec.md

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';

type RedocWindow = Window & {
  Redoc?: {
    init: (
      specUrl: string,
      options: Record<string, unknown>,
      element: HTMLElement
    ) => void;
  };
};

export default function DocsPage() {
  const redocRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    mounted.current = true;
    timeoutRef.current = setTimeout(() => {
      if (mounted.current && !initialized.current) {
        setStatus('error');
      }
    }, 10000);

    return () => {
      mounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const initRedoc = useCallback(() => {
    if (initialized.current || !redocRef.current) return;

    const redoc = (window as RedocWindow).Redoc;
    if (!redoc) {
      setStatus('error');
      return;
    }

    initialized.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    redoc.init(
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

    if (mounted.current) {
      setStatus('ready');
    }
  }, []);

  return (
    <main className="flex-1">
      <Script
        src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
        strategy="afterInteractive"
        onReady={initRedoc}
        onError={() => setStatus('error')}
      />

      <div className="bg-[var(--bg-warm)] px-6 py-8 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl heading-md">API Documentation</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            기존 LMS/ERP에 학습 데이터 연동을 추가하는 REST API로 학생 위험도 조회, AI 회복학습 생성, 개입 메시지 자동화를 제공합니다.
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
              OpenAPI JSON 보기
            </a>
          </div>
        </div>
      </div>

      <div className="relative">
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
              OpenAPI JSON 직접 보기
            </a>
          </div>
        )}
        <div ref={redocRef} id="redoc-container" />
      </div>
    </main>
  );
}
