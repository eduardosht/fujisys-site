import Link from "next/link";
import { LegalLayout } from "../LegalLayout";
import { LottiePlayer } from "../LottiePlayer";
import { Reveal } from "../Reveal";
import { assetPath, INSTITUTIONAL_SITE, siteAssetPath } from "../../lib/site";
import { BIRTHLY_PRODUCT, PRODUCT_CATALOG } from "../../products/catalog";

const Arrow = () => <span aria-hidden="true">↗</span>;

export function HomePage() {
  return <>
    <section className="hero home-hero" aria-labelledby="home-title">
      <Reveal className="hero-copy layered-reveal">
        <p className="eyebrow">Estúdio de produtos digitais</p>
        <h1 id="home-title">Ideias que resolvem.<br /><em>Produtos que aproximam.</em></h1>
        <p className="lede">Na Fuji Sys, transformamos problemas reais em experiências digitais simples, criativas e feitas para durar.</p>
        <a className="text-link" href="#produtos">Conheça nosso trabalho <span aria-hidden="true">↓</span></a>
      </Reveal>
      <Reveal className="hero-art-reveal" delay={160}><div className="hero-art" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="spark">F</span></div></Reveal>
    </section>

    <Reveal><section className="statement section" id="empresa">
      <p className="section-index">01 — Empresa</p>
      <div><h2>Boa tecnologia começa com uma pergunta simples.</h2><p>O que pode ficar mais claro, leve ou humano? É daí que partimos para criar soluções úteis — da ideia aos últimos detalhes da experiência.</p></div>
    </section></Reveal>

    <Reveal><section className="section products" id="produtos" aria-labelledby="products-title">
      <header className="section-heading"><p className="section-index">02 — Produtos</p><h2 id="products-title">Criado para fazer parte da vida.</h2></header>
      {PRODUCT_CATALOG.map((product) => <Link className="product-card" href={product.href} key={product.id}>
        <div className="birthday-product-art">
          <img className="birthday-logo" src={assetPath("/birthday/app-icon.png")} alt="" />
          <LottiePlayer className="product-lottie" src={assetPath("/birthday/lotties/present.lottie")} />
        </div>
        <div className="product-copy"><p className="eyebrow">Nosso primeiro produto</p><h3>{product.name}</h3><p className="product-tagline">{product.eyebrow}</p><p>{product.description}</p><span className="card-link">Conheça o {product.name} <Arrow /></span></div>
      </Link>)}
    </section></Reveal>

    <Reveal><section className="contact-panel" id="contato"><p className="eyebrow">Tem uma ideia?</p><h2>Vamos criar algo útil?</h2><p>Conversas boas também começam de um jeito simples.</p><a className="button button-light" href={`mailto:${INSTITUTIONAL_SITE.email}`}>Fale com a Fuji Sys <Arrow /></a></section></Reveal>
  </>;
}

