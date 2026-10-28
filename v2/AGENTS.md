# Portfolio v2: engineering guide for coding agents

Scope: this file governs work under `v2/`. Read it with `v2/README.md` and any more specific instructions before editing. For UI/UX work, also read `v2/DESIGN.md` before making changes. Direct user instructions take precedence. The repository root is the existing production portfolio; `v2/` is a separate, unpublished Vite application. Do not treat the two sites as interchangeable.

## Current architecture and contracts

- `src/main.tsx` mounts React in Strict Mode and loads the self-hosted Fraunces and Source Sans 3 fonts, tokens, and base CSS. `src/App.tsx` selects `WelcomingHome` by default and lazily loads `GuardianExperience` for `?experience=guardian`.
- `src/WelcomingHome.tsx` is the primary, welcoming portfolio. It renders project selection, Patch, navigation, and the invitation to the optional Guardian experience. `src/GuardianExperience.tsx` owns the `guardian → entering → human → domain` scene state, destination selection, history/hash behavior, focus, and transition timing. `LayeredGuardian.tsx`, `BreachTransition.tsx`, and `NeuralCore.tsx` render scene visuals. `Patch.tsx` renders the small interactive companion. These components currently contain some mixed concerns; the map below is a direction for future focused refactoring, not a claim that separation already exists.
- `src/data/projects.ts`, `domain.ts`, and `legacyAnchors.ts` hold typed, public-facing facts, destination IDs, and compatibility anchors. Project status and evidence language are deliberate: do not turn an experiment, prototype, or unapproved photo into a claimed public demo or verified result.
- Component CSS Modules own local styling; `src/styles/tokens.css` and `base.css` own shared tokens and fundamentals. `src/assets/` holds bundled scene artwork. `public/` holds copied static files, including standalone `resume.html`, its PDF, and the social image. Do not import the legacy root site's CSS, JavaScript, Three.js, or animation system.
- Vite's `base` is `/brandonhann.github.io/`. Use `import.meta.env.BASE_URL` for copied public paths. Preserve direct hashes, legacy anchors, the résumé URLs, and browser Back behavior. Keep the root production site intact.
- This is currently a static client app with no portfolio backend, authentication, or AI service. Rivet's [authorization boundary](https://github.com/danielwork12121-lab/Rivet/blob/main/convex/lib/auth.ts), [owned-data contract](https://github.com/danielwork12121-lab/Rivet/blob/main/convex/lib/drafts.ts), and [deterministic decision layer](https://github.com/danielwork12121-lab/Rivet/blob/main/convex/lib/decide.ts) are design examples, not dependencies or features to transplant. Adapt the principle: define inputs and outputs, keep facts and decisions reviewable, and isolate effects. If external or AI services are ever added, keep deterministic decisions independent and validate responses at their boundary.

## Directory responsibilities and module boundaries

| Location | Responsibility |
| --- | --- |
| `src/data/` | Typed portfolio facts, stable IDs, links, and pure data transformations. No DOM or React side effects. |
| `src/*.tsx` | Page and visual components. Keep rendering and user interaction explicit; split a component when a new responsibility can have a clear prop or function contract. |
| `src/*.module.css` | Styles tied to one component. |
| `src/styles/` | Shared design tokens, base element rules, and global accessibility styles. |
| `src/assets/`, `public/` | Bundled art versus files copied unchanged into `dist/`. Check URL behavior under the Vite base path. |
| `tests/`, `tests/dist/`, `tests/browser/` | Node data/logic tests, built-artifact checks, and Playwright behavior checks. |

For future refactoring, place pure navigation/scene decision helpers beside the feature or in a small `src/lib/` module only when extraction makes the contract testable. Use feature-specific hooks only when they reduce mixed state/effect/rendering responsibilities. Do not create folders, shared abstractions, or dependencies for a single trivial use.

Use PascalCase for React components and their CSS Modules, camelCase for functions and values, and descriptive domain names for types and IDs. Keep stable URL and `DestinationId` values compatible unless a change includes migration and browser coverage. Export the smallest useful interface. Prefer discriminated unions and `readonly` data where appropriate; avoid `any`, unchecked casts, parallel sources of truth, silent fallbacks, and duplicated project facts. Treat URL parameters and hashes as untrusted input: parse or validate them, handle unknown values explicitly, and let a documented default apply only where it is intentional. Fail visibly for missing required state. Comments should explain a constraint or reason rather than narrate syntax.

## React, interaction, and visual rules

- Keep semantic content and controls in HTML. SVG may depict the Guardian, connections, or Patch; Canvas or WebGL requires a concrete rendering need and a usable HTML interaction path. Never make artwork the only way to reach content.
- Separate durable navigation/selection state from transient hover and animation state. Keep history writes and hash reads coordinated so direct links, Back/Forward, focus, and scroll produce the same selected content. A visible control must perform its stated action; do not ship decorative mock interactions or dead links.
- Bound and clean up every timer, event listener, media query listener, observer, and animation frame. Pause or end work when its scene unmounts or the page is hidden. Avoid per-frame React state updates when CSS or a scoped DOM style is sufficient; measure before adding costly effects.
- Respect `prefers-reduced-motion`, keyboard and touch use, visible focus, accessible names, and mobile widths including 320 px. Preserve the primary homepage as the immediate entry and Guardian as an optional route. Do not make dialogue or animation a gate to projects, résumé, about, or contact.
- Keep CSS Module selectors local and use shared tokens for common colors and typography. Check text contrast, overflow, responsive artwork crop, and controls against real viewport sizes. Self-hosted fonts and image optimization are existing choices; avoid large new runtime or asset costs without a measured benefit.

