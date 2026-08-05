import { PROCESS } from "@/lib/content";

export function ProcessSequence() {
  return (
    <section className="process-section" aria-labelledby="process-title">
      <div className="process-layout page-shell">
        <div className="process-intro">
          <p className="eyebrow">Section 03 / Process</p>
          <h2 id="process-title">Five steps. One accountable build.</h2>
          <p>Each stage produces something you can review before the next stage begins.</p>
        </div>
        <div className="process-stage">
          {PROCESS.map((step, index) => (
            <article className="process-panel" key={step.name}>
              <p className="annotation">Step {String(index + 1).padStart(2, "0")}</p>
              <h3>{step.name}</h3>
              <p>{step.deliverable}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
