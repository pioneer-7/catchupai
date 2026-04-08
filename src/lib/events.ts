// 이벤트 타입 정의
// SSOT: specs/004-backend/webhook-spec.md 섹션 2

export type EventType =
  | 'student.risk_level_changed'
  | 'recovery_plan.created'
  | 'assessment.submitted'
  | 'student.imported';

export interface DomainEvent {
  event: EventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export function createEvent(event: EventType, data: Record<string, unknown>): DomainEvent {
  return {
    event,
    timestamp: new Date().toISOString(),
    data,
  };
}
