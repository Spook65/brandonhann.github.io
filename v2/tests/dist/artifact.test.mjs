import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const resume = readFileSync(resolve(root, 'resume.html'), 'utf8');

test('artifact retains required paths and subpath-based assets', () => {
  for (const path of [
    '.nojekyll',
    'index.html',
    'resume.html',
    'favicon.svg',
    'brandon-about.jpg',
    'assets/resume/Brandon-Hann-Resume.pdf',
  ]) {
    assert.ok(existsSync(resolve(root, path)), `${path} missing from dist`);
  }

  assert.match(html, /\/brandonhann\.github\.io\/assets\/index-[^" ]+\.js/);
  assert.match(html, /\/brandonhann\.github\.io\/favicon\.svg/);
  assert.match(html, /https:\/\/spook65\.github\.io\/brandonhann\.github\.io\/brandon-about\.jpg/);
});

test('standalone résumé has working relative paths and no script dependency', () => {
  assert.match(resume, /href="assets\/resume\/Brandon-Hann-Resume\.pdf"/);
  assert.match(resume, /src="assets\/resume\/Brandon-Hann-Resume\.pdf#view=FitH"/);
  assert.match(resume, /href="index\.html#projects"/);
  assert.doesNotMatch(resume, /<script|site\.js|opacity:\s*0\s*;\s*transform:\s*translateY\(24px\)/);
});

test('built app excludes legacy effects and libraries', () => {
  const scripts = [...html.matchAll(/src="([^"]+\.js)"/g)].map((match) => match[1]);
  assert.equal(scripts.length, 1);
  const bundleName = scripts[0].split('/').at(-1);
  const bundle = readFileSync(resolve(root, 'assets', bundleName), 'utf8');
  for (const legacyToken of ['THREE.WebGLRenderer', 'cursor-spotlight', 'cursor-ring', 'setupHeroTypewriter', 'setupProjectsBusGraph']) {
    assert.equal(bundle.includes(legacyToken), false, `${legacyToken} leaked into the app`);
  }
});
