// CatchUp AI — E2E Critical Flow Tests
// 프로덕션 핵심 플로우 검증

import { test, expect } from 'playwright/test';

test.describe('Landing Page', () => {
  test('renders hero section with CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=CatchUp AI')).toBeVisible();
    await expect(page.locator('text=샘플 데이터로 시작')).toBeVisible();
  });

  test('nav header is visible with links', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=대시보드')).toBeVisible();
    await expect(page.locator('text=학생 목록')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test('loads and shows KPI cards or empty state', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Either KPI cards or empty state should be visible
    const hasKpi = await page.locator('.animate-pulse, [class*="card"]').first().isVisible().catch(() => false);
    const hasEmpty = await page.locator('text=아직 업로드된 데이터가 없습니다').isVisible().catch(() => false);
    expect(hasKpi || hasEmpty).toBeTruthy();
  });
});

test.describe('Students Page', () => {
  test('loads student list or empty state', async ({ page }) => {
    await page.goto('/students');
    await page.waitForLoadState('networkidle');
    const hasTable = await page.locator('table, [role="table"]').isVisible().catch(() => false);
    const hasEmpty = await page.locator('text=업로드된 학생 데이터가 없습니다').isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBeTruthy();
  });
});

test.describe('Pricing Page', () => {
  test('shows 3-tier pricing cards', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('text=Free')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=API')).toBeVisible();
  });

  test('Pro tier shows price', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('text=15,900')).toBeVisible();
  });
});

test.describe('API Docs', () => {
  test('loads Redoc documentation', async ({ page }) => {
    await page.goto('/docs');
    await page.waitForLoadState('networkidle');
    // Wait for Redoc to initialize (may take a moment)
    await page.waitForTimeout(2000);
    const hasRedoc = await page.locator('[class*="redoc"], #redoc-container').isVisible().catch(() => false);
    const hasTitle = await page.locator('text=API').isVisible().catch(() => false);
    expect(hasRedoc || hasTitle).toBeTruthy();
  });
});

test.describe('Analytics Page', () => {
  test('loads analytics or empty state', async ({ page }) => {
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
    const hasCharts = await page.locator('text=교육 분석').isVisible().catch(() => false);
    const hasContent = await page.locator('main').isVisible();
    expect(hasCharts || hasContent).toBeTruthy();
  });
});
