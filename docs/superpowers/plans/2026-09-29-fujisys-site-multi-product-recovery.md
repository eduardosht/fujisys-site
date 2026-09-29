# Fuji Sys multi-product site and Birthly web recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Fuji Sys static site around product-owned modules and add a secure Birthly password-recovery page at `/birthly/reset-password/`.

**Architecture:** Keep institutional routes and shared shell in `src/site`, register products through a typed catalog, and isolate Birthly routes, legal content, and auth behavior under `src/products/birthly`. Add a browser-only Supabase client using public credentials and let the product recovery page consume the URL fragment, update the authenticated user's password, clear the local session, and remove tokens from browser history.

**Tech Stack:** Next.js 16 static export, React 19 client components, TypeScript, Node test runner, `@supabase/supabase-js@2.117.2` pinned in `package-lock.json`.

**Spec:** `docs/superpowers/specs/2026-09-29-fujisys-multi-product-auth-architecture-design.md`

## Global Constraints

- Preserve existing public Birthly URLs, including `/birthly/confirm-email/`, `/birthly/privacy/`, `/birthly/support/`, and `/birthly/open-app/`.
- The new reset URL is exactly `https://fujisys.com.br/birthly/reset-password/` in production.
- The site uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; never read or expose `service_role` or secret keys.
- Production Supabase redirect allowlists use exact URLs, not broad wildcards.
- Tokens, passwords, and raw Supabase errors must not be logged, analyzed, rendered into static HTML, or forwarded in query parameters.
- Route builders must preserve `NEXT_PUBLIC_BASE_PATH` and trailing-slash output.
- The static export must remain serverless; no server endpoint or admin Supabase operation is introduced.

## Review Focus

- A direct visit without a recovery fragment must show an actionable invalid-link state and must not render a password form; covered in Task 2 parser tests and Task 3 page tests.
- A recovery URL containing unrelated or attacker-controlled parameters must discard them before any CTA or navigation; covered in Task 2 parser tests.
- Missing public Supabase configuration must fail visibly without claiming success; covered in Task 2 client tests and Task 3 page tests.
- A successful password update must clear the browser session and remove tokens from history; covered in Task 3 recovery-controller tests.
- Adding a second product must not require editing Birthly route/auth code; covered in Task 1 catalog and route contract tests.

### Task 1: Establish typed institutional and product configuration

**Files:**
- Create: `src/site/routes.ts`
- Create: `src/products/catalog.ts`
- Create: `src/products/birthly/config.ts`
- Create: `src/products/birthly/routes.ts`
- Modify: `src/lib/site.ts`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/pages/Content.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/support/page.tsx`
- Create: `test-web/site-architecture.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces `ProductDefinition`, `BIRTHLY_PRODUCT`, and `PRODUCT_CATALOG` from `src/products/catalog.ts`.
- Produces `buildSiteRoute(path: string): string` and product route builders that return canonical trailing-slash paths while honoring `NEXT_PUBLIC_BASE_PATH`.
- Birthly route builders expose `home`, `privacy`, `support`, `confirmEmail`, `resetPassword`, and `openApp`.
- Institutional config exposes independent `privacy` and `support` routes; existing Birthly routes remain available under the Birthly product definition.

- [ ] **Step 1: Write failing catalog and route tests**

  Add assertions for one registered Birthly product, unique product ids/slugs, exact Birthly route paths, independent institutional routes, and base-path/trailing-slash behavior.

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `node --experimental-strip-types --test test-web/site-architecture.test.mjs`

  Expected: FAIL because the typed catalog and route builders do not exist.

- [ ] **Step 3: Implement the typed configuration boundaries**

  Move route ownership out of the current monolithic `SITE.routes` object. Keep compatibility exports only where existing pages need them, and make `Content.tsx`, `SiteHeader.tsx`, and `SiteFooter.tsx` consume the institutional config/catalog rather than hard-coded Birthly links. Add institutional `/privacy` and `/support` route pages while keeping product pages intact.

