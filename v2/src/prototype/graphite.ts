export type NormalizedPoint = readonly [number, number];

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

// Draw the approved portrait as a paper-and-graphite impression. The marks follow
// the photo's luminance; their variation is deterministic and contains no sprite.
export function paintGraphite(canvas: HTMLCanvasElement, image: HTMLImageElement): boolean {
  const context = canvas.getContext('2d');
  if (!context) return false;
  const width = canvas.width;
  const height = canvas.height;
  const source = document.createElement('canvas');
  source.width = width;
  source.height = height;
  const sampling = source.getContext('2d', { willReadFrequently: true });
  if (!sampling) return false;
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const renderedWidth = image.naturalWidth * scale;
  const renderedHeight = image.naturalHeight * scale;
  sampling.drawImage(image, (width - renderedWidth) / 2, (height - renderedHeight) * .35, renderedWidth, renderedHeight);
  const pixels = sampling.getImageData(0, 0, width, height).data;

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#eee6d3';
  context.fillRect(0, 0, width, height);
  const step = Math.max(4, Math.round(width / 105));
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const offset = (Math.min(height - 1, y) * width + Math.min(width - 1, x)) * 4;
      const light = (pixels[offset] * .23 + pixels[offset + 1] * .67 + pixels[offset + 2] * .1) / 255;
      const density = 1 - light;
      if (hash(x, y) > density * 1.28) continue;
      context.fillStyle = density > .63 ? '#27332f' : density > .38 ? '#67716b' : '#a8aa9e';
      const size = Math.max(1, step * (.16 + density * .42));
      context.save();
      context.translate(x + step / 2, y + step / 2);
      context.rotate(-.35);
      context.fillRect(-size / 2, -size / 2, size, size * 1.7);
      context.restore();
    }
  }
  return true;
}

export function eraseGraphite(canvas: HTMLCanvasElement, from: NormalizedPoint, to: NormalizedPoint): void {
  const context = canvas.getContext('2d');
  if (!context) return;
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = Math.max(32, canvas.width * .17);
  context.beginPath();
  context.moveTo(from[0] * canvas.width, from[1] * canvas.height);
  context.lineTo(to[0] * canvas.width, to[1] * canvas.height);
  context.stroke();
  context.restore();
}
