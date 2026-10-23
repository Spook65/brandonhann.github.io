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
    assert.equal(await page.locator('[data-layer="mouth-cavity"]').count(), 1);
    assert.equal(await page.locator('[data-layer="side-tissue"]').count(), 1);
    const upperBefore = await upper.getAttribute('transform');
    const lowerBefore = await lower.getAttribute('transform');
    const cheekBefore = await page.locator('[data-layer="cheek-tension"] path').first().getAttribute('d');
    await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).focus();
    assert.notEqual(await lower.getAttribute('transform'), lowerBefore, 'focus should produce a restrained jaw response');
    await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).isDisabled(), true);
    await page.waitForTimeout(380);
    const half = await lower.getAttribute('transform');
    assert.notEqual(half, lowerBefore);
    assert.match(half, /translate\(0 -\d+\.\d\)/);
    assert.notEqual(await page.locator('[data-layer="cheek-tension"] path').first().getAttribute('d'), cheekBefore, 'cheek tissue should follow jaw movement');
    assert.equal(await upper.getAttribute('transform'), upperBefore);
    await page.waitForTimeout(380);
    const open = await lower.getAttribute('transform');
    assert.notEqual(open, half);
    assert.match(open, /translate\(0 0\.0\)/);
    assert.ok((await page.locator('[data-layer="left-rod"] path').getAttribute('d')).includes('1000.0'));
    assert.ok((await page.locator('[data-layer="right-rod"] path').getAttribute('d')).includes('1012.0'));
    await page.getByTestId('mouth-passage').waitFor();
    await page.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 5000 });
    await page.close();
  } finally {
    await browser.close();
  }
});

test('pointer changes the Guardian and tunnel perspective; keyboard focus previews a spatial route', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const stage = page.locator('#hero');
    await page.mouse.move(100, 320);
    await page.waitForTimeout(220);
    const left = await stage.evaluate((node) => node.style.getPropertyValue('--look-x'));
    await page.mouse.move(1330, 320);
    await page.waitForTimeout(220);
    const right = await stage.evaluate((node) => node.style.getPropertyValue('--look-x'));
    assert.ok(Number.parseFloat(left) < 0 && Number.parseFloat(right) > 0);
    await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).click();
    await page.waitForTimeout(1700);
    const gimbal = page.getByTestId('tunnel-gimbal');
    await page.mouse.move(100, 400);
    await page.waitForTimeout(180);
    const tunnelLeft = await gimbal.evaluate((node) => getComputedStyle(node).transform);
    await page.mouse.move(1320, 400);
    await page.waitForTimeout(180);
    const tunnelRight = await gimbal.evaluate((node) => getComputedStyle(node).transform);
    assert.notEqual(tunnelLeft, tunnelRight, 'pointer should alter the tunnel camera orientation');
    const ambientFold = await page.locator('[class*="foldAmbient"]').first().evaluate((node) => getComputedStyle(node).animationName);
    assert.notEqual(ambientFold, 'none', 'tunnel tissue should have ambient motion independent of travel');
    await page.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 5000 });
    const coreAmbient = await page.locator('[data-testid="neural-core-art"] image').evaluate((node) => getComputedStyle(node).animationName);
    assert.notEqual(coreAmbient, 'none', 'the Core should keep breathing after arrival');
    await page.getByRole('button', { name: 'Skip dialogue' }).click();
    await page.getByRole('button', { name: /Project Archives/i }).focus();
    assert.equal(await page.locator('#core').getAttribute('data-active-route'), 'archives');
    assert.equal(await page.locator('[data-route="archives"]').getAttribute('data-active'), 'true');
    await page.close();
  } finally {
    await browser.close();
  }
});

test('reduced motion keeps spatial motion still and reveals content directly', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    await page.goto(site);
    await page.mouse.move(340, 400);
    assert.equal(await page.locator('#hero').evaluate((node) => node.style.getPropertyValue('--look-x')), '');
    await page.getByRole('button', { name: 'Enter through the Guardian’s mouth' }).click();
    await page.getByRole('heading', { name: /The human inside/i }).waitFor();
    const animation = await page.locator('[data-testid="neural-core-art"] image').evaluate((node) => getComputedStyle(node).animationName);
    assert.equal(animation, 'none');
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
    assert.notEqual(first, second, 'organic wall folds must move through depth');
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
