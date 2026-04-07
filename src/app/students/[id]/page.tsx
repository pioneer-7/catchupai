// 학생 상세 페이지 — SSOT: specs/003-frontend/student-detail-spec.md
export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6">학생 상세</h1>
      <p className="text-gray-500">학생 ID: {id} — 구현 예정</p>
    </main>
  );
}
