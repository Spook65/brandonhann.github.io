import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.LOGBOOK_PREVIEW_URL ?? 'http://127.0.0.1:4178/brandonhann.github.io/prototypes/living-logbook.html';

test('portrait rubbing reveals color and leads to a sourced Mapetite note, then returns', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const response = await page.goto(site);
    assert.equal(response?.status(), 200);
    const portrait = page.getByRole('button', { name: /Develop Brandon/ });
    const canvas = portrait.locator('canvas');
    await page.locator('canvas[data-ready="true"]').waitFor();
    const initial = await canvas.evaluate((element) => element.toDataURL());
    const box = await portrait.boundingBox();
    assert.ok(box);
    await page.mouse.move(box.x + box.width * .48, box.y + box.height * .5);
    assert.notEqual(await canvas.evaluate((element) => element.toDataURL()), initial);
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /Portrait developed/);
    await page.getByRole('button', { name: /Follow this thread/ }).click();
    assert.ok(await page.getByRole('heading', { name: 'Mapetite.' }).isVisible());
    assert.ok(await page.getByText(/uncertain public data honestly/).isVisible());
    assert.equal(await page.getByRole('link', { name: /Read the source note/ }).getAttribute('href'), 'https://github.com/Spook65/Mapetite/blob/main/README.md');
    assert.equal(await page.getByRole('link', { name: /Visit the live MVP/ }).getAttribute('href'), 'https://mapetite-nine.vercel.app');
    await page.getByRole('button', { name: /Close this page/ }).click();
    assert.equal(await page.locator('[data-view]').getAttribute('data-view'), 'portrait');
  } finally { await browser.close(); }
});

test('mobile tap, keyboard, and reduced motion keep the full discovery path usable', async () => {
  const browser = await chromium.launch();
  try {
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.goto(site);
    await mobile.locator('canvas[data-ready="true"]').waitFor();
    await mobile.getByRole('button', { name: /Develop Brandon/ }).tap();
    assert.match(await mobile.locator('[aria-live="polite"]').innerText(), /Portrait developed/);
    assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
    await mobile.getByRole('button', { name: /Follow this thread/ }).tap();
    assert.ok(await mobile.getByRole('heading', { name: 'Mapetite.' }).isVisible());
    await mobile.getByRole('button', { name: /Close this page/ }).tap();

    const reduced = await browser.newPage({ viewport: { width: 320, height: 740 }, reducedMotion: 'reduce' });
    await reduced.goto(site);
    const portrait = reduced.getByRole('button', { name: /Develop Brandon/ });
    await portrait.focus();
    await portrait.press('Enter');
    assert.match(await reduced.locator('[aria-live="polite"]').innerText(), /Portrait developed/);
    const duration = await reduced.locator('[class*="portraitLeaf"]').evaluate((element) => getComputedStyle(element).transitionDuration);
    assert.equal(duration, '0s');
    await reduced.getByRole('button', { name: /Follow this thread/ }).press('Enter');
    assert.ok(await reduced.getByRole('heading', { name: 'Mapetite.' }).isVisible());
    assert.equal(await reduced.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
  } finally { await browser.close(); }
});

test('canvas failure retains the photo, and drawing sleeps while idle', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(site);
    const canvas = page.locator('canvas[data-ready="true"]');
    await canvas.waitFor();
    const paints = await canvas.getAttribute('data-paints');
    await page.waitForTimeout(300);
    assert.equal(await canvas.getAttribute('data-paints'), paints, 'idle canvas repainted');
    const box = await canvas.boundingBox();
    assert.ok(box);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    assert.equal(await canvas.getAttribute('data-paints'), paints, 'pointer should erase only the touched region');

    const failed = await browser.newPage();
    await failed.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
    await failed.goto(site);
    assert.ok(await failed.getByRole('img', { name: /Brandon Hann in a casual portrait/ }).isVisible());
    assert.ok(await failed.getByText(/Portrait effect unavailable/).isVisible());
    await failed.getByRole('button', { name: /Follow this thread/ }).click();
    assert.ok(await failed.getByRole('heading', { name: 'Mapetite.' }).isVisible());
  } finally { await browser.close(); }
});