export function BirthdayPage() {
  return <div className="birthday-page">
    <section className="hero birthday-hero">
      <Reveal className="hero-copy layered-reveal"><p className="eyebrow coral">Um produto Fuji Sys</p><h1>{BIRTHLY_PRODUCT.name}</h1><p className="birthday-lead">Datas importantes merecem mais do que depender da memória.</p><p className="lede">Um jeito simples e cuidadoso de organizar aniversários e manter pessoas queridas por perto.</p><div className="actions"><Link className="button coral-button" href={BIRTHLY_PRODUCT.linkRoutes.support()}>Preciso de ajuda</Link><Link className="text-link" href={BIRTHLY_PRODUCT.linkRoutes.privacy()}>Ver privacidade <Arrow /></Link></div></Reveal>
      <Reveal className="birthday-stage-reveal" delay={160}><div className="birthday-stage"><img className="birthday-hero-logo" src={assetPath("/birthday/app-icon.png")} alt="Ícone do aplicativo Birthly" /><LottiePlayer className="celebration-lottie" src={assetPath("/birthday/lotties/celebration.lottie")} /><span className="confetti c1" /><span className="confetti c2" /><span className="confetti c3" /></div></Reveal>
    </section>
    <Reveal><section className="birthday-statement section"><p className="section-index">Por que Birthly</p><h2>Lembrar também é uma forma de cuidar.</h2><p>O Birthly reúne o essencial em uma experiência tranquila, para que as datas que importam estejam sempre ao seu alcance.</p></section></Reveal>
    <Reveal><section className="birthday-card-showcase section" aria-labelledby="birthday-card-title">
      <div className="birthday-card-copy"><p className="section-index">Uma lembrança para compartilhar</p><h2 id="birthday-card-title">Cartões que guardam um momento.</h2><p>No Birthly, uma data também pode virar uma lembrança para compartilhar: escolha uma foto, escreva sua mensagem e assine do seu jeito.</p></div>
      <div className="birthday-card-stage"><img className="birthday-card-image" src={assetPath("/birthday/examples/leandro-birthday-card.jpeg")} alt="Exemplo de cartão de aniversário do Birthly" /></div>
    </section></Reveal>
    <section className="benefit-grid section" aria-label="Benefícios do Birthly">
      <Reveal className="benefit-reveal"><article><span className="benefit-icon">01</span><h2>Tudo em um só lugar</h2><p>Organize datas importantes sem complicação e encontre o que precisa com facilidade.</p></article></Reveal>
      <Reveal className="benefit-reveal" delay={120}><article><span className="benefit-icon">02</span><h2>Acesso simples</h2><p>Entre com sua conta usando seu e-mail e mantenha seu acesso de forma prática.</p></article></Reveal>
      <Reveal className="benefit-reveal" delay={240}><article><span className="benefit-icon">03</span><h2>Feito com cuidado</h2><p>Uma experiência leve, clara e pensada para acompanhar momentos que merecem atenção.</p></article></Reveal>
    </section>
    <Reveal><section className="official-links"><div><p className="eyebrow coral">Informações oficiais</p><h2>Transparência faz parte.</h2></div><div className="link-list"><Link href={BIRTHLY_PRODUCT.linkRoutes.terms()}>Termos de Uso <Arrow /></Link><Link href={BIRTHLY_PRODUCT.linkRoutes.privacy()}>Política de privacidade <Arrow /></Link><Link href={BIRTHLY_PRODUCT.linkRoutes.support()}>Suporte do Birthly <Arrow /></Link></div></section></Reveal>
  </div>;
}

