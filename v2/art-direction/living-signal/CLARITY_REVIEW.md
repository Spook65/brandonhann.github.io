# H.4B.1 — Living Signal clarity review

Historical art checkpoint. H.4B.2 separates project selection from the optional request example; see `UX_CLARITY_REVIEW.md`. The H.4B.1 ALLOW/DENY SVGs are preserved at commit `0f31353`.

**Status:** six static art-direction keyframes for owner review. No homepage integration, character animation, policy execution, or new project feature. The H.4A prototype remains separate and functional. `desktop-secureagent.svg` from H.4B contained an ambiguous pending checkmark and is recoverable at commit `4fcedd7`; the new generator deliberately replaces it with explicit ALLOW and DENY states.

From `v2/`, run `node art-direction/living-signal/generate.mjs` to regenerate the six SVGs and the existing relay pose sheet. The SVGs are review source. Browser-rendered PNGs and the selected-route comparison stay under ignored `artifacts/living-signal-clarity/`.

## State sequence shown in the selected stills

| Step | Scene cue | Meaning |
| --- | --- | --- |
| 1. BUILD | Angled blue source labeled “Brandon's work” and “proposed tool action” | The action is illustrative; BUILD is a visual starting point for Brandon's independent projects. |
| 2. Courier | The existing relay carries the amber packet on the illuminated lavender route | A request is delivered to the SecureAgent boundary. The packet is centered on the selected SVG path. |
| 3. Policy check | The station aperture receives that route; its symbol differs by outcome | A deterministic offline policy evaluates authorization before any simulated tool step. |
| 4. Decision | **ALLOW** with a forward arrow and “simulated step,” or **DENY** with a barrier and “no tool step” | The result can be read from words and shapes as well as color. No live tool is called by this artwork. |

The four routes represent four independent case studies. They are not connected products or a live pipeline. The selected SecureAgent route is painted **after every neutral route** and before the packet and station, so ODDWORKS cannot cover the shared trunk. Its SVG endpoint passes beneath the station aperture. The idle station has a question symbol, never an approval mark.

## Responsive composition

- **Desktop, 1440 px:** Brandon's identity and the angled BUILD source frame all four project routes. The courier, packet, policy station, and result occupy one left-to-right sequence. The full selected path remains illuminated from BUILD to the boundary.
- **Mobile, 390 px:** A new two-by-two project selector replaces the four-route illustration. A Projects action remains above the selector. The selected view features only the courier, packet, SecureAgent station, and a short vertical request → policy → decision path. The selector suggests future semantic HTML controls; this SVG is not itself interactive.
- **320 px check:** The 390 px SVG was rendered at 320 px. The illustrated selector rows scale from 56 px to about 46 px, and the Projects action from 54 px to about 44 px. Main labels remain legible in the browser render; fine metadata is still small. A future implementation must use actual HTML controls and native font sizing, then recheck touch target geometry and screen-reader names.

## Review questions and remaining limits

The keyframes now explain the proposed action and result without a green mark in a pending or denied state. They are still conceptual artwork, not proof that a first-time visitor understands the system. The small relay's handoff and the mobile result region need owner review. In a real implementation, rendered SVG text cannot replace semantic project links, keyboard controls, a reduced-motion path, or an accessible explanation. The visual decision is illustrative rather than a claim of verified SecureAgent execution.
