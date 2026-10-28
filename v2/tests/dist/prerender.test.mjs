import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const dist = resolve(import.meta.dirname, '../../dist');
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');

test('built HTML contains one semantic homepage before JavaScript', () => {
  assert.match(html, /<div id="root" data-prerendered="home">/);
  assert.equal((html.match(/id="welcome-title"/g) ?? []).length, 1);
  assert.match(html, /Hey, I’m<br\/>/);
  assert.match(html, /id="projects"/);
  assert.match(html, /href="#projects"/);
  assert.match(html, /href="\/brandonhann\.github\.io\/resume\.html"/);
  assert.match(html, /Project screenshot pending approval/);
  assert.doesNotMatch(html, /Opening The Inner Workings…/);
});

test('first frame has local font preload and responsive approved portrait paths', () => {
  for (const font of ['source-sans-3-latin', 'fraunces-latin']) {
    assert.match(html, new RegExp(`rel="preload" as="font"[^>]+/brandonhann\\.github\\.io/assets/${font}`));
  }
  for (const image of ['brandon-about-640.webp', 'brandon-about-1134.webp']) {
    assert.ok(existsSync(resolve(dist, image)));
    assert.match(html, new RegExp(`/brandonhann\\.github\\.io/${image}`));
  }
  assert.match(html, /width="1134" height="1512"/);
  assert.doesNotMatch(html, /guardian-organic-sheet|mouth-cavity-organic|operator-core-concept/);
});
