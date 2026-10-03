# Personal Fuji Sys and Birthly Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Fuji Sys feel more personal and dynamic while adding a concise, animated Birthly card showcase using the supplied example image and a new site favicon.

**Architecture:** Reuse the existing `Reveal` intersection-observer component and static asset helpers. Add one semantic Birthly showcase section, update the existing home copy/layout, and keep motion in CSS with a reduced-motion override; no new routes, dependencies, backend calls, or persistent state.

**Tech Stack:** Next.js App Router, React/TypeScript, static public assets, CSS animations, Node `node:test` source-contract tests.

**Spec:** `docs/superpowers/specs/2026-10-03-personal-birthly-showcase-design.md`

## Global Constraints

- The site must communicate authorship and openness to collaboration without becoming an extended biography.
- The Birthly card section must mention photo, message, and personalized signature, and use the supplied image at `public/birthday/examples/leandro-birthday-card.jpeg`.
- The card image must remain editorial content; do not recreate its text with HTML overlays.
- Motion must use the existing `Reveal` pattern plus restrained CSS transitions, with a static `prefers-reduced-motion` fallback.
- Keep existing routes, legal/support/recovery flows, and the Birthly palette unchanged.
- Do not add authentication, persistence, upload behavior, or new dependencies.
- The favicon must be `app/icon.svg`, use a simple high-contrast Fuji Sys “F” mark, and be discovered by the Next.js App Router.

## Review Focus

- A missing, incorrectly named, or non-JPEG card asset must fail the source contract before static export; Task 1 pins the exact asset path and JPEG magic bytes.
- A favicon placed outside App Router conventions must fail the source contract; Task 1 checks `app/icon.svg` and its brand colors.
- The showcase must remain meaningful if animations are disabled; Task 2 checks semantic heading, copy, image alt text, and no text-overlay markup.
- A narrow viewport must not force the showcase or home hero wider than the viewport; Task 3 checks responsive CSS selectors and stacked layout rules.
- Reduced motion must disable continuous showcase/card motion; Task 3 checks the reduced-motion override for the new animation names.

### Task 1: Add visual asset, favicon, and failing contracts

**Files:**
- Create: `public/birthday/examples/leandro-birthday-card.jpeg` (copy supplied user image)
- Create: `app/icon.svg`
- Create: `test-web/personal-showcase.test.mjs`

**Interfaces:**
- Produces: exact static asset path `/birthday/examples/leandro-birthday-card.jpeg` and App Router icon path `app/icon.svg` consumed by Tasks 2–4.

- [ ] **Step 1: Write the failing asset and favicon tests**

  Add a Node test that reads the repository with `existsSync`, `statSync`, and `readFileSync` and asserts:

  - `public/birthday/examples/leandro-birthday-card.jpeg` exists, is a regular file, has a non-zero size, and begins with the JPEG bytes `FF D8 FF`;
  - `app/icon.svg` exists;
  - the SVG contains `viewBox`, `#8D485A` or its lowercase equivalent, and `#FDC7CC` or its lowercase equivalent.

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `node --test test-web/personal-showcase.test.mjs`

  Expected: FAIL because the new asset and favicon do not exist yet.

- [ ] **Step 3: Add the supplied JPEG and `app/icon.svg`**

  Copy `/Users/jessicavenancio/Downloads/WhatsApp Image 2026-10-03 at 16.43.45.jpeg` to `public/birthday/examples/leandro-birthday-card.jpeg`. Create a compact SVG favicon with a rounded `#8D485A` background, a high-contrast `#FDC7CC` “F” mark, `viewBox="0 0 64 64"`, and no external references.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `node --test test-web/personal-showcase.test.mjs`

  Expected: PASS for the asset and favicon contract.

- [ ] **Step 5: Commit the task**

  ```bash
  git add public/birthday/examples/leandro-birthday-card.jpeg app/icon.svg test-web/personal-showcase.test.mjs
  git commit -m "feat: add Birthly card asset and site favicon"
  ```

### Task 2: Add the semantic Birthly card showcase

**Files:**
- Modify: `src/components/pages/Content.tsx` in `BirthdayPage`
- Test: `test-web/personal-showcase.test.mjs`

**Interfaces:**
- Consumes: Task 1 asset path `/birthday/examples/leandro-birthday-card.jpeg` and existing `assetPath()`/`Reveal` helpers.
- Produces: a section with class `birthday-card-showcase`, heading id `birthday-card-title`, and image class `birthday-card-image` for Task 3 styling.

- [ ] **Step 1: Extend the failing source contract**

  Add assertions that `Content.tsx` contains:

  - `birthday-card-showcase` and `birthday-card-title`;
  - the phrases `foto`, `mensagem`, and `assine` in the Birthly feature copy;
  - `assetPath("/birthday/examples/leandro-birthday-card.jpeg")`;
  - an `alt` description that identifies the example as a Birthly birthday card;
  - the existing `Reveal` wrapper around the section.

  Also assert that the feature image is not accompanied by an HTML text overlay inside the image stage: the stage may contain the `img`, but no heading element between `birthday-card-stage` and its closing tag.

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `node --test test-web/personal-showcase.test.mjs`

  Expected: FAIL because the showcase markup and copy do not exist.

