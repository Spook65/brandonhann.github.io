import type { ProjectId } from './data/projects';

export type VisualProjectId = ProjectId | 'project-secureagent';

type Point = readonly [number, number];
type Segment = readonly [Point, Point];

export interface VisualSpec {
  readonly label: string;
  readonly detail: string;
  readonly accent: string;
  readonly soft: string;
  readonly segments: readonly Segment[];
  readonly nodes: readonly Point[];
}

// Normalized diagrams are illustrative marks, never depictions of product UI.
export const visualSpecs: Record<VisualProjectId, VisualSpec> = {
  'project-cura': {
    label: 'Cura', detail: 'VOICE / TRIAGE FLOW', accent: '#94d1cd', soft: '#456e68',
    segments: [
      [[.08,.5],[.2,.5]], [[.2,.5],[.26,.32]], [[.26,.32],[.32,.68]], [[.32,.68],[.39,.38]], [[.39,.38],[.45,.5]],
      [[.45,.5],[.56,.5]], [[.56,.5],[.69,.25]], [[.56,.5],[.72,.5]], [[.56,.5],[.69,.75]], [[.69,.25],[.84,.25]], [[.72,.5],[.88,.5]], [[.69,.75],[.84,.75]],
    ], nodes: [[.69,.25],[.72,.5],[.69,.75],[.84,.25],[.88,.5],[.84,.75]],
  },
  'project-mapetite': {
    label: 'Mapetite', detail: 'DISCOVERY / ROUTE', accent: '#e9ad63', soft: '#876441',
    segments: [
      [[.08,.22],[.93,.22]], [[.08,.5],[.93,.5]], [[.08,.78],[.93,.78]], [[.2,.1],[.2,.9]], [[.48,.1],[.48,.9]], [[.77,.1],[.77,.9]],
      [[.2,.78],[.3,.68]], [[.3,.68],[.48,.68]], [[.48,.68],[.56,.5]], [[.56,.5],[.77,.5]], [[.77,.5],[.77,.22]],
    ], nodes: [[.2,.78],[.48,.68],[.77,.22]],
  },
  'project-oddworks': {
    label: 'ODDWORKS', detail: 'WORKSHOP / ASSEMBLY', accent: '#edbd83', soft: '#936c46',
    segments: [
      [[.15,.76],[.85,.76]], [[.22,.6],[.78,.6]], [[.26,.6],[.26,.76]], [[.74,.6],[.74,.76]],
      [[.32,.44],[.68,.44]], [[.32,.44],[.32,.6]], [[.68,.44],[.68,.6]], [[.42,.28],[.58,.28]], [[.42,.28],[.42,.44]], [[.58,.28],[.58,.44]],
      [[.19,.35],[.26,.35]], [[.26,.35],[.26,.48]], [[.74,.35],[.81,.35]], [[.74,.35],[.74,.48]],
    ], nodes: [[.26,.35],[.5,.28],[.74,.35],[.32,.6],[.68,.6]],
  },
  'project-secureagent': {
    label: 'SecureAgent Lab', detail: 'PROPOSE → DECIDE → SIMULATE', accent: '#a7c8b0', soft: '#52735c',
    segments: [
      [[.09,.5],[.23,.5]], [[.23,.5],[.33,.3]], [[.23,.5],[.33,.7]], [[.33,.3],[.45,.3]], [[.33,.7],[.45,.7]],
      [[.45,.3],[.52,.5]], [[.45,.7],[.52,.5]], [[.52,.5],[.67,.5]], [[.67,.5],[.76,.32]], [[.67,.5],[.76,.68]], [[.76,.32],[.9,.32]], [[.76,.68],[.9,.68]],
    ], nodes: [[.23,.5],[.45,.3],[.45,.7],[.67,.5],[.9,.32],[.9,.68]],
  },
};

export interface Cell {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly tone: 'accent' | 'soft';
  dx: number;
  dy: number;
  vx: number;
  vy: number;
}

function distanceToSegment(x: number, y: number, [[ax, ay], [bx, by]]: Segment): number {
  const length = (bx - ax) ** 2 + (by - ay) ** 2;
  const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / length));
  return Math.hypot(x - ax - (bx - ax) * t, y - ay - (by - ay) * t);
}

export function createCells(spec: VisualSpec, width: number, height: number): Cell[] {
  const step = Math.max(12, Math.min(20, Math.round(width / 33)));
  const cells: Cell[] = [];
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const nx = x / width;
      const ny = y / height;
      const line = spec.segments.some((segment) => distanceToSegment(nx, ny, segment) < step / Math.min(width, height) * .47);
      const node = spec.nodes.some(([px, py]) => Math.hypot((nx - px) * width, (ny - py) * height) < step * 1.15);
      if (line || node) cells.push({ x, y, size: node ? step * .68 : step * .48, tone: node ? 'accent' : 'soft', dx: 0, dy: 0, vx: 0, vy: 0 });
    }
  }
  return cells;
}

export function advanceCells(cells: Cell[], pointer: Point | null, strength = 1): boolean {
  let moving = false;
  for (const cell of cells) {
    if (pointer) {
      const x = cell.x + cell.dx - pointer[0];
      const y = cell.y + cell.dy - pointer[1];
      const distance = Math.max(1, Math.hypot(x, y));
      const reach = 90;
      if (distance < reach) {
        const force = ((reach - distance) / reach) ** 2 * strength * 3.8;
        cell.vx += x / distance * force;
        cell.vy += y / distance * force;
      }
    }
    cell.vx = (cell.vx - cell.dx * .085) * .78;
    cell.vy = (cell.vy - cell.dy * .085) * .78;
    cell.dx += cell.vx;
    cell.dy += cell.vy;
    if (Math.abs(cell.dx) + Math.abs(cell.dy) + Math.abs(cell.vx) + Math.abs(cell.vy) > .12) moving = true;
    else { cell.dx = 0; cell.dy = 0; cell.vx = 0; cell.vy = 0; }
  }
  return moving;
}

export function drawVisual(ctx: CanvasRenderingContext2D, cells: readonly Cell[], spec: VisualSpec, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#172320';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#5a6e6140';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  for (let y = 0; y < height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  for (const cell of cells) {
    ctx.fillStyle = cell.tone === 'accent' ? spec.accent : spec.soft;
    ctx.fillRect(cell.x + cell.dx - cell.size / 2, cell.y + cell.dy - cell.size / 2, cell.size, cell.size);
  }
}
