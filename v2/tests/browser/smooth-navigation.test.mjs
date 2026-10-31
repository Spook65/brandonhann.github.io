import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const site =
  process.env.PORTFOLIO_PREVIEW_URL ??
  "http://127.0.0.1:4173/brandonhann.github.io/";

async function waitForScrollToSettle(page) {
  let previous;
  let stableSamples = 0;
  for (let sample = 0; sample < 160; sample += 1) {
    const current = await page.evaluate(() => window.scrollY);
    stableSamples = previous !== undefined && Math.abs(current - previous) < 0.5
      ? stableSamples + 1 : 0;
    if (stableSamples >= 4) return;
    previous = current;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("Anchor scroll did not settle");
}

async function assertHeadingVisible(page, id) {
  let previous;
  let stableSamples = 0;
  for (let sample = 0; sample < 160; sample += 1) {
    const position = await page.locator(`#${id}`).evaluate((target) => {
      const heading = target.querySelector("h2, h3") ?? target;
      const rect = heading.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: innerHeight, scrollY };
    });
    const visible = position.top >= 0 && position.top < position.height && position.bottom > 0;
    stableSamples = visible && previous !== undefined &&
      Math.abs(position.scrollY - previous) < 0.5 ? stableSamples + 1 : 0;
    if (stableSamples >= 4) return;
    previous = position.scrollY;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.fail(`Heading for #${id} did not remain visible after scrolling`);
}

test("homepage anchors settle with visible destinations and native URL history", async () => {
  const browser = await chromium.launch();
  try {
    for (const width of [320, 390, 900, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      await page.goto(site);
      assert.equal(
        await page.evaluate(() => getComputedStyle(document.scrollingElement).scrollBehavior),
        "smooth",
      );
      assert.equal(
        await page.evaluate(() => getComputedStyle(document.scrollingElement).scrollPaddingTop),
        "16px",
      );

      await page.getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Projects" }).click();
      assert.match(page.url(), /#projects$/);
      await assertHeadingVisible(page, "projects");

      const index = page.getByRole("navigation", { name: "Project index" });
      await index.getByRole("link", { name: /Rivet/ }).click();
      assert.match(page.url(), /#project-rivet$/);
      await assertHeadingVisible(page, "project-rivet");
      assert.equal(await index.getByRole("link", { name: /Rivet/ }).getAttribute("aria-current"), "location");

      await page.goBack();
      assert.match(page.url(), /#projects$/);
      await assertHeadingVisible(page, "projects");
      await page.goForward();
      assert.match(page.url(), /#project-rivet$/);
      await assertHeadingVisible(page, "project-rivet");

      await page.getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Contact" }).click();
      assert.match(page.url(), /#contact$/);
      await assertHeadingVisible(page, "contact");

      await page.getByRole("link", { name: /Back to top/ }).click();
      assert.match(page.url(), /#top$/);
      await waitForScrollToSettle(page);
      assert.ok(await page.evaluate(() => window.scrollY < 5));
      assert.equal(await page.getByRole("navigation", { name: "Primary navigation" }).isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("reduced motion, direct hashes, no JavaScript, and Guardian retain appropriate scrolling", async () => {
  const browser = await chromium.launch();
  try {
    const reduced = await browser.newPage({ reducedMotion: "reduce" });
    await reduced.goto(`${site}#project-mapetite`);
    assert.equal(await reduced.evaluate(() => getComputedStyle(document.scrollingElement).scrollBehavior), "auto");
    await assertHeadingVisible(reduced, "project-mapetite");
    await reduced.getByRole("link", { name: /Explore the authorization boundary/ }).click();
    assert.match(reduced.url(), /#project-secureagent$/);
    await assertHeadingVisible(reduced, "project-secureagent");
    await reduced.close();

    const staticPage = await browser.newPage({ javaScriptEnabled: false });
    await staticPage.goto(site);
    assert.equal(await staticPage.evaluate(() => getComputedStyle(document.scrollingElement).scrollBehavior), "smooth");
    await staticPage.getByRole("link", { name: "Explore projects" }).click();
    assert.match(staticPage.url(), /#projects$/);
    await assertHeadingVisible(staticPage, "projects");
    await staticPage.getByRole("link", { name: /Read case study/ }).click();
    assert.match(staticPage.url(), /#project-mapetite$/);
    await assertHeadingVisible(staticPage, "project-mapetite");
    await staticPage.close();

    const resume = await browser.newPage();
    await resume.goto(`${site}resume.html`);
    assert.equal(await resume.locator("#top").count(), 0);
    assert.match(resume.url(), /resume\.html$/);
    await resume.close();

    const guardian = await browser.newPage();
    await guardian.goto(`${site}?experience=guardian`);
    assert.equal(await guardian.evaluate(() => getComputedStyle(document.scrollingElement).scrollBehavior), "auto");
    await guardian.getByRole("button", { name: /Enter through the Guardian/ }).waitFor();
    await guardian.close();
  } finally { await browser.close(); }
});
