# Fuji Sys multi-product site and Birthly auth architecture

## Status

Approved conversational architecture; awaiting written-spec review before implementation planning.

## Context

The Fuji Sys website currently presents the Birthly product and the Fuji Sys institutional content from the same small set of route and configuration objects. Birthly's e-mail confirmation flow already uses a product-scoped route, but its password recovery still redirects to the native app with `birthday://password-reset`. The app does not consistently consume that recovery deep link, and the static website has no Supabase client or password-reset page.

Fuji Sys must support multiple products. Each product needs independent marketing pages, support, legal content, store links, visual identity, authentication callbacks, and product-specific integrations without turning the institutional shell into a collection of product conditionals.

## Goals

- Establish a product-oriented architecture in `fujisys-site` while preserving existing public Birthly URLs.
- Keep institutional Fuji Sys concerns separate from product concerns.
- Add a secure Birthly password-recovery flow through `https://fujisys.com.br/birthly/reset-password/`.
- Use only public Supabase browser credentials in the static site.
- Keep authentication callbacks and legal content scoped to their product.
- Make a future product additive: registering a product should not require editing unrelated Birthly behavior.
- Provide explicit configuration and rollout documentation for production and staging.

## Non-goals

- Rebuild the visual design system or redesign the existing Fuji Sys and Birthly pages.
- Move existing Birthly URLs to a new `/products/birthly` URL.
- Introduce a server-side authentication layer or expose a Supabase `service_role` key.
- Build a general multi-tenant dashboard for product administration.
- Replace the app's existing sign-up confirmation flow in this change.

## Public route model

Existing routes remain stable:

| Scope | Route | Responsibility |
| --- | --- | --- |
| Institutional | `/` | Fuji Sys home and product catalog |
| Institutional | `/privacy` | Fuji Sys institutional privacy content |
| Institutional | `/support` | Fuji Sys institutional support |
| Birthly | `/birthly/` | Birthly product page |
| Birthly | `/birthly/privacy/` | Birthly product privacy content |
| Birthly | `/birthly/support/` | Birthly product support |
| Birthly | `/birthly/confirm-email/` | Birthly sign-up confirmation result |
| Birthly | `/birthly/reset-password/` | Birthly password recovery and password update |
| Birthly | `/birthly/open-app/` | Birthly app-opening/install assistance |
| Shared callback | `/auth/callback/` | Existing compatibility callback; no new product-specific behavior should be added here |

New products receive their own namespace, for example `/product-slug/`, `/product-slug/privacy/`, and `/product-slug/support/`. Product authentication callbacks must remain under that product namespace.

All route strings must account for `NEXT_PUBLIC_BASE_PATH` and trailing-slash output. Existing links, Supabase redirect URLs, and deployed static files must use the same canonical form.

## Code architecture

The implementation will introduce explicit layers:

```text
app/
  page.tsx
  privacy/page.tsx
  support/page.tsx
  birthly/
    layout.tsx
    page.tsx
    privacy/page.tsx
    support/page.tsx
    confirm-email/page.tsx
    reset-password/page.tsx
    open-app/page.tsx

src/
  site/
    config.ts
    routes.ts
    components/
  products/
    catalog.ts
    birthly/
      config.ts
      routes.ts
      legal.ts
      auth/
        password-recovery.ts
        supabase-browser.ts
      components/
  integrations/
    supabase/
      browser-client.ts
  components/
    shared/
```

### Institutional layer

The institutional layer owns Fuji Sys branding, navigation, global metadata, institutional privacy/support content, the product catalog, and shared layout primitives. It must not contain Birthly-specific auth states, Supabase redirect URLs, or Birthly legal copy.

### Product catalog

`src/products/catalog.ts` will expose a typed product registry. A product definition contains only stable product metadata and references to product-owned capabilities:

- `id`, `slug`, display name, description, and product URL;
- product visual identity and metadata defaults;
- product route builders;
- legal content references;
- support contact and links;
- store links;
- optional integrations such as Supabase auth.

The catalog is the source used by the institutional product listing. Product pages and product callbacks import their own product definition rather than branching on a global product name.

### Product layer

Each product owns its routes, page composition, legal content, support content, auth flows, environment contract, and product assets. Shared components may be used for layout and accessibility, but product-specific state machines and copy remain in the product namespace.

### Integration layer

`src/integrations/supabase/browser-client.ts` will be a browser-only factory for a Supabase client created with the public URL and publishable key. It must:

- never read or expose `service_role` or secret keys;
- avoid server-side session assumptions in the static export;
- keep URL-session detection explicit for the recovery page;
- be consumed only by product auth modules that opt in.

