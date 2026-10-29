import { useEffect, useRef, useState } from 'react';
import { secureAgent } from '../data/domain';
import { createOutpostScene, type OutpostScene } from './createOutpostScene';
import { evaluatePolicy, finishSimulation, nextPhase, phaseDialogue, scenarios, type ActionId, type Phase, type PolicyResult, type Scenario } from './scenario';
import styles from './SecurityOutpost.module.css';

const base = import.meta.env.BASE_URL;
const durations: Readonly<Record<Exclude<Phase, 'idle'>, number>> = {
  pickup: 900, travel: 1500, examine: 1100, allow: 2000, deny: 1700, audit: 1450, recover: 1300,
};

export default function SecurityOutpost() {
  const host = useRef<HTMLDivElement>(null);
  const scene = useRef<OutpostScene | null>(null);
  const actionRef = useRef<() => void>(() => undefined);
  const visibleRef = useRef<(visible: boolean) => void>(() => undefined);
  const autoStarted = useRef(false);
  const autoPending = useRef(false);
  const autoTimer = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [result, setResult] = useState<PolicyResult | null>(null);
  const [runSource, setRunSource] = useState<'auto' | 'user'>('user');
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderError, setRenderError] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [sceneVisible, setSceneVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);

  const begin = (id: ActionId, source: 'auto' | 'user' = 'user') => {
    if (phase !== 'idle') return;
    window.clearTimeout(autoTimer.current);
    autoPending.current = false;
    autoStarted.current = true;
    setRunSource(source);
    setScenario(scenarios[id]);
    setResult(null);
    setPaused(false);
    setPhase('pickup');
  };
  actionRef.current = () => begin(scenario?.id === 'export' ? 'export' : 'inspect');
  visibleRef.current = (visible) => {
    setSceneVisible(visible);
    if (!visible && autoPending.current) {
      window.clearTimeout(autoTimer.current);
      autoPending.current = false;
      autoStarted.current = false;
    }
    if (!visible || document.hidden || autoStarted.current || reducedMotion || phase !== 'idle') return;
    autoStarted.current = true;
    autoPending.current = true;
    autoTimer.current = window.setTimeout(() => { autoPending.current = false; begin('inspect', 'auto'); }, 600);
  };

  const reset = () => {
    window.clearTimeout(autoTimer.current);
    autoPending.current = false;
    autoStarted.current = true;
    setPhase('idle');
    setScenario(null);
    setResult(null);
    setPaused(false);
  };

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(motion.matches);
    motion.addEventListener('change', onChange);
    return () => motion.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!host.current) return;
    try {
      scene.current = createOutpostScene(host.current, () => actionRef.current(), (visible) => visibleRef.current(visible), reducedMotion);
      setRenderError(false);
    } catch {
      setRenderError(true);
      setSceneVisible(true);
    }
    document.documentElement.dataset.appReady = 'true';
    return () => {
      window.clearTimeout(autoTimer.current);
      scene.current?.dispose();
      scene.current = null;
      delete document.documentElement.dataset.appReady;
    };
  }, [reducedMotion]);

  useEffect(() => {
    scene.current?.setPhase(phase, result?.decision ?? null);
  }, [phase, result, renderError, reducedMotion]);

  useEffect(() => { scene.current?.setPaused(paused); }, [paused, renderError, reducedMotion]);
  useEffect(() => { scene.current?.setProgress(progress); }, [progress, renderError, reducedMotion]);

  useEffect(() => {
    if (phase === 'idle' || paused || !scenario || !pageVisible || (!sceneVisible && !renderError)) return;
    const duration = reducedMotion ? Math.max(650, durations[phase] * 0.55) : durations[phase];
    const timer = window.setTimeout(() => {
      if (phase === 'examine') {
        const evaluated = evaluatePolicy(scenario.request);
        setResult(evaluated);
        setPhase(nextPhase('examine', evaluated));
      } else if (phase === 'allow' || phase === 'deny') {
        if (!result) throw new Error('Policy result missing before simulated outcome.');
        setResult(finishSimulation(result));
        setPhase('audit');
      } else {
        setPhase(nextPhase(phase, result));
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [phase, scenario, result, paused, reducedMotion, sceneVisible, pageVisible, renderError]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (phase !== 'idle') reset();
        else window.location.assign(base);
        return;
      }
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
  }, [phase]);

  const dialogue = phaseDialogue(phase, scenario, result);
  const nextAction: ActionId = scenario?.id === 'export' ? 'inspect' : 'export';
  const gateStatus = phase === 'allow' || (phase === 'audit' && result?.decision === 'ALLOW') ? 'open'
    : phase === 'deny' || (phase === 'audit' && result?.decision === 'DENY') ? 'locked' : 'standing by';

  return (
    <main className={styles.outpost}>
      <header className={styles.header}>
        <a className={styles.exit} href={base}>← Brandon Hann</a>
        <span className={styles.worldLabel}>The Signal Outpost <span aria-hidden="true">/</span> guided simulation</span>
        <nav aria-label="Professional navigation"><a href={`${base}#projects`}>Projects</a><a href={`${base}resume.html`}>Résumé</a><a href={`${base}?experience=guardian`}>Guardian</a></nav>
      </header>

      <section className={styles.stage} aria-labelledby="outpost-heading" data-phase={phase}>
        <div className={styles.scene} ref={host} data-render-status={renderError ? 'fallback' : 'active'}>
          {renderError && <div className={styles.fallback} role="status"><strong>The scene is unavailable.</strong><span>The guided request sequence still works below.</span></div>}
          {(['scout', 'sentinel', 'audit'] as const).map((actor) => (
            <p key={actor} data-bubble={actor} data-visible={dialogue?.actor === actor} className={styles.bubble}>
              <strong>{actor === 'scout' ? 'Scout' : actor === 'sentinel' ? 'Sentinel' : 'Audit'}</strong>
              <span>{dialogue?.actor === actor ? dialogue.text : ''}</span>
            </p>
          ))}
        </div>
        <div className={styles.sceneTitle}>
          <p>SecureAgent Lab / illustrative simulation</p>
          <h1 id="outpost-heading">Every request<br />meets a rule.</h1>
          <p>Scout delivers. Sentinel checks. The gate tells the story.</p>
        </div>
        <div className={styles.gateLabel} aria-hidden="true"><span className={styles.gateDot} data-state={gateStatus} /> Trust gate / {gateStatus}</div>
        <div className={styles.actionRail} aria-label="Outpost controls">
          <p>{renderError ? 'Scene unavailable; use the sample request controls.' : phase === 'idle' ? 'Tap the glowing packet or choose a sample request.' : `${scenario?.label ?? 'Request'} · ${phase}${paused ? ' · paused' : ''}`}</p>
          <div>
            <button type="button" className={styles.primaryAction} onClick={() => begin(scenario?.id ?? 'inspect')} disabled={phase !== 'idle'}>Replay {scenario?.id === 'export' ? 'protected export' : 'read-only'}</button>
            <button type="button" onClick={() => begin(nextAction)} disabled={phase !== 'idle'}>Try {nextAction === 'export' ? 'protected export' : 'read-only request'}</button>
            <button type="button" onClick={() => setPaused((value) => !value)} disabled={phase === 'idle'}>{paused ? 'Resume' : 'Pause'}</button>
            <button type="button" onClick={reset} disabled={phase === 'idle'}>Reset</button>
            <button type="button" onClick={() => setProgress((value) => value === 0 ? 1 : 0)}>{progress === 0 ? 'Look closer' : 'Overview'}</button>
          </div>
        </div>
      </section>

      <section className={styles.summary} aria-label="Accessible event summary">
        <details>
          <summary>What happened at the checkpoint</summary>
          <p>Scout carries a synthetic request. Sentinel evaluates a fixed read-only training policy before any simulated execution. Only an allowed request crosses the gate.</p>
          <p>Current step: <strong>{phase}</strong>. {scenario ? `Request: ${scenario.label}.` : 'No request is active.'}</p>
          {result && <p>Policy: <strong>{result.decision}</strong> — {result.reason} Audit: {result.auditRecord.scenarioId} / {result.auditRecord.action} / {result.auditRecord.executionStatus}. No external tool ran.</p>}
        </details>
        <p className={styles.auditAnnouncement} aria-live={runSource === 'user' ? 'polite' : 'off'}>{phase === 'audit' && result ? `${result.decision}. ${result.reason} ${result.simulatedExecutionStatus === 'SIMULATED' ? 'Read simulated and audited.' : 'Execution blocked and audited.'}` : ''}</p>
      </section>
      <footer className={styles.footer}><p>{secureAgent.summary} {secureAgent.scope} This is a guided simulation with fixed rules, not an autonomous agent or public demo.</p><a href={`${base}#project-secureagent`}>Read the project overview ↗</a></footer>
    </main>
  );
}
