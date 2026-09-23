import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";

const path = "out/auth/callback/index.html";
const html = readFileSync(path, "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
assert.ok(head, "Missing exported callback head");
const policies = [...head.matchAll(/<meta name="referrer" content="no-referrer"\s*\/?\s*>/g)];
assert.equal(policies.length, 1, "Callback metadata must generate one no-referrer policy");
const policy = policies[0][0];
// Next/React hoist resources ahead of ordinary metadata. Keep the App Router
// generated policy, but place it before those resources in the deployed export.
writeFileSync(path, html.replace(`<head>${head}</head>`,
  `<head>${policy}${head.replace(policy, "")}</head>`));
console.log("Callback referrer metadata precedes exported resource tags.");
