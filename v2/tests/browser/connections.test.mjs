import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';

test('six neural routes preview, select, and return to one active connection', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    await page.getByRole('button', { name: /Skip introduction/ }).click();
    assert.equal(await page.locator('#core svg [data-state="selected"]').count(), 0);
    assert.equal(await page.locator('#core svg [data-route]').count(), 6);
    assert.match(await page.locator('#destination-panel').innerText(), /Choose a connection/);
    const pin = await page.getByRole('button', { name: 'Open Project Archives connection' }).boundingBox();
    assert.ok(pin && pin.width >= 44 && pin.height >= 44, 'visual pin retains a 44px hit target');

    const archives = page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Project Archives' });
    await archives.hover();
    assert.equal(await page.locator('#core svg [data-route="archives"]').getAttribute('data-state'), 'preview');
    assert.match(await page.locator('#destination-panel').innerText(), /Choose a connection/);
    await page.getByRole('button', { name: 'Open Project Archives connection' }).click();
    assert.equal(await page.locator('#core svg [data-route="archives"]').getAttribute('data-state'), 'selected');
    assert.equal(await page.locator('#core svg [data-state="selected"]').count(), 1);
    assert.match(await page.locator('#destination-panel').innerText(), /Cura/);

    const signal = page.locator('[aria-label="Domain destinations"] button').filter({ hasText: 'Signal' });
    await signal.focus();
    assert.equal(await page.locator('#core svg [data-route="signal"]').getAttribute('data-state'), 'preview');
    await page.keyboard.press('Space');
    assert.match(await page.locator('#destination-panel').innerText(), /Download PDF/);

    await page.getByRole('button', { name: 'Operator status' }).click();
    assert.ok(await page.getByRole('region', { name: 'Operator status' }).isVisible());
    assert.match(await page.getByRole('region', { name: 'Operator status' }).innerText(), /Active development/);
    await page.getByRole('button', { name: 'Follow Main Quest' }).click();
    assert.equal(await page.locator('#core svg [data-route="quest"]').getAttribute('data-state'), 'selected');
    assert.equal(await page.getByRole('button', { name: 'Operator status' }).getAttribute('aria-expanded'), 'false');
    assert.match(await page.locator('#destination-panel').innerText(), /SecureAgent Lab/);
    assert.ok(!await page.getByText(/36\/36 tests passed/).isVisible());
    await page.getByText('Build notes and reviewed evidence').click();
    assert.ok(await page.getByText(/36\/36 tests passed/).isVisible());
  } finally { await browser.close(); }
});

test('mobile touch and reduced motion retain destination list and content', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    await page.goto(site);
    await page.getByRole('button', { name: /Skip introduction/ }).tap();
    await page.getByRole('button', { name: /Arsenal/ }).tap();
    assert.match(await page.locator('#destination-panel').innerText(), /TypeScript/);
    assert.equal(await page.locator('#core svg [data-route="arsenal"]').getAttribute('data-state'), 'selected');
    await page.getByRole('button', { name: 'Operator status' }).tap();
    assert.ok(await page.getByRole('region', { name: 'Operator status' }).isVisible());
    const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(layout.scroll <= layout.width + 1, `horizontal overflow: ${layout.scroll} > ${layout.width}`);
    const animation = await page.locator('#core svg [data-route="arsenal"] path').last().evaluate((path) => getComputedStyle(path).animationName);
    assert.equal(animation, 'none');
  } finally { await browser.close(); }
});
