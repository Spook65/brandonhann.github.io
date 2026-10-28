import { usePortraitReveal } from './usePortraitReveal';
import styles from './IdentityPortrait.module.css';

export function IdentityPortrait({ src }: { readonly src: string }) {
  const reveal = usePortraitReveal();
  return (
    <div className={styles.identity} data-discovered={reveal.discovered} data-fallback={reveal.failed}>
      <div className={styles.imageField} ref={reveal.surfaceRef} onPointerMove={reveal.onPointerMove} onPointerDown={reveal.onPointerDown} onPointerLeave={reveal.onPointerLeave}>
        <img ref={reveal.imageRef} src={src} alt="Brandon Hann in a casual portrait" draggable={false} onError={reveal.onImageError} />
        {!reveal.failed && <canvas ref={reveal.canvasRef} aria-hidden="true" data-ready={reveal.ready} />}
        {reveal.imageFailed && <span className={styles.imageFailure}>Brandon’s portrait is temporarily unavailable.</span>}
        <div className={styles.halo} aria-hidden="true" />
        <span className={styles.edgeLabel} aria-hidden="true">BH / IN PERSON</span>
        <p className={styles.annotation} aria-live="polite" inert={!reveal.discovered} aria-hidden={!reveal.discovered} data-visible={reveal.discovered}>There’s a person behind the code. <a href="#projects">Explore what I’m building ↗</a></p>
      </div>
      <div className={styles.controls}>
        <span className={styles.cue}>{reveal.imageFailed ? 'Portrait unavailable' : reveal.failed ? 'Portrait effect unavailable' : 'Move or tap the photo to find the color'}</span>
        <div className={styles.buttons}>
          <button type="button" onClick={reveal.revealAll}>Reveal photo</button>
          <button type="button" onClick={reveal.reset}>Reset</button>
        </div>
      </div>
    </div>
  );
}
