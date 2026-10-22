# The Builder's Domain — creative reset study

This is **preproduction**, not a replacement for the working Checkpoint A.1 portfolio. The interactive [storyboard.html](storyboard.html) and its screenshots live only in `v2/artifacts/creative-reset/`. No React route, production asset, dependency, or deployment configuration changed.

## Visual thesis

The guardian is an original, colossal constructed being: dark ceramic and machined stone, exposed cheek conduits, amber eyes, visible jaw hardware, and a human-sized figure at its base. Its identity carries inside as the same amber and cyan circuits become the Inner Core's neural routes. The operator is Brandon, shown as an ordinary human at a physical desk amid cables, monitors, and project connections. Typography is editorial and readable; interface labels remain HTML in the eventual app.

The vector art in this study is a **construction drawing**, not a production illustration. The final surface needs custom painted upper shell, lower jaw, cavity, hinge/linkage, and inner-room layers registered to the same geometry. It must not reuse a flattened Guardian image or a radial portal.

## Storyboard

| Shot | Time | Camera and composition | Action / interface |
| --- | --- | --- | --- |
| 01 Encounter | 0 ms | The Guardian occupies most of a 1440 × 900 frame; a tiny human-scale figure anchors the bottom. The name sits left of its face. | Mouth-aligned **Enter** is prominent. Projects and Résumé stay in conventional navigation. |
| 02 Recognition | 0–120 ms after hover, focus, or touch | Camera holds. Eye light tightens and cheek conduits answer. | The mouth seam eases apart slightly as a response, without committing to entry. |
| 03 Articulation | 120–620 ms after Enter | Close framing keeps both hinge sockets visible. Upper shell and teeth stay fixed; chin and lower teeth move down and pitch, while linkages extend and hinge pins rotate. | Enter becomes unavailable during the one-shot transition; Skip goes directly to content. |
| 04 Crossing | 620–1150 ms | Camera advances **through the now-open mouth**. Upper/lower plate edges and perspective rails occlude the exterior. | A short forward cut leads into the room. No iris, circle, ripple, or full-face scale wipe. |
| 05 Inner Core | 1150–1750 ms | Camera settles behind a human operator at a console. Dark neural architecture replaces the exterior. | One conversational line identifies Brandon; Continue and Skip are optional. Direct nav stays usable. |
| 06 Connection | visitor selection | A cyan route from the operator to a project node becomes amber when selected. Other paths remain visible. | SecureAgent Lab opens a real HTML panel with its approved active-development summary. Other typed project, skill, experience, and contact destinations use the same map. |

## Jaw feasibility proof

The SVG in `storyboard.html` has inspectable, separate groups named `upper-face`, `upper-teeth`, `mouth-cavity`, `lower-jaw`, `lower-teeth`, `left-rod`, `right-rod`, and `hinge-sockets`. The upper teeth are children of the fixed upper-face group; the lower teeth are children of the moving lower-jaw group. At 100% aperture, the chin moves **104 SVG units**, compresses vertically to **0.87** as a 2D pitch cue, both linkages update their endpoints, and two hinge pins rotate **±35°**. The upper teeth and face do not move. The cavity is present behind the plates at every frame. The slider and Open/Close buttons expose intermediate positions, which is the essential registration test for later painted layers.

This proves that separate art can create a physical mouth opening in the browser. It does **not** prove that final painted artwork will be aligned or convincing; that is the next art production gate. A more anatomically convincing version may need two cheek pieces, under-jaw shadow, side gussets, and a small perspective change as the jaw pitches.

## Responsive compositions

| Element | 1440px desktop | 390px mobile |
| --- | --- | --- |
| Exterior | Face approximately 65–75% of frame height; shoulders and one tiny visitor visible. | Center crop lets face fill the width and most of the height; both hinge points and mouth must remain visible. |
| Enter / navigation | Mouth control centered over real opening; name at lower left; full nav at top. | Mouth control near lower-middle within thumb reach; name and concise introduction below; Projects and Résumé visible in a compact nav. |
| Inner Core | Operator centered at desk; connections span left/right; selected panel occupies a side column. | Operator centered above a stacked destination list; selected panel follows in document flow, never hides the figure or blocks links. |
| Project imagery | Approved screenshots or photos appear within HTML project panels, beside text. | Images are responsive with captions and alt text; text remains first in the reading order. |

The storyboard's 390px pair is a crop study, not final UI. The eventual implementation should test 320px, 390px, tablet, and 1440px. Mobile must not rely on hover or spatial precision.

## Content and interaction continuity

- Reuse the verified, typed project data already in `v2/src/data/`. SecureAgent Lab remains public-safe and labeled active development. Cura, Mapetite, and ODDWORKS retain their accurate statuses and links.
- Shot 05 references the already tracked `v2/public/brandon-about.jpg` as an HTML source portrait; it is not painted into the room. The current site also contains `calhacks-team.jpg` and `brandon-gaming.jpg`; captions and placement should be reviewed before moving them into V2. Project and personal photos should remain replaceable HTML images rather than baked background content.
- Connections should answer a visitor's selection: light follows a single route, the camera shifts only enough to show context, and a semantic panel presents content. No additional relic activation, autonomous companion, or six separate worlds are required.
- The conventional header, direct Projects and Résumé links, Skip Introduction, Return Home, keyboard/touch controls, and reduced-motion path are permanent requirements.

## Implementation gate after review

1. Approve the guardian silhouette, face expression, mouth scale, and neural-room composition at desktop and mobile sizes.
2. Produce separate final artwork layers on the study's shared coordinate grid; prove **closed, 35%, 70%, and open** alignments before integrating them.
3. Prototype just the entrance-to-Inner-Core transition in an isolated V2 route or query mode. The existing functional portfolio remains the default fallback during this gate.
4. Integrate the connection map only after one selected project node works with real HTML content and accessible input.

Use SVG/CSS and native browser animation first. Reduced-motion activation should present the open-mouth endpoint and Inner Core immediately. Cancel animation frames on unmount or navigation, complete transitions when the tab becomes hidden, and show direct content if an art layer fails. No Three.js, game engine, animation library, or automatic audio is justified by this study.
