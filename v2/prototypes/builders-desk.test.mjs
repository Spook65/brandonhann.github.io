import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright';

const site = process.env.DESK_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/prototypes/builders-desk.html';

async function withPage(options, run) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage(options);
    await run(page);
  } finally { await browser.close(); }
}

test('desk entry, portrait reveal, project focus and exact return preserve the portrait', async () => {
  await withPage({ viewport: { width: 1440, height: 900 } }, async (page) => {
    await page.goto(site);
    const room = page.getByRole('region', { name: /Builder's Desk interactive scene/ });
    assert.equal(await room.getAttribute('data-scene'), 'desk');
    await page.locator('canvas[data-ready="true"]').waitFor();
    const canvas = page.locator('canvas');
    const before = await canvas.evaluate((element) => element.toDataURL());
    const portrait = page.getByRole('button', { name: /Develop Brandon/ });
    const box = await portrait.boundingBox();
    assert.ok(box);
    await page.mouse.move(box.x + box.width * .45, box.y + box.height * .45);
    await page.mouse.move(box.x + box.width * .55, box.y + box.height * .5);
    const after = await canvas.evaluate((element) => element.toDataURL());
    assert.notEqual(after, before, 'pointer must change the actual portrait texture');
    assert.equal(await room.getAttribute('data-portrait'), 'revealed');
    await page.getByRole('button', { name: /Move closer to the Mapetite/ }).click();
    await page.locator('[data-scene="investigating"]').waitFor();
    assert.match(page.url(), /#mapetite$/);
    assert.ok(await page.getByRole('heading', { name: 'Mapetite.' }).isVisible());
    assert.ok(await page.getByRole('link', { name: /Read the README/ }).isVisible());
    await page.getByRole('button', { name: /Back to the desk/ }).click();
    await page.locator('[data-scene="desk"]').waitFor();
    assert.equal(await canvas.evaluate((element) => element.toDataURL()), after, 'return should retain the revealed desk state');
    assert.equal(await room.getAttribute('data-portrait'), 'revealed');
    assert.equal(await page.evaluate(() => location.hash), '');
  });
});

test('keyboard, touch, reduced motion, optional note and direct navigation work', async () => {
  await withPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' }, async (page) => {
    await page.goto(site);
    await page.locator('canvas[data-ready="true"]').waitFor();
    await page.getByRole('button', { name: /Develop Brandon/ }).tap();
    assert.equal(await page.locator('[data-portrait]').getAttribute('data-portrait'), 'revealed');
    const note = page.getByRole('button', { name: /Lift the folded desk note/ });
    await note.tap();
    assert.equal(await page.getByRole('button', { name: /Fold the desk note/ }).getAttribute('aria-expanded'), 'true');
    assert.ok((await page.getByRole('button', { name: /Fold the desk note/ }).innerText()).length > 30);
    await page.getByRole('button', { name: /Move closer to the Mapetite/ }).focus();
    await page.keyboard.press('Enter');
    await page.locator('[data-scene="investigating"]').waitFor();
    await page.goBack();
    await page.locator('[data-scene="desk"]').waitFor();
    assert.equal(await page.getByRole('button', { name: /Fold the desk note/ }).getAttribute('aria-expanded'), 'true');
    const projects = page.getByRole('link', { name: 'Projects', exact: true });
    const resume = page.getByRole('link', { name: 'Résumé', exact: true });
    assert.match(await projects.getAttribute('href'), /#projects$/);
    assert.match(await resume.getAttribute('href'), /resume\.html$/);
    assert.ok(await projects.isVisible() && await resume.isVisible());
  });
  await withPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, async (page) => {
    await page.goto(site);
    await page.locator('canvas[data-ready="true"]').waitFor();
    await page.getByRole('button', { name: /Develop Brandon/ }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-portrait]').getAttribute('data-portrait'), 'revealed');
    await page.goto(`${site}#mapetite`);
    await page.locator('[data-scene="investigating"]').waitFor();
    await page.getByRole('button', { name: /Back to the desk/ }).click();
    await page.locator('[data-scene="desk"]').waitFor();
  });
});

test('camera move can be reversed before focus settles', async () => {
  await withPage({ viewport: { width: 1440, height: 900 } }, async (page) => {
    await page.goto(site);
    await page.getByRole('button', { name: /Move closer to the Mapetite/ }).click();
    await page.locator('[data-scene="focusing"]').waitFor();
    await page.getByRole('button', { name: /Back to the desk/ }).click();
    await page.locator('[data-scene="desk"]').waitFor();
    assert.equal(await page.evaluate(() => location.hash), '');
  });
});

test('Canvas failure retains the photo and professional links, and page fits narrow screens', async () => {
  await withPage({ viewport: { width: 320, height: 750 } }, async (page) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null;
    });
    await page.goto(site);
    assert.ok(await page.getByText(/Portrait effect unavailable/).isVisible());
    assert.ok(await page.getByRole('img', { name: /Brandon Hann in a casual portrait/ }).isVisible());
    assert.ok(await page.getByRole('link', { name: 'Projects', exact: true }).isVisible());
  });
  await withPage({ viewport: { width: 320, height: 750 } }, async (page) => {
    await page.goto(site);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true, `horizontal overflow at ${width}px`);
    }
  });
});

test('idle scene does not repaint Canvas', async () => {
  await withPage({ viewport: { width: 1440, height: 900 } }, async (page) => {
    await page.goto(site);
    const canvas = page.locator('canvas[data-ready="true"]');
    await canvas.waitFor();
    await page.waitForTimeout(350);
    const paints = await canvas.getAttribute('data-paints');
    await page.waitForTimeout(1200);
    assert.equal(await canvas.getAttribute('data-paints'), paints);
  });
});
