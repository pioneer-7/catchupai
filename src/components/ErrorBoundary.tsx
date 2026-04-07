'use client';

// 글로벌 에러 바운더리 — React 에러 캐치 + 복구 UI

import { Component, type ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-6 text-[var(--status-risk)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-2">
              문제가 발생했습니다
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              일시적인 오류입니다. 페이지를 새로고침하거나 홈으로 돌아가주세요.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring"
              >
                다시 시도
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 bg-[var(--bg-warm)] text-[var(--text-primary)] rounded-[var(--radius-button)] font-semibold hover:bg-[var(--bg-warm-hover)] transition btn-press focus-ring"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
