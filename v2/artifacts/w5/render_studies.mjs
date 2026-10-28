import { chromium } from 'playwright';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const directory = fileURLToPath(new URL('./', import.meta.url));
const browser = await chromium.launch();
try {
  for (const name of (await readdir(directory)).filter((file) => /^(a|b)-(desktop|mobile)-(initial|interaction)\.svg$/.test(file))) {
    const width = name.includes('desktop') ? 1440 : 390;
    const height = name.includes('desktop') ? 900 : 844;
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(new URL(name, `file://${directory}`).href);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${directory}${name.replace('.svg', '.png')}` });
    await page.close();
  }
} finally { await browser.close(); }
