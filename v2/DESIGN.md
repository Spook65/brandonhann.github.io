# Portfolio v2 design authority

This guide governs UI and experience decisions in `v2/`. It complements the engineering contracts in `AGENTS.md`. An implementation passing tests is still a visual proposal until Brandon approves it.

## Identity

Brandon is a creative, personable developer curious about software, cybersecurity, AI, and unconventional experiments. The site should invite exploration while making his work easy to understand. Play should feel purposeful, never childish or flashy for its own sake.

## Visual rules

- Compose a strong opening frame before adding motion. Brandon's name, one concise statement, and authentic imagery should read immediately.
- Use modern, intentional typography with deliberate size, weight, line height, letter spacing, and line length. Inter and JetBrains Mono are candidates, not mandatory treatments; review the complete type hierarchy at mobile and desktop sizes.
- Choose a deliberate, limited palette from the approved artwork and composition. Preserve enough contrast for reading and focus; do not inherit a rejected experiment's palette by default.
- Use approved personal imagery and verified project material. Label illustrative treatments clearly; never fabricate a project screenshot or result.
- Avoid the olive green, beige, and brown workspace aesthetic; giant faux notebooks; CSS rooms; generic dashboards; excessive empty panels; arbitrary particles; and decorative visual noise.

## Interaction rules

Every interaction needs a discoverable affordance, satisfying local feedback, and a meaningful or personal result. Provide an appropriate pointer, touch, and keyboard path. Make the result reversible or immediately understandable. Respect reduced motion. Keep actual project content and professional navigation directly accessible without playing.

Prefer one coherent visual rule over a collection of unrelated effects. Animation should start in response to input and settle promptly. Text, links, and focus remain semantic HTML even when artwork uses Canvas or SVG.

## Quality review

Review visual composition, typography, interaction satisfaction, originality, mobile behavior, and technical reliability separately. Inspect the static first frame and an actual interaction recording at mobile, tablet, and desktop sizes. Passing automated tests does not imply artistic approval.

## Primary references and boundaries

- [Jay Katariya](https://www.jaykatariya.com/) and its [readable source](https://github.com/jayamitkatariya/jay-katariya-portfolio): transferable principles include image response at the point of input, bounded Canvas work, smaller sampled imagery, direct navigation, and touch aware behavior. The source separates image sampling from component lifecycle and redraws only when needed. Brandon's imagery, composition, texture, typography balance, and motion must remain original. Do not copy Jay's photographs, sprites, square grid, polaroid pile, timing, or code.
- [Bruno Simon](https://bruno-simon.com/) and its [source](https://github.com/brunosimon/folio-2025): transferable principles include a coherent relationship among input, visual feedback, object meaning, and content, with recovery controls and alternate input. Its explicit loop phases show how input and rendering can remain coordinated. Brandon's portfolio should gain that coherence without importing a vehicle, 3D room, physics system, assets, or mandatory game controls.

The W.3 scratch reveal is recoverable on `archive/portfolio-experiments-w5`. Its useful principle is that interaction with Brandon's approved photograph reveals the same real person underneath. It is a technique to adapt, not a visual template.

## Approved hybrid direction — H.1 planning

The next experience has three independent layers: an immediately usable, visually authored homepage; a lightweight interactive enhancement that responds after content is available; and a small optional explorable world entered by choice. The Guardian remains a separate optional experience. The world must extend the homepage's visual language and project meaning, without making conventional navigation conditional on play or loading.

Design the interaction ladder as: immediate identity → discoverable response → meaningful reveal → optional world entry → authentic project-object discovery → focused project content → reversible return. One connected visual rule should carry this path; do not accumulate unrelated effects. No particular renderer, palette, or font is approved yet. The W.7A Mapetite captures remain private review candidates until Brandon selects a specific asset and approves public use and third-party attribution handling.

At each checkpoint, review the static opening composition, typographic hierarchy, interaction satisfaction, originality, recruiter clarity, mobile behavior, performance, and accessibility as separate questions. Use actual 390 px, 768 px, and 1440 px views and interaction recordings for visual review. Passing tests or meeting a timing target does not constitute visual approval. Stop after one vertical slice for owner review before expanding the world.

## H.3A — Engineering-first portfolio direction (supersedes the H.1 homepage art hypothesis)

The primary site is an immediately available software-engineering portfolio. Prioritize Brandon's work, contribution, technical decisions, evidence, and limitations. No portrait appears in the initial viewport. Guardian and the rejected Outpost experiments remain separate optional work; do not merge their visual implementations into the homepage.

Reference priority: [Damian Saelee](https://damiansaelee.com/) for case-study depth and navigable evidence; Jay for prompt local feedback and personality; Bruno for optional exploration only. Damian's source repository has not been verified public. Do not copy the project bus, graphics, palette, composition, or animation choreography.

Use a controlled 1200 px content grid, consistent section rhythm, and a compact introduction. The proposed palette uses near-black navy (#0c111b), cool slate (#121c2b), readable off-white, and restrained blue/cyan accents. The 70/20/10 balance is a guideline. Color and spacing tokens are scoped to the homepage to preserve Guardian's typography and palette. Inter supplies primary type; JetBrains Mono is reserved for sparse metadata. The rendered comparison favors Inter for compact hierarchy over Fraunces' editorial character; the extra font transfer must remain visible in performance review. Do not force lowercase or all-caps outside small labels.

The project index previews the problem on hover/focus; activation navigates to an actual semantic case study with native hash/history behavior. All case studies and native expandable notes exist in prerendered HTML. No always-running animation, Canvas, splash, or empty media rectangle is needed. Architecture diagrams must be explicitly illustrative and derived from reviewed facts. Unapproved Mapetite captures stay private.

Review visual quality, evidence accuracy, accessibility, mobile layout, and performance separately. Owner review of screenshots and an actual recording is required before treating H.3A as an approved visual system. No automatic deployment follows a passing test suite or commit.

## H.3E — Résumé-led visual refinement proposal

The existing résumé page is the primary style reference for the main route. The homepage and résumé now use the same self-hosted Sora and IBM Plex Mono Latin subsets, near-black surfaces, blue action color, rounded grouping, and pill actions. The Guardian keeps its separate visual identity. Body reading text starts at 16 px; technical labels are generally 12–13 px; secondary descriptions are 14–16 px. The project index uses four columns only when content has room, two at compact desktop/tablet widths, and one on narrow phones. Project content and the Mapetite interaction remain unchanged in meaning and navigation.

This is a visual review proposal, not release approval. Evaluate the 900 px project index, mobile case-study reading length, visual repetition of rounded surfaces, focus states, and measured initial-load impact against H.3D before adopting it.

## H.3F — Layout hierarchy review

H.3E is the owner's preferred visual direction. Keep its fonts, near-black and blue palette, rounded application feel, four featured projects, and case-study content. At narrow phone widths, prioritize identity, introduction, and a direct Projects action; place the optional engineering-principle interaction after the complete featured case-study sequence so the index, selected preview, and first study read continuously. Use compact full-width project rows at 320–540 px, two columns through compact desktop, and four only when space permits. Keep all links and factual content available in prerendered HTML.

Use rounded surfaces for major groupings, then let spacing and dividers handle lower-priority sections. Main identity, section titles, project titles, descriptions, and metadata should have distinct weight and scale. H.3F remains an owner-review proposal; tests and local performance measurements do not approve its visual quality or authorize publication.
