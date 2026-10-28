import { useEffect, useRef, useState } from 'react';
import { advanceCells, createCells, drawVisual, visualSpecs, type VisualProjectId } from './visualModel';
import styles from './ProjectVisual.module.css';

export function ProjectVisual({ projectId, hero = false }: { projectId: VisualProjectId; hero?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const spec = visualSpecs[projectId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) { setFailed(true); return; }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cells = createCells(spec, 1, 1);
    let width = 1;
    let height = 1;
    let frame = 0;
    let pointer: readonly [number, number] | null = null;
    let visible = false;
    let disposed = false;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawVisual(context, cells, spec, width, height);
      canvas.dataset.frames = String(Number(canvas.dataset.frames || 0) + 1);
    };
    const tick = () => {
      frame = 0;
      if (disposed || !visible || document.hidden || motion.matches) return;
      const moving = advanceCells(cells, pointer);
      pointer = null;
      paint();
      if (moving) frame = window.requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!frame && visible && !document.hidden && !motion.matches) frame = window.requestAnimationFrame(tick);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      cells = createCells(spec, width, height);
      paint();
    };
    const point = (event: PointerEvent): readonly [number, number] => {
      const rect = canvas.getBoundingClientRect();
      return [event.clientX - rect.left, event.clientY - rect.top];
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || motion.matches) return;
      pointer = point(event);
      wake();
    };
    const onLeave = () => { pointer = null; wake(); };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || motion.matches) return;
      pointer = point(event);
      wake();
    };
    const onVisibility = () => {
      if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; }
      else wake();
    };
    const onMotion = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      for (const cell of cells) { cell.dx = 0; cell.dy = 0; cell.vx = 0; cell.vy = 0; }
      paint();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else { window.cancelAnimationFrame(frame); frame = 0; pointer = null; }
    });
    const resizer = new ResizeObserver(resize);
    observer.observe(canvas);
    resizer.observe(canvas);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onMotion);
    resize();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizer.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onMotion);
    };
  }, [spec]);

  return (
    <div className={`${styles.visual} ${hero ? styles.hero : ''}`} data-visual-project={projectId}>
      <div className={styles.topline}><span>BH / WORKBENCH</span><span>ILLUSTRATIVE STUDY</span></div>
      {failed ? <div className={styles.fallback} role="img" aria-label={`${spec.label}: ${spec.detail} illustrative study`}><strong>{spec.label}</strong><span>{spec.detail}</span></div> : <canvas ref={canvasRef} aria-hidden="true" />}
      <div className={styles.bottomline}><strong>{spec.label}</strong><span>{spec.detail}</span></div>
    </div>
  );
}
