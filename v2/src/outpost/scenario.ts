export type ActionId = 'inspect' | 'export';
export type Phase = 'idle' | 'received' | 'approach' | 'policy' | 'allowed' | 'denied' | 'audit';

export type Scenario = {
  readonly id: ActionId;
  readonly label: string;
  readonly request: string;
  readonly decision: 'allowed' | 'denied';
  readonly reason: string;
  readonly audit: string;
};

// An illustrative, deterministic policy example inspired by SecureAgent Lab's
// offline authorization-before-execution experiment. No real tool is called.
export const scenarios: Readonly<Record<ActionId, Scenario>> = {
  inspect: {
    id: 'inspect',
    label: 'Inspect a synthetic report',
    request: 'Scout: I have a request to inspect a synthetic report.',
    decision: 'allowed',
    reason: 'Sentinel: Read-only access to this simulated report is allowed.',
    audit: 'Audit: Allowed → simulated read only. No external tool ran.',
  },
  export: {
    id: 'export',
    label: 'Export a protected report',
    request: 'Scout: I have a request to export a protected report.',
    decision: 'denied',
    reason: 'Sentinel: Export is outside this simulation’s allowed scope.',
    audit: 'Audit: Denied → execution stopped. No external tool ran.',
  },
};

export function nextPhase(phase: Phase, scenario: Scenario): Phase {
  switch (phase) {
    case 'idle': return 'idle';
    case 'received': return 'approach';
    case 'approach': return 'policy';
    case 'policy': return scenario.decision;
    case 'allowed':
    case 'denied': return 'audit';
    case 'audit': return 'idle';
  }
}

export function phaseDialogue(phase: Phase, scenario: Scenario | null): string {
  if (!scenario) return 'Scout is ready to carry a sample request. Sentinel checks policy before simulated execution.';
  switch (phase) {
    case 'idle': return scenario.audit;
    case 'received': return scenario.request;
    case 'approach': return 'Scout: Bringing the request to the trust gate.';
    case 'policy': return 'Sentinel: Checking the request against a fixed policy…';
    case 'allowed':
    case 'denied': return scenario.reason;
    case 'audit': return scenario.audit;
  }
}
