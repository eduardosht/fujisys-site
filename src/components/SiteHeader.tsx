import { SITE } from "../lib/site";

export function SiteHeader() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="site-header">
        <a className="brand" href={SITE.routes.home}>{SITE.name}</a>
        <nav aria-label="Navegação principal">
          <a href={`${SITE.routes.home}#empresa`}>Empresa</a>
          <a href={`${SITE.routes.home}#produtos`}>Produtos</a>
          <a href={SITE.routes.birthday}>Birthly</a>
          <a href={`${SITE.routes.home}#contato`}>Contato</a>
        </nav>
      </header>
    </>
  );
}
