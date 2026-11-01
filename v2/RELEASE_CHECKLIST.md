# Portfolio v2.0 — final release gate and rollback runbook

This is a **review checklist, not deployment authorization**. Latest review source: `experiment/final-release-qa`, based on `experiment/resume-unification` at `3d984862acc2a9d934f8f9f84242bf0b6d8a2e50`. The older results below document the H.3D checkpoint; they do not substitute for the latest QA run. Keep the legacy `main` branch and current live site intact until a separately approved release. See `RELEASE_READINESS.md` for the earlier claim, media, accessibility, and performance audit.

## Latest QA — November 1, 2026

- [x] The built homepage and résumé were inspected at 320, 390, 900, and 1440 px: one visible H1 on each route, no horizontal overflow, and no page errors. Local captures stay ignored. The homepage design and case studies were not changed.
- [x] Homepage and résumé local links, including project hashes, Contact, résumé, PDF, and Guardian entry, resolved under `/brandonhann.github.io/`; 12 unique homepage and 6 unique résumé local destinations had no broken target in the built preview. Browser tests cover direct hashes, Back/Forward, keyboard/touch, visible focus, reduced motion, smooth scrolling, Mapetite, Signal Network, and lazy Guardian.
- [x] Public GitHub profile, Mapetite, Rivet, ODDWORKS, Cura source/Devpost, and Mapetite live destinations returned HTTP 200 on read-only HEAD checks. LinkedIn returned 405 to the automated HEAD request and still needs a normal-browser check. Reachability does not certify the external applications' functionality.
- [x] At phone widths, the résumé uses direct Open/Download actions and a short note; the embedded PDF preview is desktop-only. Both links and the PDF return HTTP 200, a new tab opens, and the download filename is correct. The hidden lazy iframe made no initial PDF request at 390 px, while the visible desktop viewer did request it at 900 px. The normal Chrome app could not be accessed for this QA run; automated headless Chromium did not display its PDF plugin, so native browser rendering remains a manual check.
- [x] `npm run typecheck`, `npm test` (5/5), `npm run build`, `npm run test:dist` (5/5), and `npm run test:browser` (39/39) passed against the built preview. The final `dist/` has 33 files (6,232,113 bytes), including the intentionally lazy Guardian chunk/art. A targeted scan found no private W.7A captures, credential patterns, Linux Bridge text, Outpost module, source maps, or unexpected capture/archive filenames. This is not a comprehensive secret scan.
- [x] A five-cold/five-warm local homepage run at 390 × 844 with 150 ms latency, 1.6 Mbps down, and 4× CPU throttling measured median FCP/observed LCP of 804/804 ms cold and 468/468 ms warm; CLS 0.0163 cold and 0 warm; long-task duration 57 ms cold and 0 warm. These are simulated lab observations, not field Core Web Vitals. The résumé-only correction did not change the homepage entry JS/CSS chunks (229.26/26.28 kB raw in the build report).

**Remaining release blockers:** Brandon must confirm the PDF/profile's GPA, expected May 2027 graduation, experience dates (including the ambiguous “Jan. 2026 – 2026” AI Task Force range), contact details, and whether Mapetite and ODDWORKS should still say “Present”; reconfirm SecureAgent Lab's dated status. Complete a manual VoiceOver or NVDA pass and a physical-phone PDF/keyboard/touch review; verify LinkedIn in a normal browser; reconfirm the Pages setting; obtain separate explicit publication approval. No private Mapetite capture is required for the current release.

## Verified in the release-candidate source

- [x] Engineering-first homepage, four featured case studies, additional Cura work, and direct Projects/Résumé/Contact links remain in the same visual system.
- [x] Build-time prerender places semantic homepage content in `dist/index.html` before JavaScript; hydration uses that content rather than a second handwritten copy.
- [x] Mapetite examples update the original validation flow rather than appending duplicate stages. Native buttons, a persistent polite status region, and the no-JavaScript explanation remain.
- [x] The standalone résumé and PDF use the GitHub Pages subpath; the résumé brand returns to the homepage root and its Projects and Contact links retain native hashes.
- [x] Guardian is optional and lazy-loaded. The default homepage does not request its artwork or an Outpost module.
- [x] W.7A Mapetite images and H.3D private comparison files are outside `public/` and `dist/`. No Linux Bridge content is part of the main portfolio.
- [x] Repository tests, a built-preview browser run, and targeted accessibility/contrast checks are recorded below and in `RELEASE_READINESS.md`. These establish technical behavior, not artistic or personal-fact approval.

Final local gate run on October 29, 2026: Node 24.16.0; `npm run typecheck` passed; `npm test` passed 5/5; `npm run build` passed; `npm run test:dist` passed 5/5; `npm run test:browser` passed 25/25 against the fresh built preview. At 390 and 1440 px, the opening and selected Mapetite views had no horizontal overflow or page errors. A computed-color scan at 390 px found no normal-size contrast failures among 167 sampled visible text nodes; the Mapetite accessibility tree exposed named buttons and a status region. This scan does not establish full WCAG conformance or actual screen-reader announcements.