- [ ] **Step 4: Run the focused test and verify it passes**

  Run: `node --experimental-strip-types --test test-web/site-architecture.test.mjs`

  Expected: PASS with all catalog and route assertions passing.

- [ ] **Step 5: Commit the site architecture boundary**

  ```bash
  git add src/site src/products src/lib/site.ts src/components/SiteHeader.tsx src/components/SiteFooter.tsx src/components/pages/Content.tsx app/privacy app/support test-web/site-architecture.test.mjs package.json
  git commit -m "refactor: organize Fuji Sys site by product"
  ```

### Task 2: Add the public Supabase browser integration and recovery contract

**Files:**
- Create: `src/integrations/supabase/browser-client.ts`
- Create: `src/products/birthly/auth/password-recovery.ts`
- Create: `test-web/password-recovery.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- `getBrowserSupabaseClient(): SupabaseClient` returns a singleton client created only in the browser with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- `parseRecoveryCallback(search: string, hash: string): RecoveryCallback` returns a bounded state (`recovery`, `error`, or `invalid`) plus in-memory session material only for the recovery path.
- `sanitizeRecoveryUrl(pathname: string): string` returns the canonical pathname without query or fragment data.
- `recoveryErrorMessage(callback: RecoveryCallback): string` returns generic user-facing copy without raw Supabase details.

- [ ] **Step 1: Write failing parser and client tests**

  Cover valid `type=recovery` fragments with access/refresh tokens, Supabase error parameters, missing tokens, signup/non-recovery types, arbitrary parameters, URL sanitization, and missing public configuration.

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `node --experimental-strip-types --test test-web/password-recovery.test.mjs`

  Expected: FAIL because the recovery module and browser client do not exist.

- [ ] **Step 3: Install the pinned browser client dependency**

  Run: `npm install --save-exact @supabase/supabase-js@2.117.2`

  Confirm the package and lockfile contain the exact version and no server-only Supabase package is added.

- [ ] **Step 4: Implement the browser client and bounded callback parser**

  Keep token values in memory only. Do not put them in a returned URL, console output, analytics payload, error message, or static markup. Make missing configuration an explicit typed error that the page can render as unavailable.

- [ ] **Step 5: Run the focused test and verify it passes**

  Run: `node --experimental-strip-types --test test-web/password-recovery.test.mjs`

  Expected: PASS for valid recovery, invalid/error, sanitization, parameter allowlisting, and missing-config cases.

- [ ] **Step 6: Commit the integration contract**

  ```bash
  git add src/integrations/supabase/browser-client.ts src/products/birthly/auth/password-recovery.ts test-web/password-recovery.test.mjs package.json package-lock.json
  git commit -m "feat: add public Supabase browser recovery contract"
  ```

### Task 3: Build the Birthly password-recovery page

**Files:**
- Create: `app/birthly/reset-password/page.tsx`
- Create: `src/products/birthly/components/BirthlyPasswordRecoveryPage.tsx`
- Create: `src/products/birthly/components/BirthlyPasswordRecoveryPage.module.css`
- Modify: `app/globals.css`
- Modify: `test-web/static-output.test.mjs`
- Create: `test-web/password-recovery-page.test.mjs`

**Interfaces:**
- `BirthlyPasswordRecoveryPage` is a client component with states `checking`, `ready`, `success`, `invalid`, `error`, and `unavailable`.
- It consumes `parseRecoveryCallback`, `sanitizeRecoveryUrl`, `getBrowserSupabaseClient`, and the Birthly route definition from Tasks 1–2.
- Its success CTA points to the existing Birthly open-app flow or store fallback; it must not auto-launch a custom scheme.

- [ ] **Step 1: Write failing page contract tests**

  Assert the static route is emitted, the direct/invalid state does not show password fields, the valid recovery state exposes password and confirmation fields, mismatch/weak passwords do not call `updateUser`, and success calls `updateUser` once, signs out locally, sanitizes history, and renders the success CTA.

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `node --experimental-strip-types --test test-web/password-recovery-page.test.mjs test-web/static-output.test.mjs`

  Expected: FAIL because the route and component do not exist.

- [ ] **Step 3: Implement the client page and state transitions**

  On mount, parse and consume the callback, establish the recovery session, replace the URL with the canonical route, and render only the relevant state. Validate password length/strength and confirmation locally before invoking `supabase.auth.updateUser({ password })`. On success, call local sign-out and show a generic confirmation. Keep form values and token material out of logs and analytics.

- [ ] **Step 4: Add responsive accessible styling**

  Use the existing Fuji Sys/Birthly visual tokens, labels, focus states, live status messaging, and mobile layout. Do not introduce a separate auth visual system or duplicate the institutional shell.

- [ ] **Step 5: Run the focused test and verify it passes**

  Run: `node --experimental-strip-types --test test-web/password-recovery-page.test.mjs test-web/static-output.test.mjs`

  Expected: PASS with the reset route included in the static export contract and all recovery state assertions passing.

- [ ] **Step 6: Commit the recovery page**

  ```bash
  git add app/birthly/reset-password src/products/birthly/components app/globals.css test-web/static-output.test.mjs test-web/password-recovery-page.test.mjs
  git commit -m "feat: add Birthly web password recovery"
  ```

### Task 4: Document deployment and Supabase configuration

**Files:**
- Create: `docs/integrations/birthly-password-recovery.md`
- Modify: `docs/integrations/birthly-email-confirmation.md`
- Modify: `scripts/verify-static-output.mjs`
- Modify: `test-web/static-output.test.mjs`
- Modify: `README.md` if present, otherwise add the deployment section to the integration doc

**Interfaces:**
- Documentation defines production, staging, and local public variables.
- Static-output verification checks `/birthly/reset-password/index.html` and rejects an output that omits the route.

- [ ] **Step 1: Add failing static-output assertions**

  Add the reset route to the expected exported pages and assert that the verification instructions name the exact production redirect.

- [ ] **Step 2: Run the static contract and verify it fails**

  Run: `npm run test:static`

  Expected: FAIL until the exported route and verification contract are updated.

- [ ] **Step 3: Implement the documentation and static contract**

  Document `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, exact Supabase Site URL/redirect entries, staging separation, and the prohibition on `service_role`. Record that dashboard/deployment changes must be read back before claiming completion.

