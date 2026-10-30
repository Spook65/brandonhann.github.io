# H.3D — Engineering portfolio release-readiness review

Reviewed October 29, 2026 on `experiment/release-candidate-prep`, branched from `bef640ef600e4bbf8a78bae3f8771a745746d782`. This is a review of the experimental portfolio, not approval to publish or deploy it. `main`, the approved homepage branch, and the optional Guardian implementation were not changed.

## Mapetite interaction decision

Keep the three documented validation examples. They explain a concrete engineering boundary in one selection and do not call Mapetite's API. H.3C appended a second three-stage trace below the original flow after each selection, which increased density and repeated the same information. H.3D updates the original input, validation, and provider stages in place. The three existing controls and static no-JavaScript outcome explanations remain. A persistent polite status region summarizes the selected path for assistive technology. Browser tests cover button state, visible result, keyboard, touch, reduced motion, and no-JavaScript content. An accessibility-tree inspection found named buttons, the figure label, and the status region; actual VoiceOver or NVDA announcement behavior was not manually tested.

The mobile selected state is more compact than H.3C, but it still contains a full technical explanation. It is worth keeping because the selected result explains **where** the request stops or proceeds. It should not gain more controls or animation at this checkpoint.

## Private Mapetite visual evidence

The W.7A `desktop-search.jpg` (1440 × 900) shows the genuine search interface and product disclosures. It contains no venue photograph. It does **not** demonstrate a completed search. `mobile-map.jpg` (390 × 844) shows an actual Stockton mapped-result state, including the visible OpenFreeMap, OpenMapTiles, and OpenStreetMap attribution. It includes third-party map tiles and place data. Both are **private review candidates only**. The separate desktop-map capture includes additional venue imagery and logos, so it is not recommended for this first public evidence pass.

Ignored local H.3D contact sheets pair each genuine capture with the current case study. They are layout studies, not modified product screenshots or published assets. Recommended single layout after explicit approval: one full-width `<picture>`/figure immediately after the Mapetite introduction, with desktop search on wide screens and mobile map on narrow screens, a dated factual caption, and intact provider/map attribution; then the existing validation explainer. A full-width desktop presentation avoids shrinking the search interface into the current half-width evidence column. Do not implement or publish this layout until Brandon approves the specific files and third-party content review is complete. Do not add a gallery framework.

## Claim and destination audit

