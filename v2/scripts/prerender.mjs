import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build, resolveConfig } from 'vite';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const temporary = await mkdtemp(join(root, '.prerender-'));

try {
  const { base } = await resolveConfig({ root }, 'build');
  await build({
    root,
    build: {
      ssr: resolve(root, 'src/entry-server.tsx'),
      outDir: temporary,
      emptyOutDir: true,
    },
  });

  const { renderHome } = await import(pathToFileURL(join(temporary, 'entry-server.js')).href);
  const html = await readFile(join(output, 'index.html'), 'utf8');
  const files = await readdir(join(output, 'assets'));
  const fontNames = ['source-sans-3-latin-wght-normal-', 'fraunces-latin-wght-normal-'];
  const fontLinks = fontNames.map((prefix) => {
    const file = files.find((name) => name.startsWith(prefix) && name.endsWith('.woff2'));
    if (!file) throw new Error(`Missing expected Latin font: ${prefix}`);
    return `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}assets/${file}">`;
  }).join('\n    ');
  const prerendered = html
    .replace('</head>', `    ${fontLinks}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="home">${renderHome()}</div>`);

  if (prerendered === html || !prerendered.includes('id="welcome-title"')) {
    throw new Error('Homepage prerender did not produce the expected semantic content.');
  }
  await writeFile(join(output, 'index.html'), prerendered);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
