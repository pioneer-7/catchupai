// GET /api/v1/openapi.json — OpenAPI 3.0 스펙
// SSOT: specs/004-backend/openapi-spec.md

export async function GET() {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'CatchUp AI API',
      version: '1.0.0',
      description: '학습 이탈 방지 AI 코파일럿 — 위험 학습자 탐지, 회복학습 생성, 개입 메시지, 미니 진단',
      contact: { name: 'CatchUp AI', url: 'https://carchupai.vercel.app' },
    },
    servers: [
      { url: 'https://carchupai.vercel.app/api/v1', description: 'Production' },
    ],
    security: [{ ApiKeyAuth: [] }],
    paths: {
      '/students': {
        get: {
          tags: ['Students'],
          summary: '학생 목록 조회',
          parameters: [
            { name: 'risk_level', in: 'query', schema: { type: 'string', enum: ['stable', 'warning', 'at_risk'] } },
            { name: 'search', in: 'query', schema: { type: 'string' }, description: '이름 검색' },
            { name: 'sort', in: 'query', schema: { type: 'string', default: 'risk_score' } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
          ],
          responses: {
            '200': { description: '학생 목록 + 위험도 분포 요약', content: { 'application/json': { schema: { $ref: '#/components/schemas/StudentListResponse' } } } },
          },
        },
      },
      '/students/{id}': {
        get: {
          tags: ['Students'],
          summary: '학생 상세 조회',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: '학생 상세 (progress + AI 결과물)' },
            '404': { description: '학생을 찾을 수 없음' },
          },
        },
      },
      '/students/{id}/recovery-plan': {
        post: {
          tags: ['AI Generation'],
          summary: '회복학습 플랜 생성 (AI)',
          description: 'Claude AI가 학생 데이터와 강의자료를 기반으로 3단계 맞춤 회복학습 플랜을 생성합니다.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            '200': { description: '생성된 회복학습 플랜 (놓친 개념, 3단계, 액션플랜, 주의사항)' },
            '404': { description: '학생을 찾을 수 없음' },
          },
        },
      },
      '/students/{id}/intervention-message': {
        post: {
          tags: ['AI Generation'],
          summary: '개입 메시지 생성 (AI)',
          description: '교강사/운영자가 학생에게 보낼 격려형 메시지를 AI가 자동 작성합니다.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            content: { 'application/json': { schema: { type: 'object', properties: { message_type: { type: 'string', enum: ['teacher', 'operator', 'student_support'], default: 'teacher' } } } } },
          },
          responses: { '200': { description: '생성된 개입 메시지' } },
        },
      },
      '/students/{id}/mini-assessment': {
        post: {
          tags: ['AI Generation'],
          summary: '미니 진단 생성 (AI)',
          description: '회복 확인용 3문항 진단을 AI가 자동 생성합니다.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { '200': { description: '3문항 + 정답 + 해설' } },
        },
      },
      '/students/{id}/mini-assessment/submit': {
        post: {
          tags: ['Assessment'],
          summary: '미니 진단 제출 + 채점',
          description: '학생 답안을 제출하고 자동 채점합니다. 정답 수에 따라 위험도가 재계산됩니다.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['assessment_id', 'answers'],
                  properties: {
                    assessment_id: { type: 'string', format: 'uuid' },
                    answers: { type: 'array', items: { type: 'object', properties: { id: { type: 'integer' }, answer: { type: 'string' } } } },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: '채점 결과 + risk score 변경 전/후' },
          },
        },
      },
      '/upload/sample': {
        post: { tags: ['Upload'], summary: '샘플 데이터 로드', description: '8명 학생 + 1개 과정 샘플 데이터를 로드합니다.', responses: { '200': { description: '로드 결과' } } },
      },
      '/upload/students': {
        post: { tags: ['Upload'], summary: 'CSV 업로드', description: '학생 데이터 CSV를 업로드하고 위험도를 자동 계산합니다.', requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } }, responses: { '200': { description: '처리 결과' } } },
      },
      '/upload/material': {
        post: { tags: ['Upload'], summary: '강의자료 업로드', requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } } } }, responses: { '200': { description: '업로드 결과' } } },
      },
      '/webhooks': {
        post: { tags: ['Webhooks'], summary: 'Webhook 등록', description: '이벤트 구독을 위한 Webhook URL을 등록합니다.', responses: { '200': { description: '등록된 Webhook 정보' } } },
        get: { tags: ['Webhooks'], summary: '등록된 Webhook 목록', responses: { '200': { description: 'Webhook 목록' } } },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
      },
      schemas: {
        StudentListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                students: { type: 'array', items: { $ref: '#/components/schemas/StudentSummary' } },
                total: { type: 'integer' },
                summary: { type: 'object', properties: { stable: { type: 'integer' }, warning: { type: 'integer' }, at_risk: { type: 'integer' } } },
              },
            },
          },
        },
        StudentSummary: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            risk_score: { type: 'integer', minimum: 0, maximum: 100 },
            risk_level: { type: 'string', enum: ['stable', 'warning', 'at_risk'] },
            attendance_rate: { type: 'number' },
            missed_sessions: { type: 'integer' },
            assignment_submission_rate: { type: 'number' },
            avg_quiz_score: { type: 'number' },
            last_active_days_ago: { type: 'integer' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } },
          },
        },
      },
    },
    tags: [
      { name: 'Students', description: '학생 조회' },
      { name: 'AI Generation', description: 'AI 콘텐츠 생성 (Claude)' },
      { name: 'Assessment', description: '미니 진단 ���점' },
      { name: 'Upload', description: '데이터 업로드' },
      { name: 'Webhooks', description: 'Webhook 이벤트 구독' },
    ],
  };

  return Response.json(spec, {
    headers: { 'X-API-Version': 'v1', 'Access-Control-Allow-Origin': '*' },
  });
}
