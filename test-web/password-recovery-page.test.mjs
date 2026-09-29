import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  RECOVERY_PAGE_STATES,
  callbackPageState,
  establishRecoverySession,
  replaceRecoveryHistory,
  submitPasswordReset,
} from '../src/products/birthly/auth/password-recovery-page.mjs';
import { parseRecoveryCallback } from '../src/products/birthly/auth/password-recovery.ts';

const componentPath = new URL(
  '../src/products/birthly/components/BirthlyPasswordRecoveryPage.tsx',
  import.meta.url,
);
const routePath = new URL('../app/birthly/reset-password/page.tsx', import.meta.url);

test('registers the Birthly reset route and client presentation layer', () => {
  assert.equal(existsSync(routePath), true);
  assert.equal(existsSync(componentPath), true);

  const routeSource = readFileSync(routePath, 'utf8');
  const componentSource = readFileSync(componentPath, 'utf8');
  assert.match(routeSource, /BirthlyPasswordRecoveryPage/);
  assert.match(componentSource, /"use client"/);
  assert.match(componentSource, /type="password"/);
  assert.match(componentSource, /aria-live="polite"/);
  assert.match(componentSource, /BIRTHLY_PRODUCT/);
  assert.doesNotMatch(componentSource, /birthday:\/\//);
});

test('keeps the recovery state machine bounded to its six user-facing states', () => {
  assert.deepEqual(RECOVERY_PAGE_STATES, [
    'checking',
    'ready',
    'success',
    'invalid',
    'error',
    'unavailable',
  ]);

  assert.equal(callbackPageState(parseRecoveryCallback('', '')).status, 'invalid');
  assert.equal(
    callbackPageState(parseRecoveryCallback('', '#type=recovery&access_token=a&refresh_token=r')).status,
    'ready',
  );
  assert.equal(
    callbackPageState(parseRecoveryCallback('', '#type=recovery&error=denied')).status,
    'error',
  );
});

test('establishes a valid recovery session without returning token material', async () => {
  const callback = parseRecoveryCallback(
    '',
    '#type=recovery&access_token=private-access&refresh_token=private-refresh&expires_in=3600',
  );
  const calls = [];
  const supabase = {
    auth: {
      async setSession(session) {
        calls.push(session);
        return { data: { session: {} }, error: null };
      },
    },
  };

  const result = await establishRecoverySession(callback, supabase);

  assert.deepEqual(result, { status: 'ready' });
  assert.deepEqual(calls, [{
    access_token: 'private-access',
    refresh_token: 'private-refresh',
    expires_in: 3600,
  }]);
  assert.doesNotMatch(JSON.stringify(result), /private-/);
});

test('exchanges a PKCE recovery code before showing the password form', async () => {
  const callback = parseRecoveryCallback('?code=one-time-code&type=recovery', '');
  const calls = [];
  const supabase = {
    auth: {
      async exchangeCodeForSession(code) {
        calls.push(code);
        return { data: { session: {} }, error: null };
      },
    },
  };

  assert.deepEqual(await establishRecoverySession(callback, supabase), { status: 'ready' });
  assert.deepEqual(calls, ['one-time-code']);
});

test('rejects query-only recovery tokens without calling setSession', async () => {
  const callback = parseRecoveryCallback(
    '?type=recovery&access_token=query-access&refresh_token=query-refresh',
    '',
  );
  const calls = [];
  const supabase = {
    auth: {
      async setSession(session) {
        calls.push(session);
        return { data: { session: {} }, error: null };
      },
    },
  };

  assert.deepEqual(callback, { state: 'invalid' });
  assert.deepEqual(await establishRecoverySession(callback, supabase), {
    status: 'invalid',
    message: 'Este link de recuperação é inválido ou expirou. Solicite um novo link.',
  });
  assert.deepEqual(calls, []);
});

test('replaces callback history with the canonical route without leaking tokens', () => {
  const events = [];
  replaceRecoveryHistory(
    {
      state: { keep: true },
      replaceState(state, title, path) {
        events.push({ state, title, path });
      },
    },
    '/birthly/reset-password/?type=recovery#access_token=private-access',
  );

  assert.deepEqual(events, [{
    state: { keep: true },
    title: '',
    path: '/birthly/reset-password/',
  }]);
  assert.doesNotMatch(JSON.stringify(events), /private-access|type=recovery/);
});

test('rejects mismatched and weak passwords before calling updateUser', async () => {
  const calls = [];
  const supabase = {
    auth: {
      async updateUser(input) {
        calls.push(input);
        return { error: null };
      },
      async signOut() {
        throw new Error('must not sign out');
      },
    },
  };

  assert.deepEqual(
    await submitPasswordReset(supabase, 'Birthly123', 'Birthly124'),
    { status: 'ready', validationError: 'As senhas não coincidem.' },
  );
  assert.deepEqual(
    await submitPasswordReset(supabase, 'abcdefgh', 'abcdefgh'),
    { status: 'ready', validationError: 'Use uma senha com pelo menos uma letra e um número.' },
  );
  assert.deepEqual(calls, []);
});

test('updates the password once, signs out locally, and returns success', async () => {
  const calls = [];
  const supabase = {
    auth: {
      async updateUser(input) {
        calls.push(['updateUser', input]);
        return { error: null };
      },
      async signOut(options) {
        calls.push(['signOut', options]);
        return { error: null };
      },
    },
  };

  assert.deepEqual(
    await submitPasswordReset(supabase, 'Birthly123', 'Birthly123'),
    { status: 'success' },
  );
  assert.deepEqual(calls, [
    ['updateUser', { password: 'Birthly123' }],
    ['signOut', { scope: 'local' }],
  ]);
});

test('returns a non-success state when local sign-out fails', async () => {
  for (const signOut of [
    async () => {
      throw new Error('network failure');
    },
    async () => ({ error: new Error('session cleanup failed') }),
  ]) {
    const calls = [];
    const supabase = {
      auth: {
        async updateUser(input) {
          calls.push(['updateUser', input]);
          return { error: null };
        },
        async signOut(options) {
          calls.push(['signOut', options]);
          return signOut();
        },
      },
    };

    const result = await submitPasswordReset(supabase, 'Birthly123', 'Birthly123');

    assert.deepEqual(result, {
      status: 'error',
      message: 'Sua senha foi atualizada, mas não foi possível encerrar a sessão neste navegador. Feche esta aba antes de continuar.',
    });
    assert.deepEqual(calls, [
      ['updateUser', { password: 'Birthly123' }],
      ['signOut', { scope: 'local' }],
    ]);
  }
});
