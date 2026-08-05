"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const handleMenu = (event: Event) => {
      const open = (event as CustomEvent<boolean>).detail;
      if (open) lenis.stop();
      else lenis.start();
    };
    window.addEventListener("sya:menu", handleMenu);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("sya:menu", handleMenu);
      lenis.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}>
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
