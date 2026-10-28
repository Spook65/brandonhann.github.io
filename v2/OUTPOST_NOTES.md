# H.2B — The Signal Outpost engineering proof

Reviewed 2026-10-28 on `experiment/living-security-outpost`. This optional scene is a visual and interaction experiment, **not owner-approved artwork or a production release**.

## Boundaries and behavior

- The H.2A homepage remains prerendered and usable without JavaScript. Its link opens a separate `outpost.html` entry with a small static poster and direct Homepage, Projects, and Résumé links. The optional Three.js module loads only after entry. Guardian remains a separate lazy route.
- `scenario.ts` owns two fixed, illustrative authorization outcomes. No external tool, LLM, backend, or real security decision is invoked. `SecurityOutpost.tsx` owns semantic controls and phase timing. `createOutpostScene.ts` owns Three.js geometry, water shader, animation, picking, camera, resizing, visibility, and disposal.
- Scout carries the request toward Sentinel. Sentinel raises an arm while checking policy. The gate color signals the decision; the dialogue and audit text convey the same result without relying on color or WebGL. Mouse, touch, keyboard, and explicit controls reach the request; arrows or buttons move along the short crossing. Exit and ordinary portfolio links remain available.
- The scene uses original procedural meshes and a directional animated shader. There are no borrowed models, screenshots, venue images, generated backgrounds, or world textures. [Three.js renderer lifecycle](https://threejs.org/docs/pages/WebGLRenderer) and [ShaderMaterial uniforms](https://threejs.org/docs/pages/ShaderMaterial) informed the feature-scoped renderer and cleanup. React Three Fiber was unnecessary for one scene with a small number of objects.

## Local measurements and review limits

Built optional outpost module: 534.51 kB uncompressed / 135.97 kB gzip; CSS 5.05 / 1.68 kB gzip. The existing main entry is 214.19 / 67.69 kB gzip. A local headless Chromium run observed no outpost chunk on the homepage and no homepage portrait or Guardian artwork requested on direct `outpost.html` entry. A fresh outpost load reached its Canvas in roughly 0.84–0.88 seconds on localhost; this is not a network or field latency guarantee.

Draw-call instrumentation observed approximately 1,830 WebGL draw calls in one visible second, corresponding to about 30 render frames; the last 34 detected frame intervals had a 33.3 ms median and roughly 34.8–34.9 ms p95 on desktop and a 4× CPU-throttled mobile profile. The mobile scene made zero draw calls during a second after scrolling out of view. A simulated hidden-page event also yielded zero draw calls in the following second. The reduced-motion scene likewise made zero draw calls during an idle second. These are local software-rendered Chromium observations, not GPU timings, real-device thermals, or Core Web Vitals. Reduced motion renders a static scene and retains timed readable dialogue.

Visual review at 1440 × 900 and 390 × 844 found a legible, coherent small crossing; the first mobile layout overlapped scene and text, so the scene was moved below the introduction. It remains geometry-first and lacks commissioned character animation, bespoke environmental art, and audio. Treat it as an **engineering proof** until Brandon judges the style and play feel. Real-device touch, screen-reader narration, battery use, and low-end GPU behavior remain manual checks.

Ignored local review captures are under `artifacts/h2b-review/`; they are not source assets and are not published. The scene does not rely on private W.7A media or touch W.3–W.5 recovery artifacts.
