# Portfolio v2 design authority

This guide governs UI and experience decisions in `v2/`. It complements the engineering contracts in `AGENTS.md`. An implementation passing tests is still a visual proposal until Brandon approves it.

## Identity

Brandon is a creative, personable developer curious about software, cybersecurity, AI, and unconventional experiments. The site should invite exploration while making his work easy to understand. Play should feel purposeful, never childish or flashy for its own sake.

## Visual rules

- Compose a strong opening frame before adding motion. Brandon's name, one concise statement, and authentic imagery should read immediately.
- Use modern, bold typography with deliberate size, weight, line height, letter spacing, and line length. Inter carries primary copy; JetBrains Mono is reserved for sparse technical details.
- Start from black, white, or near monochrome and choose one deliberate accent. Preserve enough contrast for reading and focus.
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
