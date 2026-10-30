import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const site =
  process.env.PORTFOLIO_PREVIEW_URL ??
  "http://127.0.0.1:4173/brandonhann.github.io/";

test("Mapetite cases trace the documented validation boundary without API calls", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(`${site}#project-mapetite`);
    const figure = page.locator("#project-mapetite figure");
    await figure.getByRole("button", { name: /No matching place/ }).click();
    assert.match(await figure.getByRole("status").innerText(), /fakecity[\s\S]*PLACE_NOT_FOUND[\s\S]*Not reached/);
    await figure.getByRole("button", { name: /Multiple matching places/ }).click();
    assert.match(await figure.getByRole("status").innerText(), /Springfield[\s\S]*PLACE_AMBIGUOUS[\s\S]*Not reached/);
    await figure.getByRole("button", { name: /One matching place/ }).click();
    assert.match(await figure.getByRole("status").innerText(), /Stockton[\s\S]*Would proceed/);
    assert.equal(await figure.getByRole("button", { name: /One matching place/ }).getAttribute("aria-pressed"), "true");
    assert.equal(requests.some((url) => /mapetite-nine|mapetite-y04j|geoapify/i.test(url)), false);
  } finally {
    await browser.close();
  }
});

test("Mapetite evidence supports keyboard, touch, reduced motion and narrow screens", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390]) {
      const page = await browser.newPage({
        viewport: { width, height: 844 },
        hasTouch: true,
        reducedMotion: "reduce",
      });
      await page.goto(`${site}#project-mapetite`);
      const figure = page.locator("#project-mapetite figure");
      const invalid = figure.getByRole("button", { name: /No matching place/ });
      await invalid.tap();
      assert.equal(await invalid.getAttribute("aria-pressed"), "true");
      await page.keyboard.press("Tab");
      const ambiguous = figure.getByRole("button", { name: /Multiple matching places/ });
      await ambiguous.focus();
      await page.keyboard.press("Enter");
      assert.equal(await ambiguous.getAttribute("aria-pressed"), "true");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await page.close();
    }
  } finally {
    await browser.close();
  }
});

test("Mapetite explanation remains complete and controls do not appear without JavaScript", async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(`${site}#project-mapetite`);
    const figure = page.locator("#project-mapetite figure");
    assert.equal(await figure.getByRole("button").count(), 0);
    assert.match(await figure.innerText(), /PLACE_NOT_FOUND[\s\S]*Stop and ask[\s\S]*PLACE_AMBIGUOUS[\s\S]*Return up to five[\s\S]*RESOLVED PLACE[\s\S]*Canonical location/);
  } finally {
    await browser.close();
  }
});