| Item | Evidence reviewed | Release assessment |
| --- | --- | --- |
| Mapetite | [Public README](https://github.com/Spook65/Mapetite/blob/main/README.md), [validator](https://github.com/Spook65/Mapetite/blob/main/server/services/placeValidation.js), and [tests](https://github.com/Spook65/Mapetite/blob/main/server/services/placeValidation.test.js) support the MVP, architecture, validation outcomes, provider fallback, and demo limitations. Live app and source returned HTTP 200. | Ready as written. Portfolio examples are explicitly illustrative; project tests were inspected, not rerun. No private media published. |
| Rivet | [README](https://github.com/danielwork12121-lab/Rivet/blob/main/README.md), [hackathon log](https://github.com/danielwork12121-lab/Rivet/blob/main/hackathon.md), and [decision layer](https://github.com/danielwork12121-lab/Rivet/blob/main/convex/lib/decide.ts) support the backend architecture and prototype status. Brandon directly confirmed his Convex, Clerk, AI workflow, secure-data, and matching contribution. Source returned HTTP 200. | Ready with the existing team-contribution boundary. No claim of sole authorship, verified ROI, or deployed production service. |
| SecureAgent Lab | Existing public-safe dated local review in `data/domain.ts`: 36/36 tests including an uncommitted test and 20 synthetic scenarios, reviewed October 21. No public source or demo accompanies this case study. | Appropriately labeled offline experiment, but owner should reconfirm whether dated results and active-development status remain current before release. This audit did not rerun a private project. |
| ODDWORKS | [Public README](https://github.com/Spook65/Oddworks/blob/main/README.md) and [vertical-slice roadmap](https://github.com/Spook65/Oddworks/blob/main/docs/VERTICAL_SLICE_PLAN.md) distinguish implemented 0.1 foundation from proposed 0.2 work. Source and roadmap returned HTTP 200. | Ready as a pre-production technical foundation. The portfolio makes no released-game claim. |
| Cura | [Devpost](https://devpost.com/software/cura-kthowx) lists the Regeneron Honorable Mention and Brandon's frontend/Creao contribution; Brandon confirmed the precise pages and role. Teammate backend and iOS repositories returned HTTP 200. | Ready as additional team work. The case study does not attribute backend, iOS, or clinical validation to Brandon. |
| Linux Bridge | Owner explicitly prohibited public display. Runtime source and built homepage were searched for the project name and private material. | Excluded. No Linux Bridge case study, media, or source link. |
| Identity and résumé | Homepage and standalone résumé paths resolve under `/brandonhann.github.io/`; built PDF exists and returned HTTP 200 in the local preview. The résumé brand link previously targeted nonexistent `#hero`; corrected to `#main-content`. | Navigation ready. Owner should confirm that time-sensitive education, experience, résumé PDF contents, and contact details are current; this audit checked paths rather than independently verifying personal history or PDF text. |

External destination checks on October 29 used read-only HTTP requests. All listed GitHub project/source links, the Mapetite live URL, and Devpost returned HTTP 200. LinkedIn returned automated-client 405 for HEAD and 999 for GET, so it requires a normal-browser/manual check. HTTP 200 confirms reachability, not continued functionality of every external app feature. Main-page local links, direct project hashes, legacy hashes, browser Back/Forward, résumé navigation, and optional Guardian route have browser coverage.

## Accessibility, layout, and privacy

- Production-preview checks at 320, 390, 768, and 1440 px found no horizontal overflow; full-page 390 and 1440 px views were captured. The Mapetite selected state was inspected on mobile. Keyboard and touch selection, visible focus, reduced motion, no-JavaScript content, and Guardian route are exercised by the browser suite.
- A computed-color scan of 163 visible text nodes at 390 px found no normal-size text below a 4.5:1 contrast ratio against its nearest opaque computed background. This is a targeted automated scan, not a complete WCAG audit: it does not model every background image, pseudo-element, interaction state, or human vision condition.
- The default page prerenders one semantic homepage before JavaScript. Browser tests found no hydration duplication/warning. Guardian remains a lazy chunk; default entry requests do not fetch Guardian artwork or Outpost code. The built entry bundle contains no Outpost rendering library.
- Tracked homepage data and built HTML were scanned for Linux Bridge disclosure and common credential markers. No private Linux Bridge content or credential value was found in the audited surface. This is a targeted scan, not a repository-wide secret-detection guarantee.
- Manual screen-reader operation, physical touch devices, cross-browser testing beyond Chromium, and owner review of personal claims remain outstanding.

## Comparable local performance

The existing `scripts/measure-home.mjs` ran five cold and five warm Chromium samples at 390 × 844, 150 ms latency, 1.6 Mbps down, 0.75 Mbps up, and 4× CPU throttling. H.3C values come from `PROJECT_EVIDENCE_NOTES.md`; H.3D used the same script and profile. These are local lab medians, not field Core Web Vitals or evidence of a production improvement.

| Metric | H.3C cold | H.3D cold | H.3C warm | H.3D warm |
| --- | ---: | ---: | ---: | ---: |
| FCP / observed LCP (paragraph) | 780 ms | 772 ms | 432 ms | 436 ms |
| CLS | 0.00129 | 0.00129 | 0 | 0 |
| Long-task duration | 0 ms | 0 ms | 0 ms | 0 ms |

Representative H.3D cold transfer: entry JavaScript 70,678 B; CSS 7,490 B; two Latin font files 89,260 B. H.3C reported 70,660 B JavaScript and 7,520 B CSS. The difference is negligible. H.3D added no media request or dependency to the homepage. Field p75 LCP/INP/CLS, physical-device battery cost, and real-network behavior are unmeasured.

## Release gate

**Verified and ready:** Existing engineering-first composition, typed case-study content, source-backed Mapetite/Rivet/ODDWORKS/Cura boundaries, immediately usable prerendered homepage, local résumé paths, keyboard/touch navigation, and lazy Guardian isolation. Focused H.3D corrections are verified by the repository suite.

**Fixable defects:** The duplicate Mapetite trace and broken résumé brand anchor were corrected here. No other confirmed code defect was found in this audit. LinkedIn reachability needs a manual normal-browser check because automated requests were blocked.

**Owner approval required:** Public reuse of either W.7A capture, review of map/provider and venue-content rights, current accuracy of personal résumé/profile facts and SecureAgent's dated status, and visual approval of the recommended evidence order. No release should proceed on the assumption that private capture equals publication consent.

**Optional later:** Approved project-specific evidence for Rivet/ODDWORKS, further mobile density refinement if user testing identifies difficulty, and field performance/accessibility monitoring after an actual release. None is needed to judge this checkpoint.
