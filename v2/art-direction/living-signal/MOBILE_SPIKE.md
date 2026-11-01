# H.4C — functional mobile SecureAgent interaction

This is a separate, `noindex` prototype at `prototypes/secureagent-mobile.html`. It does not change the homepage, the H.4A desktop network, project index, Guardian, or production site.

## Source-verified example

The local SecureAgent Lab policy source and gateway test were inspected on 2026-10-31. A test submits a synthetic `send_message` for `doc:public` to `recipient:unapproved`. The expected decision is `DENY` with `RECIPIENT_NOT_APPROVED`; the mock executor invocation count remains zero. This prototype presents that fixture's outcome as an **illustrative offline explanation**. It does not import the lab, invoke its gateway, send a message, or implement a security boundary. No document body or private project code is published.

## Interaction contract

| State | Visitor action | What appears |
| --- | --- | --- |
| Idle | Select **Inspect a request** | Courier waits. The request and decision are absent. |
| Selected | Select **Check policy** | The exact synthetic tool, resource, and recipient appear. Courier leans toward the request. No decision is shown yet. |
| Result | Select **Reset example** | A brief request movement stops at the boundary, the courier raises a stop gesture, and semantic HTML announces `DENY` and the reason. Reset returns to idle. |

The real case-study link remains visible in all states and in prerendered HTML without JavaScript. The three authored poses are exported from the existing original relay-character artwork. Motion is one finite CSS animation, disabled by reduced motion; there is no timer, render loop, audio, API call, or external asset dependency.

## Review question

The sequence makes the policy result explicit, but the small scene may still read as a compact diagram. Watch a first-time visitor without explanation: do they recognize the courier's request as a proposed tool action, notice that **Check policy** is separate from inspection, and understand why the request stops? Passing browser tests does not answer that visual question.
