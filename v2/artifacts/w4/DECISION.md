# W.4 decision — The Builder's Desk

Decision: **B, a 2.5D workspace**, for one isolated vertical slice.

| Option | Experience and originality | Available art | Mobile and accessibility | Complexity, maintenance, effort | GitHub Pages |
| --- | --- | --- | --- | --- | --- |
| A. Literal flipbook | W.3 proved the portrait reveal, but the owner rejected the book as the permanent world. Another page turn would repeat that metaphor. | Portrait and text are enough. | Easy to make responsive and semantic. | Low; about 1–2 focused days. | Static, straightforward. |
| B. 2.5D workspace | A portrait, screen, and desk can form one spatial discovery chain. CSS depth and camera focus can make the artifact feel situated. | Approved portrait and verified Mapetite README are sufficient for a prototype. Custom room art remains a gap. | DOM controls remain available; CSS motion can stop under reduced motion. A narrow layout needs its own composition. | Moderate; about 3–5 focused days for a polished slice. | Static files and a separate Vite entry work under the existing base path. |
| C. Full 3D room | Greatest free movement, but the environment itself becomes a major project before the work is legible. | No approved modeled room or object assets. | Higher rendering cost, complex touch controls, and a separate accessible navigation path. | High; several weeks of art, camera, physics, and device tuning. | Technically possible, but a larger bundle and more failure modes. |

The references suggest a useful constraint: surprise works when input gets an immediate, legible response and the next action teaches something. A world can be playful without requiring navigation mastery. Bruno Simon's full 3D portfolio shows the cost of a driveable space and many control modes; Jay Katariya's image and photo interactions show local feedback; Neal.fun and The Evolution of Trust illustrate compact experiments with a clear next action. This is an interpretation, not a template to copy.

## Slice and contracts

- Separate `builders-desk.html` entry and Vite config; no import from the production `App.tsx`.
- `DeskExperience` owns explicit scene states, URL hash, Back/Forward, and focus restoration. `DeskScene` presents the spatial environment. Portrait rendering reuses the W.3 graphite component without modifying it. Mapetite content comes from typed project data plus a cited public README line.
- Direct Projects and Résumé links always lead to the existing portfolio paths. The desk interaction never gates them.
- Verify the isolated build, keyboard/pointer/touch, reduced motion, Canvas failure, direct `#mapetite`, Back, 320/390/1440 px overflow, cleanup, and idle work. Run the main app's required checks to confirm isolation.

Risks: CSS-made props can look schematic without approved object artwork; the camera illusion may need art direction refinement on mobile. The prototype must be reviewed as a scene before any homepage integration.
