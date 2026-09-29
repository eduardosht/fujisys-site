import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const verifier = fileURLToPath(new URL('../scripts/verify-static-output.mjs', import.meta.url));
const recoveryGuide = fileURLToPath(new URL('../docs/integrations/birthly-password-recovery.md', import.meta.url));
const titles = {
  'index.html': 'Fuji Sys — Soluções digitais com propósito',
  'privacy/index.html': 'Política de Privacidade | Fuji Sys',
  'support/index.html': 'Suporte | Fuji Sys',
  'birthly/index.html': 'Birthly — Datas importantes por perto | Fuji Sys',
  'birthly/privacy/index.html': 'Política de Privacidade | Fuji Sys',
  'birthly/support/index.html': 'Suporte do Birthly | Fuji Sys',
  'auth/callback/index.html': 'Confirmar e-mail | Birthly',
  'birthly/confirm-email/index.html': 'Confirmação de e-mail do Birthly | Fuji Sys',
  'birthly/reset-password/index.html': 'Redefinir senha do Birthly | Fuji Sys',
  'birthly/open-app/index.html': 'Abrir Birthly | Fuji Sys',
};

function verifyFixture(changes = {}) {
  const root = mkdtempSync(join(tmpdir(), 'birthly-static-output-'));
  const authRoutes = new Set([
    'auth/callback/index.html',
    'birthly/confirm-email/index.html',
    'birthly/reset-password/index.html',
    'birthly/open-app/index.html',
  ]);
  const includeNoIndex = changes.__noindex !== false;
  try {
    writeFileSync(join(root, 'package.json'), JSON.stringify({ scripts: {} }));
    for (const [file, title] of Object.entries(titles)) {
      if (file === '__noindex') continue;
      if (changes[file] === null) continue;
      const path = join(root, 'out', file);
      mkdirSync(dirname(path), { recursive: true });
      const robots = includeNoIndex && authRoutes.has(file)
        ? '<meta name="robots" content="noindex,nofollow">'
        : '';
      writeFileSync(path, `<html><head>${robots}<title>${changes[file] ?? title}</title></head></html>`);
    }
    writeFileSync(join(root, 'out', '404.html'), '<html></html>');
    if (changes.robots !== null) {
      writeFileSync(
        join(root, 'out', 'robots.txt'),
        changes.robots === 'blocked'
          ? 'User-agent: *\nDisallow: /auth/callback/\nDisallow: /birthly/confirm-email/\nDisallow: /birthly/reset-password/\nDisallow: /birthly/open-app/\n'
          : 'User-agent: *\nAllow: /\n',
      );
    }
    const callbackSource = join(root, 'src/components/pages/AuthCallbackPage.tsx');
    mkdirSync(dirname(callbackSource), { recursive: true });
    writeFileSync(callbackSource, 'history.replaceState({}, "", "/auth/callback/");');
    const callbackPath = join(root, 'out/auth/callback/index.html');
    mkdirSync(dirname(callbackPath), { recursive: true });
    const callbackRobots = includeNoIndex
      ? '<meta name="robots" content="noindex,nofollow">'
      : '';
    writeFileSync(callbackPath, `<html><head>${callbackRobots}<meta name="referrer" content="no-referrer"><script src="/_next/static/chunks/callback.js"></script></head><body>E-mail confirmado com sucesso birthday://signup-confirmation</body></html>`);
    const callbackBundle = join(root, 'out/_next/static/chunks/callback.js');
    mkdirSync(dirname(callbackBundle), { recursive: true });
    writeFileSync(callbackBundle, 'history.replaceState({}, "", "/auth/callback/");');
    const aasaPath = join(root, 'out/.well-known/apple-app-site-association');
    mkdirSync(dirname(aasaPath), { recursive: true });
    writeFileSync(aasaPath, JSON.stringify({ applinks: { details: [{ appIDs: ['F55K44C6JY.com.edufuji.birthday'], components: [{ '/': '/auth/callback' }, { '/': '/auth/callback/' }] }] } }));
    return spawnSync(process.execPath, [verifier], { cwd: root, encoding: 'utf8' });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('static verifier requires all Birthly auth route files', () => {
  for (const file of [
    'birthly/confirm-email/index.html',
    'birthly/reset-password/index.html',
    'birthly/open-app/index.html',
  ]) {
    const result = verifyFixture({ [file]: null });
    assert.notEqual(result.status, 0, file);
    assert.match(result.stderr, new RegExp(`Missing static output files: .*${file}`));
  }
});

test('deployment verification instructions name the exact production recovery redirect', () => {
  const instructions = readFileSync(recoveryGuide, 'utf8');
  assert.match(
    instructions,
    /PASSWORD_RESET_REDIRECT_URL=https:\/\/fujisys\.com\.br\/birthly\/reset-password\//,
  );
});

test('static verifier requires institutional route files', () => {
  for (const file of ['privacy/index.html', 'support/index.html']) {
    const result = verifyFixture({ [file]: null });
    assert.notEqual(result.status, 0, file);
    assert.match(result.stderr, new RegExp(`Missing static output files: .*${file}`));
  }
});

test('static verifier requires noindex metadata on auth flow pages', () => {
  const result = verifyFixture({ __noindex: false });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /noindex|robots\.txt/i);
});

test('static verifier keeps noindex auth pages crawlable', () => {
  const result = verifyFixture({ robots: 'blocked' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not block/i);
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
  assert.equal(result.stdout, 'Verified 12 static output files and iOS callback contracts.\n');
});
