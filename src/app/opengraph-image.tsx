// OG Image — Next.js 이미��� 생성 (ImageResponse)

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CatchUp AI — 학습 이탈 방지 AI 코파일럿';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#0075de' }} />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 16,
            background: '#0075de',
            color: 'white',
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          C
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: '-2px',
            color: 'rgba(0,0,0,0.95)',
          }}
        >
          CatchUp AI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: '#615d59',
            marginTop: 16,
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          학습 이탈 방지 AI 코파일럿
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 40,
          }}
        >
          {['위험 탐지', 'AI 회복학습', '개입 메시지', '미니 진단'].map(f => (
            <div
              key={f}
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#0075de',
                background: '#f2f9ff',
                padding: '8px 20px',
                borderRadius: 9999,
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 14,
            color: '#a39e98',
          }}
        >
          carchupai.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
