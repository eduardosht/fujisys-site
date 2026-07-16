import { SITE } from "../lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Fuji Sys</p>
      <nav aria-label="Navegação do rodapé">
        <a href={SITE.routes.birthday}>Birthday</a>
        <a href={SITE.routes.privacy}>Privacidade</a>
        <a href={SITE.routes.support}>Suporte</a>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </nav>
    </footer>
  );
}
