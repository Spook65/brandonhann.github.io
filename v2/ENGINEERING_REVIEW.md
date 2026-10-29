# H.3A — Engineering portfolio review

Reviewed October 29, 2026. Experimental direction, pending owner visual approval.

## Foundation and implementation plan

Branch `experiment/engineering-portfolio` starts at verified H.2A `1a55503315bf971e04edc89f235c4df205046d7a`. The original Outpost checkout, `.DS_Store` modification, and W.3–W.5 archives are preserved. Work began in an isolated temporary worktree and is preserved at `/Users/bhann/Documents/portfolio/engineering-portfolio`. No Outpost code was imported; its experiment stays on its existing branches. Guardian remains the existing lazy route.

`data/caseStudies.ts` extends existing public-safe facts with typed problem, contribution, architecture, decisions, stack, evidence, and limitations. `showcase/ProjectShowcase.tsx` renders the semantic index and full case studies; `useProjectNavigation.ts` reads validated URL state. `WelcomingHome` owns the compact identity, static professional links, principle inspector, additional work, and existing profile/skills/contact. Scoped CSS tokens keep the engineering identity separate from Guardian. H.2A's render/hydration path remains; the prerender script preloads the new homepage fonts. Tests and local capture/measurement scripts verify the resulting contracts.

## Reference observations — Damian

