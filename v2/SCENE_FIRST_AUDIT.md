# W.7 scene-first research and media gate

Reviewed 2026-10-27. This is a pre-implementation record. It does not approve an art direction or change the v2 runtime.

## Reference engineering comparison

| Reference | Observed rendering and interaction contract | Transferable principle and cost |
| --- | --- | --- |
| [Jay Katariya](https://www.jaykatariya.com/) / [source](https://github.com/jayamitkatariya/jay-katariya-portfolio) | `HeroCanvas.tsx` samples small photographs into a responsive Canvas grid, reads pointer position outside React state, wakes a frame loop on input, and sleeps when settled. `DitheredPhoto.tsx` samples an image on resize and paints a static dither layer. | Local image response and bounded work are useful. His photographs, grid look, choreography, and assets are not a template for Brandon. |
| [Bruno Simon](https://bruno-simon.com/) / [source](https://github.com/brunosimon/folio-2025) | A shared world coordinates input, physics, camera, interactive points, rendering, and monitoring in explicit loop phases. The live interface provides keyboard, touch, gamepad, quality, and unstuck controls. | One object should connect movement and content. The world and continuous 3D loop would be disproportionate for one project transition. |
| [Giats](https://giats.me/) / [source](https://github.com/Giats2498/giats-portfolio) | The source describes a background React Three Fiber scene, semantic content layer, and cursor-responsive fluid layer, with cutouts connecting them. | Coordinating visual layers can make a page feel unified. Three rendering layers add asset, performance, and accessibility work; project visuals are explicitly not reusable. |
| [Samsy](https://samsy.ninja/) | The live page is graphics-led; its text-only response does not expose enough behavior to verify mechanics or cleanup. | A strong authored graphic identity matters, but no implementation claim is made from an opaque page. |
| [Atelier UI article](https://tympanus.net/codrops/2026/10/21/atelier-ui-webgl-dom/) | One fixed WebGL canvas mirrors DOM images/text; a common clock keeps scroll and rendering in sync. Bounds are cached and remeasured on resize, with a more expensive path for transformed parents. | A shared layer is justified only for multiple coordinated GPU effects. A one-object focus transition does not yet justify this stack. |
| [Responsive WebGL text article](https://tympanus.net/codrops/2025/06/05/how-to-create-responsive-and-seo-friendly-webgl-text/) | HTML-first text remains the layout and accessibility source while WebGL mirrors it for visual treatment. | Preserve semantic HTML even if a visual layer is added. Duplicate rendering and synchronization have a real maintenance cost. |

### Renderer decision, pending media

SVG/CSS would be the first proof for a real image object that moves from opening composition into focus; CSS transforms can handle that continuity while HTML retains project links and text. Canvas 2D is justified if the approved media requires pixel-level reveal or displacement. A shared WebGL layer would require a demonstrated need for synchronized image distortion across multiple objects. This decision must be revisited against approved visual assets, rather than installing a renderer first.

## Authentic media audit

| Candidate | Source and genuine subject | Format / size | Rights and approval | W.7 suitability |
| --- | --- | --- | --- | --- |
| Brandon portrait | Tracked [`public/brandon-about.jpg`](public/brandon-about.jpg); existing personal portrait used by v2. | JPEG, 1134 × 1512. | Already used as Brandon's approved public portrait. | Suitable as a personal detail; it is not project imagery. |
| CalHacks team photograph | Tracked root [`calhacks-team.jpg`](../calhacks-team.jpg), already displayed on the live legacy site as “Brandon and team at CalHacks 12.0.” | JPEG, 582 × 438. | Publicly displayed by the owner. Additional teammate image rights and approval for a new transformed presentation are not recorded. | Authentic Cura context, but too small and too indirect to serve as a high-quality project-led focal artifact. |
| Gaming lounge photograph | Tracked root [`brandon-gaming.jpg`](../brandon-gaming.jpg), displayed on the legacy site as Brandon with friends. | JPEG, 1134 × 1512. | Publicly displayed by the owner; friends' approval for a new treatment is not recorded. | Personal context, unrelated to a specific project discovery. |
| Mapetite live MVP | [Live app](https://mapetite-nine.vercel.app) and [repository](https://github.com/Spook65/Mapetite). The app currently exposes a real city-search UI and its README says “No screenshot files are currently committed.” | Live HTML/UI; no stable approved image file or fixed image resolution. | Owner's public app, but no selected capture or permission decision for venue names, provider photos, and trademarks in portfolio art. | Best project candidate, pending an approved clean capture or recording. Do not synthesize a screenshot. |
| Cura Devpost demonstration | [Cura submission](https://devpost.com/software/cura-kthowx) embeds a team video (`DM4mWK8XNcI`) and describes the prototype. | Embedded video; original resolution and reusable stills not verified. | Public team submission; reuse/transform approval from the media owner and teammates is not documented. | Potentially useful after owner selection and rights confirmation. |
| ODDWORKS production texture | [Provenance record](https://github.com/Spook65/Oddworks/blob/main/docs/ASSET_PROVENANCE.md) and `assets/textures/oddlings/toastmarshal_common_albedo.png` in the public repository. It is original character albedo, not a screenshot of gameplay. | PNG, 256 × 256. | Registry describes internal original work; production GLB import was pending verification in the reviewed record. | Too small and semantically incomplete as a standalone project scene artifact. A reviewed render or gameplay capture is needed. |
| SecureAgent Lab | `src/data/domain.ts` holds public-safe text about an offline experiment. | No verified public visual media. | No public demo or approved capture identified. | Text can inform a project view but cannot supply scene imagery. |

### Gate result: stop before visual implementation

Only the portrait is clearly approved and suitable as a visual building block. The existing Cura team photo is authentic but low resolution, indirect, and needs a specific reuse decision. Mapetite has a real interface but no approved, stable capture. No two suitable, approved sources are available for the requested project-led opening composition.

To resume, Brandon should supply or explicitly approve **one genuine Mapetite product capture** (preferably a 1440 px or larger desktop image or short recording of a search/map/detail state, plus a 390 px mobile capture if that state will be shown on mobile). It should avoid personal account data and either omit third-party venue imagery or document permission/attribution. A **second independent authentic visual** such as an approved Cura demo still/video frame or a reviewed ODDWORKS character/gameplay render would make the opening composition substantially more credible. For each, record the creator, public-display permission, caption, and what the image actually demonstrates.

No W.7 visual implementation, screenshots, interaction recording, or runtime tests were attempted because the gate failed.
