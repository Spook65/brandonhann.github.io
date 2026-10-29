export type ActionId = 'inspect' | 'export';
export type Phase = 'idle' | 'pickup' | 'travel' | 'examine' | 'allow' | 'deny' | 'audit' | 'recover';
export type Decision = 'ALLOW' | 'DENY';
export type ExecutionStatus = 'NOT_RUN' | 'BLOCKED' | 'SIMULATED';

export type PolicyRequest = {
  readonly scenarioId: ActionId;
  readonly actor: 'scout';
  readonly action: 'read' | 'export';
  readonly resource: { readonly id: 'synthetic-report'; readonly classification: 'training' | 'protected' };
};

export type Scenario = {
  readonly id: ActionId;
  readonly label: string;
  readonly request: PolicyRequest;
  readonly spokenRequest: string;
};

export type AuditRecord = {
  readonly scenarioId: ActionId;
  readonly action: PolicyRequest['action'];
  readonly decision: Decision;
  readonly reason: string;
  readonly executionStatus: ExecutionStatus;
};

export type PolicyResult = {
  readonly scenarioId: ActionId;
  readonly action: PolicyRequest['action'];
  readonly decision: Decision;
  readonly reason: string;
  readonly simulatedExecutionStatus: ExecutionStatus;
  readonly auditRecord: AuditRecord;
};

// These are trusted synthetic examples. A real client-side simulation cannot
// authorize a real tool action; no backend or external action exists here.
export const scenarios: Readonly<Record<ActionId, Scenario>> = {
  inspect: {
    id: 'inspect',
    label: 'Read a training report',
    spokenRequest: 'A training report needs a read-only check.',
    request: { scenarioId: 'inspect', actor: 'scout', action: 'read', resource: { id: 'synthetic-report', classification: 'training' } },
  },
  export: {
    id: 'export',
    label: 'Export a protected report',
    spokenRequest: 'Someone asked to export a protected report.',
    request: { scenarioId: 'export', actor: 'scout', action: 'export', resource: { id: 'synthetic-report', classification: 'protected' } },
  },
};

export function evaluatePolicy(request: PolicyRequest): PolicyResult {
  const allowed = request.actor === 'scout' && request.action === 'read' && request.resource.classification === 'training';
  const decision: Decision = allowed ? 'ALLOW' : 'DENY';
  const reason = allowed
    ? 'Read-only inspection of this synthetic training report is within scope.'
    : 'This action or resource is outside the simulation’s read-only training scope.';
  const simulatedExecutionStatus: ExecutionStatus = allowed ? 'NOT_RUN' : 'BLOCKED';
  return {
    scenarioId: request.scenarioId,
    action: request.action,
    decision,
    reason,
    simulatedExecutionStatus,
    auditRecord: { scenarioId: request.scenarioId, action: request.action, decision, reason, executionStatus: simulatedExecutionStatus },
  };
}

// Called only after the physical outcome phase. The returned value is still a
// pure description of a mock action, never a real tool call.
export function finishSimulation(result: PolicyResult): PolicyResult {
  const simulatedExecutionStatus: ExecutionStatus = result.decision === 'ALLOW' ? 'SIMULATED' : 'BLOCKED';
  return { ...result, simulatedExecutionStatus, auditRecord: { ...result.auditRecord, executionStatus: simulatedExecutionStatus } };
}

export function nextPhase(phase: Phase, result: PolicyResult | null): Phase {
  switch (phase) {
    case 'idle': return 'idle';
    case 'pickup': return 'travel';
    case 'travel': return 'examine';
    case 'examine': return result?.decision === 'ALLOW' ? 'allow' : result?.decision === 'DENY' ? 'deny' : 'examine';
    case 'allow':
    case 'deny': return 'audit';
    case 'audit': return 'recover';
    case 'recover': return 'idle';
  }
}

export type Actor = 'scout' | 'sentinel' | 'audit';
export function phaseDialogue(phase: Phase, scenario: Scenario | null, result: PolicyResult | null): { actor: Actor; text: string } | null {
  switch (phase) {
    case 'idle': return scenario ? { actor: 'audit', text: 'Ready again. Choose another request or replay.' } : { actor: 'scout', text: 'I have a sample request to deliver.' };
    case 'pickup': return { actor: 'scout', text: scenario?.spokenRequest ?? 'Picking up a sample request.' };
    case 'travel': return { actor: 'scout', text: 'Taking it to Sentinel.' };
    case 'examine': return { actor: 'sentinel', text: 'Let me check the rule before it goes through.' };
    case 'allow': return { actor: 'sentinel', text: 'Read-only and in scope. Come through!' };
    case 'deny': return { actor: 'sentinel', text: 'Hold there. That request cannot cross.' };
    case 'audit': return { actor: 'audit', text: result?.decision === 'ALLOW' ? 'Allowed. Simulated read recorded.' : 'Denied. No action ran.' };
    case 'recover': return { actor: 'scout', text: result?.decision === 'ALLOW' ? 'Delivered. Back for the next one!' : 'I’ll bring this one back.' };
  }
}
