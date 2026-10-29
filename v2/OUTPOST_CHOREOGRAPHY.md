# H.2C — Outpost behavior and art direction

Planning record, 2026-10-28. This is a focused revision of the optional H.2B scene, not approval for release.

## Verified problems in H.2B

`scenario.ts` stores `decision` and `reason` in each scenario, so no policy is evaluated. The renderer sends Scout to the same x position for both outcomes, changes only gate color, and returns the packet with Scout in both cases. Sentinel's one arm motion barely varies. Dialogue and the audit result are in a separate three-column panel below the scene; on mobile a visitor can scroll away from the actors to operate it. The water has moving bands but no visible source or destination. The camera shifts less than two world units and cannot establish a useful viewpoint. The opening frame has good legibility but sparse geometry and weak character expression, so it reads as a technical demonstration.

## Transaction storyboard

| Beat | Scout and packet | Sentinel and gate | Audit station and communication |
| --- | --- | --- | --- |
| Idle | Scout checks the packet at the arrival side. One default read-only demonstration begins once after the scene becomes visible, except with reduced motion. | Sentinel scans the crossing; the gate is visibly closed. | A short in-scene cue invites replay or a different request. |
| Pickup | Scout reaches for the packet, lifts it, and turns toward the gate. | Sentinel turns to watch. | Scout's anchored speech bubble names the synthetic request. |
| Travel | Scout carries the packet along the walkway. | The gate remains closed. | The environment points in the direction of travel. |
| Examine | Scout stops before the gate and offers the packet. | Sentinel leans and signals inspection. A pure policy function evaluates trusted synthetic context before any simulated execution. | Sentinel's anchored bubble gives the decision reason. |
| Allow | Scout and packet pass through the visibly opening gate and complete delivery. | Sentinel gives an open-hand permission gesture. | The audit station lights with a recorded allow result and the simulation marks a read-only action as simulated. |
| Deny | Scout turns back with the packet; it never crosses the gate. | Sentinel gives a stop gesture; the gate stays closed. | The audit station records denial and simulated execution remains blocked. |
| Recovery | Scout returns to the arrival side; the same scene remains ready. | Sentinel relaxes; gate returns to closed. | A compact event summary remains available; Replay and Try another request are visible. |

The two branches have different physical paths. A visitor should infer permission from the packet crossing the threshold, and denial from the packet being turned away. No full transaction loops automatically after the opening demonstration.

## Small style sheet

- **Silhouette:** two hand-built, small courier/guardian figures with distinct head shapes, eyes, arm gestures, and readable feet. Scout is compact and warm; Sentinel is taller and cool-toned. Motion is purposeful, with planted pauses and a short walk cycle.
- **Environment:** one narrow checkpoint over a directional channel. The gate has an actual moving barrier and a nearby audit beacon. Water enters from a narrow upstream throat and spreads into a downstream basin; moving highlights follow that path. The crossing is one place, not a collection of islands.
- **Color and lighting:** charcoal/navy field, warm amber around Scout and the audit station, restrained cyan/violet around the gate. Allow adds mint; deny adds coral. Color is always paired with movement and semantic text.
- **Framing:** the crossing occupies most of the available scene. Desktop dialogue is anchored near characters; on mobile the scene, bubbles, and compact controls share the visible region. A small camera nudge follows the active transaction, then settles. No forced camera motion under reduced motion.
- **Asset limit:** this prototype can refine procedural silhouettes and lighting, but nuanced facial animation and a polished indie-game look will require original authored character models or sprite/texture art. Additional shader effects cannot substitute for that work.

## Implemented proof and review

The policy evaluator now derives ALLOW only for a read action on a synthetic training report. Export and protected-resource reads yield DENY. The result records its scenario, action, reason, and execution status; a separate pure completion step marks an allowed mock read as simulated only after the crossing. DENY remains blocked. No external action exists.

The renderer follows explicit visual targets in `motionPlan.ts`. Scout picks up and carries the packet, Sentinel examines it, and a moving barrier opens only for ALLOW. The packet and Scout cross only on ALLOW; on DENY they return on the arrival side. The audit beacon responds to either decision. HTML bubbles follow projected character positions without per-frame React renders. One default demonstration runs after the world becomes visible; reduced motion waits for an explicit choice. Replay, another request, Pause/Resume, Reset, and a closer view remain within the scene.

Compared with H.2B's broad water planes and remote three-column controls, the H.2C frame has a bounded channel with a visible inlet and receiving basin, a more substantial crossing, attached dialogue, and a compact control rail. Desktop and mobile captures plus separate allow, deny, and water recordings are ignored local files in `artifacts/h2c-review/`. The H.2B comparison capture remains in `artifacts/h2b-review/`.

The optional H.2C JavaScript chunk is 543.23 kB uncompressed / 138.65 kB gzip, roughly 2.7 kB gzip more than H.2B; the homepage entry remains 214.19 / 67.69 kB gzip. A local headless Chromium sample reached Canvas in about 1.0 seconds, and measured around 2,100–2,200 draw calls in a visible second at approximately 30 frame starts per second. Detected frame intervals had a 33.2–33.3 ms median; p95 was 34.2 ms in the 4× CPU-throttled mobile sample and 54.9 ms in the desktop sample. Offscreen and reduced-motion idle samples made zero draw calls in their measured seconds. These are local software-rendered lab observations, not real-device GPU timings or field performance.

Visual assessment is still provisional. The physical ALLOW and DENY paths are more legible in recordings than H.2B, but the characters remain hand-built geometric placeholders with limited facial expression. A polished indie-game presentation would require commissioned original character art and more authored motion. Do not describe this checkpoint as owner-approved artwork or deploy it from this branch.
