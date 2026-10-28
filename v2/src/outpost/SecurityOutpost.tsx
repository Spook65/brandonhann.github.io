import { useEffect, useRef, useState } from 'react';
import { secureAgent } from '../data/domain';
import { createOutpostScene, type OutpostScene } from './createOutpostScene';
import { nextPhase, phaseDialogue, scenarios, type ActionId, type Phase, type Scenario } from './scenario';
import styles from './SecurityOutpost.module.css';

const base = import.meta.env.BASE_URL;

export default function SecurityOutpost() {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<OutpostScene | null>(null);
  const requestRef = useRef<() => void>(() => undefined);
  const [phase, setPhase] = useState<Phase>('idle');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionId>('inspect');
  const [progress, setProgress] = useState(0);
  const [renderError, setRenderError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const begin = (id: ActionId) => {
    if (phase !== 'idle') return;
    setScenario(scenarios[id]);
    setSelectedAction(id);
    setPhase('received');
  };
  requestRef.current = () => begin(selectedAction);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motion.matches);
    const onChange = () => setReducedMotion(motion.matches);
    motion.addEventListener('change', onChange);
    return () => motion.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!host.current) return;
    try {
      scene.current = createOutpostScene(host.current, () => requestRef.current(), reducedMotion);
      setRenderError(false);
    } catch {
      setRenderError(true);
    }
    document.documentElement.dataset.appReady = 'true';
    return () => {
      scene.current?.dispose();
      scene.current = null;
      delete document.documentElement.dataset.appReady;
    };
  }, [reducedMotion]);

  useEffect(() => {
    scene.current?.setPhase(phase, scenario?.decision ?? null);
  }, [phase, scenario, renderError, reducedMotion]);

  useEffect(() => {
    scene.current?.setProgress(progress);
  }, [progress, renderError, reducedMotion]);

  useEffect(() => {
    if (!scenario || phase === 'idle') return;
    const duration = reducedMotion ? (phase === 'audit' ? 2600 : 650) : phase === 'approach' ? 1150 : phase === 'policy' ? 950 : phase === 'audit' ? 2600 : 850;
    const timer = window.setTimeout(() => setPhase((current) => nextPhase(current, scenario)), duration);
    return () => window.clearTimeout(timer);
  }, [phase, scenario, reducedMotion]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') window.location.assign(base);
      if (event.target instanceof HTMLElement && ['BUTTON', 'A', 'INPUT', 'SELECT'].includes(event.target.tagName)) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        event.preventDefault();
        setProgress((value) => Math.min(1, value + 0.25));
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        setProgress((value) => Math.max(0, value - 0.25));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className={styles.outpost}>
      <header className={styles.header}>
        <a className={styles.exit} href={base}>← Brandon Hann</a>
        <span className={styles.worldLabel}>The Signal Outpost <span aria-hidden="true">/</span> guided simulation</span>
        <nav aria-label="Professional navigation"><a href={`${base}#projects`}>Projects</a><a href={`${base}resume.html`}>Résumé</a><a href={`${base}?experience=guardian`}>Guardian</a></nav>
      </header>
      <section className={styles.stage} aria-labelledby="outpost-heading">
        <div className={styles.scene} ref={host} data-render-status={renderError ? 'fallback' : 'active'}>
          {renderError && <div className={styles.fallback} role="status"><strong>The scene is unavailable.</strong><span>The request simulation below still works.</span></div>}
        </div>
        <div className={styles.sceneTitle}>
          <p>SecureAgent Lab / an illustrative field exercise</p>
          <h1 id="outpost-heading">Every request<br />meets a rule.</h1>
          <p>Follow Scout across the crossing. Sentinel checks the policy before a tool action can proceed.</p>
        </div>
        <div className={styles.gateLabel} aria-hidden="true"><span className={styles.gateDot} data-state={phase} /> Trust gate / {phase === 'allowed' || (phase === 'audit' && scenario?.decision === 'allowed') ? 'allowed' : phase === 'denied' || (phase === 'audit' && scenario?.decision === 'denied') ? 'denied' : 'standing by'}</div>
      </section>
      <section className={styles.controls} aria-label="Explore the outpost">
        <div className={styles.walkControls}>
          <p className={styles.controlLabel}>01 / Traverse</p>
          <div><button type="button" onClick={() => setProgress((value) => Math.max(0, value - 0.25))} disabled={progress === 0}>← Step back</button><button type="button" onClick={() => setProgress((value) => Math.min(1, value + 0.25))} disabled={progress === 1}>Move closer →</button></div>
          <p>Use the buttons or arrow keys. The crossing is optional.</p>
        </div>
        <div className={styles.requestControls}>
          <p className={styles.controlLabel}>02 / Send one sample request</p>
          <div className={styles.actionChoices}>
            <button type="button" data-selected={selectedAction === 'inspect'} onClick={() => setSelectedAction('inspect')} aria-pressed={selectedAction === 'inspect'}>Read-only inspection</button>
            <button type="button" data-selected={selectedAction === 'export'} onClick={() => setSelectedAction('export')} aria-pressed={selectedAction === 'export'}>Protected export</button>
          </div>
          <button type="button" className={styles.send} onClick={() => begin(selectedAction)} disabled={phase !== 'idle'}>Send request to Scout ↗</button>
          <p>The glowing request object also responds to a click or tap.</p>
        </div>
        <div className={styles.dialogue} aria-live="polite" aria-atomic="true">
          <p className={styles.controlLabel}>03 / At the checkpoint</p>
          <p className={styles.speech}>{phaseDialogue(phase, scenario)}</p>
          <p className={styles.phase}>State: {phase.replace('-', ' ')}{scenario && phase === 'idle' ? ' · ready to repeat' : ''}</p>
        </div>
      </section>
      <footer className={styles.footer}><p>{secureAgent.summary} {secureAgent.scope} This scene is a guided simulation with fixed rules, not an autonomous agent or public demo.</p><a href={`${base}#project-secureagent`}>Read the project overview ↗</a></footer>
    </main>
  );
}
