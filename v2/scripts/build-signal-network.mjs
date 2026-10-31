import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const clientTemporary = await mkdtemp(join(root, '.signal-client-'));
const serverTemporary = await mkdtemp(join(root, '.signal-server-'));

try {
  // Build the concept separately so Vite does not repartition the homepage entry.
  await build({
    root,
    build: {
      rollupOptions: { input: resolve(root, 'prototypes/signal-network.html') },
      outDir: clientTemporary,
      emptyOutDir: true,
    },
  });

  const prototypeDirectory = join(output, 'prototypes');
  await mkdir(prototypeDirectory, { recursive: true });
  await mkdir(join(output, 'assets'), { recursive: true });
  let copiedAssets = 0;
  for (const entry of await readdir(join(clientTemporary, 'assets'), { withFileTypes: true })) {
    if (entry.isFile() && /^signal-network-.*\.(?:css|js)$/.test(entry.name)) {
      await copyFile(join(clientTemporary, 'assets', entry.name), join(output, 'assets', entry.name));
      copiedAssets += 1;
    }
  }
  if (copiedAssets < 2) throw new Error('Signal Network client assets are incomplete.');

  await build({
    root,
    build: {
      ssr: resolve(root, 'src/prototypes/entry-server.tsx'),
      outDir: serverTemporary,
      emptyOutDir: true,
    },
  });
  const { renderSignalNetwork } = await import(pathToFileURL(join(serverTemporary, 'entry-server.js')).href);
  const html = await readFile(join(clientTemporary, 'prototypes', 'signal-network.html'), 'utf8');
  const prerendered = html.replace(
    '<div id="signal-network-root"></div>',
    `<div id="signal-network-root" data-prerendered="signal-network">${renderSignalNetwork()}</div>`,
  );
  if (prerendered === html || !prerendered.includes('id="signal-network-title"')) {
    throw new Error('Signal Network prerender did not produce the expected content.');
  }
  await writeFile(join(prototypeDirectory, 'signal-network.html'), prerendered);
} finally {
  await rm(clientTemporary, { recursive: true, force: true });
  await rm(serverTemporary, { recursive: true, force: true });
}
