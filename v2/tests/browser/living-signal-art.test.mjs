import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";

const art = (name) => new URL(`../../art-direction/living-signal/${name}.svg`, import.meta.url).href;

test("selected SecureAgent route is above neutral paths and carries its packet", async () => {
  const browser = await chromium.launch();
  try {
    for (const name of ["desktop-allow", "desktop-deny", "mobile-allow", "mobile-deny"]) {
      const page = await browser.newPage();
      await page.goto(art(name));
      const geometry = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll("[data-layer]")];
        const selected = document.querySelector('[data-layer="selected-route"]');
        const packet = document.querySelector('[data-packet="secureagent"]');
        if (!(selected instanceof SVGPathElement) || !(packet instanceof SVGUseElement)) return null;
        const bounds = packet.getBBox();
        const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
        let distance = Number.POSITIVE_INFINITY;
        for (let point = 0; point <= selected.getTotalLength(); point += 2) {
          const position = selected.getPointAtLength(point);
          distance = Math.min(distance, Math.hypot(center.x - position.x, center.y - position.y));
        }
        return {
          selectedIndex: nodes.indexOf(selected),
          lastNeutralIndex: nodes.findLastIndex((node) => node.getAttribute("data-layer") === "neutral-route"),
          distance,
        };
      });
      assert.ok(geometry, `${name}: selected path and packet exist`);
      assert.ok(geometry.selectedIndex > geometry.lastNeutralIndex, `${name}: selected path paints after neutral routes`);
      assert.ok(geometry.distance < 3, `${name}: packet center sits on illuminated route`);
      const copy = await page.locator("svg").textContent();
      assert.match(copy, name.endsWith("allow") ? /ALLOW/ : /DENY/);
      assert.doesNotMatch(copy, name.endsWith("allow") ? /DENY/ : /ALLOW/);
      await page.close();
    }
  } finally { await browser.close(); }
});

test("idle studies show no outcome and mobile includes the project selector", async () => {
  const browser = await chromium.launch();
  try {
    for (const name of ["desktop-idle", "mobile-idle"]) {
      const page = await browser.newPage();
      await page.goto(art(name));
      const copy = await page.locator("svg").textContent();
      assert.doesNotMatch(copy, /ALLOW|DENY/);
      assert.match(copy, /Brandon Hann/);
      if (name === "mobile-idle") {
        for (const project of ["Mapetite", "Rivet", "SecureAgent Lab", "ODDWORKS"]) assert.match(copy, new RegExp(project));
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
