# Next.js Static Export Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o site React + Vite para Next.js App Router com exportação estática, preservando as quatro rotas públicas, o visual e as animações.

**Architecture:** O App Router terá um layout compartilhado e uma página por rota pública. `output: "export"` e `trailingSlash: true` produzirão HTML estático em `out/`; somente `Reveal` e `LottiePlayer` serão Client Components por dependerem de APIs do navegador.

**Tech Stack:** Next.js, React, TypeScript, CSS global, `@lottiefiles/dotlottie-react`, Node.js para o smoke test do artefato.

**Spec:** `docs/superpowers/specs/2026-09-20-next-static-export-design.md`

## Global Constraints

- O site será exclusivamente estático nesta etapa.
- As rotas públicas serão `/`, `/birthly`, `/birthly/privacy` e `/birthly/support`.
- O build de produção usará `output: "export"` e produzirá a pasta `out/`.
- Não serão usados SSR, ISR, Server Actions, cookies, headers ou APIs do Next.
- O conteúdo editorial, a identidade visual, a acessibilidade e o comportamento de movimento reduzido serão preservados.
- O deploy deverá continuar compatível com domínio próprio e hospedagem de arquivos estáticos.

## Review Focus

- Assets públicos precisam funcionar tanto no desenvolvimento quanto no artefato exportado, inclusive quando um `NEXT_PUBLIC_BASE_PATH` for usado para GitHub Pages — coberto pela configuração de caminhos e pelo smoke test do build.
- Componentes que acessam `window`, `IntersectionObserver` ou `matchMedia` não podem ser avaliados no servidor — coberto pelos Client Components e pelo build de produção.
- Rotas diretas precisam gerar arquivos HTML previsíveis — coberto pelo `trailingSlash` e pela lista de arquivos do smoke test.
- Metadata não pode voltar a ser um único título global — coberto pelos exports `metadata` de cada página.
- O fallback 404 precisa existir no export estático — coberto por `out/404.html` no smoke test.

---

### Task 1: Fixar o contrato do artefato estático

**Files:**
- Create: `scripts/verify-static-output.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: artefato gerado em `out/` pelo comando `next build`.
- Produces: comando `npm run test:static` que falha quando uma rota ou metadata obrigatória não é exportada.

- [ ] **Step 1: Escrever o smoke test antes da migração**

Criar `scripts/verify-static-output.mjs` com este comportamento:

```js
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "out");
const expectedFiles = [
  "index.html",
  "birthly/index.html",
  "birthly/privacy/index.html",
  "birthly/support/index.html",
  "404.html",
];

const missingFiles = expectedFiles.filter(
  (file) => !existsSync(join(outputDir, file)),
);

if (missingFiles.length > 0) {
  throw new Error(`Missing static output files: ${missingFiles.join(", ")}`);
}

const requiredTitles = {
  "index.html": "Fuji Sys",
  "birthly/index.html": "Birthly",
  "birthly/privacy/index.html": "Política de Privacidade",
  "birthly/support/index.html": "Suporte do Birthly",
};

for (const [file, title] of Object.entries(requiredTitles)) {
  const html = readFileSync(join(outputDir, file), "utf8");
  if (!html.includes(`<title>${title}`)) {
    throw new Error(`Missing expected title in ${file}: ${title}`);
  }
}

console.log(`Verified ${expectedFiles.length} static output files.`);
```

- [ ] **Step 2: Executar o teste para confirmar o RED**

Run: `npm run test:static`

Expected: FAIL porque o projeto atual produz `dist/`, não `out/`, e ainda não possui a estrutura de exportação do Next.

- [ ] **Step 3: Adicionar o script ao package.json**

Adicionar:

```json
"test:static": "node scripts/verify-static-output.mjs"
```

- [ ] **Step 4: Commitar o contrato de validação**

```bash
git add scripts/verify-static-output.mjs package.json
git commit -m "test: define static export smoke test"
```

### Task 2: Substituir o bootstrap Vite pelo Next

**Files:**
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Delete: `vite.config.ts`
- Delete: `tsconfig.app.json`
- Delete: `tsconfig.node.json`
- Delete: `src/main.tsx`
- Delete: `src/vite-env.d.ts`

**Interfaces:**
- Consumes: script `test:static` da Task 1.
- Produces: `next dev`, `next build` e `next start` configurados; `next build` exporta `out/`.

- [ ] **Step 1: Atualizar dependências e scripts**

Substituir os scripts por:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test:static": "node scripts/verify-static-output.mjs"
}
```

