import assert from "node:assert/strict";
import test from "node:test";
import { caseStudies, projectFromHash } from "../src/data/caseStudies.ts";
test("showcase contracts include evidence, limitations and no private project material", () => {
  assert.deepEqual(
    caseStudies.map((x) => x.project.name),
    ["Mapetite", "Rivet", "SecureAgent Lab", "ODDWORKS"],
  );
  for (const s of caseStudies) {
    assert.ok(
      s.contribution && s.problem && s.decision && s.evidence && s.limitation,
    );
    assert.ok(s.flow.length > 2);
    assert.ok(s.notes.length > 0);
  }
  assert.equal(
    caseStudies.some((s) => s.project.name === "Linux Bridge"),
    false,
  );
});
test("hash parser handles known projects, legacy aliases and malformed input", () => {
  assert.equal(projectFromHash("#project-rivet"), "project-rivet");
  assert.equal(projectFromHash("#project-systems-grid"), "project-secureagent");
  assert.equal(projectFromHash("#project-performance-lab"), "project-oddworks");
  assert.equal(projectFromHash("#%E0%A4%A"), null);
  assert.equal(projectFromHash("#unknown"), null);
});
