# Portfolio v2 foundation

This is an isolated React + TypeScript + Vite foundation for the approved Field Notes + Patch direction. It is a plain content preview; Patch and the visual redesign are later work. The repository root remains the production legacy site.

## Requirements and local preview

- Node 24 (see `.nvmrc`); npm 11 is used for the lockfile.
- From `v2/`, run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build`.
- Run `npm run test:dist` after a build.
- Run `npm run preview`. The production output is served at `http://127.0.0.1:4173/brandonhann.github.io/`.
- With the preview server running, run `npm run test:browser` for 360px–1280px layout, direct hashes, static assets, and no-JavaScript résumé checks. Install Playwright Chromium with `npx playwright install chromium` if it is not already present.
- For iteration only, run `npm run dev` and visit the same project subpath shown by Vite.

Vite uses `base: '/brandonhann.github.io/'`. References in React to copied public files use `import.meta.env.BASE_URL`; do not use domain-root `/assets/...` paths. The `dist/` directory, not the `v2/` directory, is the future Pages artifact root.

## Boundaries

- Do not import root `index.html` styles, `assets/js/site.js`, Three.js, or old animation code.
- `public/resume.html` is a standalone copy of the existing résumé with its script dependency removed. Its inline CSS is scoped to that document and is not part of the React bundle.
- `public/assets/resume/Brandon-Hann-Resume.pdf` retains the public PDF URL.
- `public/brandon-about.jpg` retains the current social-image URL for compatibility. Its portrait proportions should be replaced in a later approved content pass.
- Memories use text placeholders until photos and captions are approved. Secure Agent remains unfeatured until its repository and implementation are verified.

## Release and rollback (not part of Phase 1)

Do not publish from this feature branch automatically. The current Pages source setting must be recorded in GitHub Settings → Pages before a release. After separate approval, build `v2/` and publish only its `dist/` contents from a dedicated publishing branch. Change Pages to that branch's root. Keep `main` and its legacy root files intact. To roll back, restore the recorded prior Pages source setting and verify the legacy homepage and résumé.
