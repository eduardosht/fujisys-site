import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "out");
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
  "birthly/confirm-email/index.html",
  "birthly/open-app/index.html",
  "404.html",
];

const missingFiles = expectedFiles.filter(
  (file) => !existsSync(join(outputDir, file)),
);

if (missingFiles.length > 0) {
  throw new Error(`Missing static output files: ${missingFiles.join(", ")}`);
}

const requiredTitles = {
  "index.html": "Fuji Sys — Soluções digitais com propósito",
  "birthly/index.html": "Birthly — Datas importantes por perto | Fuji Sys",
  "birthly/privacy/index.html": "Política de Privacidade | Fuji Sys",
  "birthly/support/index.html": "Suporte do Birthly | Fuji Sys",
  "birthly/confirm-email/index.html": "Confirmação de e-mail do Birthly | Fuji Sys",
  "birthly/open-app/index.html": "Abrir Birthly | Fuji Sys",
};

for (const [file, title] of Object.entries(requiredTitles)) {
  const html = readFileSync(join(outputDir, file), "utf8");
  if (!html.includes(`<title>${title}</title>`)) {
    throw new Error(`Missing expected title in ${file}: ${title}`);
  }
}

console.log(`Verified ${expectedFiles.length} static output files.`);
