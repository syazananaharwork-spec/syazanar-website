"use client";

import { useEffect, useRef, useState } from "react";

function canAnimate() {
  return (
    window.innerWidth >= 768 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    !window.matchMedia("(pointer: coarse)").matches &&
    (navigator.hardwareConcurrency ?? 4) >= 4
  );
}

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const idle = typeof window.requestIdleCallback === "function"
      ? window.requestIdleCallback(() => setEnabled(canAnimate()), { timeout: 1200 })
      : undefined;
    const timer = idle === undefined ? window.setTimeout(() => setEnabled(canAnimate()), 400) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    let frame = 0;
    let visible = !document.hidden;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      if (visible) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);
        const scrollDepth = Math.min(window.scrollY / Math.max(document.body.scrollHeight - h, 1), 1);
        const x = w * (0.72 + Math.sin(time * 0.00008) * 0.035);
        const y = h * (0.18 + scrollDepth * 0.5);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) * 0.7);
        glow.addColorStop(0, `rgba(226,157,72,${0.045 + scrollDepth * 0.025})`);
        glow.addColorStop(0.36, "rgba(99,137,145,0.025)");
        glow.addColorStop(1, "rgba(236,232,224,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }
      frame = requestAnimationFrame(draw);
    };

    const visibility = () => {
      visible = !document.hidden;
    };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="atmosphere" aria-hidden="true" />;
}
