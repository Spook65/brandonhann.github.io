import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
const site =
  process.env.PORTFOLIO_PREVIEW_URL ??
  "http://127.0.0.1:4173/brandonhann.github.io/";
test("without JavaScript all case studies, details and navigation remain usable", async () => {
  const b = await chromium.launch();
  try {
    const p = await b.newPage({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: false,
    });
    await p.goto(site);
    assert.equal(
      await p
        .getByRole("heading", { name: "Brandon Hann.", exact: true })
        .count(),
      1,
    );
    for (const id of ["mapetite", "rivet", "secureagent", "oddworks"])
      assert.equal(await p.locator(`#project-${id}`).count(), 1);
    await p.locator("#project-rivet summary").click();
    assert.ok(
      (await p.locator("#project-rivet details").getAttribute("open")) !== null,
    );
    await p
      .getByRole("navigation", { name: "Project index" })
      .getByRole("link", { name: /Mapetite/ })
      .click();
    assert.match(p.url(), /#project-mapetite$/);
    await p.getByRole("link", { name: "Read résumé ↗" }).click();
    assert.match(p.url(), /resume.html$/);
  } finally {
    await b.close();
  }
});
test("hydration has no warnings or duplicate content and tolerates malformed hashes", async () => {
  const b = await chromium.launch();
  try {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await p.goto(`${site}#%E0%A4%A`);
    await p.getByRole("button", { name: "Authorize" }).waitFor();
    assert.equal(await p.getByRole("heading", { level: 1 }).count(), 1);
    assert.equal(await p.locator("#project-rivet").count(), 1);
    assert.deepEqual(errors, []);
  } finally {
    await b.close();
  }
});
