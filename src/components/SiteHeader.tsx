import Link from "next/link";
import { SITE } from "../lib/site";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <Link className="brand" href={SITE.routes.home}>{SITE.name}</Link>
        <nav aria-label="Navegação principal">
          <Link href="/#empresa">Empresa</Link>
          <Link href="/#produtos">Produtos</Link>
          <Link href={SITE.routes.birthday}>Birthly</Link>
          <Link href="/#contato">Contato</Link>
        </nav>
      </header>
    </>
  );
}
