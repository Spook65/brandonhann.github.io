import styles from './Patch.module.css';

export type PatchPose = 'idle' | 'wave' | 'inspect';

export function Patch({ pose, onActivate }: { pose: PatchPose; onActivate: () => void }) {
  return (
    <button className={styles.patch} type="button" onClick={onActivate} aria-label="Wave to Patch, Brandon’s tiny companion" data-pose={pose}>
      <svg viewBox="0 0 28 28" role="img" aria-label={`Patch ${pose === 'idle' ? 'resting' : pose === 'wave' ? 'waving' : 'inspecting a project'}`} shapeRendering="crispEdges">
        <g fill="#172b29">
          <path d="M8 2h2v5H8zM18 4h2v4h-2zM5 7h17v2H5zM4 9h2v13H4zM22 9h2v13h-2zM6 21h16v2H6zM8 23h3v3H7v-2h1zM17 23h3v3h-4v-2h1z" />
        </g>
        <path fill="#8bd0c0" d="M7 1h2v2H7zM19 3h2v2h-2z" />
        <path fill="#e5a958" d="M6 9h16v12H6z" />
        <path fill="#f4c781" d="M8 9h12v3H8z" />
        <path fill="#172b29" d="M9 13h3v3H9zM17 13h3v3h-3z" />
        <path fill="#8bd0c0" d="M10 13h1v1h-1zM18 13h1v1h-1z" />
        <path fill="#f4eddd" d="M12 17h5v3h-5z" />
        <path fill="#8bd0c0" d="M16 17h1v1h-1z" />
        <path className={styles.leftArm} fill="#172b29" d={pose === 'wave' ? 'M3 7h2v2H3zM2 5h2v3H2z' : 'M2 12h3v6H2z'} />
        <path fill="#172b29" d="M23 13h3v6h-3z" />
        {pose === 'inspect' && <g aria-hidden="true"><path fill="#172b29" d="M20 11h6v2h-6zM25 13h2v2h-2zM24 15h2v2h-2z" /><path fill="#8bd0c0" d="M21 12h4v3h-4z" /></g>}
      </svg>
      <span>Patch says hi.</span>
    </button>
  );
}
