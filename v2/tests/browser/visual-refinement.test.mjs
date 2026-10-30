import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('homepage and résumé share readable type without compact-width project compression', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 768, 900, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await page.goto(site);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.fonts.check('16px Sora')), true);
      const home = await page.evaluate(() => {
        const root = document.querySelector('#root > div');
        const links = [...document.querySelectorAll('nav[aria-label="Project index"] > a')];
        const boxes = links.map((link) => link.getBoundingClientRect());
        return {
          font: getComputedStyle(root).fontFamily,
          size: parseFloat(getComputedStyle(root).fontSize),
          labelSize: parseFloat(getComputedStyle(links[0].querySelector('small')).fontSize),
          columns: new Set(boxes.map((box) => Math.round(box.x))).size,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      });
      assert.match(home.font, /Sora/);
      assert.ok(home.size >= 16, `small body text at ${width}px`);
      assert.ok(home.labelSize >= 14, `small project category at ${width}px`);
      assert.equal(home.columns, width <= 540 ? 1 : width <= 1100 ? 2 : 4);
      assert.equal(home.overflow, false, `horizontal overflow at ${width}px`);
      await page.goto(new URL('resume.html', site).href);
      await page.evaluate(() => document.fonts.ready);
      assert.match(await page.locator('body').evaluate((node) => getComputedStyle(node).fontFamily), /Sora/);
      assert.equal(await page.evaluate(() => document.fonts.check('16px Sora')), true);
      await page.close();
    }
  } finally { await browser.close(); }
});
