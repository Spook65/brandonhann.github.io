import type { Decision, Phase } from './scenario';

export type VisualTargets = {
  readonly scoutX: number;
  readonly scoutZ: number;
  readonly packetX: number;
  readonly packetZ: number;
  readonly packetY: number;
  readonly gateY: number;
  readonly sentinelArmZ: number;
  readonly cameraFocusX: number;
};

// Route is world +X. Both character meshes have local +Z as their face/front.
// Gate aperture is x=1.35, |z|<0.75; the closed barrier occupies y=0.065..1.415.
export const outpostSpace = {
  gateX: 1.35, gateHalfThickness: 0.055, packetHalfWidth: 0.26,
  closedPacketLimitX: 0.95, raisedGateClearanceY: 1.8,
  scoutLaneZ: 0.35, sentinelLaneZ: -0.65,
} as const;

const rest: VisualTargets = { scoutX: -2.65, scoutZ: outpostSpace.scoutLaneZ, packetX: -1.65, packetZ: outpostSpace.scoutLaneZ, packetY: 0.38, gateY: 0.74, sentinelArmZ: 0, cameraFocusX: 0 };

export function facingYaw(fromX: number, fromZ: number, toX: number, toZ: number): number {
  return Math.atan2(toX - fromX, toZ - fromZ);
}

export function turnToward(current: number, target: number, amount: number): number {
  const shortest = Math.atan2(Math.sin(target - current), Math.cos(target - current));
  return current + shortest * amount;
}

// The path itself carries the meaning: only ALLOW crosses the x=1.35 gate.
export function visualTargets(phase: Phase, decision: Decision | null): VisualTargets {
  switch (phase) {
    case 'idle': return rest;
    case 'pickup': return { ...rest, scoutX: -1.95, packetX: -1.48, packetY: 0.91, cameraFocusX: -0.4 };
    case 'travel': return { ...rest, scoutX: 0.05, packetX: 0.48, packetY: 0.96, cameraFocusX: 0.25 };
    case 'examine': return { ...rest, scoutX: 0.1, packetX: 0.72, packetY: 0.98, sentinelArmZ: -0.8, cameraFocusX: 0.75 };
    case 'allow': return { ...rest, scoutX: 2.75, packetX: 3.12, packetY: 0.96, gateY: 2.48, sentinelArmZ: -1.35, cameraFocusX: 0.65 };
    case 'deny': return { ...rest, scoutX: -2.25, packetX: -1.92, packetY: 0.88, sentinelArmZ: 0.95, cameraFocusX: 0.15 };
    case 'audit': return decision === 'ALLOW'
      ? { ...rest, scoutX: 2.85, packetX: 3.25, packetY: 1.15, gateY: 2.48, sentinelArmZ: -1.1, cameraFocusX: 0.55 }
      : { ...rest, scoutX: -2.65, packetX: -1.65, packetY: 0.38, sentinelArmZ: 0.8, cameraFocusX: 0.1 };
    case 'recover': return decision === 'ALLOW'
      ? { ...rest, packetX: 3.25, packetY: 1.15, cameraFocusX: 0.2 }
      : rest;
  }
}

export function targetFacings(phase: Phase, decision: Decision | null, targets = visualTargets(phase, decision)) {
  const scoutTarget = phase === 'deny' || (phase === 'recover' && decision === 'ALLOW')
    ? { x: targets.scoutX - 2, z: targets.scoutZ }
    : phase === 'examine' || phase === 'audit'
      ? { x: 2.35, z: outpostSpace.sentinelLaneZ }
      : { x: targets.scoutX + 2, z: targets.scoutZ };
  const sentinelTarget = phase === 'allow' || (phase === 'audit' && decision === 'ALLOW')
    ? { x: 2.85, z: outpostSpace.scoutLaneZ }
    : { x: targets.scoutX, z: targets.scoutZ };
  return {
    scout: facingYaw(targets.scoutX, targets.scoutZ, scoutTarget.x, scoutTarget.z),
    sentinel: facingYaw(2.35, outpostSpace.sentinelLaneZ, sentinelTarget.x, sentinelTarget.z),
  } as const;
}