- [ ] **Step 4: Run the complete site checks**

  Run: `npm run test:static && npm run test:callback-output && npm run build`

  Expected: PASS; the build emits the reset route and preserves all existing confirmation/open-app routes.

- [ ] **Step 5: Commit the deployment contract**

  ```bash
  git add docs/integrations/birthly-password-recovery.md docs/integrations/birthly-email-confirmation.md scripts/verify-static-output.mjs test-web/static-output.test.mjs
  git commit -m "docs: document Birthly recovery deployment"
  ```

### Task 5: End-to-end site verification and handoff

**Files:**
- Modify: `docs/integrations/birthly-password-recovery.md`

- [ ] **Step 1: Build with production-shaped public variables**

  Run the static build with a test Supabase URL/key pair, never a service-role key, and confirm the values are present only in client bundle code where expected.

- [ ] **Step 2: Verify the generated route and token hygiene**

  Inspect `out/birthly/reset-password/index.html` and the callback bundle for absence of hard-coded access tokens, refresh tokens, passwords, and server secrets.

- [ ] **Step 3: Record external configuration status**

  Update the integration doc only with settings actually applied and read back from the deployment/Supabase dashboard.

- [ ] **Step 4: Commit the verification record**

  ```bash
  git add docs/integrations/birthly-password-recovery.md
  git commit -m "test: verify Birthly recovery static export"
  ```