Adicionar `next` às dependências e remover `vite`, `@vitejs/plugin-react` e referências exclusivas do Vite. Manter React, React DOM, TypeScript, tipos do Node e tipos do React.

- [ ] **Step 2: Criar a configuração de exportação estática**

Criar `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: Reescrever o tsconfig para o Next**

Usar `next-env.d.ts`, incluir `next-env.d.ts`, `**/*.ts`, `**/*.tsx`, `.next/types/**/*.ts` e excluir `node_modules`. Manter `strict: true`, `noEmit: true`, `moduleResolution: "Bundler"` e `jsx: "preserve"`.

- [ ] **Step 4: Executar o build para confirmar o GREEN parcial**

Run: `npm install && npm run build && npm run test:static`

Expected: o build ainda falhará enquanto não existir `app/layout.tsx` e `app/page.tsx`; corrigir apenas erros de bootstrap antes de seguir para as páginas.

- [ ] **Step 5: Commitar o bootstrap**

```bash
git add package.json package-lock.json next.config.ts next-env.d.ts tsconfig.json
git rm vite.config.ts tsconfig.app.json tsconfig.node.json src/main.tsx src/vite-env.d.ts
git commit -m "build: replace vite with next static export"
```

### Task 3: Migrar o shell compartilhado e os limites client/server

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Modify: `src/components/Reveal.tsx`
- Modify: `src/components/LottiePlayer.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/lib/site.ts`
- Delete: `src/styles.css`

**Interfaces:**
- Consumes: constantes públicas de `src/lib/site.ts` e componentes existentes.
- Produces: layout HTML compartilhado, metadata base, caminhos estáticos e componentes client-side seguros para prerenderização.

- [ ] **Step 1: Escrever o teste de contrato de saída após o bootstrap**

Run: `npm run build && npm run test:static`

Expected: continuar FAIL somente até as páginas e o layout serem implementados; a mensagem deve apontar arquivos ausentes em `out/`, não erro de compilação TypeScript.

- [ ] **Step 2: Tornar os componentes dependentes do navegador Client Components**

Adicionar `"use client";` como primeira linha de `Reveal.tsx` e `LottiePlayer.tsx`. Não adicionar `window` ou `document` a componentes de página ou layout.

- [ ] **Step 3: Tornar o site config independente de window**

Remover a leitura de `window.location.hostname` e `publicPath` baseada em runtime. Manter rotas como strings `/`, `/birthly`, `/birthly/privacy` e `/birthly/support`. Implementar `assetPath` usando `process.env.NEXT_PUBLIC_BASE_PATH ?? ""` para permitir uma publicação opcional em subpath:

```ts
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: `/birthday/${string}`): string {
  return `${basePath}${path}`;
}
```

- [ ] **Step 4: Criar o layout e migrar os estilos globais**

Criar `app/layout.tsx` com `metadata` base, `lang="pt-BR"`, `SiteHeader`, `<main id="conteudo">{children}</main>` e `SiteFooter`. Mover o conteúdo integral de `src/styles.css` para `app/globals.css` sem alterar regras visuais.

- [ ] **Step 5: Usar Link apenas na navegação interna**

Atualizar `SiteHeader` e `SiteFooter` para importar `Link` de `next/link` e usá-lo para páginas internas. Manter `mailto:` como `<a>`. Para âncoras na home, usar `Link href="/#empresa"`, `Link href="/#produtos"` e `Link href="/#contato"`.

- [ ] **Step 6: Verificar TypeScript e commit**

Run: `npm run build`

Expected: PASS para os componentes e layout, ou falhas limitadas à ausência das páginas; não pode haver erro de `window` em Server Components.

```bash
git add app src/components src/lib/site.ts
git rm src/styles.css
git commit -m "refactor: migrate shared shell to next"
```

### Task 4: Migrar páginas e metadata para o App Router

**Files:**
- Create: `src/components/pages/HomePage.tsx`
- Create: `src/components/pages/BirthlyPage.tsx`
- Create: `src/components/pages/PrivacyPage.tsx`
- Create: `src/components/pages/SupportPage.tsx`
- Create: `src/components/pages/NotFoundPage.tsx`
- Create: `app/page.tsx`
- Create: `app/birthly/page.tsx`
- Create: `app/birthly/privacy/page.tsx`
- Create: `app/birthly/support/page.tsx`
- Create: `app/not-found.tsx`
- Delete: `src/App.tsx`

**Interfaces:**
- Consumes: `SiteHeader`, `SiteFooter`, `LegalLayout`, `Reveal`, `LottiePlayer`, `SITE`, `PRODUCTS` e `assetPath` migrados.
- Produces: uma página Next por rota e metadata estática específica para cada URL.

- [ ] **Step 1: Separar o conteúdo atual por página sem alterar copy**

Mover `HomePage`, `BirthdayPage`, `PrivacyPage`, `SupportPage` e `NotFoundPage` de `src/App.tsx` para os cinco arquivos em `src/components/pages/`. Remover `Shell` desses componentes, pois o layout passa a fornecê-lo. Manter a lista `faqs` junto de `SupportPage`.

- [ ] **Step 2: Criar as entradas do App Router**

Usar páginas mínimas:

```tsx
// app/page.tsx
import HomePage from "@/src/components/pages/HomePage";

