import { chromium } from "playwright";
import { mkdir, rename } from "node:fs/promises";

const site = process.env.PORTFOLIO_PREVIEW_URL;
if (!site) throw new Error("Set PORTFOLIO_PREVIEW_URL");
const out = new URL("../artifacts/h3b-review/", import.meta.url);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    await page.goto(site);
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole("navigation", { name: "Project index" }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: new URL(`index-${width}.png`, out).pathname });
    await page.locator("#project-mapetite h3").scrollIntoViewIfNeeded();
    await page.screenshot({ path: new URL(`mapetite-${width}.png`, out).pathname });
    await page.locator("#project-mapetite figure").scrollIntoViewIfNeeded();
    await page.screenshot({ path: new URL(`evidence-${width}.png`, out).pathname });
    await page.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out.pathname, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(site);
  await page.getByRole("link", { name: "Explore projects" }).click();
  const nav = page.getByRole("navigation", { name: "Project index" });
  await nav.getByRole("link", { name: /Rivet/ }).hover();
  await page.waitForTimeout(700);
  await nav.getByRole("link", { name: /Rivet/ }).click();
  await page.waitForTimeout(700);
  await page.goBack();
  await page.waitForTimeout(500);
  await page.close();
  const video = await page.video().path();
  await context.close();
  await rename(video, new URL("project-navigation.webm", out).pathname);
} finally {
  await browser.close();
}
console.log(out.pathname);
