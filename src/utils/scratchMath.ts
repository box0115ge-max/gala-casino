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
