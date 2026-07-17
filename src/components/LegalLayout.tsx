import type { ReactNode } from "react";

export function LegalLayout({ eyebrow, title, intro, decoration, children }: { eyebrow: string; title: string; intro: string; decoration?: ReactNode; children: ReactNode }) {
  return (
    <article className="legal-page">
      <header className="legal-hero">
        {decoration}
        <div className="legal-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">{intro}</p>
        </div>
      </header>
      <div className="legal-body">{children}</div>
    </article>
  );
}
