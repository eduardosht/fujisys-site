# Fuji Sys Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir, validar e publicar o site institucional da Fuji Sys com páginas oficiais do Birthday para produto, privacidade e suporte.

**Architecture:** Aplicação React/Vinext estática e multipágina, criada pelo inicializador oficial de Sites dentro deste diretório em `Documentos`. Layout, navegação e rodapé serão compartilhados; cada rota manterá seu próprio conteúdo e metadados, com estilos globais responsivos e animações progressivas sem dependência de backend.

**Tech Stack:** React, TypeScript, Vinext/Vite, CSS nativo, Vitest, Testing Library, Sites Hosting e GitHub CLI/conector GitHub.

## Global Constraints

- **Hosting override (16 July 2026):** use plain Vite + React and deploy only to GitHub Pages. Do not use Vinext, Next-style `app/` routes, Cloudflare, Sites Hosting or `.openai/hosting.json`. Produce real static entry files for `/`, `/birthday/`, `/birthday/privacy/` and `/birthday/support/` so direct Apple review URLs work without hash routing or SPA fallback tricks.
- **User override (16 July 2026):** unit tests are not a core deliverable. Do not install Vitest or Testing Library and do not create the `tests/` files described in older task steps below. Validate with the production build, direct route checks, required-content searches, and a focused browser smoke test only when needed.
- Diretório do projeto: `/Users/jessicavenancio/Documents/Codex/2026-07-16/vamos-criar-um-outro-projeto-para`.
- Repositório público: `https://github.com/eduardosht/fujisys-site`.
- Rotas obrigatórias: `/`, `/birthday`, `/birthday/privacy` e `/birthday/support`.
- E-mail público e de privacidade: `contato@fujisys.com.br`.
- O único dado pessoal do Birthday é o endereço de e-mail, usado para autenticação, acesso e gestão da conta.
- Resend deve ser identificado como fornecedor de infraestrutura de e-mail.
- Sem formulário, backend, analytics, cookies publicitários, CMS ou integração com App Store nesta versão.
- Todo conteúdo público deve estar em português do Brasil.
- Deve existir suporte a teclado, foco visível, contraste adequado e `prefers-reduced-motion`.
- Não usar ilustrações SVG autorais; a linguagem visual será criada com tipografia, CSS e formas geométricas.

---

## File Map

- `app/layout.tsx`: estrutura HTML, metadados globais e Open Graph.
- `app/page.tsx`: página institucional.
- `app/birthday/page.tsx`: apresentação do Birthday.
- `app/birthday/privacy/page.tsx`: política oficial de privacidade.
- `app/birthday/support/page.tsx`: suporte e FAQ.
- `app/not-found.tsx`: página para rotas inexistentes.
- `app/globals.css`: tokens visuais, layout, responsividade e motion.
- `components/site-header.tsx`: navegação compartilhada e acessível.
- `components/site-footer.tsx`: links institucionais compartilhados.
- `components/reveal.tsx`: entrada progressiva com Intersection Observer.
- `components/legal-layout.tsx`: estrutura legível para páginas longas.
- `lib/site.ts`: URLs, e-mail e dados imutáveis do produto.
- `tests/routes.test.tsx`: presença de conteúdo e links críticos.
- `tests/accessibility.test.tsx`: títulos, regiões e preferências de movimento.
- `public/og.png`: cartão social final, criado somente após a direção visual ficar estável.
- `.openai/hosting.json`: configuração de publicação gerenciada pelo Sites.

### Task 1: Scaffold, test harness, and shared site contract

