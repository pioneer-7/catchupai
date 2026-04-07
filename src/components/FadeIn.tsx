'use client';

// 등장 애니메이션 래퍼 — fade-in + slide-up, stagger 지원

import { useEffect, useRef, useState, type ReactNode } from 'react';

export function FadeIn({
  children,
  delay = 0,
  duration = 400,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}

// Staggered children — 각 child에 순차 딜레이
export function FadeInStagger({
  children,
  staggerMs = 60,
  className = '',
}: {
  children: ReactNode[];
  staggerMs?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <FadeIn key={i} delay={i * staggerMs}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}