The built `dist/` contained 37 files (6,452,743 bytes), including the intentional optional Guardian artwork and chunk. The entry HTML had one prerendered root, one entry script, one stylesheet, and two preloaded Latin fonts; all four referenced files existed under the Pages base path. A filename and text-pattern scan found no W.7A capture, recovery archive, source map, credential pattern, Linux Bridge text, or Outpost import. This is a targeted artifact audit, not a guarantee against every possible secret format.

## Unresolved gates before any public switch

- [x] **Pages source read on November 1, 2026.** An authenticated GitHub Pages API request returned `build_type: legacy`, `source: main / (root)`, `status: built`, `https_enforced: true`, no custom domain, and live URL `https://spook65.github.io/brandonhann.github.io/`. The public API returned 404; the authenticated result is the source of this record. Recheck Settings → Pages and capture the current source immediately before any public switch. Stop if it differs.
- [ ] Brandon confirms current education/year, experience and contact wording, résumé PDF content, SecureAgent Lab's dated October 21 test review and active status, and the portfolio's public contribution descriptions. The one-page PDF was readable and contains an expected May 2027 graduation, 2026 experience dates, and Mapetite/ODDWORKS/Cura entries; this audit does not establish that those facts are still current. Public repositories corroborate the stated Mapetite, Rivet, ODDWORKS, and Cura boundaries; private/current personal facts require owner confirmation.
- [ ] Manually open the LinkedIn destination in a normal browser. The final HTTP HEAD check returned 405 (the prior GET returned 999); automated access cannot establish its visitor experience. All other listed public source, live-demo, Devpost, and GitHub destinations returned HTTP 200 on the final HEAD check. Reachability does not prove every external feature still works.
- [ ] Complete a manual screen-reader pass (at least one of VoiceOver or NVDA) for heading navigation, project index, Mapetite status announcements, details, and résumé links. Test keyboard focus and a physical touch device. Chromium automation and accessibility-tree inspection do not replace these checks.
- [ ] Review the 390 px and 1440 px page, Mapetite interaction, and optional Guardian visually. Passing tests does not approve layout or content. Confirm current browser/device support beyond Chromium if release audience requires it.
- [ ] Record the exact reviewed source commit, successful final build/test output, generated artifact inventory, and current remote `main` SHA. Review the publishing branch diff before any switch.
- [ ] Obtain a separate explicit owner decision to publish. **No W.7A capture is needed for this release**; the images remain private unless a specific file and its third-party content are separately approved.

## Publishing procedure after separate approval

1. Complete every gate above. Freeze the reviewed source commit and verify its remote SHA. Preserve the current Pages source values and live-site screenshots as the rollback record. Do not change `main` or overwrite a recovery branch.
2. From a clean checkout of that exact commit, use Node 24 and `npm ci`; run `npm run typecheck`, `npm test`, `npm run build`, `npm run test:dist`, and `npm run test:browser` against `npm run preview`. Verify `dist/` contains only the intended static site, including `.nojekyll`, `index.html`, `resume.html`, PDF, hashed assets, and Guardian's optional chunk. Confirm no private W.7A media, source maps, credentials, recovery archives, or Outpost assets entered the artifact.
3. **For the verified current branch-based source (`main` `/ (root)`):** after separate owner approval, create a dedicated publishing branch (for example `release/v2-pages`) from only the reviewed `dist/` contents using a separate temporary worktree. Review its full file list, commit it, and push normally; never force-push or rewrite existing history. If that branch name already exists, stop and review its history before choosing a non-destructive update. Only then change Settings → Pages to that branch's `/ (root)` folder. Record both the old `main` `/ (root)` setting and the new setting. Do not modify `main`.
4. If the pre-deployment settings check instead shows **GitHub Actions**, stop. Identify the actual workflow and its trigger/artifact contract, then prepare a separate Actions-specific publish and rollback procedure. Do not create or run an unreviewed workflow.
5. After Pages reports completion, smoke-test the public `/brandonhann.github.io/` URL, Projects hashes, direct case-study links, résumé HTML/PDF, optional `?experience=guardian`, browser Back/Forward, 390 px layout, and a JavaScript-disabled load. Check browser console/network errors and keep the pre-release state available for comparison. Announce a release only after these checks pass.

## Rollback if the approved public switch fails

1. Restore the **recorded previous** Settings → Pages source: `main` and `/ (root)` if it still matches the verified pre-deployment snapshot (or the newly recorded previous setting if it has changed). Do not reset or rewrite `main`.
2. Wait for GitHub Pages to finish, then verify the legacy homepage, résumé, and current live URL in a fresh browser session. Check that the previous Pages setting is visible again.
3. Keep the v2 source and publishing branch for diagnosis. Record the failing public URL, observed error, affected commit, and rollback verification; fix and re-review on a non-production branch before any new attempt.

## Optional after a stable release

- Review and approve project-specific authentic media, with map/provider attribution and venue-content rights checked before publication.
- Gather real-user Core Web Vitals and assistive-technology feedback; compare with the local lab observations rather than treating them as guarantees.
- Consider further mobile evidence-density refinement only if actual users struggle with the current case study.
