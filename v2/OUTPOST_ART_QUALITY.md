# H.2D — Outpost spatial and visual review

This experimental checkpoint corrects H.2C scene geometry and presentation. It does **not** claim final indie-game art or owner approval. The H.2A prerendered homepage, Guardian, and production root are unchanged.

## Spatial contract and fixes

- World **+X** is the packet route; each character model's local **+Z** is its forward/face axis. Scout faces travel during pickup/travel/ALLOW, faces Sentinel at inspection, and turns toward arrival on DENY and recovery. Sentinel targets Scout during inspection and denial, then acknowledges the permitted crossing. `facingYaw` and shortest-arc `turnToward` own that contract rather than scattered rotation literals.
- The gate is centered at x=1.35. Its closed barrier occupies y≈0.065–1.415 and its raised bottom reaches y≈1.805. The packet remains at x≤0.95 while closed. On ALLOW, Scout and packet wait until the barrier clears them; on recovery, it stays raised until Scout leaves the threshold. Sentinel stands in a separate z lane, and the audit station is moved clear of Scout's delivery path.
- The orthographic camera fits projected bounds of the crossing, actors, barrier, rails, inlet, water, basin, and audit marker. Desktop and mobile use different safe regions; the compact mobile dialogue occupies the reserved lower scene area. A small camera nudge follows the action without cropping essential props.
- Speech bubbles clamp to the scene edges, hide when their actor is offscreen on desktop, and avoid one another. The heading and controls now occupy grid rows outside the rendered scene. Mobile uses one compact dialogue position. Idle buttons show the two example requests (and Replay after a run); running buttons show Pause/Resume and Reset. No disabled five-button row remains.

## Evidence and repeatability

Run `PORTFOLIO_PREVIEW_URL=http://127.0.0.1:4175/brandonhann.github.io/ node scripts/capture-outpost-review.mjs` from `v2/` after a build and preview. It captures opening, inspection, ALLOW, and DENY at 320, 390, 768, and 1440 px, plus two normal-motion recordings. Its JSON contains world coordinates, projected prop bounds, facing dot products, and bubble boxes. Outputs live in ignored `artifacts/h2d-review/`; H.2C comparison captures are in ignored `artifacts/h2c-review/`.

The local capture found no projected clipping of actors, packet, gate, inlet, or basin at the four target widths and phases. At inspection, both characters' forward vectors have a dot product of 1.00 toward one another in the reduced-motion static sample. The barrier remains physically above Scout and the packet when they cross during the normal-motion sample; the packet does not pass a closed barrier. Browser tests recheck these claims, navigation, fallback, lazy loading, and mobile overflow. Projected-box checks do not establish artistic quality or prevent every possible mesh self-intersection.

## Performance observation

H.2C's optional JS chunk was 543.23 kB raw / 138.65 kB gzip. H.2D's latest measured build is 548.57 kB raw / 140.67 kB gzip; the homepage entry remains 214.19 kB raw / 67.69 kB gzip. A local headless Chromium sample observed about 2,190 draw calls during one visible second and **zero** during a measured offscreen second, both at 1440 px and at 390 px with 4× CPU throttling. Measured frame intervals were approximately 33.3–33.4 ms median and 34.2–34.6 ms p95; reported JS heap was about 5.7 MiB. These are localhost software-rendered lab samples, not field measurements, GPU memory, energy use, or real-device approval.

## Artistic gate

The camera, facing, and UI are cleaner, but the characters remain procedural placeholders and the crossing still has a technical-demo look. [The art brief](OUTPOST_CHARACTER_BRIEF.md) and [concept review sheet](design/outpost-character-review.svg) define two original silhouette directions; neither is a finished model. Blender 5.2.1 LTS is available, but no approved authored `.blend`/`.glb` assets exist. New character models should wait for owner approval of front, side, three-quarter, expression, and in-scene scale studies. Do not add more geometry or effects to conceal this gap.
