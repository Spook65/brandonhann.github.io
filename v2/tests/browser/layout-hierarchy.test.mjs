import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('narrow phones reveal Projects sooner with compact, full-width links', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: true, reducedMotion: 'reduce' });
      await page.goto(site);
      const layout = await page.evaluate(() => {
        const nav = document.querySelector('nav[aria-label="Project index"]');
        const heading = document.querySelector('#projects h2');
        const rows = [...nav.querySelectorAll('a')].map((link) => link.getBoundingClientRect());
        return {
          indexTop: nav.getBoundingClientRect().top,
          headingTop: heading.getBoundingClientRect().top,
          rowHeights: rows.map((row) => row.height),
          rowWidths: rows.map((row) => row.width),
          navWidth: nav.getBoundingClientRect().width,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
        };
      });
      assert.ok(layout.headingTop < 900, `Projects heading below opening viewport at ${width}px`);
      if (width === 390) assert.ok(layout.indexTop < 900, 'project links remain below first 390px viewport');
      assert.ok(layout.rowHeights.every((height) => height >= 44 && height <= 110));
      assert.ok(layout.rowWidths.every((rowWidth) => Math.abs(rowWidth - layout.navWidth) <= 2.5));
      assert.equal(layout.overflow, false);
      const principle = page.getByRole('complementary', { name: 'Engineering principles' });
      assert.equal(await principle.count(), 1);
      const order = await page.evaluate(() => {
        const index = document.querySelector('nav[aria-label="Project index"]');
        const asides = [...document.querySelectorAll('aside[aria-label="Engineering principles"]')];
        const visible = asides.find((aside) => getComputedStyle(aside).display !== 'none');
        return visible.getBoundingClientRect().top > index.getBoundingClientRect().bottom;
      });
      assert.equal(order, true);
      await principle.getByRole('button', { name: 'Validate' }).tap();
      assert.match(await principle.locator('[aria-live="polite"]').innerText(), /uncertain input/);
      await page.close();
    }
  } finally { await browser.close(); }
});

test('mobile principle and project content remain readable without JavaScript', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 900 }, javaScriptEnabled: false });
    await page.goto(site);
    const principle = page.getByRole('complementary', { name: 'Engineering principles' });
    assert.equal(await principle.count(), 1);
    assert.match(await principle.innerText(), /Keep permission separate/);
    assert.equal(await page.getByRole('navigation', { name: 'Project index' }).getByRole('link').count(), 4);
    await page.getByRole('navigation', { name: 'Project index' }).getByRole('link', { name: /Rivet/ }).click();
    assert.match(page.url(), /#project-rivet$/);
  } finally { await browser.close(); }
});
