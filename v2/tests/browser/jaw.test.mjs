import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('jaw layers articulate while the upper face stays fixed, then reveal the Core', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const upper = page.locator('[data-layer="upper-face"]');
    const lower = page.locator('[data-layer="lower-jaw"]');
    assert.equal(await page.locator('[data-layer="upper-teeth"]').count(), 1);
    assert.equal(await page.locator('[data-layer="lower-jaw"] [data-layer="lower-teeth"]').count(), 1);
    const upperBefore = await upper.getAttribute('transform');
    const lowerBefore = await lower.getAttribute('transform');
    await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).focus();
    assert.notEqual(await lower.getAttribute('transform'), lowerBefore, 'focus should produce a restrained jaw response');
    await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).isDisabled(), true);
    await page.waitForTimeout(380);
    const half = await lower.getAttribute('transform');
    assert.notEqual(half, lowerBefore);
    assert.match(half, /scale\(1 0\.\d+\)/);
    assert.equal(await upper.getAttribute('transform'), upperBefore);
    await page.waitForTimeout(380);
    const open = await lower.getAttribute('transform');
    assert.notEqual(open, half);
    assert.match(open, /translate\(0 104\.0\)/);
    assert.equal(await page.locator('[data-layer="left-rod"] line').first().getAttribute('y2'), '700.8');
    assert.equal(await page.locator('[data-layer="right-rod"] line').first().getAttribute('y2'), '700.8');
    await page.getByTestId('mouth-passage').waitFor();
    await page.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 5000 });
    await page.close();
  } finally {
    await browser.close();
  }
});

test('mouth control remains visible and the page has no horizontal overflow', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      await page.goto(site);
      const button = page.getByRole('button', { name: 'Enter through the Guardian’s mouth' });
      const box = await button.boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= width, `mouth button outside ${width}px viewport`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `horizontal overflow at ${width}px: ${overflow}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('Space and touch activate the physical entrance', async () => {
  const browser = await chromium.launch();
  try {
    const keyboard = await browser.newPage({ reducedMotion: 'reduce' });
    await keyboard.goto(site);
    await keyboard.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).focus();
    await keyboard.keyboard.press('Space');
    await keyboard.getByRole('heading', { name: /The human inside/i }).waitFor();
    await keyboard.close();

    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await touch.goto(site);
    await touch.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).tap();
    await touch.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 6000 });
    await touch.close();
  } finally {
    await browser.close();
  }
});

test('the coordinated tunnel moves depth planes past the camera into the operator Core', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).click();
    await page.waitForTimeout(1650);
    assert.equal(await page.locator('[data-journey-phase]').getAttribute('data-journey-phase'), 'tunnel');
    const ring = page.locator('[data-depth="4"]');
    const first = await ring.getAttribute('style');
    await page.waitForTimeout(650);
    const second = await ring.getAttribute('style');
    assert.notEqual(first, second, 'structural rings must move through depth');
    assert.ok(await page.getByTestId('mouth-passage').isVisible());
    await page.waitForTimeout(1350);
    assert.equal(await page.locator('[data-journey-phase]').getAttribute('data-journey-phase'), 'arrival');
    const opacity = Number(await page.getByTestId('operator-arrival').evaluate((node) => getComputedStyle(node).opacity));
    assert.ok(opacity > 0.2, `operator reveal opacity was ${opacity}`);
    await page.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 2500 });
    await page.close();
  } finally {
    await browser.close();
  }
});
