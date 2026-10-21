import assert from 'node:assert/strict';
import test from 'node:test';
import { projects } from '../src/data/projects.ts';
import { legacyAnchors } from '../src/data/legacyAnchors.ts';

test('featured work has unique anchors and only evidence-backed project names', () => {
  assert.deepEqual(projects.map((project) => project.name), ['Cura', 'Mapetite', 'ODDWORKS']);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.equal(projects.some((project) => /THREATGRID|Secure Agent/i.test(project.name)), false);
});

test('project links describe destinations honestly', () => {
  for (const project of projects) {
    assert.ok(project.links.length > 0, `${project.name} needs an evidence link`);
    for (const link of project.links) {
      assert.match(link.href, /^https:\/\//);
      assert.notEqual(link.href, '#');
    }
  }

  const cura = projects.find((project) => project.name === 'Cura');
  assert.ok(cura);
  assert.equal(cura.links.some((link) => /Devpost/.test(link.label)), true);
  assert.equal(cura.links.some((link) => /demo|try it/i.test(link.label)), false);
  assert.match(cura.status, /Regeneron Honorable Mention/);
  assert.match(projects.find((project) => project.name === 'ODDWORKS').status, /Active development/);
});

test('legacy project anchors remain distinct', () => {
  assert.equal(new Set(Object.values(legacyAnchors)).size, Object.values(legacyAnchors).length);
});
