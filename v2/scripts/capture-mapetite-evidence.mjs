import { chromium } from "playwright";
import { mkdir, rename } from "node:fs/promises";

const site = process.env.PORTFOLIO_PREVIEW_URL;
if (!site) throw new Error("Set PORTFOLIO_PREVIEW_URL");
const out = new URL("../artifacts/h3c-review/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto(`${site}#project-mapetite`);
    await page.evaluate(() => document.fonts.ready);
    const figure = page.locator("#project-mapetite figure");
    await figure.locator("figcaption").scrollIntoViewIfNeeded();
    await page.screenshot({ path: new URL(`default-${width}.png`, out).pathname });
    await figure.getByRole("button", { name: /Multiple matching places/ }).click();
    await figure.getByRole("status").scrollIntoViewIfNeeded();
    await page.screenshot({ path: new URL(`trace-${width}.png`, out).pathname });
    await page.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out.pathname, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(`${site}#project-mapetite`);
  const figure = page.locator("#project-mapetite figure");
  await figure.locator("figcaption").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  for (const name of ["No matching place", "Multiple matching places", "One matching place"]) {
    await figure.getByRole("button", { name: new RegExp(name) }).click();
    await figure.getByRole("status").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }
  await page.close();
  const video = await page.video().path();
  await context.close();
  await rename(video, new URL("validation-interaction.webm", out).pathname);
} finally {
  await browser.close();
}
console.log(out.pathname);