export function TermsPage() {
  return <div className="privacy-page"><LegalLayout eyebrow="Birthly · Documento oficial" title="Termos de Uso" intro="Condições de acesso e utilização do Birthly.">
    <p className="updated">Versão v3.0 · Vigência: 01 de novembro de 2026</p>
    <section><h2>1. Aceite e escopo</h2><p>Estes Termos regulam o acesso ao Birthly, suas telas, recursos, integrações e assinaturas. Ao criar conta, acessar ou utilizar o app, você declara que leu e concorda com estes Termos. Se não concordar, não utilize o serviço.</p><p>A Política de Privacidade integra estes Termos. A versão aplicável é a apresentada no uso e registrada no aceite quando solicitado.</p></section>
    <section><h2>2. O que o serviço oferece</h2><p>O Birthly organiza aniversariantes, datas, lembretes e cartões personalizados. Conforme o dispositivo, o ambiente e as permissões, o serviço pode incluir cadastro e sincronização, importação de contatos, autenticação, notificações, widget, mensagens, foto de perfil, foto de fundo e assinatura manuscrita no cartão.</p><p>A foto de fundo do cartão é temporária no fluxo atual e é descartada automaticamente ao sair do fluxo ou após compartilhar. Nada fica salvo no app e não há upload automático para o servidor.</p><p>O PNG final somente é enviado ao aplicativo de compartilhamento quando você toca em Compartilhar e confirma o destino.</p></section>
    <section><h2>3. Conta, segurança e elegibilidade</h2><p>Você deve fornecer informações corretas, proteger suas credenciais e comunicar acessos não autorizados. O login pode usar e-mail e senha ou Apple/Google quando disponível. Não compartilhe senha, códigos ou sessão. O app não é intencionalmente direcionado a crianças.</p></section>
    <section><h2>4. Conteúdo e dados de terceiros</h2><p>Você mantém os direitos sobre nomes, datas, notas, mensagens, imagens, desenhos e assinaturas inseridos. Você declara ter autorização ou base legal adequada para cadastrar dados de outras pessoas. Não insira conteúdo ilegal, abusivo, discriminatório, difamatório ou que viole privacidade, imagem, direitos autorais ou segurança.</p></section>
    <section><h2>5. Planos, limites e compras</h2><p>A versão gratuita pode ter limites. Na configuração atual, o limite gratuito é de até 15 aniversariantes. O Premium, quando disponível, amplia os recursos descritos na oferta apresentada no app. Preços, renovação, cancelamento, restauração e reembolso seguem a loja responsável pela cobrança.</p></section>
    <section><h2>6. Permissões e terceiros</h2><p>O app pode solicitar contatos, câmera, fotos, notificações e autenticação local para recursos específicos. Supabase fornece autenticação, banco e sincronização; Firebase fornece analytics, Crashlytics e mensagens push; Apple e Google fornecem serviços de plataforma e compras quando usados.</p></section>
    <section><h2>7. Uso aceitável</h2><p>Você não pode acessar contas ou dados de terceiros, burlar limites, explorar vulnerabilidades, interferir no serviço, distribuir malware, automatizar requisições abusivas ou usar o Birthly para finalidade ilegal.</p></section>
    <section><h2>8. Disponibilidade e responsabilidade</h2><p>Autenticação, nuvem, notificações, lojas, galeria, câmera e compartilhamento dependem de terceiros e podem ficar indisponíveis ou mudar. Lembretes são auxílio e não substituem a conferência das datas.</p></section>
    <section><h2>9. Propriedade intelectual</h2><p>Nome, identidade visual, código, interfaces, ilustrações, textos e componentes do Birthly pertencem ao titular ou licenciantes. Não copie, venda, alugue, redistribua ou explore comercialmente o app sem autorização.</p></section>
    <section><h2>10. Exclusão e encerramento</h2><p>Você pode iniciar a exclusão da conta pelo perfil. A exclusão remove ou torna inacessíveis os dados segundo o fluxo implementado e as obrigações de retenção. Backups, segurança, comprovantes de transação e registros legais podem permanecer pelo tempo necessário.</p></section>
    <section><h2>11. Alterações futuras</h2><p>Podemos atualizar estes Termos por mudanças no app, serviços, legislação, segurança ou modelo comercial. Cada versão terá número e vigência. Mudanças materiais serão destacadas e, quando necessário, exigirão novo aceite.</p></section>
    <section><h2>12. Lei aplicável e contato</h2><p>Estes Termos são regidos pelas leis brasileiras. O controlador é Eduardo Shoiti Fujiwara, pessoa física, sob a marca FujiSys, contatável pelo endereço Rua Conselheiro Brotero, 717, São Paulo - SP, CEP 01232-011, e pelo e-mail <a href={`mailto:${BIRTHLY_PRODUCT.support.email}?subject=Termos%20de%20Uso%20Birthly`}>{BIRTHLY_PRODUCT.support.email}</a>.</p></section>
    <nav className="support-nav" aria-label="Documentos oficiais do Birthly"><Link href={BIRTHLY_PRODUCT.linkRoutes.privacy()}>Política de privacidade <Arrow /></Link><a href={siteAssetPath("/birthly/legal/terms-of-use-v3.pdf")}>Baixar PDF <Arrow /></a></nav>
  </LegalLayout></div>;
}

