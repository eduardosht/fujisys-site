# Email confirmation — iOS release

Only `NEXT_PUBLIC_BIRTHLY_APP_STORE_URL` is required for this release. Export the
official Birthly App Store listing URL before running both commands:

```sh
npm run build
REQUIRE_BIRTHLY_DOWNLOAD_LINKS=1 npm run test:static
npm run test:callback-output
```

The gate requires HTTPS on `apps.apple.com` and the exact configured value in
the built callback HTML metadata and its loaded JavaScript bundle. Setting a
different URL only when verifying an old build fails. The domain root is
accepted only if that exact value was built; such a test does not prove a real
Birthly store listing. Rebuild with the official listing before deployment.

Android, Google Play, `NEXT_PUBLIC_BIRTHLY_GOOGLE_PLAY_URL`, `assetlinks.json`,
and Android signing verification are deferred and do not block iOS.

The App Router callback metadata declares `referrer: 'no-referrer'`. Next.js
places resource tags before ordinary metadata, so `npm run build` also moves
that generated tag to the beginning of the exported callback head. Static
checks enforce that it precedes resource loading. Deploy the finalized `out/`
artifact. No hosting `Referrer-Policy` response header is configured here.

AASA associates `F55K44C6JY.com.edufuji.birthday` only with `/auth/callback` and
`/auth/callback/`. Confirm the public AASA delivery and signed-device behavior
after deployment. Supabase URL configuration and a signed-iPhone confirmation
matrix remain external release prerequisites.