export default function Page() {
  return <HomePage />;
}
```

Repetir o padrão para `/birthly`, `/birthly/privacy` e `/birthly/support`, apontando para o componente correspondente.

- [ ] **Step 3: Adicionar metadata por rota**

Cada `page.tsx` deverá exportar `metadata` com título e descrição equivalentes aos HTML atuais:

```ts
export const metadata = {
  title: "Birthly — Datas importantes por perto | Fuji Sys",
  description:
    "Conheça o Birthly, um jeito simples e cuidadoso de manter datas importantes por perto.",
};
```

Usar os valores correspondentes para a home, política e suporte.

- [ ] **Step 4: Criar o fallback 404**

`app/not-found.tsx` deverá retornar `<NotFoundPage />`.

- [ ] **Step 5: Executar build e smoke test no GREEN**

Run: `npm run build && npm run test:static`

Expected: PASS; `out/` conterá os cinco arquivos esperados e cada página terá seu título correto.

- [ ] **Step 6: Commitar as páginas**

```bash
git add app src/components/pages
git rm src/App.tsx
git commit -m "feat: add static next routes"
```

### Task 5: Remover artefatos Vite e verificar a migração completa

**Files:**
- Modify: `package-lock.json`
- Verify: `package.json`, `next.config.ts`, `next-env.d.ts`, `app/**`, `src/**`, `public/**`

**Interfaces:**
- Consumes: aplicação Next completa das Tasks 1–4.
- Produces: branch com dependências limpas, artefato estático verificado e nenhum caminho de bootstrap Vite restante.

- [ ] **Step 1: Procurar referências antigas**

Run: `rg -n 'vite|createRoot|window\.location|src/styles\.css|src/main\.tsx|<div id="root"' --glob '!node_modules/**' --glob '!out/**' .`

Expected: nenhum resultado em arquivos de aplicação/configuração, exceto referências históricas em documentação que não participam do build.

- [ ] **Step 2: Verificar o build limpo e o artefato**

Run: `rm -rf out && npm run build && npm run test:static && git diff --check`

Expected: exit 0, `out/` criado com as quatro rotas e 404, sem erros de TypeScript ou whitespace.

- [ ] **Step 3: Inspecionar o artefato gerado**

Run: `find out -maxdepth 3 -type f | sort`

Expected: presença de `index.html`, `birthly/index.html`, `birthly/privacy/index.html`, `birthly/support/index.html`, `404.html`, chunks JS/CSS e assets públicos.

- [ ] **Step 4: Commitar a limpeza final**

```bash
git add package.json package-lock.json next.config.ts next-env.d.ts app src scripts
git commit -m "chore: finalize next static migration"
```

- [ ] **Step 5: Registrar o estado final da branch**

Run: `git status --short && git log --oneline -6`

Expected: worktree limpo e histórico contendo os commits da migração, sem publicar ou fazer push automaticamente.
