# H.2A — Immediate homepage proof

Reviewed 2026-10-28 on `experiment/instant-home`. This is a technical experiment on the W.2A composition, not artistic approval or a release.

## Decision and implementation

Use build-time React rendering of the existing `WelcomingHome` component. A small server entry renders its semantic markup into the Vite-built `index.html`; the browser hydrates that same markup on the homepage. `WelcomingHome` starts from a deterministic Cura selection, then its existing hash effect restores a requested project after hydration. The optional Guardian route still uses the separate lazy component. The build script derives the base URL from Vite configuration and resolves the emitted Latin font filenames for preload links. There is no second handwritten copy of Brandon's identity or project facts, no new framework, and no new runtime dependency.

The approved portrait now has intrinsic dimensions and two resized WebP variants sourced from `public/brandon-about.jpg`; its CSS crop and original JPEG fallback remain. The no-JavaScript mobile navigation reveals the existing menu links instead of leaving a nonfunctional Menu button visible. No project-media candidate was published.

This focused render reuses the full existing homepage because its build-time browser dependency was limited to initial hash selection. A separate handwritten shell would duplicate facts and would be replaced by React on startup, risking a flash or duplicate navigation. The render build adds a temporary server bundle that is removed before completion; it is not shipped to `dist`.

## Method and observations

Five cold and five warm headless Chromium samples per version at 390 × 844, 150 ms RTT, 1.6 Mbps download, 0.75 Mbps upload, and 4× CPU slowdown, against local Vite production preview. Each cold sample used a fresh context with cache disabled; its warm sample reused that context and enabled cache. The browser was allowed one second after load for layout and font observations. These are lab samples, not field p75 values. A separate unthrottled 1440 × 900 desktop capture checked appearance and requested resources. Screenshots are local review files under ignored `artifacts/h2a-review/`.

| Metric | Before cold median (range) | After cold median (range) | Before warm median | After warm median |
| --- | --- | --- | --- | --- |
| FCP | 920 ms (892–1196) | 668 ms (648–784) | 428 ms | 412 ms |
| LCP | 920 ms (892–1196) | 668 ms (648–784) | 428 ms | 412 ms |
| CLS | 0.118 (all five) | 0 (all five) | 0 | 0 |
| Long-task duration | 0 ms median (0–77) | 0 ms median (0–59) | 0 ms | 0 ms |

The observed LCP element in all ten cold samples was the introductory paragraph. The baseline CLS trace attributed 0.117 of 0.118 to the late font swap: text changed width/wrapping, the “Currently building” line rose roughly 54 px, and the portrait area followed. A further 0.0005 shift affected the heading. The portrait image was not requested in the baseline mobile first viewport, so it was not the measured cause. Font preloads and stable image sizing removed the recorded shifts in the after samples; the observed result does not guarantee zero CLS across other devices or network conditions.

| Mobile cold request | Before | After |
| --- | ---: | ---: |
| Entry JS transfer | 67,655 B | 67,775 B |
| Entry CSS transfer | 4,555 B | 4,560 B |
| Latin fonts, combined transfer | 66,092 B | 66,092 B |
| Portrait request | none in measured window | 90,556 B for 640 px WebP |

The after desktop capture requested the 640 px WebP (90,556 B) at device scale 1, versus the original JPEG (336,446 B) before. A higher-DPR desktop can select the 1134 px WebP (260,380 B on disk). Only the relevant Latin font subsets transferred in the measured loads; other emitted subsets were not requested. The homepage requested no Guardian chunk or Guardian art in the existing browser check. No world module exists. The final prerendered HTML is 11,053 B (3,457 B gzip in a local compression check). Initial JavaScript size is essentially unchanged; prerendering improves availability and paint timing, not the amount of React code.

With JavaScript disabled, the baseline displayed only a résumé fallback sentence. The new build displays Brandon's identity, introduction, Projects and Résumé links, project content, and all other homepage sections; the mobile menu links remain accessible. With JavaScript enabled, targeted browser checks found one heading, working hash selection and Back/Forward, and no hydration console/page errors. The desktop and mobile after captures preserve the same W.2A visual composition, apart from negligible photo compression differences.

## Limits and next gate

- Mobile portrait transfer is now part of the initial document parsing path. The responsive variant is smaller, but future art direction should re-evaluate image priority and cropping against real LCP elements.
- HTML is larger because it carries the full homepage. Measure response compression and cache behavior on the eventual host; the local preview is not GitHub Pages field data.
- Warm results vary by local cache timing; do not interpret these small differences as a production win. INP, field p75 metrics, and real-device energy use were not measured.
- Direct project hashes settle after hydration; the static no-JavaScript page starts with Cura selected. H.2A's no-JavaScript contract is immediate identity and conventional Projects/Résumé access.
- The interactive visual language, optional world, and public Mapetite media decision remain outside this checkpoint and require separate owner approval.
