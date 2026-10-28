import { useState } from 'react';
import { projects } from '../data/projects';
import { GraphitePortrait } from './GraphitePortrait';
import styles from './LivingLogbook.module.css';

const mapetite = (() => {
  const project = projects.find((item) => item.id === 'project-mapetite');
  if (!project) throw new Error('Mapetite project facts are required for the logbook prototype.');
  return project;
})();

const sourceUrl = 'https://github.com/Spook65/Mapetite/blob/main/README.md';
const demo = (() => {
  const link = mapetite.links.find((item) => item.label === 'Live demo');
  if (!link) throw new Error('Mapetite live demo link is required for the logbook prototype.');
  return link;
})();

export function LivingLogbook() {
  const [view, setView] = useState<'portrait' | 'project'>('portrait');
  const [discovered, setDiscovered] = useState(false);

  return (
    <main className={styles.page}>
      <div className={styles.deskGrain} aria-hidden="true" />
      <header className={styles.header}>
        <span className={styles.brand}>bh<span>.</span></span>
        <span className={styles.prototypeFlag}>Visual prototype / W.3</span>
        <a href={import.meta.env.BASE_URL}>Current portfolio ↗</a>
      </header>

      <div className={styles.intro}>
        <p className={styles.kicker}>FIELD NOTE 001 / OPEN ON THE DESK</p>
        <h1>The Living <em>Logbook.</em></h1>
        <p>Some projects start with a question. This one starts with the person asking it.</p>
      </div>

      <section className={styles.scene} aria-label="Interactive logbook prototype" data-view={view} data-discovered={discovered}>
        <div className={styles.bookSpine} aria-hidden="true" />
        <div className={styles.pageNumber} aria-hidden="true">BH / 01</div>
        <div className={styles.portraitLeaf} aria-hidden={view === 'project'} inert={view === 'project'}>
          <div className={styles.paperClip} aria-hidden="true" />
          <div className={styles.photoMount}>
            <GraphitePortrait src={`${import.meta.env.BASE_URL}brandon-about.jpg`} onDiscover={() => setDiscovered(true)} />
            <div className={styles.photoCaption}><span>Brandon, outside the editor</span><span>01 / FOUND</span></div>
          </div>
          <div className={styles.marginNote}>
            <span className={styles.scribble} aria-hidden="true">↗</span>
            <p className={styles.noteLabel}>A portrait in graphite</p>
            <p>Move across the print to bring Brandon into color. Tap on a phone; press Enter when focused.</p>
            <p className={styles.noteAppears}>{discovered ? 'There’s a real project note tucked underneath.' : 'Look closer. The print responds to you.'}</p>
          </div>
          <div className={styles.threadLine} aria-hidden="true" />
          <button className={styles.projectTab} type="button" onClick={() => setView('project')}>
            <span>Follow this thread</span><strong>{mapetite.name} ↗</strong>
          </button>
        </div>

        <article className={styles.projectLeaf} aria-hidden={view !== 'project'} inert={view !== 'project'}>
          <div className={styles.projectHeader}>
            <span>FIELD NOTE 002 / FROM THE PUBLIC README</span>
            <span>PROJECT FOUND ↗</span>
          </div>
          <div className={styles.projectBody}>
            <div className={styles.projectMark} aria-hidden="true"><span>m</span><i /></div>
            <div>
              <p className={styles.kicker}>WHY THIS ONE MATTERS</p>
              <h2>{mapetite.name}<span>.</span></h2>
              <p className={styles.projectSummary}>{mapetite.summary}</p>
              <blockquote>“Show missing or uncertain public data honestly instead of filling gaps with fake claims.”</blockquote>
              <p className={styles.sourceLine}>A real line from Brandon’s public project README. It shows the product judgment behind the interface.</p>
              <div className={styles.projectLinks}>
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Read the source note ↗</a>
                <a href={demo.href} target="_blank" rel="noopener noreferrer">Visit the live MVP ↗</a>
              </div>
            </div>
          </div>
          <button className={styles.returnButton} type="button" onClick={() => setView('portrait')}>← Close this page</button>
        </article>
      </section>
      <p className={styles.footnote} aria-live="polite">{view === 'project' ? 'Mapetite project note open.' : discovered ? 'Portrait developed. A Mapetite note is tucked underneath.' : 'Portrait ready to develop.'}</p>
    </main>
  );
}
