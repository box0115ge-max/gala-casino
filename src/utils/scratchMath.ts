export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

interface LinearTransform {
  a: number;
  b: number;
  c: number;
  d: number;
}

const CORNER_RADIUS_X = 0.077;
const CORNER_RADIUS_Y = 0.102;

export function getLinearTransform(element: HTMLElement): LinearTransform {
  let transform = { a: 1, b: 0, c: 0, d: 1 };

  // The canvas is inside the slightly tilted card. Translation and transform
  // origins are already reflected in the center of its bounding rectangle.
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const cssTransform = getComputedStyle(node).transform;
    if (cssTransform === 'none') continue;

    const next = new DOMMatrixReadOnly(cssTransform);
    const { a, b, c, d } = transform;
    transform = {
      a: next.a * a + next.c * b,
      b: next.b * a + next.d * b,
      c: next.a * c + next.c * d,
      d: next.b * c + next.d * d,
    };
  }

  return transform;
}

export function toCanvasPoint(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  { width, height }: Size,
  { a, b, c, d }: LinearTransform,
): Point {
  const x = clientX - rect.left - rect.width / 2;
  const y = clientY - rect.top - rect.height / 2;
  const determinant = a * d - b * c;
  const localX = (d * x - c * y) / determinant;
  const localY = (-b * x + a * y) / determinant;
  return { x: localX / width + 0.5, y: localY / height + 0.5 };
}

export function getBrushDiameter(width: number, pointerType: string): number {
  return pointerType === 'touch'
    ? Math.min(54, Math.max(40, width * 0.21))
    : Math.min(45, Math.max(35, width * 0.15));
}

export function getValidSampleIndices({ width, height }: Size): number[] {
  const validIndices: number[] = [];

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const x = (col + 0.5) / width;
      const y = (row + 0.5) / height;
      const dx = Math.max(0, CORNER_RADIUS_X - x, x - (1 - CORNER_RADIUS_X));
      const dy = Math.max(0, CORNER_RADIUS_Y - y, y - (1 - CORNER_RADIUS_Y));
      if ((dx / CORNER_RADIUS_X) ** 2 + (dy / CORNER_RADIUS_Y) ** 2 <= 1) {
        validIndices.push((row * width + col) * 4 + 3);
      }
    }
  }

  return validIndices;
}

export function erasedFraction(pixels: Uint8ClampedArray, indices: number[]): number {
  let erased = 0;
  for (const index of indices) {
    erased += 255 - pixels[index];
  }
  return erased / (indices.length * 255);
}
