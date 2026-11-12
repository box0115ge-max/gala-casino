import type { CSSProperties } from 'react';

export const design = { width: 1086, height: 1448 };

export type Bounds = readonly [x: number, y: number, width: number, height: number];

export const artwork = {
  crown: [499, 13, 85, 54],
  logo: [377, 68, 326, 133],
  gala: [417, 200, 285, 144],
  casino: [208, 272, 662, 207],
  ribbon: [176, 437, 720, 135],
  suits: [307, 538, 470, 53],
  heading: [214, 592, 655, 162],
  cards: [21, 662, 377, 326],
  chips: [20, 908, 294, 301],
  dice: [46, 1082, 305, 244],
  roulette: [758, 515, 328, 596],
  scratch: [297.6, 783.4, 578, 450],
  partners: [138, 1298, 842, 49.85],
} as const satisfies Record<string, Bounds>;

export function place([x, y, width, height]: Bounds): CSSProperties {
  return {
    left: `${x / design.width * 100}%`,
    top: `${y / design.height * 100}%`,
    width: `${width / design.width * 100}%`,
    height: `${height / design.height * 100}%`,
  };
}
