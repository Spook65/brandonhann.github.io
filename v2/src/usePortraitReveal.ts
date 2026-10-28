import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { erasePortraitInk, paintPortraitInk, type PortraitPoint } from './portraitInk';

interface RevealController {
  readonly canvasRef: RefObject<HTMLCanvasElement | null>;
  readonly imageRef: RefObject<HTMLImageElement | null>;
  readonly surfaceRef: RefObject<HTMLDivElement | null>;
  readonly ready: boolean;
  readonly failed: boolean;
  readonly imageFailed: boolean;
  readonly discovered: boolean;
  readonly onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  readonly onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  readonly onPointerLeave: () => void;
  readonly onImageError: () => void;
  readonly revealAll: () => void;
  readonly reset: () => void;
}

export function usePortraitReveal(): RevealController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const marksRef = useRef<[PortraitPoint, PortraitPoint][]>([]);
  const coverageRef = useRef(new Set<number>());
  const fullRevealRef = useRef(false);
  const discoveredRef = useRef(false);
  const lastRef = useRef<PortraitPoint | null>(null);
  const reducedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    let disposed = false;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedRef.current = motion.matches;
    const onMotion = () => { reducedRef.current = motion.matches; };
    motion.addEventListener('change', onMotion);
    const draw = () => {
      if (disposed || !image.complete || !image.naturalWidth) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(bounds.width * dpr);
      canvas.height = Math.round(bounds.height * dpr);
      if (!paintPortraitInk(canvas, image)) { setFailed(true); return; }
      if (fullRevealRef.current) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      for (const [from, to] of marksRef.current) erasePortraitInk(canvas, from, to);
      setReady(true);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    image.addEventListener('load', draw);
    draw();
    return () => {
      disposed = true;
      observer.disconnect();
      image.removeEventListener('load', draw);
      motion.removeEventListener('change', onMotion);
    };
  }, []);

  const point = (event: ReactPointerEvent<HTMLDivElement>): PortraitPoint => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return [Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)), Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))];
  };
  const mark = (from: PortraitPoint, to: PortraitPoint) => {
    const canvas = canvasRef.current;
    if (!canvas || !ready || failed) return;
    marksRef.current.push([from, to]);
    if (marksRef.current.length > 800) marksRef.current.shift();
    erasePortraitInk(canvas, from, to);
    const cellX = Math.min(11, Math.floor(to[0] * 12));
    const cellY = Math.min(13, Math.floor(to[1] * 14));
    for (let y = Math.max(0, cellY - 1); y <= Math.min(13, cellY + 1); y++) {
      for (let x = Math.max(0, cellX - 1); x <= Math.min(11, cellX + 1); x++) coverageRef.current.add(y * 12 + x);
    }
    if (!discoveredRef.current && coverageRef.current.size >= 28) {
      discoveredRef.current = true;
      setDiscovered(true);
    }
  };
  const moveHalo = (event: ReactPointerEvent<HTMLDivElement>) => {
    const surface = surfaceRef.current;
    if (!surface || event.pointerType === 'touch') return;
    const bounds = surface.getBoundingClientRect();
    surface.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    surface.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    surface.dataset.pointing = 'true';
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    moveHalo(event);
    if (reducedRef.current || (event.pointerType === 'touch' && event.buttons === 0)) return;
    const next = point(event);
    mark(lastRef.current ?? next, next);
    lastRef.current = next;
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedRef.current) return;
    const next = point(event);
    mark(next, next);
    lastRef.current = next;
  };
  const onPointerLeave = () => {
    lastRef.current = null;
    if (surfaceRef.current) surfaceRef.current.dataset.pointing = 'false';
  };
  const revealAll = () => {
    const canvas = canvasRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    fullRevealRef.current = true;
    marksRef.current = [];
    discoveredRef.current = true;
    setDiscovered(true);
  };
  const reset = () => {
    fullRevealRef.current = false;
    discoveredRef.current = false;
    marksRef.current = [];
    coverageRef.current.clear();
    lastRef.current = null;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (canvas && image && image.naturalWidth) paintPortraitInk(canvas, image);
    setDiscovered(false);
  };
  return { canvasRef, imageRef, surfaceRef, ready, failed, imageFailed, discovered, onPointerMove, onPointerDown, onPointerLeave, onImageError: () => { setImageFailed(true); setFailed(true); }, revealAll, reset };
}