**Files:**
- Create through initializer: `package.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.openai/hosting.json`
- Create: `lib/site.ts`
- Create: `tests/setup.ts`
- Create: `tests/site-contract.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `SITE`, `PRODUCTS` and `RoutePath` exported from `lib/site.ts`.
- Consumes: none.

- [ ] **Step 1: Initialize the Sites project in the approved Documents directory**

Run the Sites plugin initializer exactly once with the current directory as target, retain the install session, start `npm run dev`, and open the exact printed local URL once in Codex. Do not initialize a nested project.

- [ ] **Step 2: Install the test-only dependencies**

Run:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: dependencies are added without replacing the initializer's package manager or lockfile.

- [ ] **Step 3: Write the failing site-contract test**

Create `tests/site-contract.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { PRODUCTS, SITE } from "../lib/site";

describe("public site contract", () => {
  it("uses the official Fuji Sys identity and Birthday URLs", () => {
    expect(SITE.email).toBe("contato@fujisys.com.br");
    expect(SITE.routes).toEqual({
      home: "/",
      birthday: "/birthday",
      privacy: "/birthday/privacy",
      support: "/birthday/support",
    });
    expect(PRODUCTS).toHaveLength(1);
    expect(PRODUCTS[0].name).toBe("Birthday");
  });
});
```

- [ ] **Step 4: Run the test and confirm the expected failure**

Run: `npm test -- --run tests/site-contract.test.ts`

Expected: FAIL because `lib/site.ts` does not exist.

- [ ] **Step 5: Implement the shared site contract**

Create `lib/site.ts`:

```ts
export type RoutePath = "/" | "/birthday" | "/birthday/privacy" | "/birthday/support";

export const SITE = {
  name: "Fuji Sys",
  email: "contato@fujisys.com.br",
  github: "https://github.com/eduardosht",
  routes: {
    home: "/" as RoutePath,
    birthday: "/birthday" as RoutePath,
    privacy: "/birthday/privacy" as RoutePath,
    support: "/birthday/support" as RoutePath,
  },
} as const;

export const PRODUCTS = [
  {
    name: "Birthday",
    eyebrow: "Lembrar também é cuidar.",
    description: "Um jeito simples e cuidadoso de manter datas importantes por perto.",
    href: SITE.routes.birthday,
  },
] as const;
```

Add `"test": "vitest"` to the existing scripts and configure Vitest with `environment: "jsdom"` and `setupFiles: ["./tests/setup.ts"]`. Create `tests/setup.ts` with `import "@testing-library/jest-dom/vitest";`.

- [ ] **Step 6: Run the contract test**

Run: `npm test -- --run tests/site-contract.test.ts`

Expected: PASS, 1 test.

- [ ] **Step 7: Commit the independently working foundation**

```bash
git add package.json package-lock.json app .openai lib tests
git commit -m "chore: scaffold Fuji Sys site"
```

### Task 2: Shared accessible shell and motion system

**Files:**
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `components/reveal.tsx`
- Create: `tests/shared-shell.test.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `SITE` from `lib/site.ts`.
- Produces: `SiteHeader`, `SiteFooter`, and `Reveal` React components.

- [ ] **Step 1: Write failing shell tests**

Create `tests/shared-shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

describe("shared shell", () => {
  it("exposes the primary navigation and support contact", () => {
    render(<><SiteHeader /><SiteFooter /></>);
    expect(screen.getByRole("link", { name: "Fuji Sys" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Birthday" })).toHaveAttribute("href", "/birthday");
    expect(screen.getByRole("link", { name: /contato@fujisys.com.br/i })).toHaveAttribute(
      "href",
      "mailto:contato@fujisys.com.br",
    );
  });
});
```

- [ ] **Step 2: Verify the shell test fails**

Run: `npm test -- --run tests/shared-shell.test.tsx`

Expected: FAIL because shared components do not exist.

- [ ] **Step 3: Implement the shared components**

Implement `SiteHeader` with a skip link, brand link and semantic `<nav aria-label="Navegação principal">`; implement `SiteFooter` with Birthday, Privacidade, Suporte and the visible `mailto:` address. Implement `Reveal` as a client component that adds `data-visible="true"` after Intersection Observer fires and immediately reveals content when the API is unavailable.

The public component contracts must be:

