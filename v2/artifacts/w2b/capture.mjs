import { chromium } from 'playwright';
import { rename } from 'node:fs/promises';

const site = 'http://127.0.0.1:4178/brandonhann.github.io/';
const out = new URL('./', import.meta.url).pathname;
const browser = await chromium.launch();

for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
  await page.goto(site);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}desktop-${width}.png`, fullPage: true });
  await page.close();
}

{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(site);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}font-inter.png` });
  await page.addStyleTag({ content: '[class*="welcome"] { --font-body: "Source Sans 3 Variable", sans-serif; --font-display: "Fraunces Variable", serif; --font-detail: "Source Sans 3 Variable", sans-serif; }' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}font-prior-style.png` });
  await page.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
  const page = await context.newPage();
  await page.goto(site);
  await page.locator('#project-preview canvas').scrollIntoViewIfNeeded();
  const box = await page.locator('#project-preview canvas').boundingBox();
  if (!box) throw new Error('Canvas is missing');
  await page.mouse.move(box.x + 30, box.y + box.height / 2);
  for (let i = 0; i < 16; i++) {
    await page.mouse.move(box.x + 30 + i * (box.width - 60) / 15, box.y + box.height / 2 + Math.sin(i / 2) * 50);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(900);
  const video = page.video();
  await context.close();
  if (video) await rename(await video.path(), `${out}pointer.webm`);
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: out, size: { width: 1440, height: 900 } } });
  const page = await context.newPage();
  await page.goto(site);
  await page.getByRole('button', { name: /Mapetite/ }).click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /ODDWORKS/ }).click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /SecureAgent Lab/ }).click();
  await page.waitForTimeout(900);
  const video = page.video();
  await context.close();
  if (video) await rename(await video.path(), `${out}project-selection.webm`);
}

await browser.close();
