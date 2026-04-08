// 위젯: 개별 학생 카드 — iframe 삽입용
// SSOT: specs/003-frontend/widget-spec.md 섹션 2.2

import { Suspense } from 'react';
import StudentCardContent from './content';

export default function StudentCardWidget() {
  return (
    <Suspense fallback={<div className="p-5"><div className="h-6 w-24 rounded bg-gray-100 animate-pulse" /></div>}>
      <StudentCardContent />
    </Suspense>
  );
}
