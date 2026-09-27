# Birthly Web Email Confirmation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar no `fujisys-site` as rotas estáticas `/birthly/confirm-email/` e `/birthly/open-app/`, prontas para serem usadas como destino web do fluxo de confirmação de e-mail do app Birthly.

**Architecture:** Um módulo puro interpreta os parâmetros de callback sem depender do navegador; uma camada client-side lê query/fragmento, limpa a URL e guarda somente o estado seguro de confirmação. As páginas Next reutilizam o shell visual existente e são exportadas estaticamente, sem SDK ou segredo do Supabase. A configuração de produção será documentada com o domínio oficial `https://fujisys.com.br`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS global existente, Node `node:test` e export estático do Next.

**Spec:** `docs/superpowers/specs/2026-09-27-birthly-email-confirmation-web-design.md`

## Global Constraints

- O site é um export estático do Next.js e não terá sessão, chaves do Supabase ou chamada de API no navegador.
- A confirmação do token continua sendo responsabilidade do Supabase; o site apenas apresenta o resultado recebido.
- Os estados públicos são somente `success`, `error` e `unknown`.
- O app deverá usar `EMAIL_CONFIRM_REDIRECT_URL=https://fujisys.com.br/birthly/confirm-email/` após o deploy.
- No Supabase, o Site URL é `https://fujisys.com.br` e o redirect permitido é `https://fujisys.com.br/birthly/confirm-email/`.
- Durante a migração, `birthday://signup-confirmation` permanece permitido.
- O CTA transporta somente `confirmation_result=success|error|unknown`.
- Nenhum token, descrição de erro ou parâmetro bruto pode ser persistido, renderizado ou enviado para analytics.
- `/birthly/open-app/` não é o `redirectTo` do Supabase.
- Não serão implementados Universal Links/App Links sem domínio e identidade de assinatura confirmados.

## Review Focus

- Query com erro e marcador de sucesso: erro deve prevalecer; cobrir no parser da Task 1.
- Fragmento com access/refresh token: URL deve ser limpa sem armazenar o token; cobrir na Task 1.
- Código PKCE vazio, callback sem marcador ou visita direta: estado deve ser `unknown`; cobrir na Task 1.
- CTA com estado arbitrário ou retorno forjado sem estado de sessão: não pode afirmar sucesso; cobrir na Task 2.
- Callback em outra rota ou export com base path diferente: não deve alterar a página de confirmação e as duas rotas devem existir no output; cobrir nas Tasks 2 e 4.

### Task 1: Criar o contrato puro de confirmação e os testes do parser

**Files:**
- Create: `src/lib/emailConfirmation.mjs`
- Create: `src/lib/emailConfirmation.d.mts` para expor a API ao TypeScript do Next
- Create: `test-web/email-confirmation.test.mjs`
- Modify: `package.json` somente se for necessário adicionar um script de teste sem alterar dependências de runtime

**Interfaces:**
- Produces: `ConfirmationStatus = "success" | "error" | "unknown"`.
- Produces: `parseConfirmationResult(search: string, hash: string): { status: ConfirmationStatus }`.
- Produces: `sanitizeCallbackUrl(pathname: string): string`.
- Produces: `buildConfirmationResultUrl(pathname: string, status: ConfirmationStatus): string`.
- Consumes: strings `window.location.search` e `window.location.hash`, sem acessar `window` dentro do parser.

- [ ] **Step 1: Escrever os testes vermelhos do parser**

  Cobrir sucesso por `type=signup`, token no fragmento, código PKCE não vazio, erro com precedência, código vazio, visita direta, parâmetros vazios e retorno seguro limitado aos três estados.

- [ ] **Step 2: Executar os testes para confirmar a falha**

  Run: `node --test test-web/email-confirmation.test.mjs`

  Expected: FAIL porque `src/lib/emailConfirmation` ainda não existe.

- [ ] **Step 3: Implementar o módulo puro**

  Usar `URLSearchParams` para query e fragmento; mapear a presença de qualquer campo de erro para `error`; reconhecer somente marcadores de signup, token ou código PKCE não vazio; retornar `unknown` nos demais casos. Sanitizar removendo query/fragmento e gerar URLs de CTA apenas com `confirmation_result` permitido.

- [ ] **Step 4: Executar os testes para confirmar a passagem**

  Run: `node --test test-web/email-confirmation.test.mjs`

  Expected: todos os casos passam.

- [ ] **Step 5: Commit**

  ```bash
  git add src/lib/emailConfirmation.mjs src/lib/emailConfirmation.d.mts test-web/email-confirmation.test.mjs package.json package-lock.json
  git commit -m "feat: add Birthly email confirmation contract"
  ```

### Task 2: Implementar a página `/birthly/confirm-email/`

**Files:**
- Create: `app/birthly/confirm-email/page.tsx`
- Create: `src/components/pages/EmailConfirmationPage.tsx`
- Create: `src/components/pages/EmailConfirmationPage.module.css`
- Create: `src/lib/emailConfirmationNavigation.mjs`
- Create: `src/lib/emailConfirmationNavigation.d.mts`
- Modify: `src/lib/site.ts` para registrar a rota `confirmEmail`
- Create: `test-web/email-confirmation-navigation.test.mjs`

**Interfaces:**
- Consumes: `ConfirmationStatus` e funções do módulo `src/lib/emailConfirmation.mjs`.
- Produces: `processConfirmationCallback(locationLike, expectedPath)` para a camada client-side.
- Produces: página estática com `metadata.title` contendo `Confirmação de e-mail do Birthly`.
- Produces: CTA `Abrir Birthly` com estado seguro e ação secundária para continuar no navegador.

