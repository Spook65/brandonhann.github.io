# H.2D — Scout and Sentinel art-production brief

Status: concept direction for owner review, **not approved character models**. The accompanying [review sheet](design/outpost-character-review.svg) is an original silhouette study. It is not a runtime asset, final model, or animation claim.

## Shared visual language

- Small, tactile, stylized characters for an orthographic camera, designed to read at roughly 35–110 screen pixels tall. Favor a few strong masses, generous negative space, and intentional bevels over small decorative parts.
- A common construction language: dark navy structural shell, restrained warm/cool enamel panels, soft nonmetal accents, and one tiny status light per character. Avoid broad emissive strips, glassy sci-fi armor, and photoreal textures.
- Local **+Z is forward** for both rigs. The route runs world +X. At inspection Scout looks toward Sentinel on the far side; Sentinel looks back along −X. Faces, equipment, and gestures must remain legible from front, side, and three-quarter views at the actual camera distance.
- Keep the figures friendly and competent. Neither is a combat robot, mascot joke, or copy of another creator's character.

## Scout — compact courier

**Silhouette:** low, forward-leaning body with a broad messenger pouch carried slightly to one side. A swept hood/visor and a visible diagonal strap should identify the courier without dialogue. Short, planted feet and an asymmetric pouch create a recognizable profile.

**Face and acting:** two clear eye shapes under a soft brow; curious neutral, focused pickup, hopeful offer, and a readable disappointed-but-composed turn after DENY. The head leads a turn before the torso. An arm reaches under the packet at pickup, steadies it in travel, extends it for inspection, then either delivers or retrieves it.

**Gait:** purposeful short steps with alternating feet and restrained body lift. No continuous bouncing when idle. Recovery should visibly reverse direction, not slide backward while still looking at Sentinel.

## Sentinel — protective authorizer

**Silhouette:** taller, more upright, shield-like outer body with a distinct shoulder/hood arc. A compact scanner near the face is a functional cue, not a decorative antenna forest. One broad signaling arm must form two unmistakable poses: open path for ALLOW, palm/guard across the route for DENY.

**Face and acting:** a readable eye line and brow/visor angle. Sentinel notices Scout, turns head before body, examines the offered packet, and then makes the authorization gesture. The posture should feel attentive rather than aggressive.

**Gate relationship:** Sentinel stands on a separate lane beyond the gate. Its hand signals and the barrier motion must agree. The gate itself remains the decisive physical device, with a readable closed threshold and enough overhead travel to clear both Scout and packet.

## Production specification and approval gate

Blender **5.2.1 LTS is installed** at `/Applications/Blender.app`; no authored source model or licensed replacement art exists in this repository. A modeler can create reusable `.blend` sources and optimized `.glb` exports, but this checkpoint does not fabricate or integrate them. Before implementation, review one sheet with front/side/three-quarter views, expression poses, the packet scale, and an in-scene camera-distance render for **both** characters. Check their relationship at idle, inspection, ALLOW, and DENY. Then validate rig pivots, closed/open gate clearance, GLB size, materials, mobile legibility, and animation timing before integrating assets into the lazy Outpost module.

The current procedural meshes remain temporary engineering placeholders. Additional geometry or shader effects are not a substitute for the approved character designs.
