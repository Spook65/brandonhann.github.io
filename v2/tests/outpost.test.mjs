import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluatePolicy, finishSimulation, nextPhase, scenarios } from '../src/outpost/scenario.ts';
import { facingYaw, outpostSpace, targetFacings, turnToward, visualTargets } from '../src/outpost/motionPlan.ts';

test('policy evaluates trusted synthetic context before any simulated action', () => {
  const read = evaluatePolicy(scenarios.inspect.request);
  assert.equal(read.decision, 'ALLOW');
  assert.equal(read.simulatedExecutionStatus, 'NOT_RUN');
  assert.equal(read.auditRecord.executionStatus, 'NOT_RUN');
  assert.equal(finishSimulation(read).simulatedExecutionStatus, 'SIMULATED');

  const exportRequest = evaluatePolicy(scenarios.export.request);
  assert.equal(exportRequest.decision, 'DENY');
  assert.equal(exportRequest.simulatedExecutionStatus, 'BLOCKED');
  assert.equal(finishSimulation(exportRequest).simulatedExecutionStatus, 'BLOCKED');
  assert.equal(finishSimulation(exportRequest).auditRecord.executionStatus, 'BLOCKED');
  assert.match(exportRequest.reason, /outside.*read-only training scope/);

  const protectedRead = evaluatePolicy({ ...scenarios.inspect.request, resource: { id: 'synthetic-report', classification: 'protected' } });
  assert.equal(protectedRead.decision, 'DENY');
  const trainingExport = evaluatePolicy({ ...scenarios.export.request, resource: { id: 'synthetic-report', classification: 'training' } });
  assert.equal(trainingExport.decision, 'DENY');
});

test('world +X travel and face-to-face inspection use local +Z forward', () => {
  assert.equal(facingYaw(0, 0, 2, 0), Math.PI / 2);
  assert.equal(facingYaw(0, 0, -2, 0), -Math.PI / 2);
  const inspection = targetFacings('examine', null);
  assert.ok(inspection.scout > Math.PI / 2);
  assert.ok(inspection.sentinel < 0);
  assert.ok(targetFacings('idle', null).scout > 0);
  assert.equal(targetFacings('travel', null).scout, Math.PI / 2);
  assert.equal(targetFacings('allow', 'ALLOW').scout, Math.PI / 2);
  assert.equal(targetFacings('deny', 'DENY').scout, -Math.PI / 2);
  assert.equal(targetFacings('recover', 'ALLOW').scout, -Math.PI / 2);
  assert.ok(Math.abs(turnToward(Math.PI - 0.1, -Math.PI + 0.1, 1) - (Math.PI + 0.1)) < 0.001);
});

test('closed gate keeps the packet clear and both characters in separate lanes', () => {
  for (const phase of ['idle', 'pickup', 'travel', 'examine', 'deny']) {
    const target = visualTargets(phase, phase === 'deny' ? 'DENY' : null);
    assert.ok(target.packetX <= outpostSpace.closedPacketLimitX);
    assert.ok(target.packetX + outpostSpace.packetHalfWidth < outpostSpace.gateX - outpostSpace.gateHalfThickness);
    assert.ok(Math.abs(target.scoutZ - outpostSpace.sentinelLaneZ) >= 1);
  }
  assert.ok(visualTargets('allow', 'ALLOW').gateY - 0.675 > 1.4);
});

test('allowed packet crosses the gate; denied packet and Scout turn back', () => {
  const gateX = 1.35;
  const closed = visualTargets('examine', null);
  const allowed = visualTargets('allow', 'ALLOW');
  const denied = visualTargets('deny', 'DENY');
  assert.ok(allowed.scoutX > gateX && allowed.packetX > gateX);
  assert.ok(allowed.gateY > closed.gateY);
  assert.ok(denied.scoutX < gateX && denied.packetX < gateX);
  assert.equal(denied.gateY, closed.gateY);
  assert.notEqual(allowed.sentinelArmZ, denied.sentinelArmZ);
  assert.equal(nextPhase('examine', evaluatePolicy(scenarios.inspect.request)), 'allow');
  assert.equal(nextPhase('examine', evaluatePolicy(scenarios.export.request)), 'deny');
  assert.equal(nextPhase('examine', null), 'examine');
});
