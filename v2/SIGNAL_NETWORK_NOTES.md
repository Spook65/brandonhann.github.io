# H.4A — Signal Network concept review

This is an isolated visual study at `prototypes/signal-network.html`. It is not wired into `WelcomingHome`, the project index, or the optional Guardian. The four traces represent independent projects and do not claim a live pipeline or data exchange.

## Reference principles reviewed

Jay Katariya's public [`HeroCanvas.tsx`](https://github.com/jayamitkatariya/jay-katariya-portfolio/blob/main/src/components/HeroCanvas.tsx) keeps pointer response local, caps pixel ratio, sleeps its draw loop when settled, and suspends it offscreen or when the page is hidden. [`PixelSprite.tsx`](https://github.com/jayamitkatariya/jay-katariya-portfolio/blob/main/src/components/PixelSprite.tsx) only advances frames while visible and holds a static frame for reduced motion. [`sprites.ts`](https://github.com/jayamitkatariya/jay-katariya-portfolio/blob/main/src/components/sprites.ts) shows a consistent authored visual alphabet. [`GlowCard.tsx`](https://github.com/jayamitkatariya/jay-katariya-portfolio/blob/main/src/components/portfolio/GlowCard.tsx) uses a short local hover response and preserves the underlying link. This study transfers those principles only. Its artwork, traces, colors, movement, content, and layout are original to Brandon's portfolio.

## Concept and boundaries

- Four typed case studies supply names, facts, and real anchor IDs. A separate visual configuration owns only line paths, short route labels, and color. Mapetite uses mint for resolving uncertain place data; Rivet uses amber for backend matching and authorization; SecureAgent Lab uses lavender for a policy boundary; ODDWORKS uses blue for server-owned state. The colors distinguish independent branches rather than imply transaction status.
- Each port has an HTML inspection button and a direct case-study link. Hover, keyboard focus, or touch selection highlights one SVG trace, moves one short dash along it, and reveals the existing project insight. A selected route stays legible after the dash settles; clearing selection returns to the neutral composition. There is no idle animation loop, API call, or synthetic project evidence.
- A separate Vite build pass writes the standalone concept entry after the unchanged homepage build, then prerenders it from the same React component it hydrates. With JavaScript disabled, project names, a conceptual explanation, and the four direct case-study links remain usable. The default homepage imports none of the prototype code or CSS.
- The desktop page frames the board at the scale of a hero-side feature. The mobile study keeps a direct Projects action above the board; it does not alter the H.3F homepage or push its project index downward.

## Visual review

The initial board has a deliberate source chip, four differently routed traces, edge terminals, restrained grid engraving, and a finite reading path. The selected state is stronger than a text-only preview because the highlighted route and terminal point to the fact. The board is still closer to a polished technical diagram than a fully distinctive illustration. At 320 px, the terminal micro-labels and source-chip detail are small. A future integration should test a simpler mobile crop and compare it against the existing principle panel before replacing anything.

The most plausible integration is to replace the desktop engineering-principles panel with a refined network at similar visual weight. Mobile placement remains an open design decision: early project discovery must stay intact. A tiny agent character would only help if it could show a meaningful role, such as carrying the single packet; a decorative mascot would compete with the engineering content and is outside this checkpoint.

## Performance and review status

The prototype uses HTML, SVG, CSS, and one short CSS animation. Reduced motion skips the packet and keeps the highlighted route and fact. The packet is removed after its animation; no timer or animation frame runs at rest. No new dependency or external service was added. The separate build pass leaves the homepage's existing entry bundle intact; browser request checks verify the default homepage does not fetch prototype JS or CSS. A future integration still needs matched performance measurement.

The final build retained the homepage's `222.62 kB` entry JavaScript (`70.45 kB` gzip) and `22.33 kB` entry CSS (`5.01 kB` gzip). The isolated concept adds its own `209.99 kB` JavaScript (`66.65 kB` gzip) and `9.65 kB` CSS (`3.12 kB` gzip) only when the prototype URL is opened. TypeScript, five unit tests, six built-artifact tests, and 34 browser tests passed. At 320 px, measured document and viewport widths were both 320 px.

The captures and recording in the ignored local review directory are for owner review. Passing engineering tests does not approve the art direction. No production route, publication, or public project media changed.
