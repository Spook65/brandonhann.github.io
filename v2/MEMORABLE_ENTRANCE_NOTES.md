# H.4D — Memorable entrance experiment

This branch starts at `experiment/interaction-polish` (`0f42aec`). It changes the homepage entrance only. The engineering project index, case studies, and optional Guardian remain in place. This experiment is not an approved release.

## Composition and behavior

- The desktop hero keeps Brandon Hann as the primary heading. An authored SVG field places four independently routed project destinations beside the introduction. The original relay courier artwork was adapted from the preserved Living Signal experiment as one small SVG asset.
- The route geometry and colors are presentation data. Names, facts, and anchor destinations come from `caseStudies.ts`. The map illustrates separate projects and does not claim a running system between them.
- Hover or keyboard focus highlights the full route and shows one canonical engineering insight. The courier makes one finite acknowledgment gesture. Native links navigate to the existing case studies. The network remains a useful static set of links without JavaScript.
- At phone widths, the full network gives way to a small courier link beside the existing Projects action. The four-project index remains the main mobile discovery surface. The engineering-principles interaction appears once after all featured case studies at every width.

## Review findings

- Compared with the H.3F opening, the desktop view is more recognizable and project-specific while preserving immediate identity and navigation. At 900px, all four routes fit the first viewport; 768px uses a full-width composition that continues below the fold. At 390px, the project index enters the opening viewport at approximately its original position.
- The four terminals still share a visual grammar and can read as a diagram. The courier is small, especially on phones. More art detail or animation should not be added until the owner judges this first-frame composition.
- The SVG has no render loop. Its only animation is a 420ms courier reaction on project preview, disabled under reduced motion. No Three.js, Guardian, or world media is requested on the homepage.

## Performance measurement

The before/after comparison used local Vite preview, Chromium at 390 × 844, 150ms network latency, 200,000 bytes/s download, 4× CPU slowdown, and five cold plus five warm navigations per build. Median cold FCP/LCP was 700ms on the H.3F foundation and 744ms here; median warm FCP/LCP was 544ms and 548ms. CLS stayed near 0.016. Measured cold resource transfer rose from 141,045 to 144,696 bytes. The entry JS gzip size rose from 70.45 to 72.28 kB; CSS from 5.01 to 5.98 kB. These are lab observations, not field Core Web Vitals, and do not prove production performance.

## H.4D.1 — Entrance art polish review

The courier is larger and sits clear of the four route traces. Each destination keeps the same visual family while receiving a distinct original mark: a place-validation pin, paired matching shapes, a policy shield, and a server-to-clients state motif. The marks illustrate the projects' verified engineering themes; they are not product screenshots or claims of live connectivity. The route glow now uses the selected project's explicit accent, and a terminal acknowledgment and courier gesture finish within 500ms. The selected route and canonical case-study insight remain visible after motion settles.

At 1440px the character and four destinations have a stronger identity than H.4D. At 900px all destinations fit the initial viewport, though the marks are smaller. At 390px the courier remains a compact link beside the existing Projects action, and the project index retains its early placement. The network still has a diagram-like route structure; the added marks improve recognition but do not by themselves establish owner approval of the artwork. The mobile version intentionally has no miniature copy of the desktop network.

Using the same local 390 × 844 throttle as above, five cold and five warm loads of the H.4D base and H.4D.1 produced median cold FCP/LCP of 756ms and 748ms, median warm FCP/LCP of 576ms and 580ms, and CLS of about 0.016 in both. Cold resource transfer rose from 144,696 to 145,227 bytes. Entry JS gzip size rose from 72.28 to 72.74 kB; CSS from 5.98 to 6.05 kB. Differences this small are ordinary local-test variation, not evidence of a production performance improvement.
