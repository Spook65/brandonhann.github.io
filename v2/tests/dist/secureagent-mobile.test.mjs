import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";

test("mobile SecureAgent study is prerendered and isolated from the homepage", async () => {
  const home = await readFile(new URL("../../dist/index.html", import.meta.url), "utf8");
  const prototype = await readFile(new URL("../../dist/prototypes/secureagent-mobile.html", import.meta.url), "utf8");
  const assets = await readdir(new URL("../../dist/assets/", import.meta.url));
  assert.match(prototype, /data-prerendered="secureagent-mobile"/);
  assert.match(prototype, /Read the actual/);
  assert.match(prototype, /SecureAgent Lab/);
  assert.match(prototype, /#project-secureagent/);
  assert.match(prototype, /noindex, nofollow/);
  assert.doesNotMatch(home, /secureagent-mobile|courier-waiting|courier-inspecting|courier-denied/);
  for (const pose of ["waiting", "inspecting", "denied"]) {
    assert.ok(assets.some((name) => name.startsWith(`courier-${pose}-`) && name.endsWith(".svg")));
  }
});
