# A.6 Breach architecture

The entrance is a single 1,600 ms timeline in `App.tsx`. `LayeredGuardian` owns only the SVG anatomy: stationary upper face, moving lower jaw, cheek/tendon shapes, and a mouth-shaped mask. `BreachTransition` places the existing `NeuralCore` artwork behind that opening. The camera scales toward the mouth and the Core becomes visible through the aperture; there is no separate tunnel scene.

Scene state remains `guardian → entering → human → domain`. Direct navigation can cancel `entering`; reduced motion goes directly to `human`. The `requestAnimationFrame` loop and media/visibility listeners are cleaned up when the scene changes. Dialogue is optional.

Portfolio destinations and project facts remain in typed `data/` modules. The selected or previewed destination ID drives SVG connection highlights, while buttons, details, links, and dialogue remain semantic HTML in `App.tsx`. The art contains no project text or interaction targets.

For a future Living Boundary experiment, attach camera/parallax input at the `stageRef` pointer handler and apply it to scene artwork wrappers (`guardianCamera` and `NeuralCore`). Keep the existing destination IDs and React selection state. Do not move content or focusable controls into a canvas/WebGL scene. A separate prototype should first prove that new depth assets materially improve the Core.

The A.5 checkpoint is commit `17bec411d28ff74fec55483ecb77e4df3754b191`. A.6 is intentionally uncommitted until owner review.
