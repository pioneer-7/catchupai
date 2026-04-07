// 랜딩 페이지 — SSOT: specs/002-ux/ia-and-screens.md 섹션 2.1
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-16">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          CatchUp AI
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          수업을 놓친 학생이 완전히 이탈하기 전에,
          교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는
          회복학습 AI 코파일럿
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            샘플 데이터로 시작
          </Link>
          <Link
            href="/upload"
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            파일 업로드
          </Link>
        </div>
      </div>
    </main>
  );
}
