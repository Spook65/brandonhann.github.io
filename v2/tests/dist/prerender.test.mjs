import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const dist = resolve(import.meta.dirname, '../../dist');
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');

test('built HTML contains one semantic homepage before JavaScript', () => {
  assert.match(html, /<div id="root" data-prerendered="home">/);
  assert.equal((html.match(/id="welcome-title"/g) ?? []).length, 1);
  assert.match(html, /Brandon Hann<span/);
  assert.match(html, /id="projects"/);
  assert.match(html, /href="#projects"/);
  assert.match(html, /href="\/brandonhann\.github\.io\/resume\.html"/);
  assert.match(html, /Architecture schematic/);
  assert.match(html, /project-rivet/);
  assert.doesNotMatch(html, /Project screenshot pending approval/);
  assert.doesNotMatch(html, /Opening The Inner Workings…/);
});

test('first frame preloads only the homepage typefaces and no portrait or world media', () => {
  for (const font of ['sora-latin', 'ibm-plex-mono-latin-400']) assert.match(html, new RegExp(`rel="preload" as="font"[^>]+/brandonhann\\.github\\.io/fonts/${font}`));
  assert.match(html, /href="\.\/portfolio-type\.css"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.doesNotMatch(html, /<img|guardian-organic-sheet|mouth-cavity-organic|operator-core-concept/);
});
