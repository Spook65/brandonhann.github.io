import { chromium } from 'playwright';
import { rename } from 'node:fs/promises';

const site = 'http://127.0.0.1:4173/brandonhann.github.io/prototypes/builders-desk.html';
const out = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch();

for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(site);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('canvas[data-ready="true"]').waitFor();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}desk-initial-${width}.png`, fullPage: true });
  const portrait = page.getByRole('button', { name: /Develop Brandon/ });
  if (width === 390) await portrait.tap();
  else {
    const box = await portrait.boundingBox();
    if (!box) throw new Error('Portrait missing');
    for (let i = 0; i < 15; i++) {
      await page.mouse.move(box.x + box.width * (.15 + i * .05), box.y + box.height * (.32 + Math.sin(i / 2) * .22));
      await page.waitForTimeout(35);
    }
  }
  await page.screenshot({ path: `${out}desk-revealed-${width}.png`, fullPage: true });
  await page.getByRole('button', { name: /Move closer to the Mapetite/ }).click();
  await page.locator('[data-scene="investigating"]').waitFor();
  await page.screenshot({ path: `${out}desk-project-${width}.png`, fullPage: true });
  await page.getByRole('button', { name: /Back to the desk/ }).click();
  await page.locator('[data-scene="desk"]').waitFor();
  await page.screenshot({ path: `${out}desk-return-${width}.png`, fullPage: true });
  await page.getByRole('button', { name: /Lift the folded desk note/ }).click();
  await page.waitForTimeout(550);
  await page.screenshot({ path: `${out}desk-discovery-${width}.png`, fullPage: true });
  await context.close();
}

const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
const page = await context.newPage();
await page.goto(site);
await page.locator('canvas[data-ready="true"]').waitFor();
await page.waitForTimeout(700);
const portrait = page.getByRole('button', { name: /Develop Brandon/ });
const box = await portrait.boundingBox();
if (!box) throw new Error('Portrait missing');
for (let i = 0; i < 19; i++) {
  await page.mouse.move(box.x + box.width * (.12 + i * .04), box.y + box.height * (.28 + Math.sin(i / 2) * .22));
  await page.waitForTimeout(45);
}
await page.getByRole('button', { name: /Move closer to the Mapetite/ }).click();
await page.locator('[data-scene="investigating"]').waitFor();
await page.waitForTimeout(750);
await page.getByRole('button', { name: /Back to the desk/ }).click();
await page.locator('[data-scene="desk"]').waitFor();
await page.waitForTimeout(500);
await page.getByRole('button', { name: /Lift the folded desk note/ }).click();
await page.waitForTimeout(850);
const video = page.video();
await context.close();
if (video) await rename(await video.path(), `${out}builders-desk.webm`);
await browser.close();
