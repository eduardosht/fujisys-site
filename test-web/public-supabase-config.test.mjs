import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = 'scripts/verify-public-supabase-config.mjs';

function run(env) {
  return spawnSync(process.execPath, [script], {
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
}

test('rejects a secret key before static build', () => {
  const result = run({
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_not-for-browser',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /publishable|public|secret/i);
});

test('accepts the public Supabase configuration used by the browser', () => {
  const result = run({
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
  });

  assert.equal(result.status, 0, result.stderr);
});
