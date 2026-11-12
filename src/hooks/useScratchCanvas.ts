import { useCallback, useEffect, useRef, useState } from 'react';
import { eventConfig } from '../config/event';
import { asset } from '../utils/assets';
import {
  erasedFraction,
  getBrushDiameter,
  getLinearTransform,
  getValidSampleIndices,
  toCanvasPoint,
} from '../utils/scratchMath';
import type { Point, Size } from '../utils/scratchMath';

type Stage = 'covered' | 'revealing' | 'revealed';

interface Stamp {
  point: Point;
  diameter: number;
  start: boolean;
}

const SESSION_KEY = `gala-casino:revealed:${eventConfig.title}:${eventConfig.date}`;
const MEASUREMENT_INTERVAL = 110;
const REVEAL_DURATION = 1320;
const SAMPLE_SIZE = { width: 96, height: 73 };
const SAMPLE_INDICES = getValidSampleIndices(SAMPLE_SIZE);

function wasRevealed(): boolean {
  if (!eventConfig.persistReveal) return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberReveal() {
  if (!eventConfig.persistReveal) return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // Private browsing and sandboxed embeds may block storage.
  }
}

function makeBitmap({ width, height }: Size): HTMLCanvasElement {
  const bitmap = document.createElement('canvas');
  bitmap.width = width;
  bitmap.height = height;
  return bitmap;
}

