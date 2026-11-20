import type { CSSProperties } from 'react';

export const design = { width: 1080, height: 1920 };

export type Bounds = readonly [x: number, y: number, width: number, height: number];

export const artwork = {
  background: [0, 0, 1080, 1920],
  ambient: [0, 704, 1080, 1216],
  crownLight: [277, 0, 526, 359],
  crown: [449, 52, 181, 101],
  logo: [416, 184, 248, 100],
  heading: [225, 825, 628, 203],
  roulette: [748, 827, 719, 719],
  scratchGlow: [0, 908, 1080, 1012],
  scratch: [211.9, 1172.05, 663.225, 663.225],
  ring: [107.375, 1067.525, 873.2, 873.2],
  titleShadow: [166, 196, 749, 750],
  title: [126, 294, 830, 446],
  nightGlow: [459, 435, 383, 383],
  ribbon: [115, 728, 856, 143],
} as const satisfies Record<string, Bounds>;

// The Illustrator artboard already clips some silhouettes at the edges.
export const casinoProps = [
  { name: 'die-left', bounds: [0, 901, 104, 148], edge: true },
  { name: 'chip-upper-left', bounds: [54, 1067, 156, 130], edge: false },
  { name: 'card-and-chip-left', bounds: [0, 1351, 211, 341], edge: true },
  { name: 'chip-right', bounds: [879, 1424, 179, 194], edge: false },
  { name: 'cards-right', bounds: [741, 1626, 339, 294], edge: true },
  { name: 'card-and-chip-bottom', bounds: [0, 1674, 308, 246], edge: true },
] as const satisfies readonly { name: string; bounds: Bounds; edge: boolean }[];

export function place([x, y, width, height]: Bounds): CSSProperties {
  return {
    left: `${x / design.width * 100}%`,
    top: `${y / design.height * 100}%`,
    width: `${width / design.width * 100}%`,
    height: `${height / design.height * 100}%`,
  };
}
