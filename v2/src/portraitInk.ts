export type PortraitPoint = readonly [number, number];

function coverImage(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = image.naturalWidth * scale;
  const sourceHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - sourceWidth) / 2, (height - sourceHeight) * .32, sourceWidth, sourceHeight);
}

/** A monochrome photographic overprint, sampled from Brandon's approved photo. */
export function paintPortraitInk(canvas: HTMLCanvasElement, image: HTMLImageElement): boolean {
  const context = canvas.getContext('2d');
  if (!context || !image.naturalWidth || !image.naturalHeight) return false;
  const width = canvas.width;
  const height = canvas.height;
  context.save();
  context.clearRect(0, 0, width, height);
  context.filter = 'grayscale(1) contrast(1.45) brightness(.94)';
  coverImage(context, image, width, height);
  context.filter = 'none';
  context.globalCompositeOperation = 'source-atop';
  context.fillStyle = 'rgba(28, 39, 67, .16)';
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = 'source-over';
  context.strokeStyle = 'rgba(2, 8, 20, .13)';
  context.lineWidth = Math.max(1, width / 420);
  const gap = Math.max(8, Math.round(width / 65));
  for (let offset = -height; offset < width + height; offset += gap) {
    context.beginPath();
    context.moveTo(offset, 0);
    context.lineTo(offset + height * .48, height);
    context.stroke();
  }
  context.restore();
  canvas.dataset.inkPaints = String(Number(canvas.dataset.inkPaints || 0) + 1);
  return true;
}

/** Erase the overprint locally; the color image remains semantic HTML underneath. */
export function erasePortraitInk(canvas: HTMLCanvasElement, from: PortraitPoint, to: PortraitPoint): void {
  const context = canvas.getContext('2d');
  if (!context) return;
  const scale = Math.min(canvas.width, canvas.height);
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  for (const [size, opacity] of [[.20, .18], [.15, .32], [.105, 1]] as const) {
    context.globalAlpha = opacity;
    context.lineWidth = Math.max(28, scale * size);
    context.beginPath();
    context.moveTo(from[0] * canvas.width, from[1] * canvas.height);
    context.lineTo(to[0] * canvas.width, to[1] * canvas.height);
    context.stroke();
  }
  context.restore();
  canvas.dataset.strokes = String(Number(canvas.dataset.strokes || 0) + 1);
}
