// 랜딩 페이지 — Notion Hero 스타일
// SSOT: specs/002-ux/ia-and-screens.md 섹션 2.1

import Link from 'next/link';
import { SampleDataButton } from '@/components/SampleDataButton';

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-24">
      <div className="text-center max-w-2xl">
        <h1
          className="text-5xl md:text-[64px] font-bold leading-none tracking-tight"
          style={{ letterSpacing: '-2.125px' }}
        >
          CatchUp AI
        </h1>
        <p className="mt-6 text-xl font-semibold leading-relaxed text-[#615d59]"
           style={{ letterSpacing: '-0.125px' }}
        >
          수업을 놓친 학생이 완전히 이탈하기 전에,
          교육 현장이 더 빠르고 더 정밀하게 개입할 수 있도록 돕는
          회복학습 AI 코파일럿
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <SampleDataButton />
          <Link
            href="/upload"
            className="px-6 py-3 rounded font-semibold bg-black/5 text-black/95 hover:bg-black/10 transition"
          >
            파일 업로드
          </Link>
        </div>
      </div>
    </main>
  );
}
