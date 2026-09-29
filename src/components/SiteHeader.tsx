import Link from "next/link";
import { INSTITUTIONAL_SITE } from "../lib/site";
import { PRODUCT_CATALOG } from "../products/catalog";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <Link className="brand" href={INSTITUTIONAL_SITE.linkRoutes.home()}>{INSTITUTIONAL_SITE.name}</Link>
        <nav aria-label="Navegação principal">
          <Link href="/#empresa">Empresa</Link>
          <Link href="/#produtos">Produtos</Link>
          {PRODUCT_CATALOG.map((product) => <Link href={product.linkRoutes.home()} key={product.id}>{product.name}</Link>)}
          <Link href="/#contato">Contato</Link>
        </nav>
      </header>
    </>
  );
}
