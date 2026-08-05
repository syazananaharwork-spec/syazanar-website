import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Todo, isTodo } from "@/components/Todo";
import { PROJECTS, WHATSAPP, getProject } from "@/lib/content";

export const dynamicParams = false;
export function generateStaticParams() { return PROJECTS.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.client, description: project.summary };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const index = PROJECTS.findIndex((item) => item.slug === project.slug);
  const related = PROJECTS[(index + 1) % PROJECTS.length];
  return (
    <article className="inner-page case-page">
      <header className="case-hero page-shell">
        <div className="case-labels"><span className="eyebrow">Work {String(index + 1).padStart(2, "0")}</span><span className="annotation">{project.kind}</span><span className="annotation">{project.status}</span></div>
        <h1>{project.client}</h1>
        <p>{project.summary}</p>
        <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">Visit the {project.kind === "Live client work" ? "live site" : "live demonstration"} <span aria-hidden="true">↗</span></a>
      </header>
      <div className="case-main-image page-shell"><Image src={project.image} alt={project.imageAlt} fill loading="eager" fetchPriority="high" sizes="96vw" /></div>
      <div className="case-sections page-shell">
        <section><p className="eyebrow">01 / Business problem</p><h2>What had to become clear.</h2><p>{project.problem}</p></section>
        <section><p className="eyebrow">02 / What we built</p><h2>The working scope.</h2><p>{project.built}</p></section>
        <section><p className="eyebrow">03 / Key decisions</p><h2>Decisions that support the job.</h2><ol>{project.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ol></section>
        <section><p className="eyebrow">04 / Enquiry path</p><h2>From reading to action.</h2><p>{project.enquiryPath}</p></section>
        <section><p className="eyebrow">05 / Responsive build</p><h2>One system across screen sizes.</h2><p>{project.responsive}</p></section>
      </div>
      <section className="case-screens page-shell" aria-labelledby="screens-title">
        <div><p className="eyebrow">06 / Selected screens</p><h2 id="screens-title">Desktop and mobile.</h2></div>
        <div className="screen-pair"><div className="screen-desktop"><Image src={project.image} alt={`${project.shortClient} desktop screen`} fill sizes="70vw" /></div><div className="screen-mobile"><Image src={project.mobileImage} alt={`${project.shortClient} mobile screen`} fill sizes="24vw" /></div></div>
      </section>
      <section className="case-outcome page-shell"><div><p className="eyebrow">07 / Verified outcome</p><h2>What we can state.</h2></div><p>{isTodo(project.outcome) ? <Todo value={project.outcome} /> : project.outcome}</p></section>
      <section className="case-next page-shell">
        <div><p className="eyebrow">Related work</p><Link href={`/work/${related.slug}`}>{related.shortClient} <span aria-hidden="true">→</span></Link></div>
        <div><p className="eyebrow">Have a similar brief?</p><a href={WHATSAPP.url} target="_blank" rel="noreferrer">Request a quote <span aria-hidden="true">↗</span></a></div>
      </section>
    </article>
  );
}
