'use client';

// 탭 바 컴포넌트 — 학생 상세 Zone B
// SSOT: specs/003-frontend/student-detail-spec.md 섹션 5

interface Tab {
  id: string;
  label: string;
  icon: string;
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
  trailing?: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--border)] flex items-center overflow-x-auto scrollbar-none">
      <div className="flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 focus-ring ${
              activeTab === tab.id
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      {trailing && <div className="ml-auto pr-2">{trailing}</div>}
    </div>
  );
}