```tsx
export function SiteHeader(): React.JSX.Element;
export function SiteFooter(): React.JSX.Element;
export function Reveal(props: { children: React.ReactNode; className?: string }): React.JSX.Element;
```

Update `app/layout.tsx` to render the skip target `<main id="conteudo">`, shared shell, title template `%s | Fuji Sys`, default title `Fuji Sys — Soluções digitais com propósito`, description, language `pt-BR`, viewport and theme color.

- [ ] **Step 4: Establish the visual system in CSS**

In `app/globals.css`, define exact tokens:

```css
:root {
  --paper: #f7f6f2;
  --ink: #17171b;
  --muted: #66656f;
  --line: rgba(23, 23, 27, 0.14);
  --electric: #5b4dff;
  --birthday: #ff7759;
  --radius-sm: 14px;
  --radius-lg: 32px;
  --content: 1180px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}
```

Add global typography, 44px desktop/20px mobile page gutters, visible `:focus-visible`, responsive header, `.reveal` transitions and:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Verify shell tests**

Run: `npm test -- --run tests/shared-shell.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the shell**

```bash
git add components app/layout.tsx app/globals.css tests/shared-shell.test.tsx
git commit -m "feat: add shared Fuji Sys shell"
```

### Task 3: Institutional home and Birthday product page

**Files:**
- Modify: `app/page.tsx`
- Create: `app/birthday/page.tsx`
- Create: `tests/product-pages.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `PRODUCTS`, `SITE`, `Reveal`, `SiteHeader`, and `SiteFooter` through the root layout.
- Produces: public home and Birthday page content.

- [ ] **Step 1: Write failing page-content tests**

Create `tests/product-pages.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BirthdayPage from "../app/birthday/page";
import HomePage from "../app/page";

describe("product pages", () => {
  it("presents Fuji Sys and its published product", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/ideias que resolvem/i);
    expect(screen.getByRole("link", { name: /conheça o birthday/i })).toHaveAttribute("href", "/birthday");
  });

  it("links Birthday to its official privacy and support pages", () => {
    render(<BirthdayPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Birthday");
    expect(screen.getByRole("link", { name: /privacidade/i })).toHaveAttribute("href", "/birthday/privacy");
    expect(screen.getByRole("link", { name: /suporte/i })).toHaveAttribute("href", "/birthday/support");
  });
});
```

- [ ] **Step 2: Confirm the product tests fail**

Run: `npm test -- --run tests/product-pages.test.tsx`

Expected: FAIL because the starter page remains and Birthday page is missing.

- [ ] **Step 3: Build the complete institutional homepage**

Replace the starter with semantic sections and the approved copy:

```tsx
<h1>Ideias que resolvem.<br />Produtos que aproximam.</h1>
<p>Na Fuji Sys, transformamos problemas reais em experiências digitais simples, criativas e feitas para durar.</p>
```

Include anchors `#empresa`, `#produtos`, and `#contato`; principle cards labeled `Clareza`, `Criatividade`, `Cuidado na entrega`; a Birthday product card using `PRODUCTS[0]`; and the CTA `Vamos criar algo útil?` linked to the official email.

- [ ] **Step 4: Build the Birthday page**

Create a product hero headed `Birthday`, explanatory copy `Datas importantes merecem mais do que depender da memória.` and three benefit blocks: `Tudo em um só lugar`, `Acesso simples` and `Feito com cuidado`. Include visible calls to `/birthday/privacy` and `/birthday/support`; do not add an App Store button.

- [ ] **Step 5: Add responsive editorial styling**

Add CSS for 12-column desktop grids, oversized `clamp()` headings, rounded product stage, decorative CSS circles, hover lift limited to hover-capable devices, and single-column mobile layouts. Decorative nodes must use `aria-hidden="true"`.

- [ ] **Step 6: Run page tests**

Run: `npm test -- --run tests/product-pages.test.tsx`

Expected: PASS, 2 tests.

- [ ] **Step 7: Commit the public product experience**

