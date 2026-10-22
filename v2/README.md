# Portfolio v2 — The Builder's Logbook

Checkpoint A.1 of the CalHacks Event MVP adds a Guardian entrance, a short mouth-shaped passage, a Human Core dialogue and relic, and one interactive Builder's Domain chamber. Six accessible destinations open real HTML content. Direct navigation to projects, about, skills, résumé, and contact remains available throughout. The repository root remains the production legacy site.

The four illustrated scene assets in `src/assets/` are separate optimized WebP files. The mobile chamber has its own composition; interface text and controls remain HTML. Fraunces and Source Sans 3 are self-hosted font packages. Local review captures under `artifacts/` are ignored by Git; the creative-reset storyboard source is preserved there.

## Requirements and local preview

- Node 24 (see `.nvmrc`); npm 11 is used for the lockfile.
- From `v2/`, run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build`.
- Run `npm run test:dist` after a build.
- Run `npm run preview`. The production output is served at `http://127.0.0.1:4173/brandonhann.github.io/` unless that port is occupied; use the URL printed by Vite.
- With the preview server running, run `npm run test:browser` for layout, dialogue, relic, destination panels, direct hashes, static assets, and no-JavaScript résumé checks. If preview selected another port, set `PORTFOLIO_PREVIEW_URL=http://127.0.0.1:<port>/brandonhann.github.io/`. Install Playwright Chromium with `npx playwright install chromium` if it is not already present.
- For iteration only, run `npm run dev` and visit the same project subpath shown by Vite.

Vite uses `base: '/brandonhann.github.io/'`. References in React to copied public files use `import.meta.env.BASE_URL`; do not use domain-root `/assets/...` paths. The `dist/` directory, not the `v2/` directory, is the future Pages artifact root.

## Boundaries

- Do not import root `index.html` styles, `assets/js/site.js`, Three.js, or old animation code.
- `public/resume.html` is a standalone copy of the existing résumé with its script dependency removed. Its inline CSS is scoped to that document and is not part of the React bundle.
- `public/assets/resume/Brandon-Hann-Resume.pdf` retains the public PDF URL.
- `public/brandon-about.jpg` retains the current social-image URL for compatibility. Its portrait proportions should be replaced in a later approved content pass.
- Memories use text placeholders until photos and captions are approved. SecureAgent Lab appears only through the public-safe, typed data in `src/data/domain.ts`; its dated reviewed metrics do not imply a public demo or production guarantee.
- The Guardian is a flattened image. Its mouth receives a dark oval response and an elliptical passage transition; the lower jaw is not articulated. A convincing physical jaw needs separate approved artwork. Patch and additional environment reactions remain future work.

## Release and rollback (not part of Phase 1)

Do not publish from this feature branch automatically. The current Pages source setting must be recorded in GitHub Settings → Pages before a release. After separate approval, build `v2/` and publish only its `dist/` contents from a dedicated publishing branch. Change Pages to that branch's root. Keep `main` and its legacy root files intact. To roll back, restore the recorded prior Pages source setting and verify the legacy homepage and résumé.
