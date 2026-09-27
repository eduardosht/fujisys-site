import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const verifier = fileURLToPath(new URL('../scripts/verify-static-output.mjs', import.meta.url));
const titles = {
  'index.html': 'Fuji Sys — Soluções digitais com propósito',
  'birthly/index.html': 'Birthly — Datas importantes por perto | Fuji Sys',
  'birthly/privacy/index.html': 'Política de Privacidade | Fuji Sys',
  'birthly/support/index.html': 'Suporte do Birthly | Fuji Sys',
  'birthly/confirm-email/index.html': 'Confirmação de e-mail do Birthly | Fuji Sys',
  'birthly/open-app/index.html': 'Abrir Birthly | Fuji Sys',
};

function verifyFixture(changes = {}) {
  const root = mkdtempSync(join(tmpdir(), 'birthly-static-output-'));
  try {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts: {} }));
    for (const [file, title] of Object.entries(titles)) {
      if (changes[file] === null) continue;
      const path = join(root, 'out', file);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, `<html><head><title>${changes[file] ?? title}</title></head></html>`);
    }
    writeFileSync(join(root, 'out', '404.html'), '<html></html>');
    return spawnSync(process.execPath, [verifier], { cwd: root, encoding: 'utf8' });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('static verifier requires both Birthly confirmation route files', () => {
  for (const file of ['birthly/confirm-email/index.html', 'birthly/open-app/index.html']) {
    const result = verifyFixture({ [file]: null });
    assert.notEqual(result.status, 0, file);
    assert.match(result.stderr, new RegExp(`Missing static output files: .*${file}`));
  }
});

test('static verifier requires the exported route titles', () => {
  for (const file of ['birthly/confirm-email/index.html', 'birthly/open-app/index.html']) {
    const result = verifyFixture({ [file]: 'Wrong title' });
    assert.notEqual(result.status, 0, file);
    assert.match(result.stderr, new RegExp(`Missing expected title in ${file}:`));
  }
});

test('static verifier rejects a title with an extra suffix', () => {
  for (const file of ['birthly/confirm-email/index.html', 'birthly/open-app/index.html']) {
    const result = verifyFixture({ [file]: `${titles[file]} — unexpected` });
    assert.notEqual(result.status, 0, file);
    assert.match(result.stderr, new RegExp(`Missing expected title in ${file}:`));
  }
});

test('static verifier accepts a complete export', () => {
  const result = verifyFixture();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'Verified 7 static output files.\n');
});
