import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

// Run after a build with the same NEXT_PUBLIC_BIRTHLY_APP_STORE_URL value.
const builtStoreUrl = process.env.NEXT_PUBLIC_BIRTHLY_APP_STORE_URL ?? "";

test("exported callback establishes no-referrer in the document head", () => {
  const html = readFileSync("out/auth/callback/index.html", "utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, "Missing exported document head");
  assert.match(head, /<meta name="referrer" content="no-referrer"\s*\/?\s*>/);
  assert.ok(head.indexOf('<meta name="referrer"') < head.search(/<(?:link|script)\b/),
    "Referrer policy must precede resource loading tags");
});

test("exported AASA associates exactly the two callback paths", () => {
  const aasa = JSON.parse(readFileSync("out/.well-known/apple-app-site-association", "utf8"));
  const detail = aasa.applinks.details.find((entry) =>
    entry.appIDs.includes("F55K44C6JY.com.edufuji.birthday"),
  );
  assert.deepEqual(detail.components, [
    { "/": "/auth/callback" },
    { "/": "/auth/callback/" },
  ]);
});

for (const value of new Set([
  "", "http://apps.apple.com/", "https://apps.apple.com.evil.test/",
  "https://example.org/", "https://apps.apple.com/",
  "https://apps.apple.com/?bridge-test=1", builtStoreUrl,
])) {
  test(`release verifier checks built App Store value: ${value || "missing"}`, () => {
    const result = spawnSync(process.execPath, ["scripts/verify-static-output.mjs"], {
      encoding: "utf8",
      env: {
        ...process.env,
        REQUIRE_BIRTHLY_DOWNLOAD_LINKS: "1",
        NEXT_PUBLIC_BIRTHLY_APP_STORE_URL: value,
        NEXT_PUBLIC_BIRTHLY_GOOGLE_PLAY_URL: "",
      },
    });
    const shouldPass = Boolean(value) && value === builtStoreUrl &&
      new URL(value).protocol === "https:" && new URL(value).hostname === "apps.apple.com";
    if (shouldPass) {
      assert.equal(result.status, 0, result.stderr);
    } else {
      assert.notEqual(result.status, 0, "Verifier accepted a missing, unofficial, or unbuilt URL");
      assert.match(result.stderr, /NEXT_PUBLIC_BIRTHLY_APP_STORE_URL/);
    }
  });
}