Inspected the actual [live site](https://damiansaelee.com/) with a browser at 1440×900 and 390×844. Private screenshots are in ignored `artifacts/h3a-review/damian-*.jpg`.

Verified: desktop opening has identity/navigation, a featured drone recording, concise engineering focus, measurable evidence, and project shortcuts. The Projects section uses a branching circuit with four anchor destinations; selecting the drone updates the URL to `#project-drone` and moves to its case study. The circuit has a desktop Pause animation control. Mobile changes the circuit to a vertical arrangement. Case studies contain a problem/summary, source/write-up links, stack, captions for real recordings or profiling evidence, and native expandable engineering details. Expanding the drone details reveals specific implementation decisions and a longer architecture discussion. Computed heading/nav family was Sora. The dark warm palette, accent headings, restrained borders, and repeated spacing create continuity. The source repo for this portfolio was not verified public, and no private source was inspected.

Unverified: source implementation, internal state/lifecycle, exact performance, and OS reduced-motion behavior. Pointer hover and keyboard focus styling were not exhaustively assessed in the reference browser; do not infer accessibility conformance from screenshots. Transfer the evidence hierarchy and progressive disclosure, not its circuit geometry or exact layout. Brandon's index is a numbered horizontal/2-column navigation surface, followed by directly accessible case studies.

## Project selection and evidence

| Candidate | Review evidence | Decision |
|---|---|---|
| Mapetite | Public [README](https://github.com/Spook65/Mapetite), `server/services/placeValidation.js`, and validation test search results. React/Express separation, provider fallback, uncertainty labels. Existing owner portfolio project. | Feature: full-stack product with inspectable implementation and demo link. No private screenshots published. |
| Rivet | Public [README](https://github.com/danielwork12121-lab/Rivet), [hackathon log](https://github.com/danielwork12121-lab/Rivet/blob/main/hackathon.md), `convex/lib/decide.ts`. Owner confirms backend contribution: Convex, Clerk, secure user data, AI workflows, matching. | Feature: strongest new backend/authorization evidence. Label team prototype; do not claim all work or reuse team test totals as Brandon's results. |
| SecureAgent Lab | Existing public-safe `domain.ts` facts and dated October 21 local review. No public source discovered in this audit. | Feature: relevant AI security boundary. Keep scope explicit; no new security or test-success claim. |
| ODDWORKS | Public [README](https://github.com/Spook65/Oddworks) and [roadmap](https://github.com/Spook65/Oddworks/blob/main/docs/VERTICAL_SLICE_PLAN.md) separate the implemented foundation from planned gameplay. | Feature: server authority, state, persistence, and multiplayer architecture. Prototype, not released game. |
| Cura | [Devpost](https://devpost.com/software/cura-kthowx) identifies Brandon's frontend/Creao work and award; public backend `src/agent.py` corroborates the shared voice-service architecture. Owner confirms the exact frontend contribution. | Additional work with contribution details and evidence links. Do not attribute teammates' voice agent, backend, or iOS implementation to Brandon. |
| Linux Bridge | Accessible repository is private; owner explicitly says it is not for public display. | Exclude from runtime. No source excerpts or implementation details imported. |

Project repository tests were inspected where noted, not run here. Portfolio verification does not certify those projects. Schematics are original semantic renderings of reviewed documentation, not screenshots or complete security diagrams.

## Visual and typography review

The private `font-comparison.png` compares Source Sans 3/Fraunces and Inter/JetBrains Mono with identical content. Inter's tighter sans-serif hierarchy fits the engineering direction; JetBrains Mono is limited to metadata. Official Fontsource packages supply self-hosted fonts; Guardian keeps its existing fonts. The opening has no image request or face. The desktop project header is visible in the opening viewport; mobile retains direct Projects access and a brief principle interaction. The presentation is intentionally quiet. It still needs stronger approved visual evidence: every featured project currently uses a schematic, which can become repetitive. The current render should be reviewed as a proposal, not described as artistically approved.

## Performance and verification

Final comparable local production-preview samples used Chromium, 390×844, 150 ms network latency, 1.6 Mbps down / 0.75 Mbps up, and 4× CPU throttling. Five fresh-context cold loads and five same-context repeat loads were run for each version. `scripts/measure-home.mjs` records raw samples; it uses PerformanceObserver and browser resource timings, not field telemetry. Both LCP candidates were paragraphs.

| Metric | H.2A cold median | H.3A cold median | H.2A warm median | H.3A warm median |
|---|---:|---:|---:|---:|
| FCP / observed LCP | 688 ms | 780 ms | 432 ms | 464 ms |
| CLS sum without recent input | 0.1179 | 0.00129 | 0 | 0 |
| Long-task duration | 0 ms | 0 ms | 0 ms | 0 ms |

Cold FCP ranges were 680–804 ms before and 744–828 ms after. The H.2A CLS result differs from `INSTANT_HOME_NOTES.md`'s earlier 0 result. The current source-attribution capture recorded the portrait/currently-building region moving upward roughly 54 px, plus a small heading shift. It does not establish the root cause independently; the old notes attribute a similar pattern to font swapping. Report the discrepancy rather than relabeling these samples as the old result. The redesign removes the portrait composition and changes typography, so it is not a controlled test of a single CLS fix.

A representative cold resource sample transferred 67,775 → 69,277 bytes entry JS, 4,560 → 6,818 bytes CSS, and 66,092 → 89,260 bytes fonts. The 90,556-byte portrait request is absent after redesign. Build sizes: H.2A JS 213.19 kB raw / 67.48 kB gzip; H.3A 217.96 / 69.01. CSS 17.22 / 4.26 → 23.24 / 6.54. Official variable fonts improve the desired hierarchy but increase critical font transfer; further subsetting/weight tuning is a future performance decision, not an unmeasured claimed win. No external font service or optional world asset is requested on entry.

An unthrottled local interaction sample updated the principle explanation in about 3.1 ms from programmatic click to DOM mutation. This is not INP. A settled homepage sample recorded zero requestAnimationFrame callbacks and zero running Web Animations during one second. Desktop and mobile captures validate layout, not zero-latency production delivery. Field Core Web Vitals, real-device battery/thermal behavior, and manual screen-reader testing remain unmeasured.

Commands run: `npm run typecheck`, `npm test` (5 pass), `npm run build`, `npm run test:dist` (5 pass), and `npm run test:browser` (21 pass). Browser coverage includes prerender/no-JS details, single hydration, malformed/direct/legacy hashes, Back/Forward, hover/focus selection, keyboard/touch, widths 320/390/768/1440, reduced motion, résumé, lazy Guardian, no Outpost/portrait requests, and preserved Guardian regression tests. One initial browser assertion checked the URL before mobile navigation completed; it was corrected to wait for the destination and then passed. The screenshot script also caught a font-specimen origin problem; the final comparison was inspected with the actual fonts loaded. Captures and recordings remain ignored local outputs, never build assets.
