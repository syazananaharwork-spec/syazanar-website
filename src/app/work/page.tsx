import type { Metadata } from "next";
import Link from "next/link";
import { ProjectMedia } from "@/components/ProjectMedia";
import { PROJECTS } from "@/lib/content";

export const metadata: Metadata = { title: "Work", description: "Live client work, prototypes, and concept demonstrations by Sya.R." };

export default function WorkPage() {
  return (
    <div className="inner-page">
      <header className="page-intro page-shell">
        <p className="eyebrow">Work / Complete index</p>
        <h1>Real screens. Clear labels.</h1>
        <p>Client work, prototypes, and concepts are different kinds of proof. We label each one so you know what you are looking at.</p>
      </header>
      <section className="work-index page-shell" aria-label="Portfolio projects">
        {PROJECTS.map((project, index) => (
          <article className="work-card" key={project.slug}>
            <Link href={`/work/${project.slug}`} className="work-card-media"><ProjectMedia project={project} priority={index < 2} /></Link>
            <div className="work-card-copy">
              <div className="work-card-labels"><span className="annotation">Work {String(index + 1).padStart(2, "0")}</span><span className="annotation">{project.kind}</span></div>
              <h2><Link href={`/work/${project.slug}`}>{project.client}</Link></h2>
              <p>{project.summary}</p>
              <div className="work-card-actions"><Link className="text-link" href={`/work/${project.slug}`}>Read case <span aria-hidden="true">→</span></Link><a className="text-link muted" href={project.liveUrl} target="_blank" rel="noreferrer">{project.status} <span aria-hidden="true">↗</span></a></div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
