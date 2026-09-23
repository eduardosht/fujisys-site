import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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

const callbackBundle = readdirSync(join(outputDir, "_next/static/chunks"))
  .filter((file) => file.endsWith(".js"))
  .map((file) => readFileSync(join(outputDir, "_next/static/chunks", file), "utf8"))
  .join("\n");
const callbackHtml = `${readFileSync(
  join(outputDir, "auth/callback/index.html"),
  "utf8",
)}\n${callbackBundle}`;

assert.match(callbackHtml, /E-mail confirmado com sucesso/);
assert.match(callbackHtml, /birthday:\/\/signup-confirmation/);
assert.match(callbackHtml, /history\.replaceState/);
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
  [{ "/": "/auth/callback" }, { "/": "/auth/callback/*" }],
  "AASA must cover only the callback route",
);

if (process.env.REQUIRE_BIRTHLY_DOWNLOAD_LINKS === "1") {
  const name = "NEXT_PUBLIC_BIRTHLY_APP_STORE_URL";
  const value = process.env[name];

  if (!value || new URL(value).protocol !== "https:") {
    throw new Error(`${name} must be an official HTTPS store URL`);
  }
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
