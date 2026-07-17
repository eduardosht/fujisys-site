# Birthday Motion Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar o logo oficial e animações dotLottie locais em todas as áreas do Birthday, remover “Como fazemos” e enriquecer as transições do site.

**Architecture:** O site continuará Vite + React multipágina. Um componente `LottiePlayer` encapsulará `@lottiefiles/dotlottie-react`, Intersection Observer, reduced motion e fallback; assets copiados do aplicativo serão servidos de `public/birthday/` e consumidos apenas nas páginas relevantes.

**Tech Stack:** React 19, TypeScript, Vite 8, CSS nativo e `@lottiefiles/dotlottie-react@^0.19.6`.

## Global Constraints

- Não criar testes unitários; validar com build, inspeções de conteúdo e smoke test público.
- Não alterar o projeto-fonte `/Users/jessicavenancio/Documents/birthday`.
- Não alterar textos jurídicos, rotas, CNAME ou workflow do GitHub Pages.
- Remover completamente “Como fazemos” e seus três cards.
- Usar somente assets locais, sem CDN.
- Pausar animações fora da viewport e respeitar `prefers-reduced-motion`.
- Preservar conteúdo e navegação quando player ou asset falhar.

---

### Task 1: Assets oficiais e player acessível

**Files:**
- Create: `public/birthday/app-icon.png`
- Create: `public/birthday/lotties/present.lottie`
- Create: `public/birthday/lotties/celebration.lottie`
- Create: `public/birthday/lotties/notification.lottie`
- Create: `public/birthday/lotties/email.lottie`
- Create: `public/birthday/lotties/leaf.lottie`
- Create: `src/components/LottiePlayer.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `LottiePlayer({ src, label?, className?, loop? })`.
- Consumes: arquivos `.lottie` locais e `DotLottieReact`.

- [ ] **Step 1: Copiar e otimizar assets**

Copiar os cinco `.lottie` definidos na especificação. Redimensionar `app_icon_master.png` para uma versão web quadrada de 1024×1024 em `public/birthday/app-icon.png`, preservando o original.

- [ ] **Step 2: Instalar o player oficial**

Run: `npm install @lottiefiles/dotlottie-react@^0.19.6`

Expected: dependência e lockfile atualizados sem vulnerabilidades bloqueantes.

- [ ] **Step 3: Implementar o componente**

Criar `LottiePlayer.tsx` com `useRef`, Intersection Observer e `matchMedia("(prefers-reduced-motion: reduce)")`. A instância recebida em `dotLottieRefCallback` deve chamar `play()` somente quando visível e permitido; deve chamar `pause()` fora da viewport; em reduced motion, deve chamar `setFrame(0)` e permanecer pausada. O wrapper deve reservar espaço, usar `role="img"` quando `label` existir e `aria-hidden="true"` quando decorativo. Em erro, adicionar `data-failed="true"` e ocultar somente o canvas.

- [ ] **Step 4: Validar o player e assets**

Run: `npm run build`

Expected: exit 0 e todos os seis assets presentes em `dist/birthday/`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json public/birthday src/components/LottiePlayer.tsx
git commit -m "feat: add Birthday motion assets"
```

### Task 2: Composição visual, logo e transições

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Reveal.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `LottiePlayer` e caminhos `/birthday/...`.
- Produces: home e páginas Birthday atualizadas.

- [ ] **Step 1: Remover a seção antiga**

Excluir o bloco `section.principles`, o título “Como fazemos” e os três articles. Remover seletores CSS que ficarem sem uso.

- [ ] **Step 2: Aplicar identidade oficial**

Na home, substituir `.birthday-mark` por `<img src="/birthday/app-icon.png" alt="" />` e `LottiePlayer` com `/birthday/lotties/present.lottie`. No hero Birthday, substituir `.cake` pelo mesmo logo com `alt="Ícone do aplicativo Birthday"` e adicionar `/birthday/lotties/celebration.lottie` como camada decorativa. No benefício de lembretes, inserir `/birthday/lotties/notification.lottie` com label contextual.

- [ ] **Step 3: Integrar suporte e privacidade**

Adicionar `/birthday/lotties/email.lottie` ao card de atendimento com label `E-mail de suporte`; adicionar `/birthday/lotties/leaf.lottie` ao cabeçalho do `LegalLayout` como decoração. Não intercalar animações no corpo jurídico.

- [ ] **Step 4: Ampliar motion CSS e Reveal**

Fazer `Reveal` aceitar `delay?: number` e aplicar `--reveal-delay`. Criar stagger de até 240ms, translate/opacity/blur leve, hover lift de no máximo 6px, escala do logo entre 1 e 1.025 e transições de sublinhado. Restringir hover a `@media (hover: hover) and (pointer: fine)` e zerar efeitos em `prefers-reduced-motion`.

- [ ] **Step 5: Validar conteúdo e build**

Run: `npm run build`

Expected: exit 0.

Run: `rg -n "Como fazemos|Cuidado na entrega" src dist`

Expected: nenhum resultado.

Run: `rg -n "app-icon|present\.lottie|celebration\.lottie|notification\.lottie|email\.lottie|leaf\.lottie" src dist`

Expected: os seis assets referenciados.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/Reveal.tsx src/styles.css
git commit -m "feat: refresh Birthday visual motion"
```

### Task 3: Revisão, publicação e verificação pública

**Files:**
- Modify only if required by review: `src/App.tsx`, `src/components/LottiePlayer.tsx`, `src/components/Reveal.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: implementação concluída.
- Produces: release publicada no GitHub Pages.

- [ ] **Step 1: Revisar requisitos**

Confirmar por inspeção: logo oficial na home e Birthday; Lottie em home, Birthday, privacidade e suporte; texto jurídico intacto; suporte intacto; fallback e reduced motion presentes; nenhum URL externo de asset.

- [ ] **Step 2: Executar verificação final**

Run: `npm ci && npm run build && git diff --check`

Expected: todos os comandos com exit 0.

- [ ] **Step 3: Enviar ao GitHub**

Run: `git push origin main`

Expected: `main` atualizada no repositório público.

- [ ] **Step 4: Acompanhar Pages**

Run: `gh run list --repo eduardosht/fujisys-site --workflow deploy-pages.yml --limit 1`

Depois acompanhar o id retornado com `gh run watch <id> --repo eduardosht/fujisys-site --exit-status`.

Expected: build e deploy concluídos com sucesso.

- [ ] **Step 5: Smoke test público**

Verificar HTTP 200 para home, `/birthday/`, `/birthday/privacy/`, `/birthday/support/`, logo e cada `.lottie`. Confirmar que o JavaScript e o CSS publicados também retornam 200.
