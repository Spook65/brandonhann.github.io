import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('welcoming homepage introduces Brandon without loading Guardian artwork', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const requested = [];
    page.on('request', (request) => requested.push(request.url()));
    await page.goto(site);
    await page.getByRole('heading', { name: /Hey, I’m Brandon\./ }).waitFor();
    assert.ok(await page.getByRole('img', { name: /Brandon Hann in a casual portrait/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Projects', exact: true }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Résumé', exact: true }).isVisible());
    assert.equal(requested.some((url) => /guardian-organic|mouth-cavity-organic|operator-core-concept|GuardianExperience/.test(url)), false);
    await page.getByRole('link', { name: /Enter The Inner Workings/ }).click();
    await page.getByRole('button', { name: /Enter through the Guardian/ }).waitFor();
    assert.match(page.url(), /experience=guardian/);
    await page.getByRole('link', { name: /Return to homepage/ }).first().click();
    await page.getByRole('heading', { name: /Hey, I’m Brandon\./ }).waitFor();
  } finally { await browser.close(); }
});

test('project explorer responds to hover, focus, selection, and Patch interaction', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(site);
    const patch = page.getByRole('button', { name: /Wave to Patch/ });
    const oddworks = page.getByRole('button', { name: /ODDWORKS/ });
    await oddworks.hover();
    assert.equal(await patch.getAttribute('data-pose'), 'inspect');
    assert.ok(await page.getByRole('heading', { name: 'ODDWORKS' }).isVisible());
    await oddworks.click();
    assert.equal(await oddworks.getAttribute('aria-pressed'), 'true');
    assert.match(page.url(), /#project-oddworks$/);
    await patch.click();
    assert.equal(await patch.getAttribute('data-pose'), 'wave');
    const mapetite = page.getByRole('button', { name: /Mapetite/ });
    await mapetite.focus();
    assert.ok(await page.getByRole('heading', { name: 'Mapetite' }).isVisible());
  } finally { await browser.close(); }
});

test('mobile project selection, Back, menu, and reduced motion remain usable', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
      await page.goto(site);
      const menu = page.getByRole('button', { name: /Menu/ });
      await menu.tap();
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      assert.ok(await page.getByRole('link', { name: 'About', exact: true }).isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      await page.getByRole('button', { name: /SecureAgent Lab/ }).tap();
      const preview = page.locator('#project-preview');
      assert.equal(await page.getByRole('button', { name: /SecureAgent Lab/ }).getAttribute('aria-pressed'), 'true');
      const box = await preview.boundingBox();
      assert.ok(box && box.y < 844 && box.y + box.height > 0, `selected preview not in view at ${width}px`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true);
      await page.goBack();
      assert.equal(await page.getByRole('button', { name: /Cura/ }).getAttribute('aria-pressed'), 'true');
      await page.close();
    }
  } finally { await browser.close(); }
});
