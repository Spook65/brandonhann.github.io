import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('no-JavaScript homepage retains identity, navigation, projects, and résumé', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    await page.goto(site);
    assert.equal(await page.getByRole('heading', { name: /Hey, I’m Brandon\./ }).count(), 1);
    assert.ok(await page.getByRole('link', { name: /Explore projects/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: /Read résumé/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'About', exact: true }).isVisible());
    assert.equal(await page.getByRole('button', { name: /Menu/ }).isVisible(), false);
    await page.getByRole('link', { name: /Explore projects/ }).click();
    assert.match(page.url(), /#projects$/);
    assert.ok(await page.getByRole('heading', { name: 'Selected work.' }).isVisible());
    await page.getByRole('link', { name: /Read résumé/ }).click();
    assert.match(page.url(), /\/brandonhann\.github\.io\/resume\.html$/);
    assert.ok(await page.getByRole('heading', { name: 'Brandon Hann', level: 1 }).isVisible());
  } finally { await browser.close(); }
});

test('hydration keeps one homepage and interactive navigation without warnings', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(`${site}#project-oddworks`);
    await page.getByRole('button', { name: /ODDWORKS/ }).waitFor();
    assert.equal(await page.getByRole('heading', { name: /Hey, I’m Brandon\./ }).count(), 1);
    assert.equal(await page.getByRole('button', { name: /ODDWORKS/ }).getAttribute('aria-pressed'), 'true');
    const menu = page.getByRole('button', { name: /Menu/ });
    await menu.tap();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    await page.getByRole('button', { name: /Mapetite/ }).tap();
    assert.match(page.url(), /#project-mapetite$/);
    await page.goBack();
    assert.equal(await page.getByRole('button', { name: /ODDWORKS/ }).getAttribute('aria-pressed'), 'true');
    await page.goForward();
    assert.equal(await page.getByRole('button', { name: /Mapetite/ }).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});