function makeBrush(): HTMLCanvasElement {
  const brush = makeBitmap({ width: 96, height: 96 });
  const context = brush.getContext('2d');
  if (!context) return brush;

  const edge = context.createRadialGradient(48, 48, 24, 48, 48, 47);
  edge.addColorStop(0, 'rgba(0,0,0,1)');
  edge.addColorStop(0.55, 'rgba(0,0,0,1)');
  edge.addColorStop(0.84, 'rgba(0,0,0,0.62)');
  edge.addColorStop(1, 'rgba(0,0,0,0)');

  context.beginPath();
  for (let i = 0; i < 36; i += 1) {
    const angle = (i / 36) * Math.PI * 2;
    const radius = 44 + Math.sin(i * 2.3) * 3.3 + Math.cos(i * 4.9) * 1.3;
    const x = 48 + Math.cos(angle) * radius;
    const y = 48 + Math.sin(angle) * radius;
    if (i === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.closePath();
  context.fillStyle = edge;
  context.fill();
  return brush;
}

function paintFoil(
  context: CanvasRenderingContext2D,
  { width, height }: Size,
  texture: HTMLImageElement,
  mark: HTMLImageElement,
) {
  const sheen = context.createLinearGradient(0, 0, width, height);
  sheen.addColorStop(0, '#a3a2a2');
  sheen.addColorStop(0.36, '#eeeeec');
  sheen.addColorStop(0.53, '#b4b3b2');
  sheen.addColorStop(0.81, '#dedcda');
  sheen.addColorStop(1, '#a29f9e');
  context.fillStyle = sheen;
  context.fillRect(0, 0, width, height);

  if (texture.complete && texture.naturalWidth) {
    context.drawImage(texture, 0, 0, width, height);
  }

  if (mark.complete && mark.naturalWidth) {
    const markSize = height * 0.27;
    context.drawImage(mark, (width - markSize) / 2, height * 0.15, markSize, markSize);
  }

  const words = eventConfig.scratchInstruction.trim().split(/\s+/);
  const split = Math.ceil(words.length / 2);
  const lines = [words.slice(0, split).join(' '), words.slice(split).join(' ')].filter(Boolean);

  context.fillStyle = '#211b19';
  context.font = `900 ${height * 0.161}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  lines.forEach((line, index) => {
    const y = lines.length === 1 ? 0.65 : 0.57 + index * 0.166;
    context.fillText(line, width / 2, height * y, width * 0.82);
  });
}

export function useScratchCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<Stage>(() => (wasRevealed() ? 'revealed' : 'covered'));
  const [ready, setReady] = useState(false);
  const [canvasAvailable, setCanvasAvailable] = useState(true);
  const locked = useRef(stage !== 'covered');

  const reveal = useCallback(() => {
    if (locked.current) return;
    locked.current = true;
    rememberReveal();
    setStage('revealing');
  }, []);

  useEffect(() => {
    if (stage !== 'revealing') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(() => setStage('revealed'), reduceMotion ? 0 : REVEAL_DURATION);
    return () => window.clearTimeout(timeout);
  }, [stage]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element || stage !== 'covered') return;

    const displayContext = element.getContext('2d');
    const mask = makeBitmap({ width: 786, height: 594 });
    const persistentContext = mask.getContext('2d');
    const sample = makeBitmap(SAMPLE_SIZE);
    const readContext = sample.getContext('2d', { willReadFrequently: true });
    if (!displayContext || !persistentContext || !readContext) {
      setCanvasAvailable(false);
      return;
    }

    const canvas = element;
    const context = displayContext;
    const maskContext = persistentContext;
    const sampleContext = readContext;
    maskContext.fillRect(0, 0, mask.width, mask.height);
    maskContext.globalCompositeOperation = 'destination-out';

    const texture = new Image();
    const mark = new Image();
    const brush = makeBrush();
    let size = { width: 0, height: 0 };
    let transform = getLinearTransform(canvas);
    let activePointer: number | null = null;
    let frame: number | null = null;
    let lastMeasurement = -MEASUREMENT_INTERVAL;
    let measureAtEnd = false;
    let pending: Stamp[] = [];
    let previous: Point | null = null;

    function repaint() {
      if (!size.width || locked.current) return;
      context.setTransform(canvas.width / size.width, 0, 0, canvas.height / size.height, 0, 0);
      context.globalCompositeOperation = 'source-over';
      paintFoil(context, size, texture, mark);
      // The mask uses normalized positions and persists through bitmap resizes.
      context.globalCompositeOperation = 'destination-in';
      context.drawImage(mask, 0, 0, size.width, size.height);
      context.globalCompositeOperation = 'destination-out';
    }

    function resize() {
      if (locked.current) return;
      const { width, height } = getComputedStyle(canvas);
      const nextSize = { width: parseFloat(width), height: parseFloat(height) };
      if (!nextSize.width || !nextSize.height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 3);
      const bitmapWidth = Math.max(1, Math.round(nextSize.width * pixelRatio));
      const bitmapHeight = Math.max(1, Math.round(nextSize.height * pixelRatio));
      transform = getLinearTransform(canvas);

      if (
        size.width === nextSize.width && size.height === nextSize.height
        && canvas.width === bitmapWidth && canvas.height === bitmapHeight
      ) {
        return;
      }

      size = nextSize;
      canvas.width = bitmapWidth;
      canvas.height = bitmapHeight;
      repaint();
      setReady(true);
    }

    function drawStamp({ x, y }: Point, diameter: number) {
      const radius = diameter / 2;
      context.drawImage(brush, x * size.width - radius, y * size.height - radius, diameter, diameter);

      const maskWidth = (diameter / size.width) * mask.width;
      const maskHeight = (diameter / size.height) * mask.height;
      maskContext.drawImage(
        brush,
        x * mask.width - maskWidth / 2,
        y * mask.height - maskHeight / 2,
        maskWidth,
        maskHeight,
      );
    }

    function measure() {
      sampleContext.clearRect(0, 0, sample.width, sample.height);
      sampleContext.drawImage(mask, 0, 0, sample.width, sample.height);
      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data;
      return erasedFraction(pixels, SAMPLE_INDICES);
    }

    function flush(now: number) {
      frame = null;
      if (locked.current || !size.width) return;

      for (const { point, diameter, start } of pending) {
        if (previous && !start) {
          const dx = point.x - previous.x;
          const dy = point.y - previous.y;
          const distance = Math.hypot(dx * size.width, dy * size.height);
          const steps = Math.ceil(distance / (diameter * 0.19));

          for (let step = 1; step <= steps; step += 1) {
            const fraction = step / steps;
            drawStamp({ x: previous.x + dx * fraction, y: previous.y + dy * fraction }, diameter);
          }
        } else {
          drawStamp(point, diameter);
        }
        previous = point;
      }

      pending = [];
      if (measureAtEnd || now - lastMeasurement >= MEASUREMENT_INTERVAL) {
        lastMeasurement = now;
        measureAtEnd = false;
        if (measure() >= eventConfig.revealThreshold) reveal();
      }
    }

    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(flush);
    }

    function queue(events: PointerEvent[], start = false) {
      if (!size.width) return;
      const rect = canvas.getBoundingClientRect();
      events.forEach((event, index) => {
        pending.push({
          point: toCanvasPoint(event.clientX, event.clientY, rect, size, transform),
          diameter: getBrushDiameter(size.width, event.pointerType),
          start: start && index === 0,
        });
      });
      schedule();
    }

    function onDown(event: PointerEvent) {
      if (locked.current || activePointer !== null || event.button !== 0) return;
      activePointer = event.pointerId;
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // A dispatched event may have no browser-managed pointer to capture.
      }
      queue([event], true);
    }

    function onMove(event: PointerEvent) {
      if (locked.current || event.pointerId !== activePointer) return;
      const coalesced = event.getCoalescedEvents?.();
      queue(coalesced?.length ? coalesced : [event]);
    }

    function onEnd(event: PointerEvent) {
      if (event.pointerId !== activePointer) return;
      if (event.type === 'pointerup') queue([event]);
      activePointer = null;
      measureAtEnd = true;
      schedule();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    texture.onload = repaint;
    texture.onerror = () => {
      texture.onerror = null;
      texture.src = asset('scratch/scratch-silver-texture.png');
    };
    texture.src = asset('scratch/scratch-silver-texture.webp');
    mark.onload = repaint;
    mark.src = asset('scratch/scratch-mark.svg');
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onEnd);
    canvas.addEventListener('pointercancel', onEnd);
    canvas.addEventListener('lostpointercapture', onEnd);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resize);
      texture.onload = null;
      texture.onerror = null;
      mark.onload = null;
      if (frame !== null) window.cancelAnimationFrame(frame);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onEnd);
      canvas.removeEventListener('pointercancel', onEnd);
      canvas.removeEventListener('lostpointercapture', onEnd);
      if (activePointer !== null && canvas.hasPointerCapture(activePointer)) {
        canvas.releasePointerCapture(activePointer);
      }
    };
  }, [reveal, stage]);

  return { canvasRef, canvasAvailable, ready, reveal, stage };
}
