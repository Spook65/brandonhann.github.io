import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const site = process.env.PORTFOLIO_PREVIEW_URL ?? "http://127.0.0.1:4173/brandonhann.github.io/";

test("desktop routes preview canonical project facts and navigate with native hashes", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    const network = page.getByRole("navigation", { name: "Signal Network project destinations" });
    const links = network.locator("svg a");
    assert.equal(await links.count(), 4);
    assert.deepEqual(
      await network.locator("[data-project-mark]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-project-mark"))),
      ["location-validation", "matching", "policy-boundary", "server-owned-state"],
    );
    assert.equal(await network.locator("path[class*='selectedRoute']").count(), 0);
    const secure = network.getByRole("link", { name: "Open SecureAgent Lab case study" });
    await secure.hover();
    const highlighted = network.locator("path[class*='selectedRoute']");
    await highlighted.waitFor();
    assert.equal(await highlighted.getAttribute("d"), "M220 205 H359 L421 215 H505");
    assert.match(await highlighted.evaluate((node) => getComputedStyle(node).filter), /201, 167, 255/);
    assert.match(
      await network.locator("a[data-preview='true'] [class*='terminalShell']").evaluate((node) => getComputedStyle(node).animationName),
      /terminal-acknowledge/,
    );
    assert.match(await page.locator("[aria-live='polite']").first().innerText(), /deterministic policy decides before simulated execution/i);
    await secure.click();
    assert.match(page.url(), /#project-secureagent$/);
    await page.goBack();
    assert.equal(new URL(page.url()).hash, "");
    await page.close();
  } finally { await browser.close(); }
});

test("keyboard, reduced motion, and no-JavaScript links retain a useful static network", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    await page.goto(site);
    const network = page.getByRole("navigation", { name: "Signal Network project destinations" });
    const rivet = network.getByRole("link", { name: "Open Rivet case study" });
    await rivet.focus();
    assert.match(await page.locator("[aria-live='polite']").first().innerText(), /ownership checks/i);
    assert.equal(await page.locator("[class*='courierReact']").evaluate((node) => getComputedStyle(node).animationName), "none");
    assert.equal(await network.locator("a[data-preview='true'] [class*='terminalShell']").evaluate((node) => getComputedStyle(node).animationName), "none");
    await page.keyboard.press("Enter");
    assert.match(page.url(), /#project-rivet$/);
    await page.close();

    const staticPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    await staticPage.goto(site);
    assert.equal(await staticPage.getByRole("navigation", { name: "Signal Network project destinations" }).getByRole("link").count(), 4);
    await staticPage.getByRole("navigation", { name: "Signal Network project destinations" }).getByRole("link", { name: "Open Mapetite case study" }).click();
    assert.match(staticPage.url(), /#project-mapetite$/);
    await staticPage.close();
  } finally { await browser.close(); }
});

test("courier and terminal react briefly, then settle without idle animation", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(site);
    await page.waitForTimeout(600);
    assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length), 0);
    await page.getByRole("navigation", { name: "Signal Network project destinations" }).getByRole("link", { name: "Open Mapetite case study" }).hover();
    assert.ok(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length) >= 2);
    await page.waitForTimeout(700);
    assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length), 0);
  } finally { await browser.close(); }
});

test("mobile keeps the project index early without duplicating the network", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, hasTouch: true });
      await page.goto(site);
      assert.equal(await page.getByRole("navigation", { name: "Signal Network project destinations" }).isVisible(), false);
      assert.equal(await page.getByRole("navigation", { name: "Project index" }).getByRole("link").count(), 4);
      const y = await page.locator("#projects h2").evaluate((node) => node.getBoundingClientRect().top);
      assert.ok(y < 900, `Projects heading should enter first viewport at ${width}px`);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await page.getByRole("link", { name: "Explore projects" }).tap();
      assert.match(page.url(), /#projects$/);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("compact desktop project terminals retain touch targets and direct destinations", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 900 }, hasTouch: true });
    await page.goto(site);
    const links = page.getByRole("navigation", { name: "Signal Network project destinations" }).getByRole("link");
    for (const link of await links.all()) {
      const box = await link.boundingBox();
      assert.ok(box && box.height >= 44, `terminal must be at least 44px tall: ${box?.height}`);
    }
    await links.nth(2).tap();
    assert.match(page.url(), /#project-secureagent$/);
  } finally { await browser.close(); }
});
