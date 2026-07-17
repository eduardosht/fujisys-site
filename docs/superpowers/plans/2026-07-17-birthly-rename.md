# Birthly Rename Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renomear publicamente Birthday para Birthly e substituir as rotas públicas por `/birthly/...`.

**Architecture:** A configuração compartilhada continuará centralizando rotas e dados do produto. As entradas HTML estáticas serão movidas para o novo diretório público, enquanto nomes técnicos de assets e CSS permanecerão inalterados.

**Tech Stack:** Vite, React, TypeScript, GitHub Pages

## Global Constraints

- Usar Birthly em todos os textos e metadados públicos.
- Usar apenas `/birthly`, `/birthly/privacy` e `/birthly/support` como rotas do produto.
- Não criar redirecionamentos para `/birthday/...`.
- Não alterar o conteúdo substantivo da política de privacidade.
- Não adicionar testes unitários; validar com busca estática e build de produção.

---

### Task 1: Rotas e entradas estáticas

**Files:**
- Modify: `src/lib/site.ts`
- Modify: `src/App.tsx`
- Modify: `vite.config.ts`
- Move: `birthday/index.html` → `birthly/index.html`
- Move: `birthday/privacy/index.html` → `birthly/privacy/index.html`
- Move: `birthday/support/index.html` → `birthly/support/index.html`

**Interfaces:**
- Consumes: `publicPath(path: string)` e `getRoute(pathname: string)`.
- Produces: rotas `/birthly`, `/birthly/privacy` e `/birthly/support` e três entradas HTML estáticas.

- [x] **Step 1: Atualizar o tipo de rotas e a configuração compartilhada**

Trocar cada rota pública `/birthday...` por `/birthly...`, alterar `PRODUCTS[0].name` para `Birthly` e manter `assetPath()` apontando para `/birthday/`, pois essa é uma localização técnica de assets.

- [x] **Step 2: Atualizar a seleção de páginas do React**

Trocar as comparações de rota no componente `App` para `/birthly...`.

- [x] **Step 3: Mover as entradas HTML e atualizar o Vite**

Mover os três arquivos HTML para `birthly/` e alterar os inputs de `vite.config.ts` para os novos caminhos.

### Task 2: Nome público e metadados

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `birthly/index.html`
- Modify: `birthly/privacy/index.html`
- Modify: `birthly/support/index.html`

**Interfaces:**
- Consumes: `SITE.routes` e `PRODUCTS` atualizados na Task 1.
- Produces: interface, política, suporte, FAQ, assuntos de e-mail e metadados públicos com o nome Birthly.

- [x] **Step 1: Substituir o nome visível no React**

Trocar referências textuais a `Birthday` por `Birthly`, incluindo rótulos acessíveis, assuntos `mailto:` e textos jurídicos, sem mudar as declarações sobre coleta e uso do e-mail.

- [x] **Step 2: Atualizar títulos e descrições HTML**

Usar Birthly nos elementos `title` e `meta name="description"` das três páginas.

### Task 3: Verificação, commit e publicação

**Files:**
- Verify: `src/**`, `birthly/**`, `vite.config.ts`, `dist/**`

**Interfaces:**
- Consumes: implementação das Tasks 1 e 2.
- Produces: build estático válido e `main` publicada.

- [x] **Step 1: Verificar referências públicas antigas**

Run: `rg -n 'Birthday|/birthday' src birthly vite.config.ts`

Expected: somente nomes técnicos internos de assets, classes e propriedades; nenhum texto público nem rota pública antiga.

- [x] **Step 2: Executar o build**

Run: `npm run build`

Expected: exit 0 e arquivos `dist/birthly/index.html`, `dist/birthly/privacy/index.html` e `dist/birthly/support/index.html`.

- [x] **Step 3: Revisar e registrar**

Run: `git diff --check && git status --short`

Expected: nenhuma falha de whitespace e apenas arquivos pertencentes à renomeação.

- [ ] **Step 4: Commit e push**

```bash
git add src birthly birthday vite.config.ts
git commit -m "feat: rename app to Birthly"
git push origin main
```
