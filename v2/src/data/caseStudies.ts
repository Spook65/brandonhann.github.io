import { projects, type Project } from "./projects.ts";
import { legacyAnchors } from "./legacyAnchors.ts";
import { secureAgent } from "./domain.ts";

export type CaseStudy = {
  readonly project: Project;
  readonly category: string;
  readonly problem: string;
  readonly contribution: string;
  readonly stack: readonly string[];
  readonly flow: readonly { title: string; detail: string }[];
  readonly decision: string;
  readonly evidence: string;
  readonly limitation: string;
  readonly notes: readonly string[];
  readonly source: `https://${string}` | null;
};
function existing(id: string): Project {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error(`Missing project contract: ${id}`);
  return project;
}
export const caseStudies: readonly CaseStudy[] = [
  {
    project: existing("project-mapetite"),
    category: "Full-stack · Data quality",
    problem:
      "Restaurant data is incomplete. A useful search experience has to make uncertainty visible.",
    contribution:
      "Built a restaurant discovery MVP with a React interface, an Express API, place validation, provider normalization, and a saved-place demo.",
    stack: ["React", "TypeScript", "Express", "MapLibre", "Vitest"],
    flow: [
      { title: "Search interface", detail: "React / Vercel" },
      { title: "Validate place", detail: "Express / Render" },
      { title: "Normalize providers", detail: "Geoapify → OSM fallback" },
      { title: "Rank & explain", detail: "Results with uncertainty labels" },
    ],
    decision:
      "Validate location before provider search. Ambiguous places return suggestions rather than silently choosing a different city.",
    evidence:
      "Public source includes place-validation tests for ambiguous and invalid input. The README documents the deployed frontend and backend. These project tests were inspected, not rerun for this portfolio.",
    limitation:
      "Portfolio MVP: provider coverage varies, and memory-mode accounts and saved places may reset when the backend restarts.",
    notes: [
      "The catalog separates provider orchestration, normalization, ranking, and TTL caching.",
      "Hours and menu fields are labeled conservatively; a missing field is not replaced with an invented claim.",
      "The optional map uses coordinates from actual results. Private review screenshots are not published here.",
    ],
    source: "https://github.com/Spook65/Mapetite/blob/main/README.md",
  },
  {
    project: {
      id: "project-rivet",
      name: "Rivet",
      status: "Cal Hacks 13.0 · team prototype",
      summary:
        "An explainable robotics feasibility engine with pooled bounties for unmet needs.",
      evidence: "Public README, hackathon log, and backend decision functions.",
      links: [
        {
          label: "Source & documentation",
          href: "https://github.com/danielwork12121-lab/Rivet",
          kind: "source",
        },
      ],
    },
    category: "Backend · Authorization",
    problem:
      "Robot recommendations need explainable matching and private, account-owned requests.",
    contribution:
      "Worked primarily on the backend: Convex, Clerk authentication, secure user data, AI workflow coordination, and robot matching.",
    stack: ["TypeScript", "Convex", "Clerk", "AI integrations"],
    flow: [
      { title: "Authenticated request", detail: "Clerk identity" },
      { title: "Ownership boundary", detail: "Convex functions" },
      {
        title: "Workflow & matching",
        detail: "Scheduled actions + pure rules",
      },
      { title: "Explainable result", detail: "Evidence and caveats" },
    ],
    decision:
      "Keep deterministic compatibility and scoring separate from AI interpretation. Authentication and request ownership are checked in backend functions.",
    evidence:
      "The public hackathon log identifies the backend proof files. The reviewed decision layer excludes incompatible environments before ranking and flags estimated ROI inputs.",
    limitation:
      "Hackathon prototype. Team implementation; financial estimates and vendor data require independent verification.",
    notes: [
      "Convex stores requests and matching state; Clerk identity is checked within backend functions.",
      "Queued work uses scheduled internal actions; the documented sweeper handles stuck work.",
      "Only the developer bounty board uses a live subscription; other screens poll.",
    ],
    source:
      "https://github.com/danielwork12121-lab/Rivet/blob/main/hackathon.md",
  },
  {
    project: {
      id: "project-secureagent",
      name: secureAgent.name,
      status: secureAgent.status,
      summary: secureAgent.summary,
      evidence: secureAgent.scope,
      links: [],
    },
    category: "AI security · Offline systems",
    problem:
      "An agent proposal should not become a tool action until a separate authorization boundary permits it.",
    contribution:
      "Developing an offline experimental gateway that applies authorization rules before simulated tool execution.",
    stack: ["Policy evaluation", "Synthetic scenarios", "Regression testing"],
    flow: [
      { title: "Proposed action", detail: "Untrusted request" },
      { title: "Authorization", detail: "Deterministic rule boundary" },
      { title: "Simulated execution", detail: "Only after permission" },
      { title: "Regression evidence", detail: "Synthetic scenarios" },
    ],
    decision:
      "Treat proposed actions as input, not authority. Keep authorization independent of the component proposing the action.",
    evidence: secureAgent.reviewed,
    limitation: secureAgent.scope,
    notes: [
      "The result is a local, dated review—not a production security guarantee.",
      "The current documented follow-up is a persistent regression for unsupported LABDOC versions.",
      "No private source, credentials, or synthetic record contents are published in this case study.",
    ],
    source: null,
  },
  {
    project: existing("project-oddworks"),
    category: "Multiplayer · Server authority",
    problem:
      "Workshop progression and item ownership must remain consistent when multiple players act at once.",
    contribution:
      "Building a Roblox/Luau workshop prototype with server-owned gameplay state, persistence, crafting, progression, and sanitized client replication.",
    stack: ["Luau", "Roblox Studio", "Rojo", "ProfileStore"],
    flow: [
      { title: "Client intent", detail: "Request / presentation" },
      { title: "Server validation", detail: "Ownership & eligibility" },
      { title: "Authoritative state", detail: "Crafting / progression" },
      { title: "Derived presentation", detail: "Sanitized client HUD" },
    ],
    decision:
      "Let clients request actions while the server owns rewards, recipes, and progression. Derive the visible representation from authoritative state.",
    evidence:
      "The public roadmap records the implemented 0.1 foundation and explicitly separates it from the proposed modular-invention experiment.",
    limitation:
      "Pre-production prototype. The technical foundation does not establish a released game or prove the next gameplay loop is fun.",
    notes: [
      "PlayerStateService owns private server state; StateReplicationService supplies sanitized presentation.",
      "Existing schema-v1 persistence remains separate from the session-only modular experiment.",
      "Rojo-managed source and documented contracts keep filesystem code and Studio integration coordinated.",
    ],
    source:
      "https://github.com/Spook65/Oddworks/blob/main/docs/VERTICAL_SLICE_PLAN.md",
  },
];

export const principles = [
  {
    name: "Validate",
    detail:
      "Make uncertain input explicit before it becomes application state.",
  },
  {
    name: "Authorize",
    detail: "Keep permission separate from the action being requested.",
  },
  {
    name: "Verify",
    detail: "Use tests and observable evidence to challenge the result.",
  },
] as const;
export function projectFromHash(hash: string): string | null {
  let value: string;
  try {
    value = decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return null;
  }
  const mapped =
    value === legacyAnchors.threatgrid
      ? "project-secureagent"
      : value === legacyAnchors.oddworks
        ? "project-oddworks"
        : value;
  return caseStudies.some(({ project }) => project.id === mapped)
    ? mapped
    : null;
}
