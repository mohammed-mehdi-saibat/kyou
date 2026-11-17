import { useEffect, useRef } from 'react';
import styles from './CursorTrail.module.css';

const LIFETIME_MS = 1000;
const MIN_DISTANCE = 2.5;
const BREAK_AFTER_MS = 120;
const MAX_POINTS = 120;
const MAX_TRAIL_LENGTH = 110; // Short line that never takes over the page

function hexToRgb(hex) {
  const value = hex.trim().replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(value)) return [55, 78, 106];
  return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16));
}

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const points = [];
    let lastPoint = null;
    let frame = null;
    let enabled = false;
    let color = [55, 78, 106];
    let dark = false;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function readColor() {
      const computed = getComputedStyle(document.documentElement);
      color = hexToRgb(computed.getPropertyValue('--color-ai') || '#374e6a');
      dark = computed.colorScheme === 'dark';
    }

    function draw(now) {
      frame = null;
      while (points.length && now - points[0].time >= LIFETIME_MS) {
        points.shift();
      }
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (!enabled || points.length === 0) return;

      context.lineCap = 'round';
      context.lineJoin = 'round';
      const [red, green, blue] = color;
      const intensity = dark ? 0.14 : 0.10;

      // Only draw the last 110px of movement; older segments fade over ~1s.
      // Drawing from newest backwards prevents a fast swipe from filling the page.
      let distanceDrawn = 0;
      for (let i = points.length - 1; i >= 1; i -= 1) {
        const previous = points[i - 1];
        const point = points[i];
        if (point.breakBefore) break;

        const segmentLength = Math.hypot(point.x - previous.x, point.y - previous.y);
        if (segmentLength === 0) continue;

        const available = MAX_TRAIL_LENGTH - distanceDrawn;
        if (available <= 0) break;

        const visibleLength = Math.min(segmentLength, available);
        const fraction = visibleLength / segmentLength;
        const startX = point.x + (previous.x - point.x) * fraction;
        const startY = point.y + (previous.y - point.y) * fraction;
        const age = now - point.time;
        const timeFade = Math.max(0, 1 - age / LIFETIME_MS);
        const distanceFade = Math.max(0, 1 - (distanceDrawn + visibleLength / 2) / MAX_TRAIL_LENGTH);
        const alpha = intensity * timeFade * timeFade * distanceFade;

        if (alpha > 0) {
          context.beginPath();
          context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          context.lineWidth = 0.4 + 0.55 * distanceFade;
          context.moveTo(startX, startY);
          context.lineTo(point.x, point.y);
          context.stroke();
        }

        distanceDrawn += visibleLength;
      }
      frame = window.requestAnimationFrame(draw);
    }

    function onPointerMove(event) {
      if (!enabled || event.pointerType === 'touch') return;
      const now = performance.now();
      const distance = lastPoint
        ? Math.hypot(event.clientX - lastPoint.x, event.clientY - lastPoint.y)
        : Infinity;
      if (distance < MIN_DISTANCE) return;

      const breakBefore = !lastPoint || now - lastPoint.time > BREAK_AFTER_MS || distance > 140;
      const point = { x: event.clientX, y: event.clientY, time: now, breakBefore };
      points.push(point);
      if (points.length > MAX_POINTS) points.shift();
      lastPoint = point;
      readColor();
      if (frame === null) frame = window.requestAnimationFrame(draw);
    }

    function onPointerLeave() { lastPoint = null; }

    function updateEnabled() {
      enabled = !reducedMotion.matches && finePointer.matches;
      if (!enabled) {
        points.length = 0;
        lastPoint = null;
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    }

    resize();
    updateEnabled();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    reducedMotion.addEventListener('change', updateEnabled);
    finePointer.addEventListener('change', updateEnabled);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      reducedMotion.removeEventListener('change', updateEnabled);
      finePointer.removeEventListener('change', updateEnabled);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
