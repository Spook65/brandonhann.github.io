import { useEffect, useRef } from 'react';
import { DeskScene } from './DeskScene';
import { useDeskScene } from './useDeskScene';
import styles from './DeskScene.module.css';

export function DeskExperience() {
  const scene = useDeskScene();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (scene.state === 'investigating') document.getElementById('desk-project-heading')?.focus({ preventScroll: true });
    if (scene.state === 'desk' && scene.returnedRef.current) {
      scene.returnedRef.current = false;
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [scene.state, scene.returnedRef]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href={import.meta.env.BASE_URL} aria-label="Brandon Hann portfolio home">bh<span>.</span></a>
        <div className={styles.headerCenter}>W.4 / VISUAL PROTOTYPE</div>
        <nav aria-label="Professional navigation"><a href={`${import.meta.env.BASE_URL}#projects`}>Projects</a><a href={`${import.meta.env.BASE_URL}resume.html`}>Résumé</a></nav>
      </header>
      <div className={styles.intro}><span>ONE ROOM / ONE REAL PROJECT</span><h1>The Builder’s <em>Desk.</em></h1><p>Come closer. There’s more here than the first glance.</p></div>
      <DeskScene state={scene.state} onOpen={scene.openProject} onClose={scene.closeProject} onTransitionComplete={scene.completeTransition} triggerRef={triggerRef} />
      <p className={styles.footerNote}>An isolated study of one small, explorable workspace. Portrait and project facts are real; the room is illustrative.</p>
    </main>
  );
}
