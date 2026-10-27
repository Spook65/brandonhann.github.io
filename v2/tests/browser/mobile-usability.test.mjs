import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = `${process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/'}?experience=guardian`;
const routes = [
  ['quest', 'SecureAgent Lab'],
  ['archives', 'Project Archives'],
  ['arsenal', 'Arsenal'],
  ['chronicles', 'Chronicles'],
  ['profile', 'About Brandon'],
  ['signal', 'Signal'],
];

async function assertPanelInView(page, title) {
  await page.waitForFunction((expected) => {
    const panel = document.querySelector('#destination-panel');
    const heading = panel?.querySelector('h3');
    const header = document.querySelector('header');
    if (!panel || !heading || heading.textContent !== expected || !header) return false;
    const rect = heading.getBoundingClientRect();
    return rect.top >= header.getBoundingClientRect().bottom && rect.top < window.innerHeight;
  }, title);
  assert.equal(await page.locator('#destination-panel').evaluate((node) => node === document.activeElement), true);
}

test('all six mobile destinations reveal readable content only after activation', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [360, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      await page.goto(site);
      await page.getByRole('button', { name: /Skip introduction/ }).click();
      const archives = page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Project Archives' });
      await archives.focus();
      assert.match(await page.locator('#destination-panel').innerText(), /Choose a connection/);
      for (const [id, heading] of routes) {
        await page.locator('[aria-label="Domain destinations"] button').filter({ hasText: heading === 'About Brandon' ? 'Character Profile' : heading === 'SecureAgent Lab' ? 'Main Quest' : heading }).click();
        assert.equal(new URL(page.url()).hash, `#domain-${id}`);
        await assertPanelInView(page, heading);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

test('direct destination links and browser Back restore selection on mobile', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(`${site}#domain-quest`);
    await assertPanelInView(page, 'SecureAgent Lab');
    await page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Signal' }).click();
    await assertPanelInView(page, 'Signal');
    await page.goBack();
    await assertPanelInView(page, 'SecureAgent Lab');
    assert.equal(new URL(page.url()).hash, '#domain-quest');
  } finally { await browser.close(); }
});

test('mobile header supports keyboard, touch, dismissal, and narrow widths', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 360, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
      await page.goto(site);
      const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
      for (const control of [nav.getByRole('link', { name: 'Projects' }), nav.getByRole('link', { name: 'Résumé' }), nav.getByRole('button', { name: /Menu/ })]) {
        const box = await control.boundingBox();
        assert.ok(box && box.width >= 44 && box.height >= 44, `small touch target at ${width}px`);
      }
      const menu = nav.getByRole('button', { name: /Menu/ });
      await menu.focus();
      await page.keyboard.press('Enter');
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.equal(await menu.evaluate((node) => node === document.activeElement), true);
      await menu.tap();
      await nav.getByRole('link', { name: 'Skills' }).tap();
      assert.equal(new URL(page.url()).hash, '#skills');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(layout.scroll <= layout.width + 1, `horizontal overflow at ${width}px`);
      await page.close();
    }
  } finally { await browser.close(); }
});
