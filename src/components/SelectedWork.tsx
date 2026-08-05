import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/content";

export function SelectedWork() {
  return (
    <section className="selected-work page-shell" aria-labelledby="selected-work-title">
      <div className="section-heading-row">
        <div><p className="eyebrow">Selected index</p><h2 id="selected-work-title">Built for a real decision.</h2></div>
        <p className="section-note">Live work, prototypes, and concepts are labelled plainly.</p>
      </div>
      <div className="work-list">
        {PROJECTS.map((project, index) => (
          <Link
            href={`/work/${project.slug}`}
            className="work-row"
            key={project.slug}
          >
            <span className="annotation">{String(index + 1).padStart(2, "0")}</span>
            <span className="work-thumb"><Image src={project.image} alt="" fill sizes="84px" /></span>
            <strong>{project.shortClient}</strong>
            <span>{project.category}</span>
            <span>{project.kind}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
