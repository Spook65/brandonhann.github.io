import { useState, type RefObject, type TransitionEvent } from 'react';
import { profile } from '../data/domain';
import { GraphitePortrait } from '../prototype/GraphitePortrait';
import { MapetiteArtifact } from './MapetiteArtifact';
import type { DeskSceneState } from './sceneState';
import styles from './DeskScene.module.css';

interface DeskSceneProps {
  readonly state: DeskSceneState;
  readonly onOpen: () => void;
  readonly onClose: () => void;
  readonly onTransitionComplete: () => void;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

export function DeskScene({ state, onOpen, onClose, onTransitionComplete, triggerRef }: DeskSceneProps) {
  const [portraitState, setPortraitState] = useState<'unrevealed' | 'revealed'>('unrevealed');
  const [noteState, setNoteState] = useState<'folded' | 'open'>('folded');
  const expanded = state === 'focusing' || state === 'investigating';
  const handleTransition = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === 'left') onTransitionComplete();
  };

  return (
    <section className={styles.room} data-scene={state} data-portrait={portraitState} aria-label="The Builder's Desk interactive scene">
      <div className={styles.wall} aria-hidden="true"><div className={styles.wallSeam} /><div className={styles.pegboard} /><div className={styles.lightPool} /></div>
      <div className={styles.backShelf} aria-hidden="true"><span className={styles.bookOne} /><span className={styles.bookTwo} /><span className={styles.bookThree} /><span className={styles.shelfPlant} /></div>

      <div className={styles.portraitObject}>
        <div className={styles.pin} aria-hidden="true" />
        <div className={styles.portraitFrame}>
          <GraphitePortrait src={`${import.meta.env.BASE_URL}brandon-about.jpg`} onDiscover={() => setPortraitState('revealed')} />
          <div className={styles.portraitLabel}><span>Brandon / outside the editor</span><span>01</span></div>
        </div>
        <p className={styles.portraitHint}>{portraitState === 'revealed' ? 'A real person behind the prototypes.' : 'Rub the print to find the person.'}</p>
      </div>

      <div className={styles.monitor} onTransitionEnd={handleTransition}>
        <div className={styles.monitorShell}>
          <MapetiteArtifact expanded={expanded} />
          <button ref={triggerRef} type="button" className={styles.monitorTrigger} aria-label="Move closer to the Mapetite project note" onClick={onOpen} hidden={expanded}>
            <span className={styles.monitorPrompt}>LOOK CLOSER <b>↗</b></span>
          </button>
          <button type="button" className={styles.monitorReturn} onClick={onClose} hidden={!expanded}>← Back to the desk</button>
        </div>
        <div className={styles.monitorNeck} aria-hidden="true" />
        <div className={styles.monitorFoot} aria-hidden="true" />
      </div>

      <div className={styles.table} aria-hidden="true"><div className={styles.tableEdge} /><div className={styles.keyboard}><span /><span /><span /><span /><span /><span /></div><div className={styles.mug}><i /></div><div className={styles.pencil} /></div>

      <div className={styles.noteObject} data-note={noteState}>
        <button type="button" aria-expanded={noteState === 'open'} aria-label={noteState === 'open' ? 'Fold the desk note' : 'Lift the folded desk note'} onClick={() => setNoteState((current) => current === 'folded' ? 'open' : 'folded')}>
          <span className={styles.noteFold} aria-hidden="true" />
          <span className={styles.noteText}>{noteState === 'open' ? profile.intro : '· · ·'}</span>
        </button>
      </div>

      <div className={styles.sceneCaption}><span>THE BUILDER’S DESK</span><span>{expanded ? 'MAPETITE / IN FOCUS' : 'PORTRAIT · PROJECT NOTE · ONE SMALL SECRET'}</span></div>
      <p className={styles.sceneStatus} aria-live="polite">{expanded ? 'Mapetite project note in focus.' : portraitState === 'revealed' ? 'Brandon’s portrait revealed. Mapetite note ready to inspect.' : 'Desk ready. Portrait and Mapetite note can be explored.'}</p>
    </section>
  );
}
