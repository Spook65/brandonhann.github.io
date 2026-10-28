export type ProjectLink = {
  label: string;
  href: `https://${string}`;
  kind: 'project' | 'source' | 'plan';
};

export type ProjectId = 'project-cura' | 'project-mapetite' | 'project-oddworks';

export type Project = {
  id: ProjectId;
  name: string;
  status: string;
  summary: string;
  evidence: string;
  links: readonly ProjectLink[];
};

export const projects: readonly Project[] = [
  {
    id: 'project-cura',
    name: 'Cura',
    status: 'Cal Hacks 12.0 · Regeneron Honorable Mention',
    summary: 'A hackathon prototype for voice-assisted symptom conversations and care coordination.',
    evidence: 'The Devpost entry describes the prototype and identifies the award. No public interactive demo is listed here.',
    links: [
      { label: 'Devpost', href: 'https://devpost.com/software/cura-kthowx', kind: 'project' },
      { label: 'Backend source', href: 'https://github.com/hongdnn/healthcare_ai_backend', kind: 'source' },
      { label: 'iOS source', href: 'https://github.com/s-akhtar-dev/cura-ai-ios-app', kind: 'source' },
    ],
  },
  {
    id: 'project-mapetite',
    name: 'Mapetite',
    status: 'Portfolio MVP · live demo',
    summary: 'A restaurant discovery app that labels uncertain public data and validates place searches.',
    evidence: 'The project README documents its MVP scope, demo limitations, frontend, backend, and live URL.',
    links: [
      { label: 'Live demo', href: 'https://mapetite-nine.vercel.app', kind: 'project' },
      { label: 'Source', href: 'https://github.com/Spook65/Mapetite', kind: 'source' },
    ],
  },
  {
    id: 'project-oddworks',
    name: 'ODDWORKS',
    status: 'Active development · prototype foundation',
    summary: 'A Roblox workshop game in development, with server-owned progression and multiplayer foundations.',
    evidence: 'The project roadmap documents its verified 0.1 technical foundation and proposed 0.2 experiment; it is not a released game.',
    links: [
      { label: 'Source', href: 'https://github.com/Spook65/Oddworks', kind: 'source' },
      { label: 'Development roadmap', href: 'https://github.com/Spook65/Oddworks/blob/main/docs/VERTICAL_SLICE_PLAN.md', kind: 'plan' },
    ],
  },
];
