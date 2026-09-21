# Fuji Sys — migração de Vite para Next.js com exportação estática

Data: 20 de setembro de 2026

## Objetivo

Migrar o site institucional Fuji Sys de React + Vite para Next.js, mantendo a experiência visual, as páginas públicas e os assets existentes, mas substituindo o roteamento manual por rotas nativas do Next App Router.

Nesta etapa, o site será exclusivamente estático. A arquitetura deverá continuar simples e compatível com hospedagem de arquivos estáticos, mantendo a possibilidade de remover a exportação estática no futuro para estudar SSR em uma rota isolada.

## Escopo funcional

Manter as quatro rotas públicas atuais:

- `/`: página institucional da Fuji Sys;
- `/birthly`: apresentação do Birthly;
- `/birthly/privacy`: política de privacidade;
- `/birthly/support`: suporte do Birthly.

Rotas inexistentes deverão utilizar o mecanismo de 404 do Next. Os links internos deverão usar `next/link` quando houver navegação entre páginas. Links externos, `mailto:` e âncoras da própria página permanecerão como elementos HTML apropriados.

## Arquitetura

O projeto usará o App Router:

```text
app/
  layout.tsx
  page.tsx
  birthly/page.tsx
  birthly/privacy/page.tsx
  birthly/support/page.tsx
  not-found.tsx
```

O layout compartilhado conterá `SiteHeader`, `main` e `SiteFooter`. Cada página terá seu próprio componente de conteúdo e metadata específica. A lógica atual de `window.location.pathname` e as entradas HTML múltiplas do Vite serão removidas.

O arquivo `next.config.ts` usará `output: "export"`. O comando `next build` produzirá a pasta `out`, contendo HTML, CSS, JavaScript e assets prontos para um servidor estático. Não serão usados SSR, ISR, Server Actions, cookies, headers ou APIs do Next nesta etapa.

Componentes que dependem de APIs do navegador ou de efeitos de interação, como `Reveal` e `LottiePlayer`, serão marcados como Client Components somente onde necessário. O restante permanecerá como Server Components estáticos.

## Migração técnica

- substituir dependências e scripts de Vite por `next`, mantendo React e TypeScript;
- mover estilos globais para o layout global do Next;
- mover assets públicos para `public/` sem alterar seus caminhos técnicos necessários;
- substituir `window.location` por composição de páginas do App Router;
- substituir caminhos calculados por `next/link` e caminhos estáticos compatíveis com exportação;
- preservar o suporte a deploy sob domínio próprio e, se necessário, configurar `basePath`/`assetPrefix` explicitamente em vez de detectar o hostname em runtime;
- preservar a acessibilidade, metadata, animações e conteúdo atual.

## Deploy

O artefato de produção será `out/`. O deploy primário continuará compatível com GitHub Pages ou poderá ser feito em Cloudflare Pages/Vercel como hospedagem estática. Nenhum servidor Node será necessário enquanto `output: "export"` estiver ativo.

Se futuramente for necessário estudar SSR, a configuração `output: "export"` será removida e o deploy deverá usar um runtime Next, como Vercel ou um servidor Node executando `next start`. Essa alteração ficará fora desta migração.

## Validação

A entrega será considerada pronta quando:

- `npm run build` concluir sem erros;
- a pasta `out/` contiver `index.html`, `birthly/index.html`, `birthly/privacy/index.html`, `birthly/support/index.html` e `404.html`;
- cada rota puder ser acessada diretamente por seu caminho estático;
- títulos e descrições das páginas forem preservados;
- links internos, links de suporte e assets Lottie funcionarem;
- não houver dependência de `window` durante o build em componentes Server;
- a preferência `prefers-reduced-motion` continuar respeitada;
- TypeScript e lint/verificações disponíveis no projeto passarem.

## Fora do escopo

- SSR, ISR, Server Actions ou API Routes;
- backend, autenticação ou formulário de contato;
- alteração do conteúdo editorial ou visual;
- novo sistema de design;
- analytics, cookies ou CMS;
- publicação automática em uma nova plataforma.
