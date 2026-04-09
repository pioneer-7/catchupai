'use client';

// 탭 바 — Linear precision style
// SSOT: specs/003-frontend/student-detail-spec.md 섹션 5

import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
}

export function TabBar({
  tabs,
  activeTab,
  onTabChange,
  trailing,
}: {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  trailing?: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] flex items-center overflow-x-auto scrollbar-none">
      <div className="flex" role="tablist">
        {tabs.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-[13px] whitespace-nowrap transition-all border-b-2 focus-ring ${
                active
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-warm)]'
              }`}
              style={{ fontWeight: active ? 600 : 510 }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
      {trailing && <div className="ml-auto pr-3">{trailing}</div>}
    </div>
  );
}
