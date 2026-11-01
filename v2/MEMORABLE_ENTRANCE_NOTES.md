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
