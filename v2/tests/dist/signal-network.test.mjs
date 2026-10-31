import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("isolated Signal Network is prerendered while the homepage entry stays separate", async () => {
  const home = await readFile(new URL("../../dist/index.html", import.meta.url), "utf8");
  const prototype = await readFile(new URL("../../dist/prototypes/signal-network.html", import.meta.url), "utf8");
  assert.match(prototype, /data-prerendered="signal-network"/);
  for (const project of ["Mapetite", "Rivet", "SecureAgent Lab", "ODDWORKS"]) {
    assert.match(prototype, new RegExp(project));
  }
  assert.match(prototype, /#project-mapetite/);
  assert.match(prototype, /do not communicate through a live pipeline/);
  assert.doesNotMatch(home, /signalNetwork|Signal Network|signal-network-main/);
  assert.match(home, /id="welcome-title"/);
});
