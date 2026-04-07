// 샘플 데이터 상수
// SSOT: specs/001-domain/data-model.md 섹션 5

export const SAMPLE_COURSE = {
  title: '데이터분석 기초',
  description: '데이터 분석의 기본 개념과 실습을 다루는 과정입니다. 회귀분석, 데이터 시각화, 기초 통계를 학습합니다.',
};

export const SAMPLE_MATERIAL_TEXT = `데이터분석 기초 — 강의자료 요약

1장. 데이터란 무엇인가
데이터는 관찰이나 측정을 통해 수집된 값의 집합입니다. 정량적 데이터(수치형)와 정성적 데이터(범주형)로 나뉩니다. 데이터 분석의 첫 단계는 데이터의 유형을 파악하고 적절한 분석 방법을 선택하는 것입니다.

2장. 기초 통계
평균(mean)은 모든 값의 합을 개수로 나눈 것이고, 중앙값(median)은 정렬했을 때 가운데 값입니다. 표준편차(standard deviation)는 데이터가 평균에서 얼마나 퍼져 있는지를 나타냅니다. 이상치(outlier)가 있을 때는 중앙값이 평균보다 더 대표적인 값일 수 있습니다.

3장. 회귀분석
회귀분석은 독립변수(설명변수)와 종속변수(반응변수) 간의 관계를 모델링하는 기법입니다. 단순 선형 회귀는 y = ax + b 형태로, 입력 변수 x를 사용해 예측 대상 y의 값을 예측합니다. 결정계수(R²)는 모델이 데이터를 얼마나 잘 설명하는지 0에서 1 사이의 값으로 나타냅니다.

4장. 데이터 시각화
막대 그래프는 범주형 데이터 비교에, 산점도는 두 변수 간 관계 파악에, 히스토그램은 연속형 데이터의 분포 확인에 사용합니다. 시각화의 목적은 데이터 속 숨겨진 패턴을 빠르게 발견하는 것입니다.

5장. 데이터 전처리
결측값(missing value) 처리, 이상치 제거, 정규화(normalization) 등의 전처리 과정을 거쳐야 분석 결과의 신뢰도가 높아집니다. 결측값은 삭제하거나 평균/중앙값으로 대체할 수 있습니다.`;

export const SAMPLE_STUDENTS = [
  // at_risk (2명)
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
  // warning (3명)
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
    name: '한예린',
    email: 'yerin@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 75,
    missed_sessions: 2,
    assignment_submission_rate: 65,
    avg_quiz_score: 55,
    last_active_days_ago: 4,
    notes: '퀴즈 점수 하락 추세',
  },
  {
    name: '정도윤',
    email: 'doyun@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 85,
    missed_sessions: 1,
    assignment_submission_rate: 60,
    avg_quiz_score: 72,
    last_active_days_ago: 8,
    notes: '과제 제출률이 낮아지는 중',
  },
  // stable (3명)
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
    name: '오시현',
    email: 'sihyun@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 95,
    missed_sessions: 0,
    assignment_submission_rate: 88,
    avg_quiz_score: 90,
    last_active_days_ago: 0,
    notes: '우수 학생',
  },
  {
    name: '강하준',
    email: 'hajun@example.com',
    cohort_name: '데이터분석 1기',
    attendance_rate: 92,
    missed_sessions: 0,
    assignment_submission_rate: 85,
    avg_quiz_score: 78,
    last_active_days_ago: 2,
    notes: '꾸준한 참여',
  },
];
