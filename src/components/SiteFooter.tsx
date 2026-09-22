import Link from "next/link";
import { SITE } from "../lib/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Fuji Sys</p>
      <nav aria-label="Navegação do rodapé">
        <Link href={SITE.routes.birthday}>Birthly</Link>
        <Link href={SITE.routes.privacy}>Privacidade</Link>
        <Link href={SITE.routes.support}>Suporte</Link>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </nav>
    </footer>
  );
}