## Performance and Initial Experience Gate

- The homepage must expose Brandon's identity, introduction, Projects and Résumé links, and accessible navigation immediately. Interactive enhancements are progressive; no splash, mandatory startup animation, world entry, or renderer initialization may gate ordinary use.
- Keep optional world code, models, textures, and Guardian artwork outside the homepage critical path. Measure the current load before expanding features; review mobile cold and repeat visits, transfer sizes, main-thread work, Core Web Vitals, and idle rendering separately. Lab results are not field guarantees.
- Bound and clean up rendering loops, observers, listeners, and timers; stop idle or offscreen work. Validate mobile, keyboard, touch, reduced motion, and a functioning static/HTML fallback when an enhancement or asset fails.

## Security, privacy, and reliability

- Keep secrets, tokens, private contact data, and unapproved images out of source and built assets. Do not imply that client code enforces authorization. If a future backend is introduced, validate and authorize there, before reads or writes; never trust client-provided roles or IDs.
- Render text through React escaping. Do not use `dangerouslySetInnerHTML` for untrusted content. Review external links and keep `rel="noopener noreferrer"` on links opened in a new tab. Use HTTPS for public links when available.
- Preserve public-safe claims in `src/data/`; date reviewed evidence and state limitations. Handle failed assets, unknown routes, and missing data intentionally. Avoid adding analytics or third-party services without a clear requirement and privacy review.

## Required workflow

1. **Inspect:** Read relevant files, `v2/README.md`, tests, Git branch/status, and current browser behavior. Note existing edits before touching a file.
2. **Plan:** State the user-visible change, affected files, data/prop/URL contracts, verification, and material risks. Keep the plan proportional to the task.
3. **Implement:** Make one focused, reviewable change. Preserve unrelated work and existing behavior. Add no dependency or new architecture layer without a specific need.
4. **Verify:** Run relevant checks below and inspect actual behavior for interaction or layout changes. Add meaningful tests for new logic and failure paths; add a regression test for a repaired bug and confirm it would fail for the old behavior when practical. Do not write tests that merely restate implementation details.
5. **Review:** Inspect the diff for scope, accessibility, mobile layout, history, cleanup, performance, privacy, and public claims. Confirm built URLs when public assets change.
6. **Report:** Give exact commands/results, what was observed in a browser, limitations, and any unfinished work. Separate observations from assumptions; never claim success from unrun checks.

Stop and clarify when the requested behavior or approved content cannot be determined from the repository, or when proceeding would overwrite unrelated work. Stop expansion when the requested behavior is complete: no opportunistic redesign, broad refactor, dependency upgrade, or content rewrite. A failed check is not permission to skip it; investigate within scope and report any remaining failure.

## Verification commands

From `v2/`, with Node 24 (`.nvmrc`) and the lockfile's npm version, `npm ci` installs dependencies. `package.json` defines:

```text
npm run typecheck    # tsc --noEmit
npm test             # node --test tests/*.test.mjs
npm run build        # typecheck, then vite build
npm run test:dist     # node --test tests/dist/*.test.mjs; requires build
npm run preview       # local built-site server
npm run test:browser  # node --test tests/browser/*.test.mjs; requires preview and Playwright Chromium
```

The preview default is `http://127.0.0.1:4173/brandonhann.github.io/`; use the printed Vite URL if the port changes and set `PORTFOLIO_PREVIEW_URL` for browser tests. `npm run dev` is for iteration, not built-artifact verification. Choose checks relevant to the change: data/logic tests for pure contracts; typecheck/build and dist tests for bundle or path changes; browser tests for navigation, interaction, layout, animation, and accessibility. Include failure and edge cases, direct links, Back, keyboard, reduced motion, and mobile where affected. No test command is claimed to have passed merely because it appears here.

## Git, release, and definition of done

Inspect `git status` before and after edits. Respect the current branch, checkpoints, and uncommitted work. Never delete or overwrite unrelated changes. Do not automatically commit, push, merge, deploy, switch Pages settings, or publish `dist/`. `v2/README.md` contains the release and rollback constraints; release requires separate owner approval and preserving the legacy root site.

Before reporting completion, confirm:

- [ ] The request is met with a focused diff and preserved existing behavior.
- [ ] Types and interfaces are clear; data, UI, and side effects have sensible boundaries.
- [ ] Relevant success, failure, regression, and browser behavior are verified, or gaps are stated precisely.
- [ ] Mobile, keyboard, reduced motion, URLs/history, and cleanup are checked when affected.
- [ ] Public claims, privacy, performance, and accessibility have been reviewed.
- [ ] Git status contains only intended new edits plus explicitly identified pre-existing work; no release action occurred.

Final report template: **Changed** (files and behavior); **Verified** (exact commands and browser observations); **Limits** (unrun checks or remaining risks); **Git** (new diff versus pre-existing changes, and release status).
