import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "out");
const sourceDir = join(process.cwd(), "src");
const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf8"),
);

if (packageJson.scripts?.start === "next start") {
  throw new Error('The "next start" script is incompatible with static export.');
}

const expectedFiles = [
  "index.html",
  "birthly/index.html",
  "birthly/privacy/index.html",
  "birthly/support/index.html",
  "auth/callback/index.html",
  "404.html",
];

const missingFiles = expectedFiles.filter(
  (file) => !existsSync(join(outputDir, file)),
);

if (missingFiles.length > 0) {
  throw new Error(`Missing static output files: ${missingFiles.join(", ")}`);
}

const callbackSource = readFileSync(
  join(sourceDir, "components/pages/AuthCallbackPage.tsx"),
  "utf8",
);

const callbackDocument = readFileSync(
  join(outputDir, "auth/callback/index.html"),
  "utf8",
);
const callbackHead = callbackDocument.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
assert.match(callbackHead, /<meta name="referrer" content="no-referrer"\s*\/?\s*>/,
  "Callback HTML must establish no-referrer before hydration");
assert.ok(callbackHead.indexOf('<meta name="referrer"') < callbackHead.search(/<(?:link|script)\b/),
  "Callback referrer policy must precede resource loading tags; run npm run build");

// Inspect only scripts loaded by this callback, not unrelated/stale chunks.
const callbackScripts = [...callbackDocument.matchAll(/<script[^>]+src="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((src) => src.includes("/_next/static/chunks/") && src.endsWith(".js"));
const callbackBundle = [...new Set(callbackScripts)]
  .map((src) => readFileSync(join(outputDir, src.slice(src.indexOf("/_next/") + 1)), "utf8"))
  .join("\n");
const callbackHtml = `${callbackDocument}\n${callbackBundle}`;

assert.match(callbackHtml, /E-mail confirmado com sucesso/);
assert.match(callbackHtml, /birthday:\/\/signup-confirmation/);
assert.match(callbackHtml, /history\.replaceState/);
assert.match(callbackSource, /history\.replaceState/);
assert.doesNotMatch(callbackSource, /exchangeCodeForSession|setSession/);
assert.doesNotMatch(callbackHtml, /exchangeCodeForSession|setSession/);
assert.doesNotMatch(callbackHtml, /(?:example\.com|fake|placeholder)/i);

const appleAssociationPath = join(
  outputDir,
  ".well-known/apple-app-site-association",
);
assert.ok(existsSync(appleAssociationPath), "Missing exported iOS AASA file");
const appleAssociation = JSON.parse(readFileSync(appleAssociationPath, "utf8"));
const iosDetail = appleAssociation.applinks?.details?.find((detail) =>
  detail.appIDs?.includes("F55K44C6JY.com.edufuji.birthday"),
);
assert.ok(iosDetail, "Missing Birthly iOS app identity in AASA");
assert.deepEqual(
  iosDetail.components,
  [{ "/": "/auth/callback" }, { "/": "/auth/callback/" }],
  "AASA must cover only the callback route",
);

if (process.env.REQUIRE_BIRTHLY_DOWNLOAD_LINKS === "1") {
  const name = "NEXT_PUBLIC_BIRTHLY_APP_STORE_URL";
  const value = process.env[name];
  let isOfficialAppStoreUrl = false;

  try {
    const url = new URL(value ?? "");
    isOfficialAppStoreUrl =
      url.protocol === "https:" && url.hostname === "apps.apple.com";
  } catch {
    isOfficialAppStoreUrl = false;
  }

  if (!isOfficialAppStoreUrl) {
    throw new Error(`${name} must be an official HTTPS store URL`);
  }

  // The metadata value and download action both consume SITE.downloads.appStore.
  // Check its build-time identity, even if another field contains the same URL.
  const escapedValue = value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;",
  })[character]);
  assert.ok(callbackHead.includes(`<meta name="birthly-app-store-url" content="${escapedValue}"`),
    `${name} must exactly match the App Store configuration embedded in the built callback HTML`);

  // NEXT_PUBLIC values are inlined at build time. Match a complete string
  // literal, so a store-domain prefix cannot pass for a different listing.
  assert.ok(
    callbackBundle.includes(JSON.stringify(value)),
    `${name} must exactly match a URL embedded in the built callback bundle; rebuild with this value`,
  );
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

console.log(`Verified ${expectedFiles.length} static output files and iOS callback contracts.`);
