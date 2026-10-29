import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';
const phase = (page, name) => page.locator(`[data-phase="${name}"]`);

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

test('outpost entry is useful without JavaScript or homepage portrait media', async () => {
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

test('one opening demonstration delivers the allowed sample and then rests', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await phase(page, 'pickup').waitFor({ timeout: 3000 });
    await phase(page, 'travel').waitFor();
    await phase(page, 'allow').waitFor({ timeout: 6000 });
    assert.ok(await page.getByText(/Trust gate \/ open/).isVisible());
    assert.ok(await page.locator('[data-bubble="sentinel"][data-visible="true"]').isVisible());
    await phase(page, 'audit').waitFor({ timeout: 6000 });
    await phase(page, 'idle').waitFor({ timeout: 6000 });
    await page.waitForTimeout(1100);
    assert.equal(await phase(page, 'idle').count(), 1, 'opening demonstration should not repeat');
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test('reduced motion requires an explicit choice; deny remains blocked and replayable', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.waitForTimeout(900);
    assert.equal(await phase(page, 'idle').count(), 1);
    await page.getByRole('button', { name: /Try protected export/ }).click();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
    assert.ok(await page.getByText(/Trust gate \/ locked/).isVisible());
    await phase(page, 'audit').waitFor({ timeout: 6000 });
    await page.getByText('What happened at the checkpoint').click();
    assert.match(await page.locator('details').innerText(), /Policy: DENY/);
    assert.match(await page.locator('details').innerText(), /BLOCKED/);
    await phase(page, 'idle').waitFor({ timeout: 6000 });
    await page.getByRole('button', { name: /Replay protected export/ }).click();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
  } finally { await browser.close(); }
});

test('pause, reset, pointer pickup, and browser Back remain reversible', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(site);
    await page.getByRole('link', { name: /Enter the outpost/ }).click();
    await page.locator('canvas').waitFor();
    await page.mouse.click(615, 391);
    await phase(page, 'pickup').waitFor();
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.waitForTimeout(1100);
    assert.equal(await phase(page, 'pickup').count(), 1);
    await page.getByRole('button', { name: 'Resume' }).click();
    await phase(page, 'travel').waitFor();
    await page.getByRole('button', { name: 'Reset' }).click();
    assert.equal(await phase(page, 'idle').count(), 1);
    await page.goBack();
    await page.getByRole('heading', { name: /Hey, I’m Brandon/ }).waitFor();
    await page.goForward();
    await page.locator('canvas').waitFor();
    assert.equal(await phase(page, 'idle').count(), 1);
  } finally { await browser.close(); }
});

test('the transaction waits while its world is offscreen, then resumes', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.getByRole('button', { name: /Replay read-only/ }).click();
    await phase(page, 'pickup').waitFor();
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '1600px';
      document.body.append(spacer);
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1250);
    assert.equal(await phase(page, 'pickup').count(), 1);
    await page.evaluate(() => window.scrollTo(0, 0));
    await phase(page, 'travel').waitFor({ timeout: 4000 });
  } finally { await browser.close(); }
});

test('touch and keyboard can reach the scene outcome without losing mobile context', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.getByRole('button', { name: /Try protected export/ }).tap();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
    assert.ok(await page.locator('[data-bubble="sentinel"][data-visible="true"]').isVisible());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
    await phase(page, 'idle').waitFor({ timeout: 6000 });
    const replay = page.getByRole('button', { name: /Replay protected export/ });
    await replay.focus();
    await page.keyboard.press('Enter');
    await phase(page, 'pickup').waitFor();
    await page.getByRole('link', { name: 'Résumé' }).tap();
    await page.waitForURL(/resume\.html$/);
  } finally { await browser.close(); }
});

test('WebGL failure retains the semantic simulation and direct links', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return original.call(this, type, ...args);
      };
    });
    await page.goto(`${site}outpost.html`);
    await page.getByText('The scene is unavailable.').waitFor();
    await page.getByRole('button', { name: /Try protected export/ }).click();
    await phase(page, 'deny').waitFor({ timeout: 6000 });
    assert.ok(await page.getByRole('link', { name: 'Projects' }).isVisible());
  } finally { await browser.close(); }
});
