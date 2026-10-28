import { useCallback, useEffect, useRef, useState } from 'react';
import { nextDeskState, projectRequested, type DeskSceneState } from './sceneState';

export interface DeskSceneController {
  readonly state: DeskSceneState;
  readonly openProject: () => void;
  readonly closeProject: () => void;
  readonly completeTransition: () => void;
  readonly returnedRef: React.RefObject<boolean>;
}

export function useDeskScene(): DeskSceneController {
  const [state, setState] = useState<DeskSceneState>(() => projectRequested(window.location.hash) ? 'investigating' : 'desk');
  const reducedRef = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const enteredRef = useRef(false);
  const returnedRef = useRef(false);
  const change = useCallback((event: Parameters<typeof nextDeskState>[1]) => {
    setState((current) => nextDeskState(current, event, reducedRef.current));
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => {
      reducedRef.current = media.matches;
      if (media.matches) setState((current) => current === 'focusing' ? 'investigating' : current === 'returning' ? 'desk' : current);
    };
    const syncHistory = () => {
      if (projectRequested(window.location.hash)) change('history-project');
      else { returnedRef.current = true; change('history-desk'); }
    };
    media.addEventListener('change', onMotion);
    window.addEventListener('popstate', syncHistory);
    window.addEventListener('hashchange', syncHistory);
    return () => {
      media.removeEventListener('change', onMotion);
      window.removeEventListener('popstate', syncHistory);
      window.removeEventListener('hashchange', syncHistory);
    };
  }, [change]);

  const openProject = useCallback(() => {
    if (!projectRequested(window.location.hash)) {
      window.history.pushState({ builderDesk: true }, '', '#mapetite');
      enteredRef.current = true;
    }
    change('open');
  }, [change]);

  const closeProject = useCallback(() => {
    returnedRef.current = true;
    if (enteredRef.current && projectRequested(window.location.hash)) {
      enteredRef.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      change('close');
    }
  }, [change]);

  return { state, openProject, closeProject, completeTransition: () => change('transition-complete'), returnedRef };
}
