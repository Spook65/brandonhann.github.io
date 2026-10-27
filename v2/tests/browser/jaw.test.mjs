import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = `${process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/'}?experience=guardian`;
const enterName = 'Enter through the Guardian’s mouth';

test('the articulated jaw opens before a short crossing into the operator Core', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const upper = page.locator('[data-layer="upper-face"]');
    const lower = page.locator('[data-layer="lower-jaw"]');
    const cheek = page.locator('[data-layer="cheek-tension"] path').first();
    const upperBefore = await upper.getAttribute('transform');
    const lowerBefore = await lower.getAttribute('transform');
    const cheekBefore = await cheek.getAttribute('d');
    assert.equal(await page.locator('[data-layer="mouth-cavity"]').count(), 1);
    assert.equal(await page.locator('[data-layer="upper-teeth"]').count(), 1);
    assert.equal(await page.locator('[data-layer="lower-teeth"]').count(), 1);
    await page.getByRole('button', { name: enterName }).focus();
    assert.notEqual(await lower.getAttribute('transform'), lowerBefore);
    await page.keyboard.press('Enter');
    assert.equal(await page.getByRole('button', { name: enterName }).isDisabled(), true);
    await page.waitForTimeout(320);
    assert.notEqual(await lower.getAttribute('transform'), lowerBefore);
    assert.notEqual(await cheek.getAttribute('d'), cheekBefore);
    assert.equal(await upper.getAttribute('transform'), upperBefore);
    assert.equal(await page.getByTestId('mouth-passage').count(), 0);
    await page.getByTestId('breach-core').waitFor();
    await page.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 2500 });
    await page.close();
  } finally {
    await browser.close();
  }
});

test('activation-to-Core duration stays within the fast breach target', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    await page.getByRole('button', { name: enterName }).waitFor();
    const duration = await page.evaluate(async () => {
      const enter = document.querySelector('button[aria-label="Enter through the Guardian’s mouth"]');
      if (!(enter instanceof HTMLButtonElement)) throw new Error('Enter button missing');
      const start = performance.now();
      enter.click();
      await new Promise((resolve, reject) => {
        const observer = new MutationObserver(() => {
          if (document.querySelector('#core h2')) {
            clearTimeout(timeout);
            observer.disconnect();
            resolve();
          }
        });
        const timeout = setTimeout(() => { observer.disconnect(); reject(new Error('Core did not appear')); }, 3000);
        observer.observe(document.querySelector('#hero'), { childList: true, subtree: true });
      });
      return performance.now() - start;
    });
    console.log(`A.6 activation to Core: ${duration.toFixed(0)}ms`);
    // Browser scheduling can add a frame or two beyond the configured 1,600 ms timeline.
    assert.ok(duration >= 1300 && duration <= 1950, `entrance took ${duration.toFixed(0)}ms`);
    await page.close();
  } finally {
    await browser.close();
  }
});

test('pointer response and destination focus remain spatial and accessible', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    await page.getByRole('button', { name: enterName }).waitFor();
    const stage = page.locator('#hero');
    await page.mouse.move(100, 320);
    await page.waitForTimeout(50);
    const left = await stage.evaluate((node) => node.style.getPropertyValue('--look-x'));
    await page.mouse.move(1330, 320);
    await page.waitForTimeout(50);
    const right = await stage.evaluate((node) => node.style.getPropertyValue('--look-x'));
    assert.ok(Number.parseFloat(left) < 0 && Number.parseFloat(right) > 0);
    await page.getByRole('button', { name: /Skip introduction/i }).click();
    await page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Project Archives' }).focus();
    assert.equal(await page.locator('#core').getAttribute('data-active-route'), 'archives');
    assert.equal(await page.locator('#core svg [data-route="archives"]').getAttribute('data-state'), 'preview');
    await page.close();
  } finally {
    await browser.close();
  }
});

test('reduced motion, Space, and touch reach the Core', async () => {
  const browser = await chromium.launch();
  try {
    const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    await reduced.goto(site);
    await reduced.getByRole('button', { name: enterName }).focus();
    await reduced.keyboard.press('Space');
    await reduced.getByRole('heading', { name: /The human inside/i }).waitFor();
    assert.equal(await reduced.getByTestId('breach-core').count(), 0);
    await reduced.close();
    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await touch.goto(site);
    await touch.getByRole('button', { name: enterName }).tap();
    await touch.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 2500 });
    await touch.close();
  } finally {
    await browser.close();
  }
});

test('mouth control and content fit mobile and desktop widths', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
      await page.goto(site);
      const box = await page.getByRole('button', { name: enterName }).boundingBox();
      assert.ok(box && box.x >= 0 && box.x + box.width <= width);
      await page.getByRole('button', { name: /Skip introduction/i }).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(overflow <= 1, `horizontal overflow at ${width}px: ${overflow}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test('route change cancels entrance; Back and return permit repeated entry', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    await page.getByRole('button', { name: enterName }).click();
    await page.waitForTimeout(240);
    await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Projects' }).click();
    await page.waitForURL('**/?experience=guardian#projects');
    await page.waitForTimeout(1700);
    assert.equal(await page.getByTestId('breach-core').count(), 0);
    assert.ok(await page.getByRole('heading', { name: 'Projects', exact: true }).isVisible());
    await page.goBack();
    await page.locator('#hero').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: enterName }).click();
    await page.getByRole('heading', { name: /The human inside/i }).waitFor({ timeout: 2500 });
    await page.getByRole('button', { name: 'Skip dialogue' }).click();
    await page.getByRole('button', { name: 'Return to Guardian' }).click();
    assert.ok(await page.getByRole('button', { name: enterName }).isEnabled());
    await page.close();
  } finally {
    await browser.close();
  }
});