- [ ] **Step 1: Escrever os testes vermelhos de navegação**

  Criar um browser fake com `location`, `history.replaceState` e `sessionStorage`; verificar `processConfirmationCallback(locationLike, expectedPath)`, limpeza de query/fragmento, armazenamento somente do estado fechado, CTA contendo apenas `source=email-confirmation` e `confirmation_result`, e callbacks em `/birthly/open-app/` não sendo processados.

- [ ] **Step 2: Executar o teste para confirmar a falha**

  Run: `node --test test-web/email-confirmation-navigation.test.mjs`

  Expected: FAIL porque a página/utilitário de navegação ainda não existe.

- [ ] **Step 3: Implementar a página client-side**

  Criar `processConfirmationCallback(locationLike, expectedPath)` em `src/lib/emailConfirmationNavigation.mjs` para aceitar apenas a rota esperada, calcular o estado através do parser, retornar o caminho sanitizado e guardar somente o estado permitido quando o usuário tocar no CTA. Criar o componente client que invoque esse módulo em `useEffect`, inicialize em `unknown` no servidor, chame `history.replaceState` antes de navegar e use cópia fixa em português para sucesso, erro e estado neutro. Não renderizar valores vindos dos parâmetros. Reutilizar `SiteHeader`, `SiteFooter` e `main` pelo `RootLayout` existente.

- [ ] **Step 4: Implementar o visual responsivo**

  Usar um cartão central com a paleta Birthly/Fuji Sys, foco visível, contraste adequado e uma coluna em telas estreitas. Diferenciar sucesso e erro por ícone, cor e texto, sem depender somente de emoji.

- [ ] **Step 5: Executar os testes de navegação e build TypeScript**

  Run: `node --test test-web/email-confirmation-navigation.test.mjs && npm run build`

  Expected: testes passam e a rota `birthly/confirm-email/index.html` é gerada.

- [ ] **Step 6: Commit**

  ```bash
  git add app/birthly/confirm-email src/components/pages/EmailConfirmationPage.tsx src/components/pages/EmailConfirmationPage.module.css src/lib/site.ts src/lib/emailConfirmationNavigation.mjs src/lib/emailConfirmationNavigation.d.mts test-web/email-confirmation-navigation.test.mjs
  git commit -m "feat: add Birthly email confirmation page"
  ```

### Task 3: Implementar `/birthly/open-app/` e configurações públicas de build

**Files:**
- Create: `app/birthly/open-app/page.tsx`
- Create: `src/components/pages/OpenBirthlyPage.tsx`
- Create: `src/components/pages/OpenBirthlyPage.module.css`
- Modify: `src/lib/site.ts` para registrar `openApp`
- Create: `test-web/open-app-navigation.test.mjs`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_BIRTHLY_IOS_URL` e `NEXT_PUBLIC_BIRTHLY_ANDROID_URL`, quando presentes no build.
- Produces: CTA/deep link `birthday://signup-confirmation` e retorno para `https://fujisys.com.br/birthly/confirm-email/` ou caminho equivalente ao `NEXT_PUBLIC_BASE_PATH`.

- [ ] **Step 1: Escrever os testes vermelhos da página fallback**

  Cobrir que o retorno conserva somente o resultado permitido, que links de loja ausentes não criam botões vazios e que valores públicos de loja são renderizados como links HTTPS.

- [ ] **Step 2: Executar o teste para confirmar a falha**

  Run: `node --test test-web/open-app-navigation.test.mjs`

  Expected: FAIL porque a página e as funções de composição ainda não existem.

- [ ] **Step 3: Implementar a página fallback**

  Exibir instrução para abrir/instalar o Birthly, links condicionais para as lojas e link de retorno à confirmação. O deep link deve ser acionado explicitamente pelo usuário; não iniciar redirecionamento automático no carregamento.

- [ ] **Step 4: Executar testes e build**

  Run: `node --test test-web/open-app-navigation.test.mjs && npm run build`

  Expected: testes passam e `birthly/open-app/index.html` é gerado.

- [ ] **Step 5: Commit**

  ```bash
  git add app/birthly/open-app src/components/pages/OpenBirthlyPage.tsx src/components/pages/OpenBirthlyPage.module.css src/lib/site.ts test-web/open-app-navigation.test.mjs
  git commit -m "feat: add Birthly open app fallback"
  ```

### Task 4: Fechar a verificação do export e o contrato de integração

**Files:**
- Modify: `scripts/verify-static-output.mjs`
- Create: `docs/integrations/birthly-email-confirmation.md`
- Modify: `package.json` somente se necessário para expor `test:web`
- Test: `test-web/*.test.mjs`

**Interfaces:**
- Consumes: as duas páginas estáticas e os módulos produzidos nas Tasks 1–3.
- Produces: verificador que exige os arquivos `out/birthly/confirm-email/index.html` e `out/birthly/open-app/index.html`, com títulos esperados.

- [ ] **Step 1: Escrever o teste de contrato do export**

  Expandir `scripts/verify-static-output.mjs` para falhar quando uma das duas rotas ou títulos não estiver no `out/`.

- [ ] **Step 2: Implementar a verificação e o documento de integração**

  Documentar o valor final do app, as configurações do Supabase, o redirect legado temporário e os comandos de staging. Não afirmar que a configuração externa foi aplicada; registrar explicitamente o que deve ser feito no dashboard.

- [ ] **Step 3: Rodar a suíte completa**

  Run: `npm run build && npm run test:static && node --test test-web/*.test.mjs && git diff --check`

  Expected: build, verificador, testes web e checagem de whitespace passam sem falhas.

- [ ] **Step 4: Commit**

  ```bash
  git add scripts/verify-static-output.mjs docs/integrations package.json package-lock.json test-web
  git commit -m "test: verify Birthly confirmation static integration"
  ```
