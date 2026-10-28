# W.5 — Art direction review, before implementation

These are **static visual studies**, not a new site or working interaction. Every depicted photograph is Brandon's existing approved `public/brandon-about.jpg`. The portrait's monochrome and pixel treatments are transformations of that file. The project text comes from `src/data/projects.ts`; no project interface or screenshot is represented. Inter and JetBrains Mono are loaded from the repository's licensed font packages. Artboards are exactly 1440 × 900 and 390 × 844.

## Reference observations

The six columns keep appearance, mechanics, and transferable lessons distinct. Descriptions of live behavior are based on direct browser observation unless a source is named. None of these designs or mechanics is a template to copy.

| Reference | Visual identity and art direction | Layout and type | Actual interaction | Surprise or delight | Accessibility and performance implications | Principle for Brandon |
| --- | --- | --- | --- | --- | --- | --- |
| [Jay Katariya](https://www.jaykatariya.com/) | Stark black and white photographic pixels with personal snapshots. | Huge name over a responsive image field; small mono labels and immediate nav. | Dragging across the opening changes local image cells; the page also labels photo hover and rearrangement later on. | A human image responds at the exact point of input. | Image work needs a static state, a keyboard/touch action, and bounded rendering; the site has direct nav. | Let Brandon's real photograph respond locally, then reveal a specific real project fact. Use a different crop, layout, palette, and motion language. |
| [Bruno Simon](https://bruno-simon.com/) | Purpose-built 3D world with an unmistakable toy-like identity. | The world carries the work; controls and options are overlays. | The site specifies driving, camera, jump, map, respawn, and mobile/gamepad controls. | Physics and discovery reward exploration. | A large rendering stack and many controls impose a steep input and device cost; the live browser review did not reliably render beyond loading, so visual detail was cross-checked against the site's own controls and [source](https://github.com/brunosimon/folio-2025). | Keep the sense that a response belongs to the subject, without importing a world or required control vocabulary. |
| [Neal.fun](https://neal.fun/) | Playful title artwork changes per experiment; the home identity is loose and human. | Simple name and a grid of richly illustrated project links. | [Infinite Craft](https://neal.fun/infinite-craft/) starts with four elements and explicitly asks visitors to drag them together; each experiment has its own rules. | Simple inputs produce an immediately understandable consequence. | Individual experiments can be heavy, but the home gives direct paths; each mechanic must teach itself. | Give one project interaction one clear input and result, rather than make the whole portfolio a game. |
| [The Evolution of Trust](https://ncase.me/trust/) | Hand-drawn characters and consistent black-line illustration. | A centered question progresses to a choice, with chapter progress visible. | After Play, the visitor chooses between cooperate and cheat; the outcome makes the lesson concrete. | The visitor learns by trying a choice before receiving the explanation. | The long guided sequence and canvas-like visual system need alternate reading and motion options. | Let an interaction reveal a meaningful idea about a project, with direct professional information outside the sequence. |
| [Robin Noguier](https://robin-noguier.com/) | Project-specific art and photography within a disciplined editorial frame. | Large serif project title, concise copy, clear case-study action, tilted image field. | Scrolling moves photography through the selected project's field while the work stays identifiable. | The artwork changes without losing the project name or next action. | Strong media dependence; project imagery and reduced-motion alternatives are necessary. | A real artifact deserves visual prominence. Brandon currently lacks approved project photos, so use verified text and portrait rather than fabricate one. |
| [Stefan Vitasović](https://stefanvitasovic.dev/) | Raw black, white, and blue typography with controlled glitch-like visual rhythm. | Offset grid, oversize name, compact bio, direct Intro/Projects/About. | Typographic assembly, scroll navigation, and project transitions are described in his [first-person case study](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/). | A repeated motion motif makes the identity memorable. | His case study reports WebGL video on desktop and native video on mobile; the performance budget is a design decision. | Build a single recognizable graphic rule that can also stand still and remain legible. |
| [Josh W. Comeau](https://www.joshwcomeau.com/) | Friendly illustrated visual language around technical writing. | Readable editorial content and direct category navigation. | Articles such as the [interactive SVG paths guide](https://www.joshwcomeau.com/svg/interactive-guide-to-paths/) place experiments beside explanation. | Play is used to make a concept understandable. | Static writing and links survive when the interactive layer is absent; sound and theme have controls. | A portfolio interaction should clarify Brandon's approach, while the project facts remain readable as text. |

## Direction A — The Digital Playground

**Visual system.** A bright near-white field, dense black Inter, cobalt accent, and one asymmetric portrait crop. The approved portrait starts as a high-contrast pixel treatment; localized color appears only where the visitor investigates. JetBrains Mono labels mark actions and project metadata. The typography remains the primary identity, while the photograph gives it a person. Direct Projects and Résumé links are present in both sizes.

**Signature interaction storyboard.**

1. **See:** Brandon's name, real portrait rendered in pixels, a concise self-description, and selected work are already visible.
2. **Signal:** A cobalt edge and “Move to reveal” cue identify the portrait as responsive.
3. **Act:** Move across it or activate its labeled control.
4. **Change:** A local color region follows the interaction and settles; the portrait remains the same approved photograph.
5. **Learn:** Mapetite appears with its real summary: a restaurant discovery app that labels uncertain public data and validates place searches. A normal project link remains available.
6. **Equivalent:** Touch uses a tap/short stroke that leaves scrolling intact; Enter/Space reveals the same content; reduced motion switches directly between the two still compositions. The readable project text never depends on motion.

The artboards depict the opening and the fully revealed state, not a claim that this behavior is implemented.

## Direction B — The Interactive System

**Visual system.** Near-black and off-white, with one mint signal color. The portrait is cut into three editorial image channels; the separations create a repeatable graphic rule instead of a fake dashboard or data display. The name and project title are typeset as large editorial statements, with project facts in open space. JetBrains Mono is restricted to navigation and evidence labels.

**Signature interaction storyboard.**

1. **See:** Brandon's name and a monochrome portrait broken into three precise bands. A clear “01 Mapetite / Focus project” line is available immediately.
2. **Signal:** The project line changes emphasis on hover/focus; the image bands shift slightly toward alignment.
3. **Act:** Click, tap, or press Enter/Space on Mapetite.
4. **Change:** The image channels align and recover the portrait's real color while the headline becomes “Mapetite.” The transformation resolves the fragmented opening graphic.
5. **Learn:** The real Mapetite summary, MVP status, and source/live-demo actions appear directly on the canvas of the page, with no simulated software window.
6. **Equivalent:** Touch activates the line once; keyboard focus provides the same signal and action; reduced motion swaps to the aligned still composition. Project links and résumé remain conventional links.

The artboards depict the opening and the focused state, not a claim that this behavior is implemented.

## Comparison and recommendation

| Criterion | A — Digital Playground | B — Interactive System |
| --- | --- | --- |
| Visual quality | Strong human-first composition and energetic contrast; pixel treatment needs final art tuning. | More refined editorial identity; narrower emotional range. |
| Originality | Local portrait reveal is promising but close to a known reference principle; the crop and typographic system must remain distinctly Brandon's. | Three-channel photographic rule is distinctive and can carry across projects without fake artifacts. |
| First impression | Immediately welcoming and personal. | Immediately sophisticated, but cooler. |
| Recruiter clarity | Name, student identity, work, and résumé are legible at once. | Name and work are legible; the large project state makes the work unusually clear. |
| Meaningful interaction | Reveals the person and one verified project summary. | Project selection resolves the image and reveals verified scope. |
| Mobile usability | Portrait and name retain priority in one vertical view. | Image channels are legible, but the name and image compete for space. |
| Authentic imagery | The approved portrait is sufficient for this one proof. | Also sufficient; later projects may benefit from approved artifacts. |
| Performance | Static typography/image plus bounded local image effect. | Static image transforms and text; likely lighter than A. |
| Implementation complexity | Moderate due to pixel sampling and pointer/touch support; W.3 provides a recoverable mechanic. | Lower rendering cost, but precise typography and transition choreography need care. |

**Recommend A for the next owner review.** It communicates Brandon as a person in the first second, keeps work and résumé legible, and uses the only approved photo as meaningful material. Its main risk is visual proximity to Jay's pixel-photo idea. Before any implementation, refine the texture and color region so the result reads as Brandon's own photographic identity rather than a borrowed pixel composition. B is the stronger alternative if the owner values a more restrained, project-first tone. The W.3 scratch component remains a possible interaction technique, not a required centerpiece.

## Review boundary and asset gap

These eight PNGs are rendered visual compositions with no click behavior. They are concept evidence, not a live prototype. No approved Mapetite image or original project artifact was available, so the studies deliberately use text for Mapetite. A future art pass would benefit from one owner-approved project photograph, screenshot, or documented visual artifact. No application component, homepage, Guardian, production file, dependency, or Git commit was changed for W.5.
