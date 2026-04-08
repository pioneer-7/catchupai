// 위젯 전용 레이아웃 — NavHeader 없음, 최소 크기
// SSOT: specs/003-frontend/widget-spec.md 섹션 4

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
