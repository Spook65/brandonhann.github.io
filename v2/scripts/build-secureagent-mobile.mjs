import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const clientTemporary = await mkdtemp(join(root, '.secureagent-mobile-client-'));
const serverTemporary = await mkdtemp(join(root, '.secureagent-mobile-server-'));

try {
  // The prototype has its own build so its art and code never enter the homepage entry.
  await build({
    root,
    build: {
      rollupOptions: { input: resolve(root, 'prototypes/secureagent-mobile.html') },
      outDir: clientTemporary,
      emptyOutDir: true,
    },
  });

  const prototypeDirectory = join(output, 'prototypes');
  const assetsDirectory = join(output, 'assets');
  await mkdir(prototypeDirectory, { recursive: true });
  await mkdir(assetsDirectory, { recursive: true });
  let copiedAssets = 0;
  for (const entry of await readdir(join(clientTemporary, 'assets'), { withFileTypes: true })) {
    if (entry.isFile()) {
      await copyFile(join(clientTemporary, 'assets', entry.name), join(assetsDirectory, entry.name));
      copiedAssets += 1;
    }
  }
  if (copiedAssets < 5) throw new Error('SecureAgent mobile client assets are incomplete.');

  await build({
    root,
    build: {
      ssr: resolve(root, 'src/prototypes/secureagent-mobile-server.tsx'),
      outDir: serverTemporary,
      emptyOutDir: true,
    },
  });
  const { renderSecureAgentMobile } = await import(pathToFileURL(join(serverTemporary, 'secureagent-mobile-server.js')).href);
  const html = await readFile(join(clientTemporary, 'prototypes', 'secureagent-mobile.html'), 'utf8');
  const prerendered = html.replace(
    '<div id="secureagent-mobile-root"></div>',
    `<div id="secureagent-mobile-root" data-prerendered="secureagent-mobile">${renderSecureAgentMobile()}</div>`,
  );
  if (prerendered === html || !prerendered.includes('One request.')) {
    throw new Error('SecureAgent mobile prerender did not produce the expected content.');
  }
  await writeFile(join(prototypeDirectory, 'secureagent-mobile.html'), prerendered);
} finally {
  await rm(clientTemporary, { recursive: true, force: true });
  await rm(serverTemporary, { recursive: true, force: true });
}
