// 학생 활동 타임라인 — 시간순 이벤트 로그

import type { RecoveryPlan, InterventionMessage, MiniAssessment } from '@/types';

interface TimelineEvent {
  id: string;
  type: 'recovery' | 'message' | 'assessment';
  title: string;
  description: string;
  timestamp: string;
}

const TYPE_CONFIG = {
  recovery: { icon: '📚', color: 'var(--tint-blue)', textColor: 'var(--tint-blue-text)', label: '회복학습' },
  message: { icon: '💬', color: 'var(--tint-purple)', textColor: 'var(--tint-purple-text)', label: '개입 메시지' },
  assessment: { icon: '✏️', color: 'var(--tint-orange)', textColor: 'var(--tint-orange-text)', label: '미니 진단' },
};

function buildEvents(
  plans: RecoveryPlan[],
  messages: InterventionMessage[],
  assessments: MiniAssessment[]
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const p of plans) {
    events.push({
      id: p.id,
      type: 'recovery',
      title: '회복학습 플랜 생성',
      description: p.missed_concepts_summary.slice(0, 80) + (p.missed_concepts_summary.length > 80 ? '...' : ''),
      timestamp: p.created_at,
    });
  }

  for (const m of messages) {
    events.push({
      id: m.id,
      type: 'message',
      title: '개입 메시지 생성',
      description: m.content.slice(0, 80) + (m.content.length > 80 ? '...' : ''),
      timestamp: m.created_at,
    });
  }

  for (const a of assessments) {
    const scored = a.score !== null;
    events.push({
      id: a.id,
      type: 'assessment',
      title: scored ? `미니 진단 완료 (${a.score}/3 정답)` : '미니 진단 생성',
      description: scored
        ? `${a.score}개 정답으로 채점 완료`
        : `3문항 진단이 생성되었습니다`,
      timestamp: a.submitted_at || a.created_at,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${month}/${day} ${hour}:${min}`;
}

export function ActivityTimeline({
  recoveryPlans,
  interventionMessages,
  miniAssessments,
}: {
  recoveryPlans: RecoveryPlan[];
  interventionMessages: InterventionMessage[];
  miniAssessments: MiniAssessment[];
}) {
  const events = buildEvents(recoveryPlans, interventionMessages, miniAssessments);

  if (events.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg heading-md mb-6">활동 기록</h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-[var(--border)]" />

        <div className="space-y-4">
          {events.map(event => {
            const config = TYPE_CONFIG[event.type];
            return (
              <div key={event.id} className="relative flex gap-4 pl-12">
                {/* Icon */}
                <div
                  className="absolute left-2 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ backgroundColor: config.color }}
                >
                  {config.icon}
                </div>
                {/* Content */}
                <div className="card p-4 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: config.color, color: config.textColor }}
                      >
                        {config.label}
                      </span>
                      <span className="text-sm font-semibold">{event.title}</span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">{formatTime(event.timestamp)}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{event.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
