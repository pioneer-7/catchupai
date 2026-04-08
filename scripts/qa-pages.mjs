// 페이지별 콘텐츠 + 콘솔 로그 심층 검수
import { chromium } from 'playwright';

const BASE = 'https://carchupai.vercel.app';
const results = [];
const allConsole = [];

function log(emoji, msg) {
  console.log(`${emoji} ${msg}`);
  results.push(`${emoji} ${msg}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    allConsole.push({ page: page.url(), type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') console.log(`  🔴 [${msg.type()}] ${msg.text().slice(0, 150)}`);
  });
  page.on('pageerror', err => {
    allConsole.push({ page: page.url(), type: 'PAGE_ERROR', text: err.message });
    console.log(`  🔴 [PAGE_ERROR] ${err.message.slice(0, 150)}`);
  });

  // 먼저 샘플 데이터 로드
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const sampleBtn = await page.$('button:has-text("샘플 데이터로 시작")');
  await sampleBtn.click();
  await page.waitForURL('**/dashboard', { timeout: 30000 });
  await page.waitForSelector('text=전체 학생', { timeout: 10000 });
  log('✅', '샘플 데이터 로드 완료');

  // ═══════════════════════════════════════
  // 1. 랜딩 페이지
  // ═══════════════════════════════════════
  log('📄', '\n=== 1. 랜딩 (/) ===');
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const landingChecks = [
    { selector: 'h1', expected: 'CatchUp AI', label: 'Hero 제목' },
    { selector: 'text=학생이 이탈하기 전에', expected: true, label: 'Hero 부제' },
    { selector: 'button:has-text("샘플 데이터로 시작")', expected: true, label: '샘플 버튼' },
    { selector: 'a[href="/upload"]', expected: true, label: '업로드 링크' },
    { selector: 'text=AI 이탈 예측', expected: true, label: '기능 카드 1' },
    { selector: 'text=AI 교육 어시스턴트', expected: true, label: '기능 카드 2' },
    { selector: 'text=교육 분석 대시보드', expected: true, label: '기능 카드 3' },
    { selector: 'text=기존 LMS에 통합되는 API 플랫폼', expected: true, label: '플랫폼 섹션 제목' },
    { selector: 'text=REST API + Swagger', expected: true, label: '플랫폼 카드 1' },
    { selector: 'text=임베더블 위젯', expected: true, label: '플랫폼 카드 2' },
    { selector: 'text=Webhook 이벤트', expected: true, label: '플랫폼 카드 3' },
    { selector: 'text=LMS 데모 보기', expected: true, label: 'LMS 데모 CTA' },
    { selector: 'header nav', expected: false, label: 'NavHeader 숨김' },
  ];

  for (const c of landingChecks) {
    const el = await page.$(c.selector);
    if (c.expected === false) {
      log(!el ? '✅' : '❌', `  ${c.label}: ${!el ? '정상 숨김' : '보여선 안 됨'}`);
    } else if (typeof c.expected === 'string') {
      const text = el ? await el.textContent() : null;
      log(text?.includes(c.expected) ? '✅' : '❌', `  ${c.label}: "${text?.slice(0, 50)}"`);
    } else {
      log(el ? '✅' : '❌', `  ${c.label}`);
    }
  }

  // ═══════════════════════════════════════
  // 2. 대시보드
  // ═══════════════════════════════════════
  log('📄', '\n=== 2. 대시보드 (/dashboard) ===');
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=전체 학생', { timeout: 10000 });
  await page.waitForTimeout(1500);

  const dashChecks = [
    { selector: 'text=대시보드', expected: true, label: '페이지 제목' },
    { selector: 'text=전체 학생', expected: true, label: 'KPI: 전체 학생' },
    { selector: 'text=안정', expected: true, label: 'KPI: 안정' },
    { selector: 'text=주의', expected: true, label: 'KPI: 주의' },
    { selector: 'text=위험', expected: true, label: 'KPI: 위험' },
    { selector: 'svg circle', expected: true, label: '도넛 차트 SVG' },
    { selector: 'text=위험도 분포', expected: true, label: '차트 제목' },
    { selector: 'text=위험도 높은 학생', expected: true, label: 'Top-N 섹션 제목' },
    { selector: 'a[href^="/students/"]', expected: true, label: '학생 링크' },
    { selector: 'text=학생 전체 보기', expected: true, label: '전체 보기 버튼' },
    { selector: 'header nav', expected: true, label: 'NavHeader 표시' },
    { selector: 'text=개발자', expected: true, label: '개발자 메뉴' },
    { selector: 'text=데모 리셋', expected: true, label: '데모 리셋 버튼' },
  ];

  for (const c of dashChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  // ═══════════════════════════════════════
  // 3. 학생 목록
  // ═══════════════════════════════════════
  log('📄', '\n=== 3. 학생 목록 (/students) ===');
  await page.goto(`${BASE}/students`, { waitUntil: 'networkidle' });
  await page.waitForSelector('table', { timeout: 10000 });

  const listChecks = [
    { selector: 'text=학생 목록', expected: true, label: '페이지 제목' },
    { selector: 'input[placeholder*="검색"]', expected: true, label: '검색 입력' },
    { selector: 'button:has-text("전체")', expected: true, label: '필터: 전체' },
    { selector: 'button:has-text("안정")', expected: true, label: '필터: 안정' },
    { selector: 'button:has-text("주의")', expected: true, label: '필터: 주의' },
    { selector: 'button:has-text("위험")', expected: true, label: '필터: 위험' },
    { selector: 'table thead', expected: true, label: '테이블 헤더' },
  ];

  for (const c of listChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  const rows = await page.$$('table tbody tr');
  log(rows.length === 8 ? '✅' : '❌', `  학생 행: ${rows.length}개 (기대: 8)`);

  // 테이블 컬럼 확인
  const headers = await page.$$eval('table thead th', ths => ths.map(th => th.textContent?.trim()));
  log('📋', `  테이블 컬럼: ${headers.join(' | ')}`);

  // ═══════════════════════════════════════
  // 4. 학생 상세
  // ═══════════════════════════════════════
  log('📄', '\n=== 4. 학생 상세 (/students/[id]) ===');
  const firstLink = await page.$('a:has-text("상세")');
  const detailHref = await firstLink.getAttribute('href');
  await page.goto(`${BASE}${detailHref}`, { waitUntil: 'networkidle' });
  await page.waitForURL(`**${detailHref}`, { timeout: 15000 });
  await page.waitForSelector('.card h1', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const name = await page.$eval('.card h1', el => el.textContent);
  log('📋', `  학생: ${name}`);

  const detailChecks = [
    { selector: '.card h1', expected: true, label: '학생 이름' },
    { selector: 'text=위험 점수', expected: true, label: '위험 점수 라벨' },
    { selector: 'text=출석률', expected: true, label: '지표: 출석률' },
    { selector: 'text=과제 제출률', expected: true, label: '지표: 과제 제출률' },
    { selector: 'text=퀴즈 평균', expected: true, label: '지표: 퀴즈 평균' },
    { selector: 'text=최근 활동', expected: true, label: '지표: 최근 활동' },
    { selector: 'text=위험 요인', expected: true, label: '위험 요인 섹션' },
    { selector: 'text=AI 지원 액션', expected: true, label: 'AI 액션 섹션' },
    { selector: 'text=5~10초', expected: true, label: 'AI 소요 시간 안내' },
    { selector: 'button:has-text("회복학습 생성")', expected: true, label: '회복학습 버튼' },
    { selector: 'button:has-text("개입 메시지")', expected: true, label: '메시지 버튼' },
    { selector: 'button:has-text("미니 진단")', expected: true, label: '진단 버튼' },
    { selector: 'button:has-text("전체 생성")', expected: true, label: '전체 생성 버튼' },
    { selector: 'text=학생 목록', expected: true, label: '뒤로가기 링크' },
  ];

  for (const c of detailChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  // ═══════════════════════════════════════
  // 5. 업로드 페이지
  // ═══════════════════════════════════════
  log('📄', '\n=== 5. 업로드 (/upload) ===');
  await page.goto(`${BASE}/upload`, { waitUntil: 'networkidle' });

  const uploadChecks = [
    { selector: 'text=데이터 업로드', expected: true, label: '페이지 제목' },
    { selector: 'text=학생 데이터 (CSV)', expected: true, label: 'CSV 카드 제목' },
    { selector: 'text=강의자료', expected: true, label: '강의자료 카드 제목' },
    { selector: 'input[type="file"][accept=".csv"]', expected: true, label: 'CSV 파일 입력' },
    { selector: 'input[type="file"][accept=".pdf,.txt"]', expected: true, label: '강의자료 파일 입력' },
    { selector: 'button:has-text("CSV 업로드")', expected: true, label: 'CSV 업로드 버튼' },
    { selector: 'button:has-text("강의자료 업로드")', expected: true, label: '강의자료 버튼' },
    { selector: 'a[href*="template.csv"]', expected: true, label: 'CSV 템플릿 다운로드' },
    { selector: 'button:has-text("샘플 데이터")', expected: true, label: '샘플 대안 버튼' },
  ];

  for (const c of uploadChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  // ═══════════════════════════════════════
  // 6. API 문서 (/docs)
  // ═══════════════════════════════════════
  log('📄', '\n=== 6. API 문서 (/docs) ===');
  await page.goto(`${BASE}/docs`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const docsChecks = [
    { selector: 'text=API Documentation', expected: true, label: '페이지 제목' },
    { selector: 'text=v1.0.0', expected: true, label: '버전 배지' },
    { selector: 'a[href="/api/v1/openapi.json"]', expected: true, label: 'OpenAPI JSON 링크' },
    { selector: 'redoc', expected: true, label: 'Redoc 컴포넌트' },
  ];

  for (const c of docsChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  // OpenAPI JSON 직접 확인
  const apiRes = await page.request.get(`${BASE}/api/v1/openapi.json`);
  const apiJson = await apiRes.json();
  log(apiJson.openapi === '3.0.0' ? '✅' : '❌', `  OpenAPI 버전: ${apiJson.openapi}`);
  log(apiJson.paths?.['/students'] ? '✅' : '❌', `  /students 엔드포인트 존재`);
  log(apiJson.paths?.['/webhooks'] ? '✅' : '❌', `  /webhooks 엔드포인트 존재`);
  log(apiJson.components?.securitySchemes?.ApiKeyAuth ? '✅' : '❌', `  API 키 인증 스키마`);

  // ═══════════════════════════════════════
  // 7. 통합 가이드 (/integration)
  // ═══════════════════════════════════════
  log('📄', '\n=== 7. 통합 가이드 (/integration) ===');
  await page.goto(`${BASE}/integration`, { waitUntil: 'networkidle' });

  const intChecks = [
    { selector: 'text=통합 가이드', expected: true, label: '페이지 제목' },
    { selector: 'text=위젯 타입', expected: true, label: '위젯 타입 라벨' },
    { selector: 'button:has-text("코스 위험 요약")', expected: true, label: '위젯 타입 1' },
    { selector: 'button:has-text("학생 카드")', expected: true, label: '위젯 타입 2' },
    { selector: 'text=API 키', expected: true, label: 'API 키 입력 라벨' },
    { selector: 'text=Embed 코드', expected: true, label: 'Embed 코드 라벨' },
    { selector: 'button:has-text("복사")', expected: true, label: '복사 버튼' },
    { selector: 'text=미리보기', expected: true, label: '미리보기 라벨' },
    { selector: 'iframe', expected: true, label: 'iframe 미리보기' },
    { selector: 'a[href="/docs"]', expected: true, label: 'API 문서 링크' },
    { selector: 'a[href="/demo/lms"]', expected: true, label: 'LMS 데모 링크' },
  ];

  for (const c of intChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  // ═══════════════════════════════════════
  // 8. LMS 데모 (/demo/lms)
  // ═══════════════════════════════════════
  log('📄', '\n=== 8. LMS 데모 (/demo/lms) ===');
  await page.goto(`${BASE}/demo/lms`, { waitUntil: 'networkidle' });

  const lmsChecks = [
    { selector: 'text=EduLMS', expected: true, label: '가상 LMS 헤더' },
    { selector: 'text=CatchUp AI', expected: true, label: 'CatchUp 메뉴 항목' },
    { selector: 'text=CatchUp AI 통합 데모', expected: true, label: '안내 배너' },
    { selector: 'text=데이터분석 기초', expected: true, label: '과정 카드' },
    { selector: 'text=CatchUp AI Widget', expected: true, label: '위젯 라벨' },
    { selector: 'iframe[src*="widget/risk-summary"]', expected: true, label: 'risk-summary iframe' },
    { selector: 'iframe[src*="widget/student-card"]', expected: true, label: 'student-card iframe' },
    { selector: 'text=이번 주 일정', expected: true, label: 'Mock 일정 카드' },
    { selector: 'text=최근 공지', expected: true, label: 'Mock 공지 카드' },
    { selector: 'a[href="/integration"]', expected: true, label: '통합 가이드 링크' },
  ];

  for (const c of lmsChecks) {
    const el = await page.$(c.selector);
    log(el ? '✅' : '❌', `  ${c.label}`);
  }

  // ═══════════════════════════════════════
  // 9. 위젯 페이지 직접 접근
  // ═══════════════════════════════════════
  log('📄', '\n=== 9. 위젯 직접 접근 ===');

  await page.goto(`${BASE}/widget/risk-summary?api_key=demo`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  const riskWidget = await page.textContent('body');
  log(riskWidget?.includes('전체 학생') ? '✅' : '❌', `  risk-summary: "전체 학생" 표시`);
  log(riskWidget?.includes('Powered by CatchUp AI') ? '✅' : '❌', `  risk-summary: 푸터`);

  await page.goto(`${BASE}/widget/student-card?api_key=demo`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const cardWidget = await page.textContent('body');
  log(cardWidget?.includes('student_id가 필요합니다') ? '✅' : '❌', `  student-card: ID 미제공 시 에러 메시지`);

  await browser.close();

  // ═══════════════════════════════════════
  // 최종 리포트
  // ═══════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log('📊 페이지별 콘텐츠 검수 최종 리포트');
  console.log('═'.repeat(60));

  const passed = results.filter(r => r.includes('✅')).length;
  const failed = results.filter(r => r.includes('❌')).length;
  console.log(`\n✅ PASS: ${passed}`);
  console.log(`❌ FAIL: ${failed}`);
  console.log(`📝 총: ${passed + failed}`);

  const errors = allConsole.filter(c => c.type === 'error' || c.type === 'PAGE_ERROR');
  if (errors.length > 0) {
    console.log(`\n🔴 콘솔 에러 (${errors.length}개):`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.page.replace(BASE, '')} → ${e.text.slice(0, 150)}`));
  } else {
    console.log('\n✅ 콘솔 에러 없음');
  }

  const warns = allConsole.filter(c => c.type === 'warning');
  if (warns.length > 0) {
    console.log(`\n🟡 콘솔 경고 (${warns.length}개):`);
    warns.slice(0, 5).forEach(w => console.log(`  ${w.page.replace(BASE, '')} → ${w.text.slice(0, 120)}`));
  }
}

run();
