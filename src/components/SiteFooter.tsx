import Link from "next/link";
import { INSTITUTIONAL_SITE } from "../lib/site";
import { PRODUCT_CATALOG } from "../products/catalog";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} Fuji Sys</p>
      <nav aria-label="Navegação do rodapé">
        {PRODUCT_CATALOG.map((product) => <Link href={product.linkRoutes.home()} key={product.id}>{product.name}</Link>)}
        <Link href={INSTITUTIONAL_SITE.linkRoutes.privacy()}>Privacidade</Link>
        <Link href={INSTITUTIONAL_SITE.linkRoutes.support()}>Suporte</Link>
        <a href={`mailto:${INSTITUTIONAL_SITE.email}`}>{INSTITUTIONAL_SITE.email}</a>
      </nav>
    </footer>
  );
}