The product auth module will own recovery-specific parsing, session state, password validation, update, local sign-out, and user-facing error mapping. The generic integration must not know Birthly copy or routes.

## Birthly password-recovery flow

### Request

The Flutter app will pass the canonical HTTPS URL below to Supabase's `resetPasswordForEmail`:

```text
https://fujisys.com.br/birthly/reset-password/
```

The app's build-time `PASSWORD_RESET_REDIRECT_URL` remains configurable so staging can use a staging domain and a separate Supabase project.

### Browser callback

The static page is client-only. After Supabase verifies the one-time recovery link, the browser receives the session in the URL fragment. The page will:

1. detect only the expected recovery callback (`type=recovery`) and required session material;
2. let the Supabase browser client establish the recovery session;
3. replace the current history entry to remove access and refresh tokens from the visible URL;
4. render a new-password and confirmation form;
5. call `supabase.auth.updateUser({ password })` only after local validation;
6. clear the local browser session after a successful update;
7. show a success state and an explicit Birthly app CTA without automatically launching a custom scheme.

The raw token, password, and Supabase error details must not be written to analytics, logs, rendered HTML, or query-string parameters. Expired, missing, malformed, and already-used links receive a generic recovery error with a support path.

### Credentials and security

The deployed site may expose only these build-time browser variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The Supabase dashboard must use exact production and staging redirect URLs. Production must not use a broad wildcard. The `Site URL` must remain the institutional canonical URL, while product callback URLs are added as explicit allowed redirects. The reset page must not use a server-side admin update or accept a user id from the browser.

### Legacy links

Existing `birthday://password-reset` links may already be in user inboxes. The app will keep recognizing the legacy route during the migration window and show a recoverable state instead of falling through to onboarding. New reset requests will use the HTTPS site route. Legacy support can be removed only after the migration window is documented and observed.

## Environment contract

The app and site must use environment-specific values:

| Environment | App `PASSWORD_RESET_REDIRECT_URL` | Site reset route | Supabase project |
| --- | --- | --- | --- |
| Production | `https://fujisys.com.br/birthly/reset-password/` | same | production project |
| Staging | staging HTTPS domain and `/birthly/reset-password/` | same | preferably separate staging project |
| Local | local site URL or explicitly supported test redirect | same local route | local/test project |

The site must fail the recovery page in a user-readable way when the public Supabase variables are missing; it must not silently pretend that a reset succeeded. Build documentation will distinguish public browser variables from prohibited secrets.

## Testing strategy

### Site unit/contract tests

- product catalog exposes unique product ids and slugs;
- product route builders preserve base path and trailing slash;
- recovery parser accepts only valid recovery markers and does not forward arbitrary parameters;
- recovery parser rejects missing, malformed, error, and non-recovery callbacks;
- token cleanup removes query and fragment values from the canonical route;
- password form validates mismatch and weak-password cases before calling Supabase;
- success and failure states do not include raw tokens or password values;
- static export contains the Birthly reset route and does not require a server runtime.

### App tests

- the reset request passes the configured HTTPS redirect;
- the legacy `birthday://password-reset` link does not route to onboarding;
- a valid recovery session opens the reset state;
- update success signs out and returns to the expected post-reset state;
- recovery errors remain actionable and do not leave stale loading state.

### Integration verification

After implementation, run the site tests and build, then validate with a real staging Supabase project: request reset, open the e-mail on mobile and desktop, update the password, verify that the old password fails, verify the new password works in the app, and confirm that refresh/reuse of the same link is rejected safely.

## Rollout and external configuration

Implementation will be split into these deployable steps:

1. Add the multi-product structure without changing existing URLs.
2. Add the static Birthly reset page and site-side Supabase client.
3. Update the app redirect and legacy deep-link handling.
4. Add public site variables in the deployment environment.
5. Add exact redirect URLs in Supabase for production and staging.
6. Build and run site/app tests.
7. Validate a real reset in staging before changing production app configuration.
8. Roll out the production redirect and retain the legacy route during the documented migration window.

The repository documentation must record which external settings were applied and which still require dashboard/deployment access. No claim of external configuration is complete until it is read back from the relevant environment or Supabase dashboard.

## Acceptance criteria

- Fuji Sys institutional routes contain no Birthly-specific auth conditionals.
- Birthly pages and callbacks are grouped under the Birthly namespace and use product-owned configuration.
- A future product can be registered without editing Birthly auth code.
- Password recovery completes entirely through the HTTPS site page on mobile and desktop.
- No service-role key or password-reset token is exposed through source, query parameters, logs, analytics, or static HTML.
- Existing Birthly confirmation and support routes continue to work.
- Production and staging redirects are explicit, documented, and testable.
- Unit, static-export, app, and staging integration checks pass before rollout.
