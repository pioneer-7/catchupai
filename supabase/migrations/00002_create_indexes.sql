-- CatchUp AI — 인덱스 생성
-- SSOT: specs/001-domain/data-model.md 섹션 7

create index if not exists idx_student_progress_course_id
  on student_progress(course_id);

create index if not exists idx_student_progress_risk_level
  on student_progress(risk_level);

create index if not exists idx_student_progress_risk_score
  on student_progress(risk_score desc);

create index if not exists idx_recovery_plans_student_course
  on recovery_plans(student_id, course_id);

create index if not exists idx_intervention_messages_student_course
  on intervention_messages(student_id, course_id);

create index if not exists idx_mini_assessments_student_course
  on mini_assessments(student_id, course_id);
