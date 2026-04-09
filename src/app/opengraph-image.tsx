// OG Image — Next.js 이미지 생성 (ImageResponse)

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
          background: 'linear-gradient(135deg, #faf9f7 0%, #f0eee9 50%, #e8e5df 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: 'linear-gradient(90deg, #5B5BD6, #7C7CFF)' }} />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #5B5BD6, #7C7CFF)',
            color: 'white',
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          C
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: '-2px',
            color: '#1a1a1a',
          }}
        >
          CatchUp AI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#6b6b6b',
            marginTop: 14,
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          학습 이탈 방지 AI 코파���럿
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            marginTop: 44,
          }}
        >
          {[
            { num: '6', label: 'AI Features' },
            { num: '14', label: 'Pages' },
            { num: '36', label: 'Tests' },
            { num: '11', label: 'APIs' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#5B5BD6' }}>{stat.num}</div>
              <div style={{ fontSize: 14, color: '#8b8b8b', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: 28, fontSize: 14, color: '#a39e98' }}>
          carchupai.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
