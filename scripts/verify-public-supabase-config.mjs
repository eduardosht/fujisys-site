import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isPublicSupabaseKey } from "../src/integrations/supabase/public-config.mjs";

function loadEnvFile(file) {
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]] !== undefined) continue;

    const value = match[2].replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, (_, doubleQuoted, singleQuoted) =>
      doubleQuoted ?? singleQuoted,
    );
    process.env[match[1]] = value;
  }
}

for (const file of [".env", ".env.local", ".env.production", ".env.production.local"]) {
  loadEnvFile(join(process.cwd(), file));
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

if (!url || !key) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Configure public Supabase values before the static build.",
  );
}

if (!isPublicSupabaseKey(key)) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY contains a secret/service-role key. Use a Supabase publishable key; never expose a secret key in a static site.",
  );
}

console.log("Public Supabase build configuration: ok");
