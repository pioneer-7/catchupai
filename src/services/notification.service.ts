// Notification Service — 알림 생성 + 조회
// SSOT: specs/004-backend/notification-spec.md

import { notificationRepository } from '@/repositories/notification.repository';

export const notificationService = {
  async getUnread(userId: string) {
    return notificationRepository.findUnreadByUser(userId);
  },

  async getRecent(userId: string) {
    return notificationRepository.findRecentByUser(userId);
  },

  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId);
  },

  async markAsRead(notificationId: string, userId?: string) {
    return notificationRepository.markAsRead(notificationId, userId);
  },

  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  },

  // 이벤트 트리거 — 서비스에서 호출
  async notifyRiskDetected(userId: string, orgId: string, studentName: string, link: string) {
    return notificationRepository.create({
      user_id: userId,
      org_id: orgId,
      type: 'risk_detected',
      title: '위험 학생 감지',
      message: `${studentName} 학생이 위험 상태로 전환되었습니다.`,
      link,
    });
  },

  async notifyPredictionCritical(userId: string, orgId: string, studentName: string, score: number, link: string) {
    return notificationRepository.create({
      user_id: userId,
      org_id: orgId,
      type: 'prediction_critical',
      title: '이탈 위험 경고',
      message: `${studentName} 학생의 이탈 확률이 ${Math.round(score * 100)}%입니다.`,
      link,
    });
  },

  async notifyRecoveryCreated(userId: string, orgId: string, studentName: string, link: string) {
    return notificationRepository.create({
      user_id: userId,
      org_id: orgId,
      type: 'recovery_created',
      title: '회복학습 생성 완료',
      message: `${studentName} 학생의 회복학습 플랜이 생성되었습니다.`,
      link,
    });
  },

  async notifyAssessmentGraded(userId: string, orgId: string, studentName: string, score: number, total: number, link: string) {
    return notificationRepository.create({
      user_id: userId,
      org_id: orgId,
      type: 'assessment_graded',
      title: '미니 진단 채점 완료',
      message: `${studentName} 학생: ${score}/${total} 정답`,
      link,
    });
  },
};
