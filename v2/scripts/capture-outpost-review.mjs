// Repeatable local review capture. Output stays in ignored artifacts/h2d-review/.
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const site = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:4173/brandonhann.github.io/';
const output = new URL('../artifacts/h2d-review/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const samples = [];

try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const inspect = () => page.evaluate(() => document.querySelector('[data-render-status]')?.outpostInspection?.());
    await page.screenshot({ path: new URL(`opening-${width}.png`, output).pathname });
    samples.push({ width, state: 'idle', inspection: await inspect() });
    await page.getByRole('button', { name: 'Try read-only request' }).click();
    await page.locator('[data-phase="examine"]').waitFor();
    await page.screenshot({ path: new URL(`inspection-${width}.png`, output).pathname });
    samples.push({ width, state: 'examine', inspection: await inspect() });
    await page.locator('[data-phase="allow"]').waitFor();
    await page.screenshot({ path: new URL(`allow-${width}.png`, output).pathname });
    samples.push({ width, state: 'allow', inspection: await inspect() });
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByRole('button', { name: 'Try protected export' }).click();
    await page.locator('[data-phase="deny"]').waitFor();
    await page.screenshot({ path: new URL(`deny-${width}.png`, output).pathname });
    samples.push({ width, state: 'deny', inspection: await inspect() });
    await page.close();
  }

  for (const [action, label] of [['read-only', 'Try read-only request'], ['protected export', 'Try protected export']]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference', recordVideo: { dir: output.pathname, size: { width: 1440, height: 900 } } });
    const page = await context.newPage();
    await page.goto(`${site}outpost.html`);
    await page.locator('canvas').waitFor();
    await page.getByRole('button', { name: label }).click();
    await page.locator('[data-phase="audit"]').waitFor();
    await page.waitForTimeout(500);
    await page.close();
    const video = await page.video()?.path();
    await context.close();
    const target = new URL(`${action === 'read-only' ? 'allow' : 'deny'}-sequence.webm`, output).pathname;
    if (video) await rename(video, target);
    samples.push({ recording: action, path: target });
  }
} finally {
  await browser.close();
}

await writeFile(new URL('measurements.json', output), JSON.stringify(samples, null, 2));
process.stdout.write(`Review captures and measurements: ${output.pathname}\n`);