export function PrivacyPage() {
  return <div className="privacy-page"><LegalLayout eyebrow="Birthly · Documento oficial" title="Política de Privacidade" intro="Transparência e cuidado também fazem parte da experiência Birthly.">
    <p className="updated">Versão v3.0 · Vigência: 01 de novembro de 2026</p>
    <section><h2>1. Sobre esta política</h2><p>A Fuji Sys é responsável pelo aplicativo Birthly. Esta política explica, em linguagem clara, qual dado pessoal utilizamos, por que ele é necessário e quais escolhas você tem.</p></section>
    <section><h2>2. Dado pessoal coletado</h2><p>O <strong>único dado pessoal coletado pelo Birthly é o seu endereço de e-mail</strong>. Não coletamos outros dados pessoais para o funcionamento da conta.</p></section>
    <section><h2>3. Como usamos seu e-mail</h2><p>Usamos o endereço de e-mail exclusivamente para <strong>autenticação, acesso e gestão da conta</strong> no Birthly, incluindo o envio das mensagens necessárias para você entrar e administrar seu acesso.</p></section>
    <section><h2>4. Venda, publicidade e compartilhamento</h2><p><strong>Não vendemos seus dados</strong> e não compartilhamos seu e-mail para publicidade. O dado é utilizado somente nas finalidades descritas nesta política.</p><p>Usamos a <strong>Resend</strong> como fornecedora de infraestrutura para o envio dos e-mails de autenticação. Ela processa o endereço de e-mail apenas na medida necessária para prestar esse serviço.</p></section>
    <section><h2>5. Segurança</h2><p>Adotamos medidas técnicas e organizacionais razoáveis para proteger o e-mail contra acesso, alteração, divulgação ou destruição não autorizados. O acesso é limitado às pessoas e aos fornecedores que precisam da informação para operar o serviço.</p></section>
    <section><h2>6. Retenção</h2><p>Mantemos seu e-mail apenas pelo período necessário ao funcionamento e à gestão da sua conta e ao cumprimento de obrigações legais ou regulatórias aplicáveis. Fotos de fundo e arquivos temporários do cartão são usados somente durante a criação/compartilhamento e descartados automaticamente ao sair do fluxo ou após compartilhar; nada fica salvo no app e não há upload automático. Quando a retenção não for mais necessária, o dado será excluído ou anonimizado de forma segura.</p></section>
    <section><h2>7. Seus direitos</h2><p>Você pode solicitar acesso ao seu dado, correção do endereço de e-mail ou exclusão da conta e do dado associado. Para exercer esses direitos, escreva para <a href={`mailto:${BIRTHLY_PRODUCT.support.email}?subject=Privacidade%20Birthly`}>{BIRTHLY_PRODUCT.support.email}</a>. Poderemos pedir informações suficientes para confirmar que a solicitação pertence ao titular da conta.</p></section>
    <section><h2>8. Alterações nesta política</h2><p>Esta política poderá ser atualizada para refletir mudanças no Birthly ou em nossas práticas. A nova versão será publicada nesta mesma URL, acompanhada da data de vigência.</p></section>
    <section><h2>9. Contato</h2><p>Para dúvidas sobre privacidade ou sobre o tratamento do seu e-mail, entre em contato com a Fuji Sys pelo endereço <a href={`mailto:${BIRTHLY_PRODUCT.support.email}?subject=Privacidade%20Birthly`}>{BIRTHLY_PRODUCT.support.email}</a>.</p></section>
    <nav className="support-nav" aria-label="Documentos oficiais do Birthly"><Link href={BIRTHLY_PRODUCT.linkRoutes.terms()}>Termos de Uso <Arrow /></Link><a href={siteAssetPath("/birthly/legal/privacy-policy-v3.pdf")}>Baixar PDF <Arrow /></a></nav>
  </LegalLayout></div>;
}

const faqs = [
  ["Como acesso minha conta?", "Use o seu endereço de e-mail na tela de acesso do Birthly e siga as instruções enviadas para a sua caixa de entrada."],
  ["Não recebi o e-mail de login. O que faço?", "Confira as pastas de spam, lixo eletrônico e promoções. Verifique também se o endereço informado está correto e aguarde alguns minutos antes de tentar novamente."],
  ["Como atualizo meu endereço de e-mail?", `Envie uma mensagem para ${BIRTHLY_PRODUCT.support.email} explicando que deseja atualizar o e-mail da conta. Orientaremos você sobre os próximos passos.`],
  ["Como excluo minha conta?", `Solicite a exclusão pelo e-mail ${BIRTHLY_PRODUCT.support.email}. Para proteger sua conta, poderemos confirmar sua identidade antes de concluir o pedido.`],
  ["Como o Birthly cuida da minha privacidade?", "O único dado pessoal utilizado é seu e-mail, exclusivamente para autenticação, acesso e gestão da conta. Consulte a Política de Privacidade para conhecer todos os detalhes."],
] as const;

