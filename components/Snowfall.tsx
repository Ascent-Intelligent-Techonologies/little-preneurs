"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  r: number; // radius in px
  vy: number; // fall speed, px per frame at 60fps
  sway: number; // horizontal sway amplitude
  phase: number;
  spin: number;
  star: boolean; // six-armed flake vs. soft dot
  alpha: number;
};

// A light, decorative snowfall behind the page. Pointer-events are off so it
// never blocks clicks; it's skipped for people who prefer reduced motion and
// paused while the tab is hidden.
export default function Snowfall() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let flakes: Flake[] = [];
    let raf = 0;
    let last = 0;

    const make = (initial: boolean): Flake => {
      const star = Math.random() < 0.28;
      const r = star ? 5 + Math.random() * 5 : 1.6 + Math.random() * 3.2;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -r * 2,
        r,
        vy: (0.35 + Math.random() * 0.75) * (0.7 + r / 8),
        sway: 8 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        star,
        alpha: star ? 0.75 : 0.55 + Math.random() * 0.4,
      };
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = w < 700 ? 26 : 52;
      flakes = Array.from({ length: target }, () => make(true));
    };

    const drawStar = (f: Flake, x: number, angle: number) => {
      ctx.save();
      ctx.translate(x, f.y);
      ctx.rotate(angle);
      ctx.strokeStyle = `rgba(104, 156, 198, ${f.alpha})`;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (Math.PI / 3) * i;
        const dx = Math.cos(a) * f.r;
        const dy = Math.sin(a) * f.r;
        ctx.moveTo(-dx, -dy);
        ctx.lineTo(dx, dy);
        // little branches near the tips
        for (const s of [1, -1]) {
          const bx = Math.cos(a) * f.r * 0.62 * s;
          const by = Math.sin(a) * f.r * 0.62 * s;
          const ba = a + Math.PI / 2;
          const bl = f.r * 0.28;
          ctx.moveTo(bx - Math.cos(ba) * bl, by - Math.sin(ba) * bl);
          ctx.lineTo(bx + Math.cos(ba) * bl, by + Math.sin(ba) * bl);
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min((t - last) / 16.67, 3) : 1; // normalise to 60fps
      last = t;
      ctx.clearRect(0, 0, w, h);

      flakes.forEach((f, i) => {
        f.y += f.vy * dt;
        f.phase += 0.012 * dt;
        const x = f.x + Math.sin(f.phase) * f.sway;
        if (f.star) {
          drawStar(f, x, f.phase * f.spin * 60);
        } else {
          // white flake with a faint blue edge so it reads on cream and dark alike
          ctx.beginPath();
          ctx.arc(x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(104, 156, 198, ${f.alpha * 0.55})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (f.y > h + f.r * 2) flakes[i] = make(false);
      });
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 40 }}
    />
  );
}
