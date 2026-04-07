# AI 프롬프트 명세

> **SSOT 문서** — 시스템 프롬프트, 생성 타입별 user prompt 템플릿, 출력 형식

---

## 1. 공통 원칙

- AI는 위험도 계산을 하지 않는다.
- 입력 데이터에 없는 사실을 추측하지 않는다.
- 학생을 낙인찍지 않는다.
- 짧고 실행 가능한 결과를 생성한다.
- 결과는 UI에 그대로 렌더링할 수 있게 구조화한다.

---

## 2. 공통 시스템 프롬프트

```text
You are an educational recovery learning assistant.
Your job is to help teachers and operators support students who are at risk of falling behind.
Use only the provided course material and student progress data.
Do not speculate about personality, family, health, or private circumstances.
Do not shame or label the student.
Be concise, practical, and supportive.
Return output in the exact requested format.
```

---

## 3. 공통 입력 컨텍스트

모든 생성 작업에 포함:

- `course_title`
- `course_material_excerpt`
- `student_name`
- `risk_level`
- `risk_score`
- `attendance_rate`
- `missed_sessions`
- `assignment_submission_rate`
- `avg_quiz_score`
- `last_active_days_ago`
- `risk_factors`

---

## 4. 위험 원인 설명 프롬프트

### 목적

학생이 왜 주의/위험 상태인지 2~4문장으로 설명한다.

### user prompt template

```text
Generate a short risk explanation for the student.

Course: {{course_title}}
Student name: {{student_name}}
Risk level: {{risk_level}}
Risk score: {{risk_score}}
Attendance rate: {{attendance_rate}}
Missed sessions: {{missed_sessions}}
Assignment submission rate: {{assignment_submission_rate}}
Average quiz score: {{avg_quiz_score}}
Last active days ago: {{last_active_days_ago}}
Risk factors: {{risk_factors}}

Requirements:
- 2 to 4 sentences
- Explain only using the provided data
- Use a supportive and professional tone
- Do not exaggerate
- Respond in Korean
```

### 출력 형식

```json
{
  "summary": "최근 결석과 과제 제출 저하가 함께 나타나 학습 공백이 커질 가능성이 있습니다. 최근 활동도 줄어 빠른 개입이 필요한 상태입니다."
}
```

---

## 5. 회복학습 킷 생성 프롬프트

### 목적

학생 맞춤형 회복학습 플랜 생성

### user prompt template

```text
Create a recovery learning kit for the student.

Course: {{course_title}}
Course material excerpt:
{{course_material_excerpt}}

Student name: {{student_name}}
Risk level: {{risk_level}}
Risk score: {{risk_score}}
Attendance rate: {{attendance_rate}}
Missed sessions: {{missed_sessions}}
Assignment submission rate: {{assignment_submission_rate}}
Average quiz score: {{avg_quiz_score}}
Last active days ago: {{last_active_days_ago}}
Risk factors: {{risk_factors}}

Requirements:
- Focus on helping the student catch up quickly
- Summarize missed concepts in simple language
- Provide exactly 3 recovery steps
- Provide a short 10-15 minute action plan
- Provide caution points or common mistakes
- Respond in Korean
- Return valid JSON only
```

### 출력 형식

```json
{
  "missed_concepts_summary": "학생은 회귀분석의 목적과 입력 변수의 의미를 다시 정리할 필요가 있습니다.",
  "recovery_steps": [
    {
      "step": 1,
      "title": "핵심 개념 다시 읽기",
      "description": "회귀분석이 무엇을 예측하는지와 입력 변수의 역할을 먼저 복습합니다."
    },
    {
      "step": 2,
      "title": "짧은 예제로 확인",
      "description": "작은 예제로 독립변수와 종속변수를 구분해봅니다."
    },
    {
      "step": 3,
      "title": "직접 한 문제 풀기",
      "description": "간단한 데이터를 보고 어떤 값을 예측해야 하는지 말해봅니다."
    }
  ],
  "action_plan_text": "먼저 5분 동안 핵심 개념을 다시 읽고, 5분 동안 예제를 확인한 뒤, 마지막 5분 동안 직접 한 문제를 풀어보세요.",
  "caution_points_text": "입력 변수와 예측 대상 변수를 혼동하지 않도록 주의하세요."
}
```

---

## 6. 미니 진단 생성 프롬프트

### 목적

회복 여부 확인용 3문항 생성

### user prompt template

```text
Create a mini assessment with exactly 3 questions.

Course: {{course_title}}
Course material excerpt:
{{course_material_excerpt}}

Student name: {{student_name}}
Recovery target summary: {{missed_concepts_summary}}

Requirements:
- Exactly 3 questions
- Mix multiple choice and short answer if appropriate
- Questions must match the recovery content
- Include answer key and short explanations
- Respond in Korean
- Return valid JSON only
```

### 출력 형식

```json
{
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "회귀분석의 가장 기본 목적은 무엇인가요?",
      "options": ["분류", "예측", "정렬", "압축"]
    },
    {
      "id": 2,
      "type": "short_answer",
      "question": "입력 변수와 예측 대상 변수의 차이를 한 문장으로 설명하세요."
    },
    {
      "id": 3,
      "type": "multiple_choice",
      "question": "독립변수에 해당하는 것은 무엇인가요?",
      "options": ["예측 결과", "입력 데이터", "오차", "라벨 없음"]
    }
  ],
  "answer_key": [
    { "id": 1, "answer": "예측" },
    { "id": 2, "answer": "입력 변수는 예측에 사용하는 값이고 예측 대상 변수는 맞히려는 값입니다." },
    { "id": 3, "answer": "입력 데이터" }
  ],
  "explanations": [
    { "id": 1, "explanation": "회귀분석은 주로 연속적인 값을 예측하는 데 사용됩니다." },
    { "id": 2, "explanation": "두 변수의 역할을 구분하는 것이 기본입니다." },
    { "id": 3, "explanation": "독립변수는 모델이 참고하는 입력값입니다." }
  ]
}
```

---

## 7. 개입 메시지 생성 프롬프트

### 목적

교강사/운영자가 학생에게 보낼 짧은 메시지 초안 생성

### user prompt template

```text
Write a supportive intervention message for a student.

Student name: {{student_name}}
Risk level: {{risk_level}}
Risk score: {{risk_score}}
Risk factors: {{risk_factors}}
Recovery summary: {{missed_concepts_summary}}

Requirements:
- 3 to 6 sentences
- Warm, supportive, non-judgmental tone
- Encourage a small next step
- Do not shame the student
- Do not mention sensitive speculation
- Respond in Korean
- Return valid JSON only
```

### 출력 형식

```json
{
  "message": "최근 학습 공백이 조금 생긴 것으로 보여서, 부담 없이 다시 시작할 수 있도록 짧은 따라잡기 플랜을 준비했어요. 먼저 핵심 개념 요약부터 10분 정도 가볍게 확인해보면 좋아요. 바로 모든 내용을 따라잡으려 하기보다, 오늘 한 단계만 진행해도 충분합니다."
}
```

---

## Cross-references

- AI 계약 → [`001-domain/ai-contracts.md`](../001-domain/ai-contracts.md)
- 출력 스키마 상세 → [`005-ai/output-schema.md`](./output-schema.md)
- 가드레일 → [`005-ai/guardrails.md`](./guardrails.md)
- API 엔드포인트 → [`004-backend/api-spec.md`](../004-backend/api-spec.md)
