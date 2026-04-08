// 위젯: 코스 위험 요약 — iframe 삽입용
// SSOT: specs/003-frontend/widget-spec.md 섹션 2.1

import { Suspense } from 'react';
import RiskSummaryContent from './content';

export default function RiskSummaryWidget() {
  return (
    <Suspense fallback={<div className="p-6"><div className="h-8 rounded bg-gray-100 animate-pulse" /></div>}>
      <RiskSummaryContent />
    </Suspense>
  );
}
