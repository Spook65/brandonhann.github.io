# H.4B.2 — project exploration and example requests

**Status:** static interaction storyboards for owner review. The six SVGs are not interactive controls. They do not replace the homepage or the working H.4A prototype. H.4B.1 ALLOW/DENY art is recoverable on `experiment/living-signal-clarity` at `0f31353`.

## Corrected meaning

BUILD is the visual entry to Brandon's **independent projects**. The relay courier does not create those projects. It carries an **illustrative example request** into a selected system, and only after the visitor asks to try that example. The floating amber cube represents that request; the courier's attached messenger bag is part of the character design. Neither represents a project, code artifact, or real tool action. SecureAgent Lab's offline, deterministic authorization boundary is the only system example in this review. The illustrated DENY blocks the request before simulated tool execution. The example is not a live gateway call or a claim about a particular private policy rule.

## Desktop storyboard — 1440 px

| State | What changes | Visitor action and information |
| --- | --- | --- |
| Idle | Four independent routes, BUILD, and an idle courier. No packet or decision result. | Hover or keyboard focus temporarily highlights one route and previews one verified engineering insight. This preview never starts a delivery. Direct case-study links remain available. |
| SecureAgent selected | Its route stays illuminated. The station remains neutral; the courier still has no packet. A concise insight, **Try an example**, and **Read case study** appear. | Clicking/tapping or activating the project establishes durable selection. The visitor can read the project without running an example. |
| Example result | Only after **Try an example**, the courier and packet appear on the selected route. The station shows a DENY barrier and “no tool step.” | The visitor sees an illustrative request blocked before simulated execution, then may reset to selected or open the real case study. |

## Mobile storyboard — 390 px, checked at 320 px

| State | What remains above the fold | Scene below the compact selector |
| --- | --- | --- |
| Idle | Brandon's identity, Projects access, four compact project choices. | One idle courier and BUILD teaser. No network diagram, package, or policy stages. |
| SecureAgent selected | Same identity, Projects access, and selected project choice. | One featured courier/station illustration, the key insight, a separate **Try an illustrative request** action, and a direct case-study link. No packet or decision result. |
| Example result | Same project selection. | A short vertical request → courier → policy → DENY sequence. The case-study link remains direct. |

The shorter idle/selected mobile images deliberately reveal less than the result image. A real implementation should use semantic HTML buttons and links, not SVG text as controls. The art includes no automatic animation; reduced motion can use the same still states.

## Future interaction contract, after art approval

- Keep one durable selected-project ID, separate from temporary hover/focus preview and example state. Leaving a preview restores the selected project. Changing projects cancels an example.
- Hover/focus produces only local route emphasis and a short insight. Selection reveals the project summary and direct link. **Try an example** is the sole trigger for the courier sequence. Reset returns to the selected project; browser navigation and direct project links retain native behavior.
- When JavaScript is unavailable, keep the semantic project list and direct case-study links visible; omit nonfunctional example controls. Never require the illustration to access project content.
- If animated later, the request delivery must be finite, cancelable, offscreen-aware, and optional. Touch and keyboard must trigger the same explicit state change. No LLM, external API, tool execution, sound, or four-project demonstration system is proposed.

## Visual review limits

These stills correct the package's meaning and delay the request story until the explicit example action. They do not prove that visitors discover the controls or understand the courier unaided. The selected desktop insight and mobile selector remain art-direction proposals. The 320 px render still needs inspection with native HTML text and actual touch targets before implementation. Passing SVG geometry tests is not visual approval.
