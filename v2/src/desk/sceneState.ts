export type DeskSceneState = 'desk' | 'focusing' | 'investigating' | 'returning';
export type DeskSceneEvent = 'open' | 'close' | 'transition-complete' | 'history-desk' | 'history-project';

export function nextDeskState(state: DeskSceneState, event: DeskSceneEvent, reducedMotion: boolean): DeskSceneState {
  switch (event) {
    case 'open': return state === 'desk' || state === 'returning' ? reducedMotion ? 'investigating' : 'focusing' : state;
    case 'close': return state === 'focusing' || state === 'investigating' ? reducedMotion ? 'desk' : 'returning' : state;
    case 'transition-complete': return state === 'focusing' ? 'investigating' : state === 'returning' ? 'desk' : state;
    case 'history-desk': return state === 'desk' ? state : reducedMotion ? 'desk' : 'returning';
    case 'history-project': return reducedMotion ? 'investigating' : state === 'desk' || state === 'returning' ? 'focusing' : state;
  }
}

export function projectRequested(hash: string): boolean {
  return hash === '#mapetite';
}
