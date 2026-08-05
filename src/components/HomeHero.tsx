"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HERO, WHATSAPP } from "@/lib/content";

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [scrollTravel, setScrollTravel] = useState(150);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const pathYRaw = useTransform(scrollYProgress, [0, 1], [0, scrollTravel]);
  const pathY = useSpring(pathYRaw, { stiffness: 82, damping: 24, mass: 0.72 });
  const pathScale = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.9]);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const objectX = useSpring(rawX, { stiffness: 90, damping: 20 });
  const objectY = useSpring(rawY, { stiffness: 90, damping: 20 });

  useEffect(() => {
    const updateTravel = () => {
      if (window.innerWidth < 768) setScrollTravel(72);
      else if (window.innerWidth < 1100) setScrollTravel(110);
      else setScrollTravel(Math.min(170, window.innerHeight * 0.18));
    };
    updateTravel();
    window.addEventListener("resize", updateTravel);
    return () => window.removeEventListener("resize", updateTravel);
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    rawX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 34);
    rawY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 24);
  };

  const resetObject = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <section ref={ref} className="home-hero" aria-labelledby="home-title">
      <div className="hero-stage" onPointerMove={handlePointerMove} onPointerLeave={resetObject}>
        <div className="hero-aurora" aria-hidden="true" />
        <m.div className="hero-copy" style={{ y: titleY }}>
        <p className="hero-kicker">{HERO.name}</p>
        <h1 id="home-title" aria-label={HERO.lines.join(" ")}>
          {HERO.lines.map((line, index) => (
            <span className={`hero-title-line hero-title-line-${index + 1}`} key={line}>
              <m.span
                aria-hidden="true"
                initial={{ y: "35%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 + index * 0.1, duration: 0.82 }}
              >
                {line}
              </m.span>
            </span>
          ))}
        </h1>
        </m.div>
        <m.div className="hero-object-path" style={{ y: reduceMotion ? 0 : pathY, scale: reduceMotion ? 1 : pathScale }} aria-hidden="true">
          <m.div
            className="hero-object"
            style={{ x: objectX, y: objectY }}
            initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.38, duration: 1.1 }}
          >
            <m.div animate={reduceMotion ? undefined : { y: [0, -13, 0], rotate: [-1.5, 1.5, -1.5] }} transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}>
              <Image src="/hero/figma-object.png" alt="" fill priority unoptimized sizes="(max-width: 767px) 48vw, 26vw" />
            </m.div>
          </m.div>
        </m.div>
        <div className="hero-index" aria-label="Core capabilities">
        {["Website design", "Development", "Creative direction", "Digital systems"].map((item, index) => (
          <div key={item}><p><span>#</span>0{index + 1}</p><small>{item}</small></div>
        ))}
        </div>
        <div className="hero-summary">
        <p>{HERO.support}</p>
        <div className="hero-actions">
          <Link href="/work">View selected work <span aria-hidden="true">↘</span></Link>
          <a href={WHATSAPP.url} target="_blank" rel="noreferrer">Start a project <span aria-hidden="true">↗</span></a>
        </div>
        </div>
        <Image className="hero-mark" src="/brand/sya-r-monogram.png" alt="" width={96} height={96} aria-hidden="true" />
      </div>
    </section>
  );
}
