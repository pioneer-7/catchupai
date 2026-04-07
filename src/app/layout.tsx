import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavHeader } from "@/components/NavHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CatchUp AI — 학습 이탈 방지 AI 코파일럿",
  description: "수업을 놓친 학생을 조기에 발견하고, 개인 맞춤형 회복학습 경로를 생성해주는 교육 현장용 AI 코파일럿",
  openGraph: {
    title: "CatchUp AI",
    description: "학습 이탈 방지 AI 코파일럿 — 위험 학습자 조기 탐지, 맞춤 회복학습, 개입 메시지 자동 생성",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NavHeader />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
