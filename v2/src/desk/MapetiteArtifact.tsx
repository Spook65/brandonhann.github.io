import { projects } from '../data/projects';
import styles from './DeskScene.module.css';

const project = (() => {
  const found = projects.find((item) => item.id === 'project-mapetite');
  if (!found) throw new Error('Mapetite facts are required for the desk prototype.');
  return found;
})();
const demo = (() => {
  const found = project.links.find((link) => link.label === 'Live demo');
  if (!found) throw new Error('Mapetite live demo link is required for the desk prototype.');
  return found;
})();

export function MapetiteArtifact({ expanded }: { readonly expanded: boolean }) {
  return (
    <div className={styles.artifact}>
      <div className={styles.artifactBar}><span className={styles.fileDots} aria-hidden="true"><i /><i /><i /></span><span>PUBLIC PROJECT NOTE / README.MD</span><span>01</span></div>
      <div className={styles.artifactTeaser} aria-hidden={expanded}>
        <span className={styles.artifactPath}>~/projects/mapetite</span>
        <strong>{project.name}<span>.</span></strong>
        <small>Restaurant discovery · portfolio MVP</small>
        <p>What happens when place data is uncertain?</p>
      </div>
      <div className={styles.artifactDetail} aria-hidden={!expanded} inert={!expanded}>
        <span className={styles.artifactPath}>~/projects/mapetite / source note</span>
        <h2 tabIndex={-1} id="desk-project-heading">{project.name}<span>.</span></h2>
        <p className={styles.projectStatus}>{project.status}</p>
        <p className={styles.projectSummary}>{project.summary}</p>
        <blockquote>“Show missing or uncertain public data honestly instead of filling gaps with fake claims.”</blockquote>
        <p className={styles.artifactSource}>From Brandon’s public README. This is the project’s stated product promise, not a software screenshot.</p>
        <div className={styles.artifactLinks}>
          <a href="https://github.com/Spook65/Mapetite/blob/main/README.md" target="_blank" rel="noopener noreferrer">Read the README ↗</a>
          <a href={demo.href} target="_blank" rel="noopener noreferrer">Open live MVP ↗</a>
        </div>
      </div>
    </div>
  );
}
