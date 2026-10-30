import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
const site =
  process.env.PORTFOLIO_PREVIEW_URL ??
  "http://127.0.0.1:4173/brandonhann.github.io/";
test("engineering homepage exposes identity and keeps optional worlds out of entry requests", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    const requests = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.goto(site);
    await page
      .getByRole("heading", { name: "Brandon Hann.", exact: true })
      .waitFor();
    assert.equal(await page.locator("main img").count(), 0);
    assert.ok(
      await page
        .getByRole("link", { name: "Projects", exact: true })
        .isVisible(),
    );
    assert.equal(
      requests.some((url) =>
        /GuardianExperience|guardian-organic|SecurityOutpost|three|brandon-about/.test(
          url,
        ),
      ),
      false,
    );
    await page.getByRole("button", { name: "Validate" }).click();
    assert.match(
      await page.getByRole("complementary", { name: "Engineering principles" }).locator('[aria-live="polite"]').innerText(),
      /uncertain input/,
    );
    await page
      .getByRole("link", { name: "Explore The Inner Workings ↗" })
      .click();
    await page
      .getByRole("button", { name: /Enter through the Guardian/ })
      .waitFor();
  } finally {
    await browser.close();
  }
});
test("résumé paths and return anchor resolve at the Pages subpath", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    const resume = await page.goto(`${site}resume.html`);
    assert.equal(resume.status(), 200);
    const pdf = await page.request.get(`${site}assets/resume/Brandon-Hann-Resume.pdf`);
    assert.equal(pdf.status(), 200);
    await page.getByRole("link", { name: "Back to Brandon Hann portfolio" }).click();
    assert.match(page.url(), /#main-content$/);
    assert.equal(await page.locator("#main-content").count(), 1);
  } finally {
    await browser.close();
  }
});
test("index preview, case-study details, direct links and history are coherent", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(site);
    const nav = page.getByRole("navigation", { name: "Project index" });
    await nav.getByRole("link", { name: /Rivet/ }).hover();
    assert.match(
      await page.locator('[aria-label="Project focus preview"]').innerText(),
      /Rivet[\s\S]*ownership checks/,
    );
    assert.equal(
      await nav
        .getByRole("link", { name: /Rivet/ })
        .getAttribute("data-preview"),
      "true",
    );
    assert.equal(
      await nav
        .getByRole("link", { name: /Mapetite/ })
        .getAttribute("aria-current"),
      "location",
    );
    assert.match(
      await nav.getByRole("link", { name: /Mapetite/ }).innerText(),
      /Selected/,
    );
    await nav.getByRole("link", { name: /Rivet/ }).click();
    assert.match(page.url(), /#project-rivet$/);
    assert.match(
      await nav.getByRole("link", { name: /Rivet/ }).innerText(),
      /Selected/,
    );
    await page.locator("#project-rivet summary").click();
    assert.ok(
      (await page.locator("#project-rivet details").getAttribute("open")) !==
        null,
    );
    await page.goto(`${site}#project-oddworks`);
    assert.equal(
      await nav
        .getByRole("link", { name: /ODDWORKS/ })
        .getAttribute("aria-current"),
      "location",
    );
    await page.goto(`${site}#project-systems-grid`);
    assert.equal(
      await nav
        .getByRole("link", { name: /SecureAgent Lab/ })
        .getAttribute("aria-current"),
      "location",
    );
    await page.keyboard.press("Tab");
    await nav.getByRole("link", { name: /Mapetite/ }).focus();
    assert.notEqual(
      await nav
        .getByRole("link", { name: /Mapetite/ })
        .evaluate((e) => getComputedStyle(e).outlineStyle),
      "none",
    );
    await page.keyboard.press("Enter");
    await page.goBack();
    assert.equal(
      await nav
        .getByRole("link", { name: /SecureAgent Lab/ })
        .getAttribute("aria-current"),
      "location",
    );
    await page.goForward();
    assert.equal(
      await nav
        .getByRole("link", { name: /Mapetite/ })
        .getAttribute("aria-current"),
      "location",
    );
  } finally {
    await browser.close();
  }
});
test("mobile touch, direct navigation, and all viewport widths have no horizontal overflow", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        hasTouch: true,
        reducedMotion: "reduce",
      });
      await page.goto(site);
      await page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Projects" })
        .tap();
      await page
        .getByRole("navigation", { name: "Project index" })
        .getByRole("link", { name: /Rivet/ })
        .tap();
      assert.equal(await page.locator("#project-rivet").isVisible(), true);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        true,
      );
      await page.getByRole("link", { name: "Résumé", exact: true }).tap();
      await page.waitForURL(/resume.html$/);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});
