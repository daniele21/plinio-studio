import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const VIEWPORTS = [
  { name: 'iphone-se', width: 320, height: 568 },
  { name: 'android-360', width: 360, height: 800 },
  { name: 'iphone-14', width: 390, height: 844 },
  { name: 'iphone-plus', width: 430, height: 932 },
  { name: 'ipad-portrait', width: 768, height: 1024 },
];

const OUTPUT_DIR = 'artifacts/mobile-qa';

async function preparePage(page) {
  await page.addInitScript(() => {
    localStorage.setItem('plinio_consent_v1', JSON.stringify({
      necessary: true,
      analytics: false,
      updatedAt: new Date().toISOString(),
      version: 1,
    }));
  });

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#app main')).toBeVisible();
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(350);
}

async function assertNoHorizontalOverflow(page, viewportWidth) {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    viewport: window.innerWidth,
  }));
  expect(overflow.scrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(viewportWidth + 1);
  expect(overflow.bodyScrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(viewportWidth + 1);
}

async function expectMinSize(locator, minWidth, minHeight) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThanOrEqual(minWidth);
  expect(box.height).toBeGreaterThanOrEqual(minHeight);
}

async function captureSection(page, viewportName, selector, fileName) {
  const section = page.locator(selector).first();
  await expect(section).toBeVisible();
  await section.screenshot({ path: `${OUTPUT_DIR}/${viewportName}-${fileName}.png` });
}

test.beforeAll(async () => {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
});

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('landing is usable and visually responsive', async ({ page }) => {
      await preparePage(page);
      await assertNoHorizontalOverflow(page, viewport.width);

      const desktopPipeline = page.locator('.pl-hero-desktop-showcase').first();
      const mobileCarousel = page.locator('.pl-hero-mobile-carousel').first();
      await expect(desktopPipeline).toBeHidden();
      await expect(mobileCarousel).toBeVisible();

      const headerCta = page.locator('.pl-v5-header .pl-header__cta');
      await expectMinSize(headerCta, 44, 44);

      const carouselPrev = page.locator('.pl-hero-mobile-carousel .pl-radar-nav-btn').first();
      await expectMinSize(carouselPrev, 40, 40);

      const title = page.locator('.pl-product-hero__title').first();
      const titleBox = await title.boundingBox();
      expect(titleBox).not.toBeNull();
      expect(titleBox.x).toBeGreaterThanOrEqual(0);
      expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(viewport.width + 1);

      const faqNumbers = await page.locator('#faq .pl-faq-card__num').evaluateAll((els) =>
        els.map((el) => ({
          text: el.textContent.trim(),
          y: el.getBoundingClientRect().top + window.scrollY,
        }))
          .sort((a, b) => a.y - b.y)
          .map((item) => item.text)
      );
      expect(faqNumbers).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
      await expect(page.locator('#faq .pl-faq-card[open]')).toHaveCount(0);

      await page.screenshot({ path: `${OUTPUT_DIR}/${viewport.name}-full.png`, fullPage: true });
      await captureSection(page, viewport.name, '.pl-product-hero', 'hero');
      await captureSection(page, viewport.name, '#confronto', 'comparison');
      await captureSection(page, viewport.name, '#faq', 'faq');

      await page.locator('[data-open-lead-modal]').first().click();
      const dialog = page.locator('.pl-lead-modal__dialog');
      await expect(dialog).toBeVisible();
      const form = page.locator('.pl-lead-form');
      const steps = page.locator('.pl-lead-modal__steps-panel');
      const [formBox, stepsBox] = await Promise.all([form.boundingBox(), steps.boundingBox()]);
      expect(formBox).not.toBeNull();
      expect(stepsBox).not.toBeNull();
      expect(formBox.y).toBeLessThan(stepsBox.y);
      await expectMinSize(page.locator('.pl-lead-modal__close'), 44, 44);
      await expectMinSize(page.locator('.pl-lead-form__submit'), 44, 48);
      await dialog.screenshot({ path: `${OUTPUT_DIR}/${viewport.name}-modal.png` });

      await assertNoHorizontalOverflow(page, viewport.width);
    });
  });
}
