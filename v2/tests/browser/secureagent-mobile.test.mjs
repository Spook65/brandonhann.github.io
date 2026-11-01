import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const base = process.env.PORTFOLIO_PREVIEW_URL ?? "http://127.0.0.1:4173/brandonhann.github.io/";
const prototype = `${base}prototypes/secureagent-mobile.html`;

test("the isolated mobile example requires an explicit check and stops the request", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, hasTouch: true });
      const errors = [];
      const requests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("request", (request) => requests.push(request.url()));
      await page.goto(prototype);
      assert.equal(await page.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0), true);

      const experience = page.getByRole("region", { name: "Illustrative SecureAgent request" });
      assert.equal(await experience.getAttribute("data-stage"), "idle");
      assert.equal(await page.getByText("DENY", { exact: true }).count(), 0);
      assert.equal(await page.getByRole("button", { name: /Check policy/ }).count(), 0);
      for (const link of [page.getByRole("link", { name: /Projects/ }), page.getByRole("link", { name: /Read the actual SecureAgent Lab case study/ })]) {
        const box = await link.boundingBox();
        assert.ok(box && box.height >= 44, `${width}px: navigation target is at least 44px high`);
      }

      const inspect = page.getByRole("button", { name: /Inspect a request/ });
      assert.ok((await inspect.boundingBox()).height >= 44);
      await inspect.tap();
      assert.equal(await experience.getAttribute("data-stage"), "selected");
      assert.equal(await page.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0), true);
      assert.match(await experience.innerText(), /send_message/);
      assert.match(await experience.innerText(), /recipient:unapproved/);
      assert.equal(await page.getByText("DENY", { exact: true }).count(), 0);
      const check = page.getByRole("button", { name: /Check policy/ });
      assert.ok((await check.boundingBox()).height >= 44);
      await check.tap();
      assert.equal(await experience.getAttribute("data-stage"), "result");
      assert.equal(await page.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0), true);
      assert.match(await page.getByRole("status").innerText(), /DENY.*Request stopped/s);
      assert.match(await page.getByRole("status").innerText(), /mock tool is not invoked/);
      assert.match(await page.getByRole("status").innerText(), /RECIPIENT_NOT_APPROVED/);
      await page.waitForTimeout(550);
      assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      assert.equal(requests.some((url) => /^https?:/.test(url) && !url.startsWith(new URL(base).origin)), false);
      const reset = page.getByRole("button", { name: /Reset example/ });
      assert.ok((await reset.boundingBox()).height >= 44);
      await reset.tap();
      assert.equal(await experience.getAttribute("data-stage"), "idle");
      assert.deepEqual(errors, []);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("ordinary homepage does not request the isolated interaction or courier art", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(base);
    await page.getByRole("heading", { name: "Brandon Hann.", exact: true }).waitFor();
    assert.equal(requests.some((url) => /secureagent-mobile|courier-(?:waiting|inspecting|denied)/.test(url)), false);
  } finally { await browser.close(); }
});

test("keyboard, reduced motion, and no-JavaScript case-study fallback work", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await page.goto(prototype);
    const inspect = page.getByRole("button", { name: /Inspect a request/ });
    await inspect.focus();
    assert.equal(await inspect.evaluate((button) => getComputedStyle(button).outlineStyle), "solid");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: /Check policy/ }).focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator('[data-stage="result"]').count(), 1);
    assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length), 0);
    await page.close();

    const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    await noJs.goto(prototype);
    assert.match(await noJs.locator("main").innerText(), /One request/);
    const caseStudy = noJs.getByRole("link", { name: /Read the actual SecureAgent Lab case study/ });
    assert.equal(await caseStudy.count(), 1);
    await caseStudy.click();
    assert.match(noJs.url(), /#project-secureagent$/);
    await noJs.getByRole("heading", { name: "SecureAgent Lab", exact: true }).waitFor();
  } finally { await browser.close(); }
});
