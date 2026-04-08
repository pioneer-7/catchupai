'use client';

// AI 코칭 챗봇 UI — 스트리밍 + 마크다운 렌더링
// SSOT: specs/005-ai/chat-spec.md 섹션 6

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatBox({ studentId }: { studentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streaming]);

  async function handleSend() {
    const text = input.trim();
    if (!text || streaming) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setStreaming(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch(`/api/students/${studentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          setMessages(prev => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'assistant' && !last.content) {
          updated[updated.length - 1] = { ...last, content: '응답 중 오류가 발생했어요. 다시 시도해주세요.' };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-warm)]">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎓</span>
          <div>
            <h3 className="text-sm font-bold">AI 교육 어시스턴트</h3>
            <p className="text-xs text-[var(--text-muted)]">학생 개입 전략 · 교수법 조언</p>
          </div>
          {streaming && (
            <span className="ml-auto px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[var(--accent-light)] text-[var(--accent-text)]">
              응답 중
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="px-6 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: 480, minHeight: 200 }}>
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-3xl mb-3">👋</p>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              이 학생에 대한 개입 전략을 도와드리는 AI 어시스턴트입니다.
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              학생 상태, 개입 방법, 메시지 작성 등을 물어보세요.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {['이 학생에게 어떻게 개입하면 좋을까요?', '회복학습 플랜을 쉽게 설명해줘', '학부모 상담 포인트 알려줘'].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus(); }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--bg-warm)] text-[var(--text-secondary)] hover:bg-[var(--bg-warm-hover)] transition btn-press"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-sm mr-2 mt-1">
                🎓
              </div>
            )}
            <div className={msg.role === 'user' ? 'msg-bubble msg-bubble-user' : 'msg-bubble msg-bubble-assistant'}>
              {msg.role === 'assistant' ? (
                msg.content ? (
                  <div className="chat-md">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                )
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-[var(--border)]">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="질문을 입력하세요..."
            disabled={streaming}
            className="flex-1 input-base disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-[var(--radius-button)] font-semibold hover:bg-[var(--accent-hover)] transition btn-press focus-ring disabled:opacity-40"
          >
            {streaming ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
            ) : '전송'}
          </button>
        </div>
      </div>
    </section>
  );
}
