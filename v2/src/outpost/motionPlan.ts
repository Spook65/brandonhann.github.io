import type { Decision, Phase } from './scenario';

export type VisualTargets = {
  readonly scoutX: number;
  readonly packetX: number;
  readonly packetY: number;
  readonly gateY: number;
  readonly sentinelArmZ: number;
  readonly cameraFocusX: number;
};

const rest: VisualTargets = { scoutX: -2.65, packetX: -1.65, packetY: 0.38, gateY: 0.74, sentinelArmZ: 0, cameraFocusX: 0 };

// The path itself carries the meaning: only ALLOW crosses the x=1.35 gate.
export function visualTargets(phase: Phase, decision: Decision | null): VisualTargets {
  switch (phase) {
    case 'idle': return rest;
    case 'pickup': return { ...rest, scoutX: -1.95, packetX: -1.48, packetY: 0.91, cameraFocusX: -0.4 };
    case 'travel': return { ...rest, scoutX: 0.05, packetX: 0.48, packetY: 0.96, cameraFocusX: 0.25 };
    case 'examine': return { ...rest, scoutX: 0.1, packetX: 0.72, packetY: 0.98, sentinelArmZ: -0.8, cameraFocusX: 0.75 };
    case 'allow': return { ...rest, scoutX: 2.6, packetX: 2.95, packetY: 0.96, gateY: 2.48, sentinelArmZ: -1.35, cameraFocusX: 1.15 };
    case 'deny': return { ...rest, scoutX: -2.25, packetX: -1.92, packetY: 0.88, sentinelArmZ: 0.95, cameraFocusX: 0.45 };
    case 'audit': return decision === 'ALLOW'
      ? { ...rest, scoutX: 2.85, packetX: 3.2, packetY: 1.15, gateY: 2.48, sentinelArmZ: -1.1, cameraFocusX: 1.1 }
      : { ...rest, scoutX: -2.65, packetX: -1.65, packetY: 0.38, sentinelArmZ: 0.8, cameraFocusX: 0.1 };
    case 'recover': return decision === 'ALLOW'
      ? { ...rest, packetX: 3.2, packetY: 1.15, cameraFocusX: 0.35 }
      : rest;
  }
}
