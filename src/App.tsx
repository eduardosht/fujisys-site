import type { ReactNode } from "react";
import { LegalLayout } from "./components/LegalLayout";
import { LottiePlayer } from "./components/LottiePlayer";
import { Reveal } from "./components/Reveal";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { getRoute, PRODUCTS, SITE } from "./lib/site";

const Arrow = () => <span aria-hidden="true">↗</span>;

function HomePage() {
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
      {PRODUCTS.map((product) => <a className="product-card" href={product.href} key={product.name}>
        <div className="birthday-product-art">
          <img className="birthday-logo" src="/birthday/app-icon.png" alt="" />
          <LottiePlayer className="product-lottie" src="/birthday/lotties/present.lottie" />
        </div>
        <div className="product-copy"><p className="eyebrow">Nosso primeiro produto</p><h3>{product.name}</h3><p className="product-tagline">{product.eyebrow}</p><p>{product.description}</p><span className="card-link">Conheça o Birthday <Arrow /></span></div>
      </a>)}
    </section></Reveal>

    <Reveal><section className="contact-panel" id="contato"><p className="eyebrow">Tem uma ideia?</p><h2>Vamos criar algo útil?</h2><p>Conversas boas também começam de um jeito simples.</p><a className="button button-light" href={`mailto:${SITE.email}`}>Fale com a Fuji Sys <Arrow /></a></section></Reveal>
  </>;
}

function BirthdayPage() {
  return <div className="birthday-page">
    <section className="hero birthday-hero">
      <Reveal className="hero-copy layered-reveal"><p className="eyebrow coral">Um produto Fuji Sys</p><h1>Birthday</h1><p className="birthday-lead">Datas importantes merecem mais do que depender da memória.</p><p className="lede">Um jeito simples e cuidadoso de organizar aniversários e manter pessoas queridas por perto.</p><div className="actions"><a className="button coral-button" href={SITE.routes.support}>Preciso de ajuda</a><a className="text-link" href={SITE.routes.privacy}>Ver privacidade <Arrow /></a></div></Reveal>
      <Reveal className="birthday-stage-reveal" delay={160}><div className="birthday-stage"><img className="birthday-hero-logo" src="/birthday/app-icon.png" alt="Ícone do aplicativo Birthday" /><LottiePlayer className="celebration-lottie" src="/birthday/lotties/celebration.lottie" /><span className="confetti c1" /><span className="confetti c2" /><span className="confetti c3" /></div></Reveal>
    </section>
    <Reveal><section className="birthday-statement section"><p className="section-index">Por que Birthday</p><h2>Lembrar também é uma forma de cuidar.</h2><p>O Birthday reúne o essencial em uma experiência tranquila, para que as datas que importam estejam sempre ao seu alcance.</p></section></Reveal>
    <section className="benefit-grid section" aria-label="Benefícios do Birthday">
      <Reveal className="benefit-reveal"><article className="benefit-with-lottie"><LottiePlayer className="notification-lottie" src="/birthday/lotties/notification.lottie" label="Lembretes de datas importantes" /><span className="benefit-icon">01</span><h2>Tudo em um só lugar</h2><p>Organize datas importantes sem complicação e encontre o que precisa com facilidade.</p></article></Reveal>
      <Reveal className="benefit-reveal" delay={120}><article><span className="benefit-icon">02</span><h2>Acesso simples</h2><p>Entre com sua conta usando seu e-mail e mantenha seu acesso de forma prática.</p></article></Reveal>
      <Reveal className="benefit-reveal" delay={240}><article><span className="benefit-icon">03</span><h2>Feito com cuidado</h2><p>Uma experiência leve, clara e pensada para acompanhar momentos que merecem atenção.</p></article></Reveal>
    </section>
    <Reveal><section className="official-links"><div><p className="eyebrow coral">Informações oficiais</p><h2>Transparência faz parte.</h2></div><div className="link-list"><a href={SITE.routes.privacy}>Política de privacidade <Arrow /></a><a href={SITE.routes.support}>Suporte do Birthday <Arrow /></a></div></section></Reveal>
  </div>;
}

