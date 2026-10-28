import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { eraseGraphite, paintGraphite, type NormalizedPoint } from './graphite';
import styles from './LivingLogbook.module.css';

interface GraphitePortraitProps {
  readonly src: string;
  readonly onDiscover: () => void;
}

export function GraphitePortrait({ src, onDiscover }: GraphitePortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const marksRef = useRef<[NormalizedPoint, NormalizedPoint][]>([]);
  const lastPointRef = useRef<NormalizedPoint | null>(null);
  const discoveredRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    let disposed = false;
    const render = () => {
      if (!image.complete || !image.naturalWidth || disposed) return;
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(box.width * dpr));
      canvas.height = Math.max(1, Math.round(box.height * dpr));
      if (!paintGraphite(canvas, image)) { setFailed(true); return; }
      canvas.dataset.paints = String(Number(canvas.dataset.paints || 0) + 1);
      for (const [from, to] of marksRef.current) eraseGraphite(canvas, from, to);
      setReady(true);
    };
    const onImageError = () => { setImageFailed(true); setFailed(true); };
    const observer = new ResizeObserver(render);
    observer.observe(canvas);
    image.addEventListener('load', render);
    image.addEventListener('error', onImageError);
    render();
    return () => {
      disposed = true;
      observer.disconnect();
      image.removeEventListener('load', render);
      image.removeEventListener('error', onImageError);
    };
  }, [src]);

  const point = (event: ReactPointerEvent<HTMLButtonElement>): NormalizedPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))];
  };
  const reveal = (from: NormalizedPoint, to: NormalizedPoint) => {
    const canvas = canvasRef.current;
    if (!canvas || failed || !ready) return;
    marksRef.current.push([from, to]);
    if (marksRef.current.length > 1200) marksRef.current.shift();
    eraseGraphite(canvas, from, to);
    if (!discoveredRef.current) { discoveredRef.current = true; onDiscover(); }
  };
  const onMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'mouse' || event.buttons !== 0) return;
    const next = point(event);
    reveal(lastPointRef.current ?? next, next);
    lastPointRef.current = next;
  };
  const onDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') return;
    const next = point(event);
    reveal(next, next);
  };

  return (
    <button
      type="button"
      className={styles.photoButton}
      aria-label="Develop Brandon's portrait. Move the pointer, tap, or press Enter to reveal color."
      onPointerMove={onMove}
      onPointerLeave={() => { lastPointRef.current = null; }}
      onPointerDown={onDown}
      onClick={(event) => {
        if (event.detail !== 0) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        marksRef.current = [[[0, 0], [1, 1]]];
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        if (!discoveredRef.current) { discoveredRef.current = true; onDiscover(); }
      }}
    >
      <img ref={imageRef} src={src} alt="Brandon Hann in a casual portrait" draggable={false} onError={() => { setImageFailed(true); setFailed(true); }} />
      {!failed && <canvas ref={canvasRef} className={styles.graphite} aria-hidden="true" data-ready={ready} />}
      {failed && <span className={styles.photoFailure}>{imageFailed ? 'Brandon’s portrait is temporarily unavailable.' : 'Portrait effect unavailable. The approved photo remains visible.'}</span>}
    </button>
  );
}
