"use client";

import { FormEvent, useState } from "react";
import { CONTACT_TIERS, WHATSAPP } from "@/lib/content";

type Errors = Partial<Record<"name" | "business" | "contact" | "tier" | "project", string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [fallback, setFallback] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? "").trim(),
      business: String(data.get("business") ?? "").trim(),
      contact: String(data.get("contact") ?? "").trim(),
      tier: String(data.get("tier") ?? "").trim(),
      project: String(data.get("project") ?? "").trim(),
    };
    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = "Enter your name.";
    if (!values.business) nextErrors.business = "Enter your business name.";
    if (!values.contact) nextErrors.contact = "Enter a contact number.";
    if (!values.tier) nextErrors.tier = "Choose a tier or select Not sure.";
    if (!values.project) nextErrors.project = "Describe what the website needs to do.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const message = [
      "Hello Sya.R, I would like to request a website quote.",
      "",
      `Name: ${values.name}`,
      `Business: ${values.business}`,
      `Contact: ${values.contact}`,
      `Tier: ${values.tier}`,
      `Project: ${values.project}`,
    ].join("\n");
    const popup = window.open(`${WHATSAPP.url}?text=${encodeURIComponent(message)}`, "_blank");
    if (popup) popup.opener = null;
    setFallback(!popup);
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <Field label="Name" name="name" error={errors.name} autoComplete="name" />
      <Field label="Business" name="business" error={errors.business} autoComplete="organization" />
      <Field label="Contact number" name="contact" error={errors.contact} autoComplete="tel" inputMode="tel" />
      <label className="field">
        <span>Tier interest</span>
        <select name="tier" aria-invalid={Boolean(errors.tier)} aria-describedby={errors.tier ? "tier-error" : undefined} defaultValue="">
          <option value="" disabled>Choose a tier</option>
          {CONTACT_TIERS.map((tier) => <option key={tier}>{tier}</option>)}
        </select>
        {errors.tier ? <small id="tier-error" role="alert">{errors.tier}</small> : null}
      </label>
      <label className="field field-full">
        <span>Project description</span>
        <textarea name="project" rows={6} aria-invalid={Boolean(errors.project)} aria-describedby={errors.project ? "project-error" : undefined} />
        {errors.project ? <small id="project-error" role="alert">{errors.project}</small> : null}
      </label>
      <div className="field-full form-submit">
        <button className="button button-primary" type="submit">Open message in WhatsApp <span aria-hidden="true">↗</span></button>
        <p>We will open WhatsApp with your details prefilled. You review and send the message there.</p>
        {fallback ? <p role="alert">WhatsApp did not open. Your entries are still here. <a href={WHATSAPP.url} target="_blank" rel="noreferrer">Open WhatsApp directly.</a></p> : null}
        <noscript><p>JavaScript is off. <a href={WHATSAPP.url}>Open WhatsApp directly</a> or call {WHATSAPP.display}.</p></noscript>
      </div>
    </form>
  );
}

function Field({ label, name, error, ...props }: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${name}-error`;
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
      {error ? <small id={errorId} role="alert">{error}</small> : null}
    </label>
  );
}
