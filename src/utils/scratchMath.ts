export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export function isInsideScratchCircle(x: number, y: number): boolean {
  return (x - 0.5) ** 2 + (y - 0.5) ** 2 <= 0.25;
}

export function toCanvasPoint(clientX: number, clientY: number, rect: DOMRect): Point {
  return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
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
      if (isInsideScratchCircle(x, y)) {
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
