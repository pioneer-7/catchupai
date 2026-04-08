// API 문서 페이지 — Redoc CDN 기반 Swagger UI
// SSOT: specs/004-backend/openapi-spec.md

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CatchUp AI — API Documentation',
  description: 'CatchUp AI REST API v1 문서',
};

export default function DocsPage() {
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

      {/* Redoc */}
      <div
        id="redoc-container"
        dangerouslySetInnerHTML={{
          __html: `
            <redoc spec-url="/api/v1/openapi.json"
              hide-download-button
              theme='{
                "colors": { "primary": { "main": "#0075de" } },
                "typography": {
                  "fontFamily": "Inter, -apple-system, sans-serif",
                  "headings": { "fontFamily": "Inter, -apple-system, sans-serif" }
                },
                "sidebar": { "backgroundColor": "#f6f5f4" }
              }'
            ></redoc>
            <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
          `,
        }}
      />
    </main>
  );
}
