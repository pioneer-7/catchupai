'use client';

// 토스트 알림 — 아이콘 + 닫기 + 자동 사라짐

import { useCallback, useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
};

const COLORS: Record<ToastType, string> = {
  success: 'bg-[#31302e]',
  error: 'bg-[var(--status-risk)]',
  info: 'bg-[var(--accent)]',
};

let nextId = 0;

export function useToast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++;
    setItems(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems(prev => prev.filter(t => t.id !== id));
  }, []);

  return { items, toast, dismiss };
}

export function ToastContainer({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {items.map(item => (
        <ToastItem key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-card)] text-white text-sm font-medium shadow-lg ${COLORS[item.type]}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
        minWidth: 250,
      }}
    >
      <span className="text-base">{ICONS[item.type]}</span>
      <span className="flex-1">{item.message}</span>
      <button
        onClick={() => onDismiss(item.id)}
        className="opacity-60 hover:opacity-100 transition text-base leading-none"
      >
        ×
      </button>
    </div>
  );
}

// Legacy compat — single message
export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#31302e] text-white text-sm font-medium rounded-[var(--radius-card)] shadow-lg" style={{ minWidth: 250 }}>
        <span>✓</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
