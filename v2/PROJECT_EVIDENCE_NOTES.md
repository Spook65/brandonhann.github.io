# H.3C — Mapetite evidence review

Reviewed October 29, 2026 on `experiment/project-evidence`, based on H.3B `4e0cf145cd51c288ea4472af01d2494a5f496efd`. This is an experimental evidence treatment, not approval to publish W.7A media or release the site.

## Source and behavior contract

The public [Mapetite README](https://github.com/Spook65/Mapetite/blob/main/README.md), [validator](https://github.com/Spook65/Mapetite/blob/main/server/services/placeValidation.js), and [validator tests](https://github.com/Spook65/Mapetite/blob/main/server/services/placeValidation.test.js) were checked on October 29. The validator resolves a city with optional region and country against a backend place index. An invalid place raises `PLACE_NOT_FOUND`; multiple matches raise `PLACE_AMBIGUOUS` with up to five suggestions; one match returns a canonical location. The README states that only a resolved place reaches provider search, with Geoapify primary and OSM / Overpass fallback when needed.

The three selectable examples come from public test cases: `fakecity` with California / United States is rejected, city-only `Springfield` is ambiguous, and Stockton / California / United States resolves. The portfolio **does not run Mapetite's validator or call its API**. Each selection is labeled an illustrative trace of the documented behavior. The no-JavaScript HTML retains all three outcome explanations and the provider boundary without dead controls. After hydration, native buttons expose one trace at a time. No animation loop, timer, or new dependency was added.

## Private visual comparison and media review

The prior H.3B diagram is in ignored `artifacts/h3b-review/evidence-{390,1440}.png`. The new initial and selected states plus recording are in ignored `artifacts/h3c-review/`. W.7A candidates remain only in the original checkout's ignored `v2/artifacts/w7a-review/`; none was copied into source or `dist/`.

| Candidate | Genuine content | Suitability and rights boundary |
| --- | --- | --- |
| `desktop-search.jpg` (1440 × 900 JPEG) | Actual Mapetite search form, location options, product attribution footer | Cleanest desktop product capture without venue photos. It shows the entry UI, not successful results. Needs owner approval for portfolio publication. |
| `mobile-map.jpg` (390 × 844 JPEG) | Actual open map for the Stockton search with mapped-result count | Best clean functional candidate without venue photos. OpenFreeMap / OpenMapTiles / OpenStreetMap attribution is visible and must remain. Map tile reuse and public presentation require owner review. |
| `desktop-map.jpg` (1440 × 900 JPEG) | Actual results, map, and preview from the live MVP | Stronger functional story, but includes venue names, thumbnail photography, logos, map tiles, and provider data. Do not publish without a specific content and attribution decision. |

The tighter H.3C controls make the allow/block boundary explicit and improve the recruiter explanation: select a case, read whether provider search is reached. This is more instructive than H.3B's static diagram. It also adds visible controls and text within an already dense case study; the simpler H.3B diagram remains a reasonable choice if Brandon prefers a quieter presentation. The authentic map capture would add product evidence that neither diagram can provide after its use is approved.

## Performance and verification

Five cold and five warm local Chromium samples used the same 390 × 844 profile as H.3B: 150 ms RTT, 1.6 Mbps down, 0.75 Mbps up, and 4× CPU throttling. These are medians of laboratory samples, not field p75 values.

| Metric | H.3B cold | H.3C cold | H.3B warm | H.3C warm |
| --- | ---: | ---: | ---: | ---: |
| FCP / observed LCP | 740 ms | 780 ms | 428 ms | 432 ms |
| CLS | 0.00129 | 0.00129 | 0 | 0 |
| Long tasks | 0 ms | 0 ms | 0 ms | 0 ms |

A representative cold request transferred entry JS 70,137 → 70,660 B and CSS 7,271 → 7,520 B; Latin font transfer stayed 89,260 B. The default homepage still requests no Guardian or Outpost assets. A separate direct-Mapetite-hash observation recorded CLS 0 for both versions after 1.8 seconds at 390 px; it is one sample, not a guarantee. Under 4× CPU, fifteen warm programmatic project-index activations per version reached the selected DOM state in 2.2 ms median for H.3B and 2.0 ms for H.3C. This measures an internal click-to-DOM update, not INP or complete visual navigation.

Commands run: `npm run typecheck`, `npm test` (5 pass), `npm run build`, `npm run test:dist` (5 pass), and `npm run test:browser` (24 pass). The browser suite covers all three Mapetite paths, no external Mapetite API request, touch, keyboard, reduced motion, no-JavaScript explanation, hashes/history, no overflow, and optional Guardian. Field metrics, physical mobile devices, and manual screen-reader use remain unmeasured.
