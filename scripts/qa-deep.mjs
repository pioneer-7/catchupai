// 심층 QA/QC — 콘솔 로그 전수 수집 + 네트워크 에러 + 깨진 링크 + 성능

import { chromium } from 'playwright';

const BASE = 'https://carchupai.vercel.app';
const allConsole = [];
const allNetworkErrors = [];
const allResponses = [];
const results = [];

function log(emoji, msg) {
  const line = `${emoji} ${msg}`;
  console.log(line);
  results.push(line);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 모든 콘솔 로그 수집
  page.on('console', msg => {
    allConsole.push({ page: page.url(), type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    allConsole.push({ page: page.url(), type: 'PAGE_ERROR', text: err.message });
  });

  // 네트워크 응답 추적
  page.on('response', res => {
    allResponses.push({ url: res.url(), status: res.status() });
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      allNetworkErrors.push({ url: res.url(), status: res.status(), page: page.url() });
    }
  });

  try {
    // ═══════════════════════════════════════
    // QA-1: 랜딩 페이지 심층 검사
    // ═══════════════════════════════════════
    log('🔍', '=== QA-1: 랜딩 페이지 심층 검사 ===');
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // 모든 링크 유효성
    const landingLinks = await page.$$eval('a[href]', links => links.map(l => ({ href: l.href, text: l.textContent?.trim() })));
    log('📋', `랜딩 링크 ${landingLinks.length}개 발견`);
    for (const link of landingLinks) {
      if (link.href.startsWith(BASE)) {
        const res = await page.request.get(link.href);
        log(res.status() < 400 ? '✅' : '❌', `  [${res.status()}] ${link.text} → ${link.href.replace(BASE, '')}`);
      }
    }

    // 이미지/SVG 깨짐 확인
    const brokenImages = await page.$$eval('img', imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src));
    log(brokenImages.length === 0 ? '✅' : '❌', `깨진 이미지: ${brokenImages.length}개`);

    // viewport meta
    const viewport = await page.$('meta[name="viewport"]');
    log(viewport ? '✅' : '❌', 'viewport meta 태그 존재');

    // lang 속성
    const lang = await page.$eval('html', el => el.lang);
    log(lang === 'ko' ? '✅' : '❌', `HTML lang: "${lang}" (기대: "ko")`);

    // ═══════════════════════════════════════
    // QA-2: 대시보드 데이터 정합성
    // ═══════════════════════════════════════
    log('🔍', '=== QA-2: 대시보드 데이터 정합성 ===');

    // 샘플 로드
    const sampleBtn = await page.$('button:has-text("샘플 데이터로 시작")');
    await sampleBtn.click();
    await page.waitForURL('**/dashboard', { timeout: 30000 });
    await page.waitForSelector('text=전체 학생', { timeout: 10000 });
    await page.waitForTimeout(1500);

    // API 직접 호출하여 데이터 대조
    const apiRes = await page.request.get(`${BASE}/api/students`);
    const apiData = await apiRes.json();
    log(apiRes.status() === 200 ? '✅' : '❌', `API /students 응답: ${apiRes.status()}`);
    log(apiData.success ? '✅' : '❌', `API success: ${apiData.success}`);
    log(apiData.data?.total === 8 ? '✅' : '❌', `학생 수: ${apiData.data?.total} (기대: 8)`);

    const s = apiData.data?.summary;
    log('📊', `분포: stable=${s?.stable}, warning=${s?.warning}, at_risk=${s?.at_risk}`);
    log((s?.stable + s?.warning + s?.at_risk) === apiData.data?.total ? '✅' : '❌', `분포 합계 = 전체 학생 수`);

    // 도넛 차트 존재 확인
    const svgChart = await page.$('svg circle');
    log(svgChart ? '✅' : '❌', '도넛 차트 SVG 렌더링');

    // ═══════════════════════════════════════
    // QA-3: 학생 목록 필터/정렬 정합성
    // ═══════════════════════════════════════
    log('🔍', '=== QA-3: 학생 목록 필터/정렬 정합성 ===');
    await page.goto(`${BASE}/students`, { waitUntil: 'networkidle' });
    await page.waitForSelector('table', { timeout: 10000 });

    // 기본 정렬 (risk_score desc) 확인
    const scores = await page.$$eval('table tbody tr td:nth-child(3)', cells => cells.map(c => parseInt(c.textContent)));
    const isSorted = scores.every((v, i) => i === 0 || v <= scores[i - 1]);
    log(isSorted ? '✅' : '❌', `기본 정렬 (risk_score desc): [${scores.join(', ')}]`);

    // 각 학생의 risk_level과 badge 색상 매칭
    const badges = await page.$$eval('table tbody tr', rows => {
      return rows.map(row => {
        const score = parseInt(row.querySelector('td:nth-child(3)')?.textContent || '0');
        const badgeText = row.querySelector('td:nth-child(2) span')?.textContent?.trim();
        return { score, badgeText };
      });
    });

    for (const b of badges) {
      const expected = b.score >= 60 ? '위험' : b.score >= 30 ? '주의' : '안정';
      log(b.badgeText === expected ? '✅' : '❌', `  점수 ${b.score} → 배지 "${b.badgeText}" (기대: "${expected}")`);
    }

    // ═══════════════════════════════════════
    // QA-4: 학생 상세 — AI 전체 플로우
    // ═══════════════════════════════════════
    log('🔍', '=== QA-4: 학생 상세 AI 전체 플로우 ===');

    // 가장 위험한 학생(첫 번째) 상세 페이지
    const firstDetailLink = await page.$('a:has-text("상세 보기")');
    const detailHref = await firstDetailLink.getAttribute('href');
    await firstDetailLink.click();
    await page.waitForURL(`**${detailHref}`, { timeout: 15000 });
    // 학생 상세 데이터 로딩 대기
    await page.waitForSelector('.card h1', { timeout: 15000 }).catch(() => null);
    await page.waitForTimeout(1000);

    const studentName = await page.$eval('.card h1', el => el.textContent).catch(() => 'NOT_FOUND');
    log('📋', `학생: ${studentName}`);

    // 위험 점수 표시
    const riskScoreText = await page.textContent('main');
    const hasRiskScore = riskScoreText?.includes('위험 점수');
    log(hasRiskScore ? '✅' : '❌', '위험 점수 레이블 표시');

    // "전체 생성" 버튼 존재
    const generateAllBtn = await page.$('button:has-text("전체 생성")');
    log(generateAllBtn ? '✅' : '❌', '"전체 생성" 버튼 존재');

    // PDF 내보내기 — 회복학습 생성 후 확인
    const recoveryBtn = await page.$('button:has-text("회복학습 생성")');
    await recoveryBtn.click();
    await page.waitForSelector('text=회복학습 플랜', { timeout: 30000 }).catch(() => null);
    await page.waitForTimeout(1000);

    const pdfBtn = await page.$('button:has-text("PDF 내보내기")');
    log(pdfBtn ? '✅' : '❌', 'PDF 내보내기 버튼 존재');

    // 생성 시간 표시
    const hasGenTime = (await page.textContent('main'))?.includes('초 만에 생성');
    log(hasGenTime ? '✅' : '❌', 'AI 생성 시간 표시');

    // 메시지 생성 + 복사 버튼
    const msgBtn = await page.$('button:has-text("개입 메시지")');
    await msgBtn.click();
    await page.waitForTimeout(15000);
    const copyBtn = await page.$('button:has-text("메시지 복사")');
    log(copyBtn ? '✅' : '❌', '메시지 복사 버튼 존재');

    // 미니 진단 + 제출 + 결과
    const assessBtn = await page.$('button:has-text("미니 진단")');
    await assessBtn.click();
    // 진단 문항 렌더링 대기 (AI 호출 ~15초)
    await page.waitForSelector('input[type="radio"]', { timeout: 30000 }).catch(() => null);
    await page.waitForTimeout(1000);

    // 문항 응답
    const radios = await page.$$('input[type="radio"]');
    const textInputs = await page.$$('input[type="text"][placeholder*="답변"]');
    const answered = new Set();
    for (const r of radios) {
      const name = await r.getAttribute('name');
      if (name && !answered.has(name)) { await r.click(); answered.add(name); }
    }
    for (const t of textInputs) { await t.fill('예측'); }

    const submitBtn = await page.$('button:has-text("답안 제출")');
    if (submitBtn && !(await submitBtn.isDisabled())) {
      await submitBtn.click();
      await page.waitForSelector('text=진단 결과', { timeout: 10000 }).catch(() => null);
      await page.waitForTimeout(1000);

      // 채점 결과 확인
      const resultText = await page.textContent('main');
      log(resultText?.includes('진단 결과') ? '✅' : '❌', '진단 결과 섹션 표시');
      log(resultText?.includes('변경 전') ? '✅' : '❌', 'risk score 변경 전/후 표시');

      // 정답 해설 표시
      const explanations = await page.$$('text=/Q[0-9]/');
      log(explanations.length >= 3 ? '✅' : '⚠️', `문항별 해설: ${explanations.length}개`);
    }

    // 활동 타임라인 존재
    const timeline = await page.$('text=활동 기록');
    log(timeline ? '✅' : '❌', '활동 타임라인 섹션 존재');

    // ═══════════════════════════════════════
    // QA-5: 업로드 페이지 검사
    // ═══════════════════════════════════════
    log('🔍', '=== QA-5: 업로드 페이지 검사 ===');
    await page.goto(`${BASE}/upload`, { waitUntil: 'networkidle' });

    // CSV 템플릿 다운로드 링크
    const templateLink = await page.$('a[href*="template.csv"]');
    log(templateLink ? '✅' : '❌', 'CSV 템플릿 다운로드 링크 존재');

    if (templateLink) {
      const templateRes = await page.request.get(`${BASE}/sample/template.csv`);
      log(templateRes.status() === 200 ? '✅' : '❌', `CSV 템플릿 파일 접근: ${templateRes.status()}`);
    }

    // ═══════════════════════════════════════
    // QA-6: 모바일 반응형 검사
    // ═══════════════════════════════════════
    log('🔍', '=== QA-6: 모바일 반응형 (375px) ===');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // 랜딩 페이지 overflow 확인
    const bodyWidth = await page.$eval('body', el => el.scrollWidth);
    log(bodyWidth <= 375 ? '✅' : '❌', `모바일 body overflow: ${bodyWidth}px (기대: ≤375)`);

    // 대시보드에서 햄버거 메뉴
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const hamburger = await page.$('button[aria-label="메뉴 열기"]');
    log(hamburger ? '✅' : '❌', '모바일 햄버거 버튼 존재');

    // 데스크톱 nav 숨김
    const desktopNav = await page.$('.hidden.md\\:flex');
    const isHidden = desktopNav ? await desktopNav.isVisible() : true;
    log(!isHidden || !desktopNav ? '✅' : '⚠️', '데스크톱 nav 모바일에서 숨김');

    // 햄버거 클릭 → 메뉴 열림
    if (hamburger) {
      await hamburger.click();
      await page.waitForTimeout(300);
      const mobileMenu = await page.$('text=학생 목록');
      log(mobileMenu ? '✅' : '❌', '모바일 메뉴 열림');
    }

    // 뷰포트 복원
    await page.setViewportSize({ width: 1280, height: 800 });

    // ═══════════════════════════════════════
    // QA-7: OG 메타 + 파비콘
    // ═══════════════════════════════════════
    log('🔍', '=== QA-7: 메타데이터 + 파비콘 ===');
    await page.goto(BASE, { waitUntil: 'networkidle' });

    const ogTitle = await page.$('meta[property="og:title"]');
    log(ogTitle ? '✅' : '❌', 'OG title 메타 태그');

    const ogDesc = await page.$('meta[property="og:description"]');
    log(ogDesc ? '✅' : '❌', 'OG description 메타 태그');

    const ogImage = await page.$('meta[property="og:image"]');
    log(ogImage ? '✅' : '❌', 'OG image 메타 태그');

    if (ogImage) {
      const ogImageUrl = await ogImage.getAttribute('content');
      log('📋', `OG image URL: ${ogImageUrl}`);
    }

    // 파비콘 (SVG 또는 ICO)
    const faviconLink = await page.$('link[rel="icon"]');
    log(faviconLink ? '✅' : '❌', '파비콘 link 태그');

  } catch (err) {
    log('❌', `CRITICAL ERROR: ${err.message}`);
  } finally {
    await browser.close();
  }

  // ═══════════════════════════════════════
  // 최종 리포트
  // ═══════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log('📊 QA/QC 최종 리포트');
  console.log('═'.repeat(60));

  const passed = results.filter(r => r.includes('✅')).length;
  const warnings = results.filter(r => r.includes('⚠️')).length;
  const failed = results.filter(r => r.includes('❌')).length;

  console.log(`\n✅ PASS: ${passed}`);
  console.log(`⚠️ WARN: ${warnings}`);
  console.log(`❌ FAIL: ${failed}`);
  console.log(`📝 총 검증 항목: ${passed + warnings + failed}`);

  // 콘솔 로그 리포트
  const errors = allConsole.filter(c => c.type === 'error' || c.type === 'PAGE_ERROR');
  const warns = allConsole.filter(c => c.type === 'warning');

  console.log(`\n📋 수집된 콘솔 로그: ${allConsole.length}개`);
  if (errors.length > 0) {
    console.log(`\n🔴 콘솔 에러 (${errors.length}개):`);
    errors.forEach(e => console.log(`  [${e.type}] ${e.page.replace(BASE, '')} → ${e.text.slice(0, 120)}`));
  } else {
    console.log('✅ 콘솔 에러 없음');
  }

  if (warns.length > 0) {
    console.log(`\n🟡 콘솔 경고 (${warns.length}개):`);
    warns.slice(0, 5).forEach(w => console.log(`  [warn] ${w.page.replace(BASE, '')} → ${w.text.slice(0, 120)}`));
    if (warns.length > 5) console.log(`  ... 외 ${warns.length - 5}개`);
  }

  // 네트워크 에러 리포트
  if (allNetworkErrors.length > 0) {
    console.log(`\n🔴 네트워크 에러 (${allNetworkErrors.length}개):`);
    allNetworkErrors.forEach(e => console.log(`  [${e.status}] ${e.url.slice(0, 100)}`));
  } else {
    console.log('✅ 네트워크 에러 없음');
  }

  // API 응답 시간 (sample endpoint)
  console.log(`\n📡 총 네트워크 요청: ${allResponses.length}개`);
  const apiCalls = allResponses.filter(r => r.url.includes('/api/'));
  console.log(`📡 API 호출: ${apiCalls.length}개`);
  apiCalls.forEach(a => console.log(`  [${a.status}] ${a.url.replace(BASE, '')}`));
}

run();
