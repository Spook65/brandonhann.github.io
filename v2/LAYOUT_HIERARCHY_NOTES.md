# H.3F layout hierarchy review

Source: `experiment/visual-refinement` at `7c742e383d07e04ac89cc06564a29dab2dbe0ad5`. H.3F changes layout and presentation only. No project claim, destination, Mapetite validation behavior, Guardian scene, font file, or public media was changed.

## What changed

- The hero keeps Brandon's name, introduction, and direct Projects/Résumé links. The action labels are visually shorter on phones; their accessible names remain descriptive.
- At 540 px and below, the engineering-principle interaction appears after the project index. One `EngineeringPrinciple` component and one React state value feed responsive desktop/mobile placements. CSS hides the unused placement, so only one is visible or keyboard-focusable at a time. Both placements are present in prerendered HTML, allowing a visible static explanation without JavaScript.
- The narrow-phone index uses full-width rows with name and category on the left and number/state on the right. Link targets stay at least 78 px tall; the longest row reaches about 99 px at 320 px.
- The hero and case studies retain useful rounded grouping. The nested principle card and the broad Additional/About cards become restrained dividers. Contact remains a focused surface.
- The redundant education line was removed from the hero; the same fourth-year and university information remains in the About introduction. Main identity uses stronger weight than section headings, while index titles and technical metadata have a clearer hierarchy.

## Measured viewport geometry

Matched Chromium screenshots, loaded fonts, 900 px viewport height, reduced motion, identical browser zoom. Pixel positions are from the top of the loaded page, before scrolling. Captures are private and ignored under `artifacts/h3f-review/` outside the experimental Git worktree.

| Width | H.3E project heading | H.3F project heading | H.3E index | H.3F index |
| ---: | ---: | ---: | ---: | ---: |
| 320 px | 1308 px | 783 px | 1477 px | 953 px |
| 390 px | 1080 px | 627 px | 1249 px | 796 px |
| 768 px | 817 px | 664 px | 905 px | 752 px |
| 900 px | 757 px | 677 px | 845 px | 765 px |
| 1440 px | 765 px | 676 px | 866 px | 777 px |

At 390 px, the first project row now enters the first viewport; at 320 px the Projects heading does. The four narrow-phone rows take 317–338 px total instead of 516 px. No horizontal overflow or page errors appeared in the matched capture run.

## Performance comparison

Five cold and five warm loads of each frozen build through Vite preview, Chromium at 390 × 844, 150 ms RTT, 1.6 Mbps downlink, and 4× CPU throttle. Medians are local lab observations, not production or field Core Web Vitals. LCP was a paragraph in both builds.

| Metric | H.3E | H.3F |
| --- | ---: | ---: |
| Cold FCP / LCP | 672 / 672 ms | 692 / 692 ms |
| Warm FCP / LCP | 420 / 420 ms | 428 / 428 ms |
| Cold CLS | 0.0152 | 0.0163 |
| Warm CLS | 0 | 0 |
| Initial JS transfer | 70,676 B | 70,735 B |
| Stylesheet transfer | 5,908 B | 6,080 B |
| Latin font transfer | 64,148 B | 64,148 B |

The timing differences are small and do not establish a real performance change. No animation or continuous rendering was introduced. Homepage entry requests still exclude Guardian art and Outpost code.

## Visual review and limits

The first mobile viewport now communicates identity, the main actions, and project discovery in that order. The 900 px index remains two columns, and wide desktop retains the H.3E composition without a nested principle card. Additional/About read as quieter sections; case-study surfaces still group substantial technical content. The 320 px header still wraps Contact onto another row, and long case studies still require scrolling. The responsive principle placement duplicates a small piece of static HTML even though its source and state are shared; this is a deliberate trade-off for correct visual and keyboard order at both breakpoints.

Manual physical-device and screen-reader review remain before release. Private Mapetite captures remain unpublished. No deployment or production change is part of H.3F.

Final verification: `npm run typecheck`, `npm test` (5/5), `npm run build`, `npm run test:dist` (5/5), and `npm run test:browser` (28/28) passed against the built H.3F preview. Browser coverage includes no-JavaScript content, hydration, hash/history navigation, Mapetite, touch, keyboard, reduced motion, Guardian, and overflow. The first parallel browser run surfaced an overstrict new row-width assertion and an intermittent Guardian focus result; the assertion was corrected, both targeted files passed, and the complete 28-test suite passed on the final source.
