import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('visual follows preview and selected project through focus, activation, and Back', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const visual = page.locator('#project-preview [data-visual-project]');
    assert.equal(await visual.getAttribute('data-visual-project'), 'project-cura');
    const initialPixels = await visual.locator('canvas').evaluate((canvas) => canvas.toDataURL());
    const mapetite = page.getByRole('button', { name: /Mapetite/ });
    await mapetite.focus();
    assert.equal(await visual.getAttribute('data-visual-project'), 'project-mapetite');
    assert.notEqual(await visual.locator('canvas').evaluate((canvas) => canvas.toDataURL()), initialPixels);
    await mapetite.press('Enter');
    assert.equal(await mapetite.getAttribute('aria-pressed'), 'true');
    assert.equal(await visual.getAttribute('data-visual-project'), 'project-mapetite');
    await page.goBack();
    assert.equal(await visual.getAttribute('data-visual-project'), 'project-cura');
    await page.goto(`${site}#project-secureagent`);
    assert.equal(await visual.getAttribute('data-visual-project'), 'project-secureagent');
  } finally { await browser.close(); }
});

test('pointer impulse animates and settles; reduced motion stays static', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const canvas = page.locator('#project-preview canvas');
    await page.waitForTimeout(150);
    const offscreen = Number(await canvas.getAttribute('data-frames'));
    await page.waitForTimeout(200);
    assert.equal(Number(await canvas.getAttribute('data-frames')), offscreen, 'offscreen canvas kept drawing');
    await canvas.scrollIntoViewIfNeeded();
    const box = await canvas.boundingBox();
    assert.ok(box);
    const before = Number(await canvas.getAttribute('data-frames'));
    const restingPixels = await canvas.evaluate((element) => element.toDataURL());
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(100);
    const during = Number(await canvas.getAttribute('data-frames'));
    assert.ok(during > before, `pointer did not draw: ${before} to ${during}`);
    assert.notEqual(await canvas.evaluate((element) => element.toDataURL()), restingPixels, 'pointer did not visibly change cells');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1500);
    const settled = Number(await canvas.getAttribute('data-frames'));
    await page.waitForTimeout(250);
    assert.equal(Number(await canvas.getAttribute('data-frames')), settled, 'canvas kept drawing while idle');

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
    await reduced.goto(site);
    const touchCanvas = reduced.locator('#project-preview canvas');
    await touchCanvas.scrollIntoViewIfNeeded();
    const staticBefore = Number(await touchCanvas.getAttribute('data-frames'));
    await touchCanvas.tap();
    await reduced.waitForTimeout(200);
    assert.equal(Number(await touchCanvas.getAttribute('data-frames')), staticBefore);
    assert.equal(await reduced.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  } finally { await browser.close(); }
});

test('homepage typography is scoped and optional Guardian keeps its original font', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const fonts = await page.evaluate(() => ({
      heading: getComputedStyle(document.querySelector('h1')).fontFamily,
      label: getComputedStyle(document.querySelector('[class*="eyebrow"]')).fontFamily,
    }));
    assert.match(fonts.heading, /Inter/);
    assert.match(fonts.label, /JetBrains Mono/);
    await page.goto(`${site}?experience=guardian`);
    await page.getByRole('button', { name: /Enter through the Guardian/ }).waitFor();
    const guardianFont = await page.evaluate(() => getComputedStyle(document.querySelector('h1')).fontFamily);
    assert.match(guardianFont, /Fraunces/);
  } finally { await browser.close(); }
});

test('touch triggers motion without blocking scroll, and failed Canvas retains a readable diagram label', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.goto(site);
    const canvas = page.locator('#project-preview canvas');
    await canvas.scrollIntoViewIfNeeded();
    const before = Number(await canvas.getAttribute('data-frames'));
    await canvas.tap();
    await page.waitForTimeout(100);
    assert.ok(Number(await canvas.getAttribute('data-frames')) > before);
    const y = await page.evaluate(() => window.scrollY);
    await page.touchscreen.tap(180, 650);
    await page.evaluate(() => window.scrollBy(0, 120));
    assert.ok(await page.evaluate(() => window.scrollY) > y);
    await page.close();

    const failed = await browser.newPage();
    await failed.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
    await failed.goto(site);
    assert.ok(await failed.getByRole('img', { name: /Cura: VOICE \/ TRIAGE FLOW illustrative study/ }).first().isVisible());
    assert.ok(await failed.getByRole('button', { name: /Mapetite/ }).isVisible());
  } finally { await browser.close(); }
});