function PrivacyPage() {
  return <div className="privacy-page"><LegalLayout eyebrow="Birthday · Documento oficial" title="Política de Privacidade" intro="Transparência e cuidado também fazem parte da experiência Birthday." decoration={<LottiePlayer className="privacy-leaf" src="/birthday/lotties/leaf.lottie" />}>
    <p className="updated">Última atualização: 16 de julho de 2026</p>
    <section><h2>1. Sobre esta política</h2><p>A Fuji Sys é responsável pelo aplicativo Birthday. Esta política explica, em linguagem clara, qual dado pessoal utilizamos, por que ele é necessário e quais escolhas você tem.</p></section>
    <section><h2>2. Dado pessoal coletado</h2><p>O <strong>único dado pessoal coletado pelo Birthday é o seu endereço de e-mail</strong>. Não coletamos outros dados pessoais para o funcionamento da conta.</p></section>
    <section><h2>3. Como usamos seu e-mail</h2><p>Usamos o endereço de e-mail exclusivamente para <strong>autenticação, acesso e gestão da conta</strong> no Birthday, incluindo o envio das mensagens necessárias para você entrar e administrar seu acesso.</p></section>
    <section><h2>4. Venda, publicidade e compartilhamento</h2><p><strong>Não vendemos seus dados</strong> e não compartilhamos seu e-mail para publicidade. O dado é utilizado somente nas finalidades descritas nesta política.</p><p>Usamos a <strong>Resend</strong> como fornecedora de infraestrutura para o envio dos e-mails de autenticação. Ela processa o endereço de e-mail apenas na medida necessária para prestar esse serviço.</p></section>
    <section><h2>5. Segurança</h2><p>Adotamos medidas técnicas e organizacionais razoáveis para proteger o e-mail contra acesso, alteração, divulgação ou destruição não autorizados. O acesso é limitado às pessoas e aos fornecedores que precisam da informação para operar o serviço.</p></section>
    <section><h2>6. Retenção</h2><p>Mantemos seu e-mail apenas pelo período necessário ao funcionamento e à gestão da sua conta e ao cumprimento de obrigações legais ou regulatórias aplicáveis. Quando a retenção não for mais necessária, o dado será excluído ou anonimizado de forma segura.</p></section>
    <section><h2>7. Seus direitos</h2><p>Você pode solicitar acesso ao seu dado, correção do endereço de e-mail ou exclusão da conta e do dado associado. Para exercer esses direitos, escreva para <a href={`mailto:${SITE.email}?subject=Privacidade%20Birthday`}>{SITE.email}</a>. Poderemos pedir informações suficientes para confirmar que a solicitação pertence ao titular da conta.</p></section>
    <section><h2>8. Alterações nesta política</h2><p>Esta política poderá ser atualizada para refletir mudanças no Birthday ou em nossas práticas. A nova versão será publicada nesta mesma URL, acompanhada da data de atualização.</p></section>
    <section><h2>9. Contato</h2><p>Para dúvidas sobre privacidade ou sobre o tratamento do seu e-mail, entre em contato com a Fuji Sys pelo endereço <a href={`mailto:${SITE.email}?subject=Privacidade%20Birthday`}>{SITE.email}</a>.</p></section>
    <aside className="legal-note">Este texto descreve as práticas operacionais informadas pela Fuji Sys e não constitui parecer jurídico.</aside>
  </LegalLayout></div>;
}

const faqs = [
  ["Como acesso minha conta?", "Use o seu endereço de e-mail na tela de acesso do Birthday e siga as instruções enviadas para a sua caixa de entrada."],
  ["Não recebi o e-mail de login. O que faço?", "Confira as pastas de spam, lixo eletrônico e promoções. Verifique também se o endereço informado está correto e aguarde alguns minutos antes de tentar novamente."],
  ["Como atualizo meu endereço de e-mail?", `Envie uma mensagem para ${SITE.email} explicando que deseja atualizar o e-mail da conta. Orientaremos você sobre os próximos passos.`],
  ["Como excluo minha conta?", `Solicite a exclusão pelo e-mail ${SITE.email}. Para proteger sua conta, poderemos confirmar sua identidade antes de concluir o pedido.`],
  ["Como o Birthday cuida da minha privacidade?", "O único dado pessoal utilizado é seu e-mail, exclusivamente para autenticação, acesso e gestão da conta. Consulte a Política de Privacidade para conhecer todos os detalhes."],
] as const;

function SupportPage() {
  const mailto = `mailto:${SITE.email}?subject=Suporte%20Birthday`;
  return <div className="support-page">
    <section className="support-hero"><Reveal className="layered-reveal"><p className="eyebrow coral">Birthday · Suporte</p><h1>Suporte do Birthday</h1><p className="lede">Se algo não saiu como esperado, conte com a gente. Vamos entender o que aconteceu e orientar você.</p><a className="button coral-button" href={mailto}>Enviar e-mail <Arrow /></a></Reveal><Reveal delay={160}><aside className="support-card"><LottiePlayer className="support-email-lottie" src="/birthday/lotties/email.lottie" label="E-mail de suporte" /><p>Canal de atendimento</p><a href={mailto}>{SITE.email}</a><span>Responderemos assim que possível.</span></aside></Reveal></section>
    <section className="support-guide"><p className="section-index">Para agilizar</p><div><h2>O que incluir na mensagem</h2><p>Descreva o problema e o que você esperava que acontecesse. Quando for útil, informe também a versão do Birthday e a versão do sistema do seu aparelho. Não envie senhas ou códigos de acesso.</p></div></section>
    <Reveal><section className="faq section" aria-labelledby="faq-title"><header><p className="section-index">Dúvidas frequentes</p><h2 id="faq-title">Talvez a resposta esteja aqui.</h2></header><div>{faqs.map(([question, answer], index) => <Reveal key={question} delay={index * 60}><details><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details></Reveal>)}</div></section></Reveal>
    <nav className="support-nav" aria-label="Links do Birthday"><a href={SITE.routes.birthday}>← Voltar ao Birthday</a><a href={SITE.routes.privacy}>Política de privacidade <Arrow /></a></nav>
  </div>;
}

function NotFoundPage() { return <section className="not-found"><p className="eyebrow">Erro 404</p><h1>Essa página saiu para comemorar.</h1><p className="lede">O endereço pode ter mudado ou não existe.</p><a className="button" href={SITE.routes.home}>Voltar ao início</a></section>; }

function Shell({ children }: { children: ReactNode }) { return <><SiteHeader /><main id="conteudo">{children}</main><SiteFooter /></>; }

export default function App() {
  const route = getRoute(window.location.pathname);
  const page = route === "/" ? <HomePage /> : route === "/birthday" ? <BirthdayPage /> : route === "/birthday/privacy" ? <PrivacyPage /> : route === "/birthday/support" ? <SupportPage /> : <NotFoundPage />;
  return <Shell>{page}</Shell>;
}
