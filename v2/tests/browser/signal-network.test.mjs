import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const base = process.env.PORTFOLIO_PREVIEW_URL ?? "http://127.0.0.1:4173/brandonhann.github.io/";
const prototype = `${base}prototypes/signal-network.html`;

test("the network previews, selects, settles, and opens a real case study", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(prototype);
    await page.getByRole("heading", { name: "Signal Network." }).waitFor();
    assert.equal(await page.getByRole("button", { name: /^Inspect / }).count(), 4);
    assert.equal(await page.locator('svg g[data-active="true"]').count(), 0);

    await page.getByRole("button", { name: "Inspect Mapetite" }).hover();
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /Ambiguous places return suggestions/);
    assert.equal(await page.locator('svg g[data-route-id="project-mapetite"][data-active="true"]').count(), 2);
    const packet = page.locator('svg[data-signal-variant="desktop"] [data-signal-packet="project-mapetite"]');
    const startOffset = await packet.evaluate((path) => getComputedStyle(path).strokeDashoffset);
    await page.waitForTimeout(220);
    assert.notEqual(await packet.evaluate((path) => getComputedStyle(path).strokeDashoffset), startOffset);
    await page.waitForTimeout(1050);
    assert.equal(await page.locator('[data-signal-packet]').count(), 0);
    assert.equal(await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length), 0);

    await page.getByRole("heading", { name: "Signal Network." }).hover();
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /Choose a route/);
    const rivet = page.getByRole("button", { name: "Inspect Rivet" });
    await rivet.focus();
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /Backend ownership checks/);
    await page.keyboard.press("Enter");
    assert.equal(await rivet.getAttribute("aria-pressed"), "true");
    assert.match(await page.locator('[aria-live="polite"]').innerText(), /Backend ownership checks/);
    await page.getByRole("link", { name: "Read Rivet case study" }).click();
    assert.match(page.url(), /#project-rivet$/);
    await page.getByRole("heading", { name: "Rivet", exact: true }).waitFor();
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
});

test("mobile selection and reduced motion keep the visual compact and still", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, hasTouch: true, reducedMotion: "reduce" });
      await page.goto(prototype);
      const action = page.getByRole("link", { name: "Explore actual projects" });
      const box = await action.boundingBox();
      assert.ok(box && box.y + box.height < 844);
      await page.getByRole("button", { name: "Inspect SecureAgent Lab" }).tap();
      assert.equal(await page.getByRole("button", { name: "Inspect SecureAgent Lab" }).getAttribute("aria-pressed"), "true");
      assert.match(await page.locator('[aria-live="polite"]').innerText(), /deterministic policy decides before simulated execution/);
      assert.equal(await page.locator('[data-signal-packet]').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await page.getByRole("button", { name: "Clear selection" }).tap();
      assert.equal(await page.locator('svg g[data-active="true"]').count(), 0);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("prerendered project content and links remain useful without JavaScript", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(prototype);
    assert.match(await page.locator("main").innerText(), /four projects do not communicate through a live pipeline/i);
    assert.equal(await page.getByRole("link", { name: /^Open .* case study$/ }).count(), 4);
    await page.getByRole("link", { name: "Open Mapetite case study" }).click();
    assert.match(page.url(), /#project-mapetite$/);
    await page.getByRole("heading", { name: "Mapetite", exact: true }).waitFor();
  } finally { await browser.close(); }
});

test("ordinary homepage never requests prototype code or art", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const urls = [];
    page.on("request", (request) => urls.push(request.url()));
    await page.goto(base);
    await page.getByRole("heading", { name: "Brandon Hann." }).waitFor();
    assert.equal(urls.some((url) => /signalNetwork|signal-network|SignalNetwork/.test(url)), false);
    assert.equal(await page.getByRole("heading", { name: "Signal Network." }).count(), 0);
  } finally { await browser.close(); }
});

test("all routes visibly reach their destinations at rest and while selected", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(prototype);
      const variant = width < 540 ? "mobile" : "desktop";
      for (const id of ["project-mapetite", "project-rivet", "project-secureagent", "project-oddworks"]) {
        const name = { "project-mapetite": "Mapetite", "project-rivet": "Rivet", "project-secureagent": "SecureAgent Lab", "project-oddworks": "ODDWORKS" }[id];
        const reach = async () => page.locator(`svg[data-signal-variant="${variant}"] g[data-route-id="${id}"] path`).first().evaluate((path) => {
          const point = path.getPointAtLength(path.getTotalLength());
          const matrix = path.getScreenCTM();
          if (!matrix) return null;
          const end = point.matrixTransform(matrix);
          const port = document.querySelector(`div[data-route-id="${path.parentElement?.getAttribute("data-route-id")}"]`);
          if (!port) return null;
          const box = port.getBoundingClientRect();
          return { endX: end.x, left: box.left, endY: end.y, top: box.top, bottom: box.bottom };
        });
        for (const state of ["rest", "selected"]) {
          if (state === "selected") await page.getByRole("button", { name: `Inspect ${name}` }).click();
          const geometry = await reach();
          assert.ok(geometry, `${id}: endpoint and destination exist at ${state}`);
          assert.ok(geometry.endX >= geometry.left + 2, `${id}: trace reaches underneath the port at ${state}`);
          assert.ok(geometry.endY >= geometry.top && geometry.endY <= geometry.bottom, `${id}: trace enters port vertically at ${state}`);
        }
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
