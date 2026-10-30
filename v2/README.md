# Portfolio v2 — engineering-first review candidate

`v2/` is an unpublished Vite, React, and TypeScript portfolio. The repository root is the legacy live site. The current visual review branch is `experiment/layout-hierarchy`; a commit or push to it does not authorize a release. Read `AGENTS.md`, `DESIGN.md`, and `RELEASE_CHECKLIST.md` before changing UI or preparing publication.

## What the application serves

- The default route is Brandon's engineering-first homepage: identity, direct Projects/Résumé/GitHub/Contact navigation, four featured technical case studies (Mapetite, Rivet, SecureAgent Lab, ODDWORKS), additional Cura work, About, Skills, and Contact. `src/data/` owns public-safe project facts; `src/showcase/` renders the case studies and Mapetite's **illustrative**, source-derived place-validation explainer. Every case study remains available without interacting with the explainer.
- `npm run build` runs TypeScript, Vite, and `scripts/prerender.mjs`. The prerender step renders the React homepage into `dist/index.html` at build time from the same content modules used during hydration. Identity, project content, navigation, and résumé links are present and usable without client JavaScript. `src/main.tsx` hydrates that HTML on the default route; it mounts a separate React tree for the optional Guardian query route.
- `?experience=guardian` lazily loads the separate Guardian experience. Its art and code should not be requested by the default homepage. The rejected Signal Outpost experiments are not part of this application entry.
- `public/resume.html` is a standalone, script-free résumé page. Its relative PDF link resolves to `public/assets/resume/Brandon-Hann-Resume.pdf`. The main homepage and résumé share self-hosted Sora and IBM Plex Mono Latin subsets from `public/portfolio-type.css` and `public/fonts/`; the optional Guardian keeps its existing typography. W.7A Mapetite captures are **not** in `public/` or the built site and remain private review material.

## Local setup and verification

Use Node 24 (`.nvmrc`) and the lockfile's npm version. From `v2/`:

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run test:dist
npm run preview
```

In another terminal, run `npm run test:browser` against the printed preview URL. If Vite uses a port other than 4173, set `PORTFOLIO_PREVIEW_URL=http://127.0.0.1:<port>/brandonhann.github.io/` for that command. Install Playwright Chromium with `npx playwright install chromium` if absent. `npm run dev` is for iteration; browser release checks use the built preview.

The browser suite covers no-JavaScript content, hydration, Mapetite pointer/keyboard/touch selection, project hashes and Back/Forward, mobile widths and overflow, résumé paths, and optional Guardian loading. Passing tests does not establish visual or content approval. See `RELEASE_READINESS.md` for the latest audit and measured limitations.

Vite's base is `/brandonhann.github.io/`. Use `import.meta.env.BASE_URL` for copied public paths. Verify direct hashes, the résumé page/PDF, and optional query routes under that subpath. `dist/` is generated output and is not committed to review branches.

## Release boundary

No release has been authorized. Before a separately approved deployment, record the **actual** GitHub Settings → Pages source, branch/folder or Actions workflow, custom domain, and current live URL. This repository does not expose that setting in tracked files, and the current audit could not read it through the available API. Do not infer it from `main` or from the absence of workflows.

Follow `RELEASE_CHECKLIST.md` for the exact preflight, conditional publishing procedure, smoke checks, and rollback. Keep the legacy `main` branch and its root site files unchanged. Never publish unapproved Mapetite captures, local review artifacts, recovery archives, caches, or source-only files. The Guardian remains optional and Linux Bridge stays private.
