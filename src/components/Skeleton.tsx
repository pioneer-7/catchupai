// 통일된 Skeleton 로딩 컴포넌트
// SSOT: specs/003-frontend/design-system.md

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`h-28 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse ${className}`} />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-3.5 rounded-full bg-[var(--bg-warm)] animate-pulse"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {[...Array(cols)].map((_, i) => (
          <div key={i} className="h-4 rounded bg-[var(--bg-warm)] animate-pulse" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, r) => (
        <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {[...Array(cols)].map((_, c) => (
            <div key={c} className="h-10 rounded-[var(--radius-button)] bg-[var(--bg-warm)] animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`h-64 rounded-[var(--radius-card)] bg-[var(--bg-warm)] animate-pulse ${className}`} />
  );
}
