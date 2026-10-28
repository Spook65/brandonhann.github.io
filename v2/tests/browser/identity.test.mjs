import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('portrait responds to pointer, reveals an authentic invitation, and resets without idle drawing', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const canvas = page.locator('canvas[data-ready="true"]');
    await canvas.waitFor();
    const initial = await canvas.evaluate((element) => element.toDataURL());
    const box = await canvas.boundingBox();
    assert.ok(box);
    for (let i = 0; i < 14; i++) await page.mouse.move(box.x + box.width * (.14 + i * .055), box.y + box.height * (.3 + Math.sin(i / 3) * .2));
    assert.notEqual(await canvas.evaluate((element) => element.toDataURL()), initial);
    assert.equal(await page.locator('[data-discovered="true"]').count(), 1);
    assert.ok(await page.getByRole('link', { name: /Explore what I’m building/ }).isVisible());
    const strokes = await canvas.getAttribute('data-strokes');
    await page.waitForTimeout(350);
    assert.equal(await canvas.getAttribute('data-strokes'), strokes, 'canvas continued drawing while idle');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    assert.equal(await page.locator('[data-discovered="false"]').count(), 1);
    assert.equal(await canvas.evaluate((element) => element.toDataURL()), initial);
  } finally { await browser.close(); }
});

test('keyboard, touch, and reduced motion retain deliberate reveal and reset', async () => {
  const browser = await chromium.launch();
  try {
    const keyboard = await browser.newPage({ viewport: { width: 768, height: 900 } });
    await keyboard.goto(site);
    await keyboard.locator('canvas[data-ready="true"]').waitFor();
    await keyboard.getByRole('button', { name: 'Reveal photo' }).focus();
    await keyboard.keyboard.press('Enter');
    assert.equal(await keyboard.locator('[data-discovered="true"]').count(), 1);
    await keyboard.getByRole('button', { name: 'Reset', exact: true }).focus();
    await keyboard.keyboard.press('Space');
    assert.equal(await keyboard.locator('[data-discovered="false"]').count(), 1);

    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touch.goto(site);
    const canvas = touch.locator('canvas[data-ready="true"]');
    await canvas.waitFor();
    const before = Number(await canvas.getAttribute('data-strokes') || 0);
    await canvas.locator('..').tap();
    assert.ok(Number(await canvas.getAttribute('data-strokes')) > before);
    assert.equal(await touch.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await reduced.goto(site);
    const still = reduced.locator('canvas[data-ready="true"]');
    await still.waitFor();
    const stillBefore = Number(await still.getAttribute('data-strokes') || 0);
    await still.locator('..').tap();
    assert.equal(Number(await still.getAttribute('data-strokes') || 0), stillBefore);
    await reduced.getByRole('button', { name: 'Reveal photo' }).tap();
    assert.equal(await reduced.locator('[data-discovered="true"]').count(), 1);
    await reduced.getByRole('button', { name: 'Reset', exact: true }).tap();
    assert.equal(await reduced.locator('[data-discovered="false"]').count(), 1);
  } finally { await browser.close(); }
});

test('Canvas and image failure keep direct portfolio access; typography is scoped away from Guardian', async () => {
  const browser = await chromium.launch();
  try {
    const failed = await browser.newPage();
    await failed.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
    await failed.goto(site);
    assert.ok(await failed.getByText('Portrait effect unavailable').isVisible());
    assert.ok(await failed.getByRole('img', { name: /Brandon Hann in a casual portrait/ }).isVisible());
    assert.ok(await failed.getByRole('link', { name: 'Projects', exact: true }).isVisible());
    assert.ok(await failed.getByRole('link', { name: 'Résumé', exact: true }).isVisible());

    const missing = await browser.newPage();
    await missing.route('**/brandon-about.jpg', (route) => route.abort());
    await missing.goto(site);
    assert.ok(await missing.getByText('Portrait unavailable', { exact: true }).isVisible());
    assert.ok(await missing.getByText('Brandon’s portrait is temporarily unavailable.').isVisible());
    assert.ok(await missing.getByRole('link', { name: 'Projects', exact: true }).isVisible());

    const font = await missing.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily);
    assert.match(font, /Inter/);
    await missing.goto(`${site}?experience=guardian`);
    await missing.getByRole('button', { name: /Enter through the Guardian/ }).waitFor();
    const guardianFont = await missing.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily);
    assert.match(guardianFont, /Fraunces/);
  } finally { await browser.close(); }
});

test('first frame and navigation fit mobile, tablet, and desktop widths', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(site);
      await page.locator('canvas[data-ready="true"]').waitFor();
      assert.ok(await page.getByRole('heading', { name: /Brandon\s*Hann\./ }).isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, `horizontal overflow at ${width}px`);
      assert.ok(await page.getByRole('link', { name: 'Explore projects' }).isVisible());
      await page.close();
    }
  } finally { await browser.close(); }
});
