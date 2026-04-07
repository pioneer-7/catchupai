// 샘플 데이터 상수
// SSOT: specs/001-domain/data-model.md 섹션 5

export const SAMPLE_COURSE = {
  title: '데이터분석 기초',
  description: '데이터 분석의 기본 개념과 실습을 다루는 과정입니다. 회귀분석, 데이터 시각화, 기초 통계를 학습합니다.',
};

export const SAMPLE_MATERIAL_TEXT = `데이터분석 기초 — 강의자료 요약

1장. 데이터란 무엇인가
데이터는 관찰이나 측정을 통해 수집된 값의 집합입니다. 정량적 데이터와 정성적 데이터로 나뉩니다.

2장. 기초 통계
평균, 중앙값, 표준편차 등 기초 통계 개념을 학습합니다. 데이터의 분포를 이해하는 것이 분석의 시작입니다.

3장. 회귀분석
회귀분석은 독립변수와 종속변수 간의 관계를 모델링하는 기법입니다. 입력 변수(독립변수)를 사용해 예측 대상(종속변수)의 값을 예측합니다.

4장. 데이터 시각화
막대 그래프, 산점도, 히스토그램 등을 활용해 데이터의 패턴을 시각적으로 파악합니다.`;

export const SAMPLE_STUDENTS = [
  {
    name: '김민수',
    email: 'minsu@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 62,
    missed_sessions: 2,
    assignment_submission_rate: 45,
    avg_quiz_score: 58,
    last_active_days_ago: 9,
    notes: '최근 과제 미제출이 이어짐',
  },
  {
    name: '이지은',
    email: 'jieun@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 88,
    missed_sessions: 0,
    assignment_submission_rate: 92,
    avg_quiz_score: 81,
    last_active_days_ago: 1,
    notes: '안정적 수강 중',
  },
  {
    name: '박서준',
    email: 'seojun@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 79,
    missed_sessions: 1,
    assignment_submission_rate: 70,
    avg_quiz_score: 66,
    last_active_days_ago: 5,
    notes: '기초 개념 복습 필요',
  },
  {
    name: '최수아',
    email: 'sua@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 48,
    missed_sessions: 3,
    assignment_submission_rate: 30,
    avg_quiz_score: 35,
    last_active_days_ago: 16,
    notes: '결석 및 활동 공백 심함',
  },
];
