import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = `${process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/'}?experience=guardian`;

test('entrance, dialogue, connected domain destinations, and direct links work', async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(site);
      await page.getByRole('button', { name: /Enter through the Guardian/ }).waitFor();
      assert.ok(await page.getByRole('link', { name: 'Projects', exact: true }).isVisible());
      assert.ok(await page.getByRole('link', { name: 'Résumé', exact: true }).isVisible());
      await page.getByRole('button', { name: /Enter through the Guardian/ }).click();
      await page.getByRole('heading', { name: /The human inside/ }).waitFor();
      await page.getByRole('button', { name: 'Continue →' }).click();
      assert.ok(await page.getByText(/I’m Brandon. I build things/).isVisible());
      await page.getByRole('button', { name: 'Skip dialogue' }).click();
      await page.getByRole('heading', { name: /The Builder’s Domain/ }).waitFor();
      await page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Project Archives' }).click();
      assert.equal(await page.locator('#core svg [data-route="archives"]').getAttribute('data-state'), 'selected');
      const archive = await page.locator('#destination-panel').innerText();
      for (const name of ['Cura', 'Mapetite', 'ODDWORKS']) assert.ok(archive.includes(name));
      await page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Signal' }).click();
      assert.ok(await page.locator('#destination-panel a[href$="resume.html"]').isVisible());
      const layout = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(layout.scroll <= layout.viewport + 1, `horizontal overflow at ${width}px`);
      await page.close();
    }
  } finally { await browser.close(); }
});

test('skip and reduced motion reveal content without animation', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(site);
    await page.getByRole('button', { name: /Skip introduction/ }).click();
    assert.ok(await page.getByRole('heading', { name: /The Builder’s Domain/ }).isVisible());
    await page.getByRole('button', { name: /Return to Guardian/ }).click();
    await page.getByRole('button', { name: /Enter through the Guardian/ }).click();
    assert.ok(await page.getByRole('heading', { name: /The human inside/ }).isVisible());
    await page.getByRole('button', { name: 'Skip dialogue' }).click();
    assert.ok(await page.getByRole('heading', { name: /The Builder’s Domain/ }).isVisible());
    await page.close();
  } finally { await browser.close(); }
});

test('keyboard, touch, and missing artwork retain usable controls and content', async () => {
  const browser = await chromium.launch();
  try {
    const keyboard = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await keyboard.goto(site);
    await keyboard.getByRole('button', { name: /Enter through the Guardian/ }).focus();
    await keyboard.keyboard.press('Enter');
    assert.ok(await keyboard.getByRole('heading', { name: /The human inside/ }).isVisible());
    await keyboard.close();

    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    await touch.route('**/assets/guardian-organic-sheet-*.png', (route) => route.abort());
    await touch.route('**/assets/operator-core-concept-*.jpg', (route) => route.abort());
    await touch.goto(site);
    await touch.getByRole('button', { name: /Skip introduction/ }).tap();
    assert.ok(await touch.getByRole('heading', { name: /The Builder’s Domain/ }).isVisible());
    await touch.getByRole('button', { name: /Arsenal/ }).tap();
    assert.ok((await touch.locator('#destination-panel').innerText()).includes('TypeScript'));
    await touch.close();
  } finally { await browser.close(); }
});
