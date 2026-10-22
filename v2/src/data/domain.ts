export type DestinationId =
  | "quest"
  | "archives"
  | "arsenal"
  | "chronicles"
  | "profile"
  | "signal";

export type Destination = {
  id: DestinationId;
  number: string;
  label: string;
  hint: string;
};

export const destinations: readonly Destination[] = [
  { id: "quest", number: "01", label: "Main Quest", hint: "SecureAgent Lab" },
  {
    id: "archives",
    number: "02",
    label: "Project Archives",
    hint: "Cura · Mapetite · ODDWORKS",
  },
  {
    id: "arsenal",
    number: "03",
    label: "Arsenal",
    hint: "Tools and practices",
  },
  {
    id: "chronicles",
    number: "04",
    label: "Chronicles",
    hint: "Education and experience",
  },
  {
    id: "profile",
    number: "05",
    label: "Character Profile",
    hint: "About Brandon",
  },
  { id: "signal", number: "06", label: "Signal", hint: "Résumé and contact" },
];

export const secureAgent = {
  name: "SecureAgent Lab",
  status: "Active development",
  summary:
    "An offline experimental gateway for AI-agent tool actions. It applies authorization rules before simulated execution.",
  objective:
    "Add a persistent full-pipeline regression test for unsupported LABDOC versions and update stale project documentation.",
  reviewed:
    "October 21, 2026: 36/36 tests passed in the reviewed local state, including an uncommitted test; 20 synthetic scenarios were reviewed.",
  scope:
    "The reviewed results describe an offline experiment. There is no public demo, real LLM integration, or production security claim.",
} as const;

export const skillGroups = [
  {
    title: "Build",
    items: ["TypeScript", "React", "Node.js", "Python", "FastAPI", "REST APIs"],
  },
  {
    title: "Systems",
    items: [
      "Input validation",
      "Server authority",
      "Testing",
      "Profiling",
      "Git",
    ],
  },
  {
    title: "Explore",
    items: [
      "Cybersecurity",
      "AI evaluation",
      "Data quality",
      "Roblox Studio",
      "Luau",
    ],
  },
] as const;

export const profile = {
  intro:
    "I’m Brandon, a fourth-year Computer Science student at the University of the Pacific. I build things, break things, and figure out why they broke.",
  focus:
    "I’m drawn to software engineering, cybersecurity, AI evaluation, and creative experiments that make complex systems easier to understand.",
  education: "Fourth-year Computer Science student · University of the Pacific",
  experience: [
    "Research Assistant, AI Task Force at the University of the Pacific — work on AI risk and policy.",
    "Secretary, Alpha Phi Omega — chapter communications and records.",
    "Cal Hacks 12.0 — Regeneron Honorable Mention for Cura.",
  ],
} as const;
