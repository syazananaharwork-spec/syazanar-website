"use client";

import Link from "next/link";
import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PROJECTS } from "@/lib/content";
import { ProjectMedia } from "@/components/ProjectMedia";

export function HorizontalProjects() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(PROJECTS.length - 1) * 76}vw`]);

  return (
    <section ref={ref} className="horizontal-section" aria-labelledby="featured-work-title">
      <noscript><style>{`.horizontal-section{height:auto!important}.horizontal-sticky{position:relative!important}.horizontal-track{overflow-x:auto!important;transform:none!important}`}</style></noscript>
      <div className="horizontal-sticky">
        <div className="page-shell section-topline">
          <p className="eyebrow">Section 02 / Work</p>
          <p className="annotation">Scroll to review</p>
        </div>
        <h2 id="featured-work-title" className="sr-only">Featured work</h2>
        <m.div className="horizontal-track" style={{ x }}>
          {PROJECTS.map((project, index) => (
            <Link href={`/work/${project.slug}`} className="project-panel" key={project.slug}>
              <ProjectMedia project={project} priority={index === 0} />
              <div className="project-scrim" aria-hidden="true" />
              <div className="project-panel-meta">
                <span className="annotation">Work {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
                <span className="annotation">{project.kind}</span>
              </div>
              <div className="project-title-mask"><h3>{project.shortClient}</h3></div>
              <p className="project-category">{project.category}<span>{project.status}</span></p>
            </Link>
          ))}
        </m.div>
      </div>
    </section>
  );
}
