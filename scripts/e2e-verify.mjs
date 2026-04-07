// E2E 프로덕션 검증 스크립트
// 모든 페이지 + 버튼을 순차 확인하며 콘솔 로그 수집

import { chromium } from 'playwright';

const BASE = 'https://carchupai.vercel.app';
const results = [];
const consoleLogs = [];

function log(emoji, msg) {
  const line = `${emoji} ${msg}`;
  console.log(line);
  results.push(line);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 콘솔 로그 수집
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') console.log('  🔴 CONSOLE:', text);
  });

  page.on('pageerror', err => {
    const text = `[PAGE ERROR] ${err.message}`;
    consoleLogs.push(text);
    console.log('  🔴', text);
  });

  try {
    // ═══════════════════════════════════════════
    // 1. 랜딩 페이지 /
    // ═══════════════════════════════════════════
    log('📄', '=== 1. 랜딩 페이지 (/) ===');
    await page.goto(BASE, { waitUntil: 'networkidle' });

    const title = await page.title();
    log(title.includes('CatchUp AI') ? '✅' : '❌', `Title: "${title}"`);

    const heroText = await page.textContent('h1');
    log(heroText?.includes('CatchUp AI') ? '✅' : '❌', `Hero H1: "${heroText}"`);

    const subtitle = await page.textContent('section p');
    log(subtitle?.includes('회복학습') ? '✅' : '❌', `Subtitle 포함: "회복학습"`);

    // NavHeader는 랜딩에서 숨김
    const nav = await page.$('header nav');
    log(!nav ? '✅' : '⚠️', `NavHeader 숨김 (랜딩): ${!nav ? 'OK' : 'VISIBLE'}`);

    // 기능 소개 카드 3개
    const featureCards = await page.$$('section.bg-\\[\\#f6f5f4\\] .rounded-xl');
    log(featureCards.length === 3 ? '✅' : '❌', `기능 소개 카드: ${featureCards.length}개 (기대: 3)`);

    // "샘플 데이터로 시작" 버튼
    const sampleBtn = await page.$('button:has-text("샘플 데이터로 시작")');
    log(sampleBtn ? '✅' : '❌', `"샘플 데이터로 시작" 버튼 존재`);

    // "파일 업로드" 링크
    const uploadLink = await page.$('a[href="/upload"]');
    log(uploadLink ? '✅' : '❌', `"파일 업로드" 링크 존재`);

    // ═══════════════════════════════════════════
    // 2. 샘플 데이터 로드 → 대시보드 이동
    // ═══════════════════════════════════════════
    log('📄', '=== 2. 샘플 데이터 로드 + 대시보드 (/dashboard) ===');
    await sampleBtn.click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    log('✅', `대시보드로 이동 완료: ${page.url()}`);

    // 데이터 로딩 완료 대기 (KPI 텍스트가 나타날 때까지)
    await page.waitForSelector('text=전체 학생', { timeout: 10000 }).catch(() => null);
    await page.waitForTimeout(1000);

    // NavHeader 표시
    const dashNav = await page.$('header nav');
    log(dashNav ? '✅' : '❌', `NavHeader 표시 (대시보드)`);

    // KPI 카드 4개
    const kpiCards = await page.$$('.grid .rounded-xl');
    log(kpiCards.length >= 4 ? '✅' : '❌', `KPI 카드: ${kpiCards.length}개 (기대: 4+)`);

    // KPI 텍스트 확인
    const dashText = await page.textContent('main');
    log(dashText?.includes('전체 학생') ? '✅' : '❌', `"전체 학생" 텍스트`);
    log(dashText?.includes('안정') ? '✅' : '❌', `"안정" 텍스트`);
    log(dashText?.includes('주의') ? '✅' : '❌', `"주의" 텍스트`);
    log(dashText?.includes('위험') ? '✅' : '❌', `"위험" 텍스트`);

    // Top-N 학생 리스트
    await page.waitForSelector('a[href^="/students/"]', { timeout: 5000 }).catch(() => null);
    const topStudents = await page.$$('a[href^="/students/"]');
    log(topStudents.length >= 1 ? '✅' : '❌', `위험 학생 리스트: ${topStudents.length}명`);

    // "학생 전체 보기" 버튼
    const viewAllBtn = await page.$('a:has-text("학생 전체 보기")');
    log(viewAllBtn ? '✅' : '❌', `"학생 전체 보기" 버튼 존재`);

    // ═══════════════════════════════════════════
    // 3. 학생 목록 (/students)
    // ═══════════════════════════════════════════
    log('📄', '=== 3. 학생 목록 (/students) ===');
    await viewAllBtn.click();
    await page.waitForURL('**/students', { timeout: 10000 });
    log('✅', `학생 목록으로 이동: ${page.url()}`);

    // 테이블 렌더링 대기
    await page.waitForSelector('table', { timeout: 5000 });
    const rows = await page.$$('table tbody tr');
    log(rows.length === 8 ? '✅' : '⚠️', `학생 테이블 행: ${rows.length}개 (기대: 8)`);

    // 검색 입력
    const searchInput = await page.$('input[placeholder*="검색"]');
    log(searchInput ? '✅' : '❌', `검색 입력 존재`);

    // 필터 버튼들
    const filterBtns = await page.$$('button:has-text("전체"), button:has-text("안정"), button:has-text("주의"), button:has-text("위험")');
    log(filterBtns.length === 4 ? '✅' : '⚠️', `필터 버튼: ${filterBtns.length}개 (기대: 4)`);

    // "위험" 필터 테스트
    const riskFilterBtn = await page.$('button:has-text("위험"):not(:has-text("전체"))');
    if (riskFilterBtn) {
      await riskFilterBtn.click();
      await page.waitForTimeout(1500);
      const filteredRows = await page.$$('table tbody tr');
      log(filteredRows.length < rows.length ? '✅' : '⚠️', `위험 필터 적용: ${filteredRows.length}행 (전체 ${rows.length}에서 감소)`);

      // 전체로 복원
      const allBtn = await page.$('button:has-text("전체")');
      await allBtn?.click();
      await page.waitForTimeout(1500);
    }

    // 검색 테스트
    await searchInput.fill('김민수');
    await page.waitForTimeout(1500);
    const searchRows = await page.$$('table tbody tr');
    log(searchRows.length === 1 ? '✅' : '⚠️', `검색 "김민수": ${searchRows.length}행 (기대: 1)`);
    await searchInput.fill('');
    await page.waitForTimeout(1500);

    // "상세 보기" 링크
    const detailLinks = await page.$$('a:has-text("상세 보기")');
    log(detailLinks.length >= 1 ? '✅' : '❌', `"상세 보기" 링크: ${detailLinks.length}개`);

    // ═══════════════════════════════════════════
    // 4. 학생 상세 (/students/[id]) — 첫 번째 학생 (가장 위험)
    // ═══════════════════════════════════════════
    log('📄', '=== 4. 학생 상세 (/students/[id]) ===');
    await detailLinks[0].click();
    await page.waitForURL('**/students/**', { timeout: 10000 });
    log('✅', `학생 상세로 이동: ${page.url()}`);

    // 학생 이름 표시
    await page.waitForSelector('h1', { timeout: 5000 });
    const studentName = await page.textContent('h1');
    log(studentName ? '✅' : '❌', `학생 이름: "${studentName}"`);

    // 위험 배지
    const riskBadge = await page.$('.rounded-full');
    log(riskBadge ? '✅' : '❌', `위험 배지 표시`);

    // 4 지표 카드
    const metricCards = await page.$$('.grid .rounded-xl');
    log(metricCards.length >= 4 ? '✅' : '⚠️', `지표 카드: ${metricCards.length}개 (기대: 4)`);

    // 위험 요인 태그
    const riskTags = await page.$$('.flex.flex-wrap .rounded-full');
    log(riskTags.length >= 1 ? '✅' : '⚠️', `위험 요인 태그: ${riskTags.length}개`);

    // "약 5~10초" 안내 텍스트
    const hintText = await page.textContent('main');
    log(hintText?.includes('5~10초') ? '✅' : '⚠️', `AI 소요 시간 안내 텍스트`);

    // ─── 회복학습 생성 버튼 ───
    log('🔘', '--- 회복학습 생성 버튼 ---');
    const recoveryBtn = await page.$('button:has-text("회복학습 생성")');
    log(recoveryBtn ? '✅' : '❌', `"회복학습 생성" 버튼 존재`);
    await recoveryBtn.click();
    await page.waitForTimeout(1000);

    // 결과 대기 (fallback이라 빠름, AI면 ~10초)
    await page.waitForSelector('text=회복학습 플랜', { timeout: 20000 }).catch(() => null);
    await page.waitForTimeout(500);
    const recoverySection = await page.textContent('main');
    const hasRecovery = recoverySection?.includes('회복학습 플랜') || recoverySection?.includes('놓친 개념');
    log(hasRecovery ? '✅' : '❌', `회복학습 결과 표시`);

    // 3단계 스텝 확인
    const stepNumbers = await page.$$('.rounded-full.bg-\\[\\#0075de\\]');
    log(stepNumbers.length === 3 ? '✅' : '⚠️', `3단계 스텝 번호: ${stepNumbers.length}개`);

    // ─── 개입 메시지 생성 버튼 ───
    log('🔘', '--- 개입 메시지 생성 버튼 ---');
    const messageBtn = await page.$('button:has-text("개입 메시지")');
    log(messageBtn ? '✅' : '❌', `"개입 메시지 생성" 버튼 존재`);
    await messageBtn.click();
    await page.waitForTimeout(3000);

    const messageSection = await page.textContent('main');
    const hasMessage = messageSection?.includes('개입 메시지') && messageSection?.includes('메시지 복사');
    log(hasMessage ? '✅' : '❌', `개입 메시지 + 복사 버튼 표시`);

    // 복사 버튼 클릭
    const copyBtn = await page.$('button:has-text("메시지 복사")');
    if (copyBtn) {
      // clipboard API는 headless에서 제한될 수 있으므로 버튼 존재만 확인
      log('✅', `"메시지 복사" 버튼 존재`);
    }

    // ─── 미니 진단 생성 버튼 ───
    log('🔘', '--- 미니 진단 생성 버튼 ---');
    const assessmentBtn = await page.$('button:has-text("미니 진단")');
    log(assessmentBtn ? '✅' : '❌', `"미니 진단 생성" 버튼 존재`);
    await assessmentBtn.click();
    await page.waitForTimeout(3000);

    // 3문항 확인
    const questions = await page.$$('text=/Q[0-9]/');
    log(questions.length === 3 ? '✅' : '⚠️', `미니 진단 문항: ${questions.length}개 (기대: 3)`);

    // 객관식 radio 버튼 확인
    const radios = await page.$$('input[type="radio"]');
    log(radios.length >= 1 ? '✅' : '⚠️', `객관식 radio 버튼: ${radios.length}개`);

    // 답안 입력 — 첫 번째 객관식 선택
    if (radios.length > 0) {
      await radios[0].click();
      log('✅', '객관식 1번 선택');
    }

    // 나머지 문항 답변 (radio 또는 text input)
    const allRadioGroups = await page.$$('input[type="radio"]');
    const textInputs = await page.$$('input[type="text"][placeholder*="답변"]');

    // 각 문항의 첫 번째 옵션 선택
    const answeredQ = new Set();
    for (const radio of allRadioGroups) {
      const name = await radio.getAttribute('name');
      if (name && !answeredQ.has(name)) {
        await radio.click();
        answeredQ.add(name);
      }
    }
    // 단답형 입력
    for (const input of textInputs) {
      await input.fill('예측');
    }
    log('✅', `답변 입력 완료 (radio: ${answeredQ.size}개, text: ${textInputs.length}개)`);

    // 제출 버튼
    const submitBtn = await page.$('button:has-text("답안 제출")');
    log(submitBtn ? '✅' : '❌', `"답안 제출" 버튼 존재`);

    if (submitBtn) {
      const isDisabled = await submitBtn.isDisabled();
      log(!isDisabled ? '✅' : '⚠️', `제출 버튼 활성화: ${!isDisabled}`);

      if (!isDisabled) {
        await submitBtn.click();
        await page.waitForTimeout(3000);

        // 결과 표시 확인
        const resultText = await page.textContent('main');
        const hasResult = resultText?.includes('진단 결과') || resultText?.includes('정답 수');
        log(hasResult ? '✅' : '❌', `진단 결과 표시`);

        const hasScoreChange = resultText?.includes('변경 전') && resultText?.includes('변경 후');
        log(hasScoreChange ? '✅' : '❌', `위험 점수 변화 표시 (변경 전/후)`);
      }
    }

    // ═══════════════════════════════════════════
    // 5. 업로드 페이지 (/upload)
    // ═══════════════════════════════════════════
    log('📄', '=== 5. 업로드 페이지 (/upload) ===');
    await page.goto(`${BASE}/upload`, { waitUntil: 'networkidle' });

    const uploadTitle = await page.textContent('h1');
    log(uploadTitle?.includes('업로드') ? '✅' : '❌', `업로드 제목: "${uploadTitle}"`);

    // CSV 업로드 카드
    const csvCard = await page.$('text=학생 데이터 (CSV)');
    log(csvCard ? '✅' : '❌', `CSV 업로드 카드 존재`);

    // 강의자료 업로드 카드
    const materialCard = await page.$('text=강의자료');
    log(materialCard ? '✅' : '❌', `강의자료 업로드 카드 존재`);

    // 파일 입력
    const fileInputs = await page.$$('input[type="file"]');
    log(fileInputs.length === 2 ? '✅' : '⚠️', `파일 입력: ${fileInputs.length}개 (기대: 2)`);

    // CSV 업로드 버튼 (비활성)
    const csvUploadBtn = await page.$('button:has-text("CSV 업로드")');
    if (csvUploadBtn) {
      const disabled = await csvUploadBtn.isDisabled();
      log(disabled ? '✅' : '⚠️', `CSV 업로드 버튼 비활성 (파일 미선택): ${disabled}`);
    }

    // "샘플 데이터로 시작" 대안 버튼
    const sampleAlt = await page.$('button:has-text("샘플 데이터")');
    log(sampleAlt ? '✅' : '❌', `"샘플 데이터로 시작" 대안 버튼`);

    // ═══════════════════════════════════════════
    // 6. 네비게이션 검증
    // ═══════════════════════════════════════════
    log('📄', '=== 6. 네비게이션 검증 ===');

    // NavHeader 링크들
    const navLinks = await page.$$('header nav a');
    const navTexts = [];
    for (const link of navLinks) {
      navTexts.push(await link.textContent());
    }
    log(navTexts.includes('대시보드') ? '✅' : '❌', `네비: "대시보드" 링크`);
    log(navTexts.includes('학생 목록') ? '✅' : '❌', `네비: "학생 목록" 링크`);
    log(navTexts.includes('업로드') ? '✅' : '❌', `네비: "업로드" 링크`);

    // 로고 → 홈 링크
    const logoLink = await page.$('header nav a[href="/"]');
    log(logoLink ? '✅' : '❌', `로고 → 홈 링크`);

  } catch (err) {
    log('❌', `ERROR: ${err.message}`);
  } finally {
    await browser.close();
  }

  // ═══════════════════════════════════════════
  // 결과 요약
  // ═══════════════════════════════════════════
  console.log('\n' + '='.repeat(50));
  console.log('📊 검증 결과 요약');
  console.log('='.repeat(50));

  const passed = results.filter(r => r.includes('✅')).length;
  const warnings = results.filter(r => r.includes('⚠️')).length;
  const failed = results.filter(r => r.includes('❌')).length;

  console.log(`✅ PASS: ${passed}`);
  console.log(`⚠️ WARN: ${warnings}`);
  console.log(`❌ FAIL: ${failed}`);
  console.log(`총 검증 항목: ${passed + warnings + failed}`);

  if (consoleLogs.filter(l => l.includes('[error]') || l.includes('PAGE ERROR')).length > 0) {
    console.log('\n🔴 콘솔 에러:');
    consoleLogs.filter(l => l.includes('[error]') || l.includes('PAGE ERROR')).forEach(l => console.log(' ', l));
  } else {
    console.log('\n✅ 콘솔 에러 없음');
  }
}

run();