```bash
git add app/page.tsx app/birthday/page.tsx app/globals.css tests/product-pages.test.tsx
git commit -m "feat: add Fuji Sys and Birthday pages"
```

### Task 4: Official privacy policy and support routes

**Files:**
- Create: `components/legal-layout.tsx`
- Create: `app/birthday/privacy/page.tsx`
- Create: `app/birthday/support/page.tsx`
- Create: `tests/legal-support.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `SITE.email` and shared layout styles.
- Produces: `LegalLayout` and the two Apple-required public URLs.

- [ ] **Step 1: Write failing legal and support tests**

Create `tests/legal-support.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "../app/birthday/privacy/page";
import SupportPage from "../app/birthday/support/page";

describe("Birthday official pages", () => {
  it("states the exact data practice", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Política de Privacidade");
    expect(screen.getByText(/único dado pessoal coletado.*endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByText(/Resend/i)).toBeInTheDocument();
    expect(screen.getByText(/não vendemos/i)).toBeInTheDocument();
  });

  it("offers pt-BR support and a visible email fallback", () => {
    render(<SupportPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Suporte do Birthday");
    expect(screen.getByRole("link", { name: /enviar e-mail/i })).toHaveAttribute(
      "href",
      "mailto:contato@fujisys.com.br?subject=Suporte%20Birthday",
    );
    expect(screen.getAllByText("contato@fujisys.com.br").length).toBeGreaterThan(0);
    expect(screen.getByText(/não recebi o e-mail de acesso/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Confirm official-page tests fail**

Run: `npm test -- --run tests/legal-support.test.tsx`

Expected: FAIL because the legal and support pages do not exist.

- [ ] **Step 3: Implement the legal layout and privacy policy**

`LegalLayout` accepts `{ eyebrow: string; title: string; updated?: string; children: React.ReactNode }`. The privacy page must use `updated="16 de julho de 2026"` and these sections: `1. Quem somos`, `2. Dado que coletamos`, `3. Como usamos o e-mail`, `4. Compartilhamento e fornecedores`, `5. Retenção e segurança`, `6. Seus direitos`, `7. Alterações nesta política`, `8. Fale conosco`.

The text must explicitly state that the email is the only personal datum, is used for authentication/access/account management, is not sold or shared for advertising, and may be processed by Resend to deliver authentication messages. Include a plain-language note that legal obligations may require limited retention.

- [ ] **Step 4: Implement support and FAQ**

Create the heading `Suporte do Birthday`, visible address, encoded `mailto:` CTA, troubleshooting instructions, and native `<details>` FAQs for: not receiving login email, changing email address, deleting the account, and understanding privacy. Do not promise a response deadline.

- [ ] **Step 5: Style long-form reading and FAQ states**

Limit prose to `72ch`, ensure heading anchors are not obscured by the sticky header, style open/closed details, and preserve a minimum 44px interactive target.

- [ ] **Step 6: Run legal and support tests**

Run: `npm test -- --run tests/legal-support.test.tsx`

Expected: PASS, 2 tests.

- [ ] **Step 7: Commit the official Birthday URLs**

```bash
git add components/legal-layout.tsx app/birthday/privacy app/birthday/support app/globals.css tests/legal-support.test.tsx
git commit -m "feat: add Birthday privacy and support pages"
```

### Task 5: 404, metadata, social card, and production verification

**Files:**
- Create: `app/not-found.tsx`
- Create after validation: `public/og.png`
- Modify: `app/layout.tsx`
- Modify: route page files for metadata exports
- Delete: `app/_sites-preview/` when present
- Modify: `package.json` and lockfile if `react-loading-skeleton` becomes unused

**Interfaces:**
- Consumes: all completed routes and the final visual language.
- Produces: production-ready metadata, social sharing and fallback route.

- [ ] **Step 1: Add route-specific metadata and the 404 page**

Use these exact titles:

- Home: `Fuji Sys — Soluções digitais com propósito`
- Birthday: `Birthday — Datas importantes por perto`
- Privacy: `Política de Privacidade do Birthday`
- Support: `Suporte do Birthday`

Create a 404 page headed `Essa página não existe.` with a link `Voltar para a Fuji Sys` pointing to `/`.

- [ ] **Step 2: Remove all starter-only artifacts**

Remove `_sites-preview`, `codex-preview` metadata, unused starter icons and `react-loading-skeleton` when no finished page imports it. Refresh the lockfile through the package manager rather than editing it by hand.

- [ ] **Step 3: Generate and inspect one social card**

Create exactly one 1200×630 social image reflecting the final off-white, graphite, electric violet and Birthday coral palette. Required visible text: `Fuji Sys`, `Ideias que resolvem.` and `Produtos digitais com propósito.` Inspect it for missing or invented text; retry once only if unusable. Save the accepted result as `public/og.png` and add request-host-derived absolute Open Graph and X image metadata.

- [ ] **Step 4: Run the complete test suite**

Run: `npm test -- --run`

Expected: all tests PASS with zero failures.

- [ ] **Step 5: Run the production build**

Run: `npm run build`

Expected: exit code 0 and production output generated for all routes.

- [ ] **Step 6: Verify critical output strings**

Run:

```bash
rg -n "contato@fujisys.com.br|Política de Privacidade|Suporte do Birthday" dist
```

Expected: each critical string occurs in the generated production output.

- [ ] **Step 7: Commit the verified release candidate**

```bash
git add app public package.json package-lock.json
git commit -m "feat: prepare Fuji Sys site for release"
```

### Task 6: Create the public GitHub repository and publish the site

**Files:**
- Modify only if required by hosting: `.openai/hosting.json`
- Read: `.git/config`

**Interfaces:**
- Consumes: verified production build and authenticated GitHub/Sites sessions.
- Produces: public GitHub repository and deployed Sites URL.

- [ ] **Step 1: Confirm repository identity and authentication**

Run:

```bash
git status --short
gh auth status
```

Expected: clean or intentionally scoped worktree, and GitHub authenticated as `eduardosht`. If another GitHub account is active, stop and request the user to switch accounts rather than creating the repository under the wrong owner.

- [ ] **Step 2: Create the public repository and connect origin**

Run:

```bash
gh repo create eduardosht/fujisys-site --public --source=. --remote=origin --description "Site institucional da Fuji Sys e páginas oficiais do Birthday"
```

Expected: repository created at `https://github.com/eduardosht/fujisys-site` and `origin` points to it. If the repository already exists, verify ownership and connect it with `git remote add origin https://github.com/eduardosht/fujisys-site.git` instead of creating a duplicate.

- [ ] **Step 3: Push the default branch**

Run:

```bash
git branch -M main
git push -u origin main
```

Expected: `main` is published and tracks `origin/main`.

- [ ] **Step 4: Deploy with Sites Hosting**

Invoke the `sites:sites-hosting` skill, deploy the verified build, confirm the returned public URL loads, and keep the local development server alive until hosting completes.

- [ ] **Step 5: Record the custom-domain handoff**

Return the deployed URL as the primary deliverable and list the exact DNS records shown by Sites for connecting `fujisys.com.br`. Do not alter DNS without separate user authorization.

- [ ] **Step 6: Stop the retained development server**

After hosting succeeds, terminate only the development server session started for this project.

## Final Acceptance Checklist

- [ ] `https://github.com/eduardosht/fujisys-site` is public and contains `main`.
- [ ] The deployed home page presents Fuji Sys and Birthday.
- [ ] `/birthday/privacy` is directly accessible and contains the approved data practices.
- [ ] `/birthday/support` is directly accessible and offers `contato@fujisys.com.br` plus FAQ.
- [ ] Tests and production build complete with no failures.
- [ ] Keyboard focus, mobile layout and reduced-motion behavior are present.
- [ ] No starter content, tracking, form backend or unapproved App Store link ships.
