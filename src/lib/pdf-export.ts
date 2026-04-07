// 회복학습 PDF 내보내기 — 브라우저 print API 활용 (라이브러리 불필요)

import type { RecoveryPlan, Student, StudentProgress } from '@/types';

export function exportRecoveryPlanPDF(
  student: Student,
  progress: StudentProgress,
  plan: RecoveryPlan
) {
  const riskLabel = progress.risk_level === 'at_risk' ? '위험' : progress.risk_level === 'warning' ? '주의' : '안정';
  const date = new Date(plan.created_at).toLocaleDateString('ko-KR');

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>${student.name} — 회복학습 플랜</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 2px solid #0075de; padding-bottom: 16px; margin-bottom: 24px; }
    .header h1 { font-size: 24px; color: #0075de; }
    .header p { font-size: 14px; color: #615d59; margin-top: 4px; }
    .info { display: flex; gap: 24px; margin-bottom: 24px; }
    .info-item { background: #f6f5f4; padding: 12px 16px; border-radius: 8px; flex: 1; }
    .info-item .label { font-size: 12px; color: #615d59; }
    .info-item .value { font-size: 18px; font-weight: 700; margin-top: 4px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 16px; font-weight: 700; color: #0075de; margin-bottom: 12px; border-left: 3px solid #0075de; padding-left: 12px; }
    .section p { font-size: 14px; line-height: 1.6; color: #31302e; }
    .steps { display: flex; gap: 16px; margin-bottom: 24px; }
    .step { flex: 1; background: #f6f5f4; border-radius: 8px; padding: 16px; }
    .step-num { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; background: #0075de; color: white; border-radius: 50%; font-size: 12px; font-weight: 700; }
    .step h3 { font-size: 14px; font-weight: 700; margin-top: 8px; }
    .step p { font-size: 13px; color: #615d59; margin-top: 4px; line-height: 1.5; }
    .caution { background: #fff3e0; border-left: 3px solid #dd5b00; padding: 12px 16px; border-radius: 0 8px 8px 0; }
    .caution h2 { color: #dd5b00; border-left: none; padding-left: 0; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #a39e98; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>CatchUp AI — 회복학습 플랜</h1>
    <p>생성일: ${date}</p>
  </div>

  <div class="info">
    <div class="info-item">
      <div class="label">학생</div>
      <div class="value">${student.name}</div>
    </div>
    <div class="info-item">
      <div class="label">위험도</div>
      <div class="value">${riskLabel} (${progress.risk_score}점)</div>
    </div>
    <div class="info-item">
      <div class="label">반</div>
      <div class="value">${student.cohort_name || '-'}</div>
    </div>
  </div>

  <div class="section">
    <h2>놓친 개념 요약</h2>
    <p>${plan.missed_concepts_summary}</p>
  </div>

  <div class="steps">
    ${plan.recovery_steps_json.map(s => `
    <div class="step">
      <span class="step-num">${s.step}</span>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
    </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>액션 플랜</h2>
    <p>${plan.action_plan_text}</p>
  </div>

  ${plan.caution_points_text ? `
  <div class="caution">
    <h2>주의 포인트</h2>
    <p>${plan.caution_points_text}</p>
  </div>
  ` : ''}

  <div class="footer">
    CatchUp AI — 학습 이탈 방지 AI 코파일럿 | 이 문서는 AI에 의해 자동 생성되었습니다
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.print();
}