export function SupportPage() {
  const mailto = `mailto:${BIRTHLY_PRODUCT.support.email}?subject=Suporte%20Birthly`;
  return <div className="support-page">
    <section className="support-hero"><Reveal className="layered-reveal"><p className="eyebrow coral">Birthly · Suporte</p><h1>Suporte do Birthly</h1><p className="lede">Se algo não saiu como esperado, conte com a gente. Vamos entender o que aconteceu e orientar você.</p><a className="button coral-button" href={mailto}>Enviar e-mail <Arrow /></a></Reveal><Reveal delay={160}><aside className="support-card"><LottiePlayer className="support-email-lottie" src={assetPath("/birthday/lotties/email.lottie")} label="E-mail de suporte" /><p>Canal de atendimento</p><a href={mailto}>{BIRTHLY_PRODUCT.support.email}</a><span>Responderemos assim que possível.</span></aside></Reveal></section>
    <section className="support-guide"><p className="section-index">Para agilizar</p><div><h2>O que incluir na mensagem</h2><p>Descreva o problema e o que você esperava que acontecesse. Quando for útil, informe também a versão do Birthly e a versão do sistema do seu aparelho. Não envie senhas ou códigos de acesso.</p></div></section>
    <Reveal><section className="faq section" aria-labelledby="faq-title"><header><p className="section-index">Dúvidas frequentes</p><h2 id="faq-title">Talvez a resposta esteja aqui.</h2></header><div>{faqs.map(([question, answer], index) => <Reveal key={question} delay={index * 60}><details><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details></Reveal>)}</div></section></Reveal>
    <nav className="support-nav" aria-label="Links do Birthly"><Link href={BIRTHLY_PRODUCT.linkRoutes.home()}>← Voltar ao Birthly</Link><Link href={BIRTHLY_PRODUCT.linkRoutes.privacy()}>Política de privacidade <Arrow /></Link></nav>
  </div>;
}

export function InstitutionalPrivacyPage() {
  return <div className="privacy-page"><LegalLayout eyebrow="Fuji Sys · Documento institucional" title="Política de Privacidade" intro="Como a Fuji Sys cuida das informações relacionadas ao seu contato com a empresa.">
    <p className="updated">Última atualização: 29 de setembro de 2026</p>
    <section><h2>1. Escopo</h2><p>Esta política descreve as práticas institucionais da Fuji Sys para informações recebidas por nossos canais de contato e pelo site.</p></section>
    <section><h2>2. Uso das informações</h2><p>Usamos as informações necessárias para responder solicitações, prestar suporte e manter o funcionamento seguro do site. Não vendemos dados pessoais.</p></section>
    <section><h2>3. Seus direitos</h2><p>Para dúvidas, solicitações de acesso ou exclusão de dados relacionados ao seu contato, escreva para <a href={`mailto:${INSTITUTIONAL_SITE.email}?subject=Privacidade%20Fuji%20Sys`}>{INSTITUTIONAL_SITE.email}</a>.</p></section>
    <aside className="legal-note">Este texto descreve as práticas operacionais informadas pela Fuji Sys e não constitui parecer jurídico.</aside>
  </LegalLayout></div>;
}

export function InstitutionalSupportPage() {
  const mailto = `mailto:${INSTITUTIONAL_SITE.email}?subject=Contato%20Fuji%20Sys`;
  return <div className="support-page">
    <section className="support-hero"><Reveal className="layered-reveal"><p className="eyebrow">Fuji Sys · Suporte</p><h1>Como podemos ajudar?</h1><p className="lede">Conte o que você precisa e encaminharemos sua mensagem para o canal adequado.</p><a className="button" href={mailto}>Enviar e-mail <Arrow /></a></Reveal><Reveal delay={160}><aside className="support-card"><p>Canal de atendimento</p><a href={mailto}>{INSTITUTIONAL_SITE.email}</a><span>Responderemos assim que possível.</span></aside></Reveal></section>
  </div>;
}

export function NotFoundPage() { return <section className="not-found"><p className="eyebrow">Erro 404</p><h1>Essa página saiu para comemorar.</h1><p className="lede">O endereço pode ter mudado ou não existe.</p><Link className="button" href={INSTITUTIONAL_SITE.linkRoutes.home()}>Voltar ao início</Link></section>; }
