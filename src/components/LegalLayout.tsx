import type { ReactNode } from "react";

export function LegalLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <article className="legal-page">
      <header className="legal-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{intro}</p>
      </header>
      <div className="legal-body">{children}</div>
    </article>
  );
}
