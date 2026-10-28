import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('homepage remains usable without downloading the optional world', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const requests = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(site);
    await page.getByRole('heading', { name: /Hey, I’m Brandon/ }).waitFor();
    assert.ok(await page.getByRole('link', { name: /Explore projects/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: /Read résumé/ }).isVisible());
    assert.equal(requests.some((url) => /SecurityOutpost-.*\.(js|css)$/.test(url)), false);
    assert.equal(requests.some((url) => /guardian-organic|human-core-chamber/.test(url)), false);
  } finally { await browser.close(); }
});

test('outpost entry is usable without JavaScript and does not fetch portrait media', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    const requests = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(`${site}outpost.html`);
    assert.ok(await page.getByRole('heading', { name: /Every request meets a rule/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Projects' }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Résumé' }).isVisible());
    assert.equal(requests.some((url) => /brandon-about|guardian-organic|SecurityOutpost/.test(url)), false);
  } finally { await browser.close(); }
});

test('clicking the visible request object begins Scout’s sequence', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.mouse.click(640, 338);
    await page.getByText(/State: received/).waitFor();
    assert.match(await page.getByText(/Scout: I have a request/).textContent(), /synthetic report/);
  } finally { await browser.close(); }
});

test('outpost supports a repeatable request, movement, and return', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(site);
    await page.getByRole('link', { name: /Enter the outpost/ }).click();
    await page.getByRole('heading', { name: /Every request meets a rule/ }).waitFor();
    await page.locator('canvas').waitFor();
    assert.equal(await page.locator('canvas').count(), 1);
    assert.equal(await page.getByRole('link', { name: 'Projects', exact: true }).count(), 1);
    await page.getByRole('button', { name: /Move closer/ }).click();
    assert.equal(await page.getByRole('button', { name: /Step back/ }).isEnabled(), true);
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.getByRole('button', { name: /Step back/ }).isDisabled(), true);
    await page.getByRole('button', { name: /Send request to Scout/ }).click();
    await page.getByText(/State: received/).waitFor();
    await page.getByText(/State: allowed/).waitFor({ timeout: 6000 });
    await page.getByText(/State: idle · ready to repeat/).waitFor({ timeout: 6000 });
    await page.getByRole('button', { name: 'Protected export' }).click();
    await page.getByRole('button', { name: /Send request to Scout/ }).click();
    await page.getByText(/State: denied/).waitFor({ timeout: 6000 });
    await page.goBack();
    await page.getByRole('heading', { name: /Hey, I’m Brandon/ }).waitFor();
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('touch, reduced motion, canvas failure, and mobile layout retain the semantic path', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.getByRole('heading', { name: /Every request meets a rule/ }).waitFor();
    await page.getByRole('button', { name: 'Protected export' }).tap();
    await page.getByRole('button', { name: /Send request to Scout/ }).tap();
    await page.getByText(/State: denied/).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
    await page.getByRole('link', { name: 'Résumé' }).tap();
    await page.waitForURL(/resume\.html$/);
    assert.match(page.url(), /resume\.html$/);
    const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return original.call(this, type, ...args);
      };
    });
    await fallback.goto(`${site}outpost.html`);
    await fallback.getByText('The scene is unavailable.').waitFor();
    assert.ok(await fallback.getByRole('button', { name: /Send request to Scout/ }).isVisible());
    assert.ok(await fallback.getByRole('link', { name: 'Projects' }).isVisible());
  } finally { await browser.close(); }
});
