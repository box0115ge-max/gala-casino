import type { CSSProperties } from 'react';
import { design } from '../config/artwork';

const outerLights = [
  [260, 73], [197, 73], [136, 88], [87, 125], [58, 174], [46, 232], [46, 300], [46, 361],
  [46, 421], [46, 488], [46, 547], [46, 602], [46, 662], [46, 1247], [58, 1298], [93, 1340],
  [141, 1373], [204, 1387], [269, 1387], [334, 1387], [401, 1387], [469, 1387], [540, 1387],
  [608, 1387], [677, 1387], [747, 1387], [817, 1387], [884, 1387], [946, 1373], [994, 1340],
  [1023, 1298], [1034, 1247], [1034, 1142], [1034, 488], [1034, 421], [1034, 361],
  [1034, 300], [1034, 232], [1023, 174], [995, 125], [949, 88], [889, 73], [828, 73],
];

const marqueeLights = [
  [244, 336], [251, 313], [275, 300], [302, 298], [332, 298], [364, 298], [394, 298],
  [700, 298], [729, 298], [758, 298], [790, 302], [814, 315], [832, 337], [840, 366],
  [838, 394], [831, 421], [815, 444], [480, 451], [448, 453], [415, 454], [382, 455],
  [352, 456], [320, 457], [290, 456], [256, 443], [242, 420], [235, 392], [236, 363],
  [317, 341], [341, 348], [294, 378], [308, 408], [333, 415], [422, 343], [413, 367],
  [400, 391], [440, 389], [500, 345], [524, 343], [506, 370], [534, 395], [516, 413],
  [575, 341], [575, 375], [575, 410], [615, 341], [615, 409], [644, 372], [676, 342],
  [676, 409], [744, 343], [772, 349], [784, 377], [771, 406], [743, 413], [717, 386],
];

function lightGroups(points: number[][], radius: number, fill: string) {
  const groups = Array.from({ length: 8 }, () => [] as number[][]);
  points.forEach((point, index) => groups[index % groups.length].push(point));

  return groups.map((group, index) => (
    <g className="bulb-group" key={index} style={{ '--phase': `${index * -0.64}s` } as CSSProperties}>
      {group.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={radius} fill={fill} />)}
    </g>
  ));
}

export default function MarqueeLights() {
  return (
    <svg className="poster-art poster-art--full poster__lights" viewBox={`0 0 ${design.width} ${design.height}`} aria-hidden="true">
      <defs>
        <radialGradient id="bulb-halo">
          <stop offset="0" stopColor="#fff8d1" stopOpacity=".97" />
          <stop offset=".19" stopColor="#ffe09a" stopOpacity=".87" />
          <stop offset=".4" stopColor="#ff9e30" stopOpacity=".52" />
          <stop offset=".73" stopColor="#ff4113" stopOpacity=".16" />
          <stop offset="1" stopColor="#ff4113" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="marquee-halo">
          <stop offset="0" stopColor="#fffbe9" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffcb76" stopOpacity=".62" />
          <stop offset="1" stopColor="#ff6b21" stopOpacity="0" />
        </radialGradient>
      </defs>
      {lightGroups(outerLights, 34, 'url(#bulb-halo)')}
      {lightGroups(marqueeLights, 20, 'url(#marquee-halo)')}
      <g className="poster__sparks" fill="url(#bulb-halo)">
        <circle cx="247" cy="230" r="24" />
        <circle cx="795" cy="200" r="21" />
        <circle cx="902" cy="257" r="21" />
        <circle cx="168" cy="289" r="19" />
        <circle cx="932" cy="371" r="22" />
        <circle cx="125" cy="384" r="19" />
      </g>
    </svg>
  );
}
