import Link from "next/link";
import { SERVICES, whatsappQuoteUrl } from "@/lib/content";

export function ServiceCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={`service-grid ${detailed ? "is-detailed" : ""}`}>
      {SERVICES.map((service) => (
        <article className={`service-card ${service.featured ? "is-featured" : ""}`} key={service.name}>
          <div className="service-card-head">
            <div><p className="annotation">{service.featured ? "Recommended" : "Service tier"}</p><h3>{service.name}</h3></div>
            <p className="service-price">{service.price}</p>
          </div>
          <p className="service-pages">{service.pageRange}</p>
          <p className="service-capability">{service.capability}</p>
          <p className="service-ideal"><span>Good fit</span>{service.idealFor}</p>
          <div className="service-lists">
            <div><h4>Included</h4><ul>{service.included.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h4>Not included</h4><ul>{service.excluded.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
          {detailed ? <p className="service-upgrade"><span>Upgrade path</span>{service.upgrade}</p> : null}
          <a className="text-link" href={whatsappQuoteUrl(service.name)} target="_blank" rel="noreferrer">Request this tier <span aria-hidden="true">↗</span></a>
        </article>
      ))}
      {detailed ? <Link className="service-help" href="/contact">Not sure which tier fits? Tell us what the site needs to do. <span aria-hidden="true">→</span></Link> : null}
    </div>
  );
}
