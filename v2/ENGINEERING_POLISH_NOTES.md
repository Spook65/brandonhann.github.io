# H.3B — Engineering showcase polish

Reviewed October 29, 2026 on `experiment/engineering-polish`, based on H.3A commit `c9c9301149dec7ed85f877d9a3815cdf7876265d`. This is a review candidate, not visual approval or a release.

## Defects observed before editing

- At 390 px, project categories were 0.59 rem and the preview label 0.55 rem; evidence captions, stack labels, and boundary text were similarly small. The 320 px view compressed these further.
- A tiny dot carried much of the selected-state signal. Hover and selected states both used a filled surface, so the difference was hard to read. The preview restated each case study's problem immediately above that same study.
- All four studies used the same numbered flow. For Mapetite, that hid the interesting validation decision: rejecting invalid or ambiguous locations before a provider search.
- The H.3A browser test covered pointer preview, direct hashes, and history, but did not assert a visible keyboard focus treatment or the distinct preview and selection labels.

## Change and evidence boundary

The index now uses readable **Selected**, **Preview**, and **Open** labels, stronger focus/pressed states, and compact project-specific insight previews. Hover and focus share a transient preview; the URL remains the authoritative selection. Touch activates the ordinary anchor. This keeps every case study in prerendered HTML.

Mapetite now has a dedicated, source-derived validation figure: input → backend place resolution → not found / ambiguous / resolved → provider search only for a resolved place. `PLACE_NOT_FOUND` and `PLACE_AMBIGUOUS` are actual error codes in [the public validator](https://github.com/Spook65/Mapetite/blob/main/server/services/placeValidation.js); the [README](https://github.com/Spook65/Mapetite/blob/main/README.md) documents the provider fallback, uncertainty labels, live app, and deployment. The figure is explicitly illustrative and links to that source. It does not depict a fabricated product interface or claim the portfolio reran Mapetite's tests.

The W.7A open-map capture remains a private candidate. `SCENE_FIRST_AUDIT.md` records map/provider attribution and venue media review requirements. No screenshot, tile, logo, or venue photo was copied into the build. A future approved capture should preserve attribution and be captioned as the live MVP at capture time.

For later project-specific evidence: Rivet could show a reviewed pure decision rule and authorization boundary from its public source, with team contribution marked; SecureAgent Lab needs an approved public-safe artifact before replacing its schematic; ODDWORKS could use an approved Studio/gameplay capture that distinguishes implemented foundation from planned gameplay. These are recommendations, not content added in H.3B. Cura remains additional work and Linux Bridge remains excluded.

## Local visual and performance review

Before captures: ignored `artifacts/h3a-review/projects-*.png` and `case-study-*.png`. After captures and navigation recording: ignored `artifacts/h3b-review/`. The new index and Mapetite figure were inspected at 320, 390, 768, and 1440 px. The special figure is more explanatory than the former generic flow, but its three outcome columns still have a diagrammatic appearance. An approved app capture would add genuine product texture after permission review. Artistic acceptance remains Brandon's decision.

Comparable local Chromium samples used the H.3A script: five fresh-context cold and five same-context warm loads at 390 × 844, 150 ms latency, 1.6 Mbps download, 0.75 Mbps upload, and 4× CPU throttling. Values are median lab observations, not field Core Web Vitals.

| Metric | H.3A cold | H.3B cold | H.3A warm | H.3B warm |
| --- | ---: | ---: | ---: | ---: |
| FCP / observed LCP | 780 ms | 740 ms | 464 ms | 428 ms |
| CLS | 0.00129 | 0.00129 | 0 | 0 |
| Long tasks | 0 ms | 0 ms | 0 ms | 0 ms |

A representative cold load transferred entry JS 69,277 → 70,137 B, CSS 6,818 → 7,271 B, and fonts 89,260 → 89,260 B. The same official Latin Inter and JetBrains Mono preloads remain; no new font weights or external font request were added. Guardian stays lazy. These small timing differences should not be interpreted as a production performance improvement. Real-device INP, battery, field p75, and manual screen-reader use remain unmeasured.
