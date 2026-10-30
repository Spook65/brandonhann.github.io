import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
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
  const fontFiles = ['sora-latin-wght-normal.woff2', 'ibm-plex-mono-latin-400-normal.woff2'];
  const fontLinks = (await Promise.all(fontFiles.map(async (file) => {
    await readFile(join(output, 'fonts', file));
    return `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}fonts/${file}">`;
  }))).join('\n    ');
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
