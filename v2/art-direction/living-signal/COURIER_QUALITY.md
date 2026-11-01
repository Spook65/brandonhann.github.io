# H.4C.1 — courier delivery quality review

The isolated mobile SecureAgent prototype retains H.4C's three semantic states and synthetic `RECIPIENT_NOT_APPROVED` example. Selecting **Check policy** shows the HTML DENY result immediately. The visual layer then plays one finite 720 ms sequence: courier preparation, packet travel, gate reaction, and the settled stop pose. Reset unmounts that visual sequence and returns to idle. Reduced motion shows the final denied pose, gate, and packet immediately.

The policy remains illustrative. No SecureAgent code, tool call, backend, API request, or document body enters the portfolio. Both later courier poses are preloaded within the isolated prototype so the visual handoff does not wait for a new image request; the real homepage still requests none of them.

## Frame review

Keyframes were inspected in Chromium at 320 px and 390 px. The packet moves from beside the courier toward the policy boundary, reaches its closest point at roughly 400 ms, and remains outside the gate. Measured minimum packet-to-gate bounding-box clearance was 6 px at both widths. The gate switches from purple pending to amber DENY after packet arrival; the stop pose is visible by roughly 520 ms and stays settled by 720 ms. No animation runs at idle or after the sequence settles.

The 320 px path is shorter because the courier and gate must remain visible together. It is visually coherent, but a first-time visitor may still understand the policy outcome mainly from the text. The original character poses are expressive for their scale; they are not a frame-animated sprite sheet. This is an interaction quality proposal, not artistic approval or evidence of uncoached comprehension.
