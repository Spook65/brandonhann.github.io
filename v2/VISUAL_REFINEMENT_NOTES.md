# H.3E visual refinement review

This is an experimental visual review, not design or release approval. It starts from H.3D `dbdc0687a3aff0171ee43c49295b960d525eb8b9`. The case-study facts, project URLs, Guardian route, and Mapetite interaction content are unchanged.

## Side-by-side audit

| Property | H.3D homepage | Existing résumé / H.3E direction | Why it matters |
| --- | --- | --- | --- |
| Main type | Inter, 15 px base | Sora, 16 px base | More comfortable reading and a stronger, consistent identity. |
| Technical type | JetBrains Mono, labels down to 10–12 px | IBM Plex Mono, most labels 12–13 px | Metadata stays technical without carrying body copy. |
| Main action | Rectangular light button | Blue pill, 46 px high | Clearer primary action and more consistent with résumé controls. |
| Grouping | Flat dividers | 14–20 px rounded surfaces with restrained borders | Separates the hero and case studies without adding decorative artwork. |
| 900 px index | Four 207 px columns | Two columns with larger names and 14 px categories | Names, state, and purpose can be read without shrinking. |
| Narrow phone index | Two small columns | One column | Preserves readable titles and tap space at 320–390 px. |

The homepage uses the résumé's self-hosted Sora and IBM Plex Mono Latin WOFF2 subsets, near-black and blue color system, button form, and container language. The résumé retains its PDF viewer and unique background treatment. Guardian typography and styles are unchanged.

## Type and spacing scale

- Base reading text: 16 px / 1.65; case-study paragraphs: about 15 px; secondary evidence copy: 14–15 px.
- Project names: about 19 px; category descriptions: 14 px. Metadata: about 12.5 px, with monospace used sparingly.
- Hero name: responsive 43–73 px. Section headings: responsive 28–39 px.
- Main content width: 1280 px; outer gutter: 16–32 px. Section surfaces: 20 px radius, 24–40 px padding on desktop and 20–24 px on phones.
- Project index: four columns above 1100 px, two from 541–1100 px, one at 540 px and below. Case studies use one column below 1100 px so the evidence remains legible.

## Render review

Matched browser screenshots at 390, 768, 900, and 1440 px are in the ignored local `artifacts/h3e-review/` directory outside this Git worktree. The 900 px project index is the clearest improvement: it no longer compresses four projects into one row. The 390 px view has readable labels and no horizontal overflow. The résumé and homepage now share font shapes, accent, rounded grouping, and pill actions. The first frame remains usable before animation or JavaScript; no new animation was added.

Remaining visual concerns for owner review: on narrow phones the one-column index and full technical case studies require substantial scrolling; repeated rounded case-study surfaces may feel too uniform; Sora's heavier heading shapes are more assertive than the prior Inter system. The Mapetite evidence is clearer at 900 px, though it remains a text-led technical explanation while authentic media awaits separate approval.

## Comparable lab measurements

Five cold and five warm Chromium loads for each build at 390 × 844, 150 ms RTT, 1.6 Mbps downlink, 4× CPU throttle. Values are medians, from the same local preview script and machine; they are not field Core Web Vitals or a production guarantee. The LCP element was a paragraph in both builds.

| Metric | H.3D | H.3E |
| --- | ---: | ---: |
| Cold FCP / LCP | 804 / 804 ms | 676 / 676 ms |
| Warm FCP / LCP | 440 / 440 ms | 416 / 416 ms |
| Cold CLS | 0.0013 | 0.0152 |
| Warm CLS | 0 | 0 |
| Cold initial JS transfer | 70.7 KB | 70.7 KB |
| Cold stylesheet transfer | 7.5 KB | 5.9 KB |
| Cold Latin font transfer | 89.3 KB | 64.1 KB |

The higher H.3E cold CLS came from the Sora font swap moving visible hero text, buttons, and the principle panel. It remains below the 0.1 target, but should be monitored on actual devices. No continuous rendering was introduced. The optional Guardian artwork and Outpost code remain outside homepage entry requests.

## Verification and boundaries

`npm run typecheck`, `npm test`, `npm run build`, `npm run test:dist`, and `npm run test:browser` passed in the final verification pass (5 unit, 5 artifact, 26 browser checks). `git diff --check` passed. The new browser check verifies actual Sora loading and responsive column counts at 320, 390, 768, 900, and 1440 px. Private Mapetite captures remain excluded from public files. No production settings or branch were changed.
