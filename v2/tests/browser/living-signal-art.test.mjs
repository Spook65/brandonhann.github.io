import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const art = (name) => new URL(`../../art-direction/living-signal/${name}.svg`, import.meta.url).href;

test("SecureAgent selection highlights a route but only an explicit example shows a packet", async () => {
  const browser = await chromium.launch();
  try {
    for (const name of ["desktop-selected", "desktop-result", "mobile-selected", "mobile-result"]) {
      const page = await browser.newPage();
      await page.goto(art(name));
      if (name === "mobile-selected") {
        assert.equal(await page.locator('[data-layer="selected-route"]').count(), 0);
        assert.equal(await page.locator('[data-packet="secureagent"]').count(), 0);
        assert.match(await page.locator("svg").textContent(), /Try an illustrative request/);
        await page.close();
        continue;
      }
      const geometry = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll("[data-layer]")];
        const selected = document.querySelector('[data-layer="selected-route"]');
        const packet = document.querySelector('[data-packet="secureagent"]');
        if (!(selected instanceof SVGPathElement)) return null;
        let distance = null;
        if (packet instanceof SVGUseElement) {
          const bounds = packet.getBBox();
          const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
          distance = Number.POSITIVE_INFINITY;
          for (let point = 0; point <= selected.getTotalLength(); point += 2) {
            const position = selected.getPointAtLength(point);
            distance = Math.min(distance, Math.hypot(center.x - position.x, center.y - position.y));
          }
        }
        return {
          selectedIndex: nodes.indexOf(selected),
          lastNeutralIndex: nodes.findLastIndex((node) => node.getAttribute("data-layer") === "neutral-route"),
          distance,
        };
      });
      assert.ok(geometry, `${name}: selected route exists`);
      assert.ok(geometry.selectedIndex > geometry.lastNeutralIndex, `${name}: selected path paints after neutral routes`);
      const copy = await page.locator("svg").textContent();
      if (name.endsWith("result")) {
        assert.ok(geometry.distance !== null && geometry.distance < 3, `${name}: packet sits on selected route`);
        assert.match(copy, /DENY/);
      } else {
        assert.equal(geometry.distance, null, `${name}: selection alone shows no packet`);
        assert.doesNotMatch(copy, /ALLOW|DENY/);
        assert.match(copy, /Try an (?:illustrative request|example)/);
      }
      await page.close();
    }
  } finally { await browser.close(); }
});

test("idle studies show no request or outcome and mobile includes project selection", async () => {
  const browser = await chromium.launch();
  try {
    for (const name of ["desktop-idle", "mobile-idle"]) {
      const page = await browser.newPage();
      await page.goto(art(name));
      const copy = await page.locator("svg").textContent();
      assert.doesNotMatch(copy, /ALLOW|DENY/);
      assert.equal(await page.locator('[data-packet="secureagent"]').count(), 0);
      assert.match(copy, /Brandon Hann/);
      if (name === "mobile-idle") {
        for (const project of ["Mapetite", "Rivet", "SecureAgent Lab", "ODDWORKS"]) assert.match(copy, new RegExp(project));
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
