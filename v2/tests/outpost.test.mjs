import assert from 'node:assert/strict';
import test from 'node:test';
import { nextPhase, phaseDialogue, scenarios } from '../src/outpost/scenario.ts';

test('policy decisions are deterministic and stop denied execution', () => {
  for (const scenario of Object.values(scenarios)) {
    assert.equal(nextPhase('received', scenario), 'approach');
    assert.equal(nextPhase('approach', scenario), 'policy');
    assert.equal(nextPhase('policy', scenario), scenario.decision);
    assert.equal(nextPhase(scenario.decision, scenario), 'audit');
    assert.match(phaseDialogue('audit', scenario), /No external tool ran/);
  }
  assert.match(phaseDialogue('denied', scenarios.export), /outside.*allowed scope/);
});
