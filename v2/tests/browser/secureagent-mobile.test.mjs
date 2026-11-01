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
      assert.equal(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);

      const experience = page.getByRole("region", { name: "Illustrative SecureAgent request" });
      assert.equal(await experience.getAttribute("data-stage"), "idle");
      assert.equal(await page.getByRole("status").count(), 0);
      assert.equal(await page.getByRole("button", { name: /Check policy/ }).count(), 0);
      for (const link of [page.getByRole("link", { name: /Projects/ }), page.getByRole("link", { name: /Read the actual SecureAgent Lab case study/ })]) {
        const box = await link.boundingBox();
        assert.ok(box && box.height >= 44, `${width}px: navigation target is at least 44px high`);
      }

      const inspect = page.getByRole("button", { name: /Inspect a request/ });
      assert.ok((await inspect.boundingBox()).height >= 44);
      await inspect.tap();
      assert.equal(await experience.getAttribute("data-stage"), "selected");
      assert.equal(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);
      assert.match(await experience.innerText(), /send_message/);
      assert.match(await experience.innerText(), /recipient:unapproved/);
      assert.equal(await page.getByRole("status").count(), 0);
      const check = page.getByRole("button", { name: /Check policy/ });
      assert.ok((await check.boundingBox()).height >= 44);
      await check.tap();
      assert.equal(await experience.getAttribute("data-stage"), "result");
      assert.equal(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);
      assert.equal(await page.getByRole("status").count(), 1);
      assert.match(await page.getByRole("status").innerText(), /DENY.*Request stopped/s);
      assert.match(await page.getByRole("status").innerText(), /mock tool is not invoked/);
      assert.match(await page.getByRole("status").innerText(), /RECIPIENT_NOT_APPROVED/);
      await page.waitForTimeout(850);
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
    assert.equal(await page.locator('[data-gate-state="pending"]').evaluate((node) => getComputedStyle(node).opacity), "0");
    assert.equal(await page.locator('[data-gate-state="denied"]').evaluate((node) => getComputedStyle(node).opacity), "1");
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

test("packet stops before the gate, the visual sequence settles, and reset cancels motion", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(prototype);
      await page.getByRole("button", { name: /Inspect a request/ }).click();
      await page.getByRole("button", { name: /Check policy/ }).click();
      assert.equal(await page.getByRole("status").count(), 1, "semantic result appears immediately");
      await page.evaluate(() => document.getAnimations().forEach((animation) => animation.pause()));
      const samples = [];
      for (const time of [0, 130, 260, 400, 520, 650, 720]) {
        samples.push(await page.evaluate((time) => {
          document.getAnimations().forEach((animation) => { animation.currentTime = time; });
          const packet = document.querySelector('[data-visual="request-packet"]');
          const gate = document.querySelector('[data-visual="policy-gate"]');
          const preparing = document.querySelector('[data-pose="preparing"]');
          const stopping = document.querySelector('[data-pose="stopping"]');
          const denial = document.querySelector('[data-gate-label="denied"]');
          if (!packet || !gate || !preparing || !stopping || !denial) return null;
          const p = packet.getBoundingClientRect();
          const g = gate.getBoundingClientRect();
          return {
            clearance: g.left - p.right,
            packetX: p.left,
            preparing: Number(getComputedStyle(preparing).opacity),
            stopping: Number(getComputedStyle(stopping).opacity),
            denial: Number(getComputedStyle(denial).opacity),
            gateColor: getComputedStyle(gate).borderColor,
          };
        }, time));
      }
      assert.ok(samples.every((sample) => sample && sample.clearance >= 4), `${width}px: packet never enters gate`);
      assert.ok(samples[3].packetX - samples[0].packetX > (width === 320 ? 10 : 25), `${width}px: request travels toward gate`);
      assert.equal(samples[0].preparing, 1);
      assert.equal(samples[0].stopping, 0);
      assert.equal(samples[0].denial, 0);
      assert.equal(samples.at(-1).preparing, 0);
      assert.equal(samples.at(-1).stopping, 1);
      assert.equal(samples.at(-1).denial, 1);
      assert.notEqual(samples[0].gateColor, samples.at(-1).gateColor);
      await page.getByRole("button", { name: /Reset example/ }).click();
      assert.equal(await page.locator('[data-stage="idle"]').count(), 1);
      assert.equal(await page.locator('[data-visual="request-packet"]').count(), 0);
      assert.equal(await page.getByRole("status").count(), 0);
      assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length), 0);
      await page.close();
    }
  } finally { await browser.close(); }
});
