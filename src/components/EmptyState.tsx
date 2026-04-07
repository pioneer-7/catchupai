// 빈 상태 컴포넌트 — SVG 일러스트 + CTA

import Link from 'next/link';

const ICONS: Record<string, string> = {
  upload: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  search: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  students: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  error: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
};

export function EmptyState({
  icon = 'students',
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon?: 'upload' | 'search' | 'students' | 'error';
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="card p-16 text-center">
      <div
        className="mx-auto mb-6 text-[var(--text-muted)]"
        dangerouslySetInnerHTML={{ __html: ICONS[icon] }}
        style={{ width: 48, height: 48 }}
      />
      <h3 className="text-lg font-bold tracking-tight mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
