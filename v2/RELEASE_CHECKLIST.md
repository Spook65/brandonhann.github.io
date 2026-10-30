# Portfolio v2.0 — final release gate and rollback runbook

This is a **review checklist, not deployment authorization**. Review source: `experiment/release-candidate-prep`, which descends from H.3C `bef640ef600e4bbf8a78bae3f8771a745746d782`. Keep the legacy `main` branch and current live site intact until a separately approved release. See `RELEASE_READINESS.md` for the detailed claim, media, accessibility, and performance audit.

## Verified in the release-candidate source

- [x] Engineering-first homepage, four featured case studies, additional Cura work, and direct Projects/Résumé/Contact links remain in the same visual system.
- [x] Build-time prerender places semantic homepage content in `dist/index.html` before JavaScript; hydration uses that content rather than a second handwritten copy.
- [x] Mapetite examples update the original validation flow rather than appending duplicate stages. Native buttons, a persistent polite status region, and the no-JavaScript explanation remain.
- [x] The standalone résumé and PDF use the GitHub Pages subpath; the résumé brand link returns to an existing `#main-content` anchor.
- [x] Guardian is optional and lazy-loaded. The default homepage does not request its artwork or an Outpost module.
- [x] W.7A Mapetite images and H.3D private comparison files are outside `public/` and `dist/`. No Linux Bridge content is part of the main portfolio.
- [x] Repository tests, a built-preview browser run, and targeted accessibility/contrast checks are recorded below and in `RELEASE_READINESS.md`. These establish technical behavior, not artistic or personal-fact approval.

Final local gate run on October 29, 2026: Node 24.16.0; `npm run typecheck` passed; `npm test` passed 5/5; `npm run build` passed; `npm run test:dist` passed 5/5; `npm run test:browser` passed 25/25 against the fresh built preview. At 390 and 1440 px, the opening and selected Mapetite views had no horizontal overflow or page errors. A computed-color scan at 390 px found no normal-size contrast failures among 167 sampled visible text nodes; the Mapetite accessibility tree exposed named buttons and a status region. This scan does not establish full WCAG conformance or actual screen-reader announcements.

The built `dist/` contained 37 files (6,452,743 bytes), including the intentional optional Guardian artwork and chunk. The entry HTML had one prerendered root, one entry script, one stylesheet, and two preloaded Latin fonts; all four referenced files existed under the Pages base path. A filename and text-pattern scan found no W.7A capture, recovery archive, source map, credential pattern, Linux Bridge text, or Outpost import. This is a targeted artifact audit, not a guarantee against every possible secret format.

## Unresolved gates before any public switch

- [ ] **Identify the actual Pages source.** In GitHub, open `Spook65/brandonhann.github.io` → **Settings → Pages → Build and deployment** while signed in. Record **Source** (`Deploy from a branch` or `GitHub Actions`), selected branch and folder if branch-based, any workflow if Actions-based, custom domain, HTTPS setting, and current live URL. Save a private screenshot or note. The review branch contains no `.github/workflows`, but that does not prove the live setting. The available connector lacks this setting, the public Pages API returned 404, and the signed-out browser showed 404. **Stop if this cannot be recorded.**
- [ ] Brandon confirms current education/year, experience and contact wording, résumé PDF content, SecureAgent Lab's dated October 21 test review and active status, and the portfolio's public contribution descriptions. The one-page PDF was readable and contains an expected May 2027 graduation, 2026 experience dates, and Mapetite/ODDWORKS/Cura entries; this audit does not establish that those facts are still current. Public repositories corroborate the stated Mapetite, Rivet, ODDWORKS, and Cura boundaries; private/current personal facts require owner confirmation.
- [ ] Manually open the LinkedIn destination in a normal browser. The final HTTP HEAD check returned 405 (the prior GET returned 999); automated access cannot establish its visitor experience. All other listed public source, live-demo, Devpost, and GitHub destinations returned HTTP 200 on the final HEAD check. Reachability does not prove every external feature still works.
- [ ] Complete a manual screen-reader pass (at least one of VoiceOver or NVDA) for heading navigation, project index, Mapetite status announcements, details, and résumé links. Test keyboard focus and a physical touch device. Chromium automation and accessibility-tree inspection do not replace these checks.
- [ ] Review the 390 px and 1440 px page, Mapetite interaction, and optional Guardian visually. Passing tests does not approve layout or content. Confirm current browser/device support beyond Chromium if release audience requires it.
- [ ] Record the exact reviewed source commit, successful final build/test output, generated artifact inventory, and current remote `main` SHA. Review the publishing branch diff before any switch.
- [ ] Obtain a separate explicit owner decision to publish. **No W.7A capture is needed for this release**; the images remain private unless a specific file and its third-party content are separately approved.

## Publishing procedure after separate approval

1. Complete every gate above. Freeze the reviewed source commit and verify its remote SHA. Preserve the current Pages source values and live-site screenshots as the rollback record. Do not change `main` or overwrite a recovery branch.
2. From a clean checkout of that exact commit, use Node 24 and `npm ci`; run `npm run typecheck`, `npm test`, `npm run build`, `npm run test:dist`, and `npm run test:browser` against `npm run preview`. Verify `dist/` contains only the intended static site, including `.nojekyll`, `index.html`, `resume.html`, PDF, hashed assets, and Guardian's optional chunk. Confirm no private W.7A media, source maps, credentials, recovery archives, or Outpost assets entered the artifact.
3. **If Pages is currently branch-based:** create a dedicated publishing branch (for example `release/v2-pages`) from only the reviewed `dist/` contents using a separate temporary worktree. Review its full file list, commit it, and push normally; never force-push or rewrite existing history. If that branch name already exists, stop and review its history before choosing a non-destructive update. Only then change Settings → Pages to that branch's `/ (root)` folder. Keep the previous source branch/folder unchanged and record the new setting and deployment result.
4. **If Pages is currently Actions-based:** stop here. Identify the actual workflow and its trigger/artifact contract, then prepare a separate, reviewed Actions-specific publish and rollback procedure. Do not create or run an unreviewed workflow merely to fit a branch-based plan.
5. After Pages reports completion, smoke-test the public `/brandonhann.github.io/` URL, Projects hashes, direct case-study links, résumé HTML/PDF, optional `?experience=guardian`, browser Back/Forward, 390 px layout, and a JavaScript-disabled load. Check browser console/network errors and keep the pre-release state available for comparison. Announce a release only after these checks pass.

## Rollback if the approved public switch fails

1. Restore the **recorded previous** Settings → Pages source, branch, and folder (or the recorded Actions deployment procedure, if applicable). Do not reset or rewrite `main`.
2. Wait for GitHub Pages to finish, then verify the legacy homepage, résumé, and current live URL in a fresh browser session. Check that the previous Pages setting is visible again.
3. Keep the v2 source and publishing branch for diagnosis. Record the failing public URL, observed error, affected commit, and rollback verification; fix and re-review on a non-production branch before any new attempt.

## Optional after a stable release

- Review and approve project-specific authentic media, with map/provider attribution and venue-content rights checked before publication.
- Gather real-user Core Web Vitals and assistive-technology feedback; compare with the local lab observations rather than treating them as guarantees.
- Consider further mobile evidence-density refinement only if actual users struggle with the current case study.
