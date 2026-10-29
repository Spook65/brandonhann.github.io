import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluatePolicy, finishSimulation, nextPhase, scenarios } from '../src/outpost/scenario.ts';
import { visualTargets } from '../src/outpost/motionPlan.ts';

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