- [ ] **Step 3: Implement the showcase markup**

  Insert the new `Reveal`-wrapped section between the Birthly statement and benefits. Use the approved copy:

  - Heading: `Cartões que guardam um momento.`
  - Body: `No Birthly, uma data também pode virar uma lembrança para compartilhar: escolha uma foto, escreva sua mensagem e assine do seu jeito.`

  Render the supplied image through `assetPath()` with an explicit descriptive `alt`, and keep the section readable without relying on animation.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `node --test test-web/personal-showcase.test.mjs`

  Expected: PASS for the asset, favicon, and showcase source contracts.

- [ ] **Step 5: Commit the task**

  ```bash
  git add src/components/pages/Content.tsx test-web/personal-showcase.test.mjs
  git commit -m "feat: add Birthly personalized card showcase"
  ```

### Task 3: Personalize the home and add responsive motion styling

**Files:**
- Modify: `src/components/pages/Content.tsx` in `HomePage`
- Modify: `app/globals.css`
- Test: `test-web/personal-showcase.test.mjs`

**Interfaces:**
- Consumes: Task 2 classes `birthday-card-showcase` and `birthday-card-image`.
- Produces: personal home copy, widened home hero layout, card/showcase motion, responsive stacking, and reduced-motion overrides.

- [ ] **Step 1: Extend the failing source/style contract**

  Add assertions that:

  - `HomePage` contains first-person phrases about creating tools from real problems and inviting collaboration;
  - `app/globals.css` contains a wider home hero grid, `.birthday-card-showcase`, `.birthday-card-image`, a named showcase animation, a reduced-motion override for that animation, and a mobile rule that stacks the showcase layout.

- [ ] **Step 2: Run the focused test to verify it fails**

  Run: `node --test test-web/personal-showcase.test.mjs`

  Expected: FAIL because the current home copy/layout and new showcase CSS are not present.

- [ ] **Step 3: Update home copy and CSS**

  Rewrite the main HomePage copy in a compact first-person voice, keeping the existing links and route behavior. Use the approved direction:

  - hero: `Eu crio ferramentas para lembrar, organizar e aproximar.`;
  - statement: `Algumas ideias começam numa necessidade minha. Outras começam numa conversa.`;
  - contact: invite the visitor to share an idea, a real problem, or build together.

  Adjust `.home-hero` to `grid-template-columns:minmax(0,8fr) minmax(300px,4fr)` on wide screens and retain a single column below `850px`. Add explicit `Reveal` delays of `80ms`, `160ms`, and `240ms` to the statement, product, and contact blocks, plus restrained transitions for the statement, product card, contact panel, and Birthly showcase. Style the showcase as a two-column section on wide screens and a stacked section below the mobile breakpoint. Add a named `birthday-card-float` animation to `.birthday-card-image`; the reduced-motion block must target `.birthday-card-image` and set its animation duration to `.01ms`, iteration count to `1`, and transform to none.

- [ ] **Step 4: Run the focused test to verify it passes**

  Run: `node --test test-web/personal-showcase.test.mjs`

  Expected: PASS for all personal-content, asset, favicon, and motion contracts.

- [ ] **Step 5: Commit the task**

  ```bash
  git add src/components/pages/Content.tsx app/globals.css test-web/personal-showcase.test.mjs
  git commit -m "feat: make Fuji Sys home more personal and dynamic"
  ```

### Task 4: Run complete verification and visual QA

**Files:**
- Modify: none unless verification exposes a defect
- Test: `test-web/personal-showcase.test.mjs` plus existing project suites

**Interfaces:**
- Consumes: all outputs from Tasks 1–3.
- Produces: verified static build and visual confirmation at `/` and `/birthly/`.

- [ ] **Step 1: Run the focused and existing automated tests**

  Run:

  ```bash
  node --test test-web/personal-showcase.test.mjs
  npm run test:site-architecture
  npm run test:static
  npm run test:callback-output
  npx tsc --noEmit
  ```

  Expected: all tests pass with zero failures and typecheck exits with status 0.

- [ ] **Step 2: Run the production build**

  Run: `npm run build`

  Expected: Next.js compiles, static pages are generated, and callback/static verification completes successfully.

- [ ] **Step 3: Inspect both rendered routes**

  Start `npm run dev`, open `/` and `/birthly/` in the local browser, wait for reveal animations to settle, and inspect desktop plus a narrow viewport. Confirm the personal copy, wider hero, card image, motion, focus-visible states, and no horizontal overflow. Enable reduced motion if available and confirm the card becomes static.

- [ ] **Step 4: Commit any verification-only fixes**

  If visual QA finds a P0–P2 issue, fix it with a focused test-first cycle, rerun the complete verification, and commit with a specific message. Do not add unrelated polish.
