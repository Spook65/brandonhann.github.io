import { chromium } from 'playwright';
import { rename } from 'node:fs/promises';

const site = 'http://127.0.0.1:4178/brandonhann.github.io/prototypes/living-logbook.html';
const out = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch();

for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1, hasTouch: width === 390, isMobile: width === 390 });
  const page = await context.newPage();
  await page.goto(site);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('canvas[data-ready="true"]').waitFor();
  await page.screenshot({ path: `${out}initial-${width}.png`, fullPage: true });
  const portrait = page.getByRole('button', { name: /Develop Brandon/ });
  if (width === 390) await portrait.tap();
  else {
    const box = await portrait.boundingBox();
    if (!box) throw new Error('Portrait is missing');
    for (let i = 0; i < 11; i++) {
      await page.mouse.move(box.x + box.width * (.15 + i * .07), box.y + box.height * (.3 + Math.sin(i / 2) * .22));
      await page.waitForTimeout(35);
    }
  }
  await page.screenshot({ path: `${out}revealed-${width}.png`, fullPage: true });
  await page.getByRole('button', { name: /Follow this thread/ }).click();
  await page.getByRole('heading', { name: 'Mapetite.' }).waitFor();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${out}project-${width}.png`, fullPage: true });
  await page.getByRole('button', { name: /Close this page/ }).click();
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
const page = await context.newPage();
await page.goto(site);
await page.locator('canvas[data-ready="true"]').waitFor();
await page.waitForTimeout(450);
const portrait = page.getByRole('button', { name: /Develop Brandon/ });
const box = await portrait.boundingBox();
if (!box) throw new Error('Portrait is missing');
for (let i = 0; i < 23; i++) {
  await page.mouse.move(box.x + box.width * (.12 + i * .035), box.y + box.height * (.27 + Math.sin(i / 2) * .22));
  await page.waitForTimeout(45);
}
await page.waitForTimeout(500);
await page.getByRole('button', { name: /Follow this thread/ }).click();
await page.waitForTimeout(1100);
await page.getByRole('button', { name: /Close this page/ }).click();
await page.waitForTimeout(950);
const video = page.video();
await context.close();
if (video) await rename(await video.path(), `${out}living-logbook.webm`);
await browser.close();
