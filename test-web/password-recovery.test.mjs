import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseRecoveryCallback,
  recoveryErrorMessage,
  sanitizeRecoveryUrl,
} from '../src/products/birthly/auth/password-recovery.ts';
import {
  getBrowserSupabaseClient,
  SupabaseBrowserConfigError,
  SupabaseBrowserEnvironmentError,
} from '../src/integrations/supabase/browser-client.ts';

test('accepts a recovery callback with session material from the fragment', () => {
  const callback = parseRecoveryCallback(
    '?unrelated=discard-me',
    '#type=recovery&access_token=access-example&refresh_token=refresh-example&expires_in=3600&token_type=bearer',
  );

  assert.deepEqual(callback, {
    state: 'recovery',
    session: {
      accessToken: 'access-example',
      refreshToken: 'refresh-example',
      expiresIn: 3600,
      tokenType: 'bearer',
    },
  });
  assert.doesNotMatch(JSON.stringify(callback), /discard-me/);
});

test('accepts a PKCE recovery callback code from the query without exposing it as a session', () => {
  assert.deepEqual(
    parseRecoveryCallback('?code=one-time-code&type=recovery', ''),
    { state: 'pkce', code: 'one-time-code' },
  );
});

test('rejects recovery tokens supplied only in the query', () => {
  const callback = parseRecoveryCallback(
    '?type=recovery&access_token=access-example&refresh_token=refresh-example',
    '',
  );

  assert.deepEqual(callback, { state: 'invalid' });
});

test('maps Supabase callback errors to an error state without returning raw details', () => {
  const callback = parseRecoveryCallback(
    '',
    '#type=recovery&error=access_denied&error_code=otp_expired&error_description=private-detail',
  );

  assert.deepEqual(callback, { state: 'error' });
  assert.equal(recoveryErrorMessage(callback), 'Este link já foi usado ou expirou. Abra o Birthly e toque em ‘Esqueci minha senha’ para solicitar um novo link.');
  assert.doesNotMatch(recoveryErrorMessage(callback), /private-detail|otp_expired|access_denied/);
});

test('rejects missing session material and non-recovery callbacks', () => {
  assert.deepEqual(parseRecoveryCallback('', ''), { state: 'invalid' });
  assert.deepEqual(parseRecoveryCallback('', '#type=recovery&access_token=only-one'), { state: 'invalid' });
  assert.deepEqual(parseRecoveryCallback('', '#type=signup&access_token=access-example&refresh_token=refresh-example'), { state: 'invalid' });
  assert.deepEqual(parseRecoveryCallback('', '#access_token=access-example&refresh_token=refresh-example'), { state: 'invalid' });
});

test('ignores arbitrary parameters and never returns them as callback data', () => {
  const callback = parseRecoveryCallback(
    '?type=recovery&redirect=https%3A%2F%2Fevil.example&query-only=discarded',
    '#access_token=access-example&refresh_token=refresh-example&unexpected=also-discarded',
  );

  assert.deepEqual(callback, {
    state: 'recovery',
    session: { accessToken: 'access-example', refreshToken: 'refresh-example' },
  });
  assert.doesNotMatch(JSON.stringify(callback), /evil\.example|unexpected|also-discarded/);
});

test('sanitizes query and fragment data from the canonical recovery pathname', () => {
  assert.equal(
    sanitizeRecoveryUrl('/birthly/reset-password/?type=recovery#access_token=access-example'),
    '/birthly/reset-password/',
  );
});

test('returns a generic invalid-link message for invalid callbacks', () => {
  const callback = parseRecoveryCallback('?type=signup', '');

  assert.equal(callback.state, 'invalid');
  assert.equal(recoveryErrorMessage(callback), 'Este link já foi usado ou expirou. Abra o Birthly e toque em ‘Esqueci minha senha’ para solicitar um novo link.');
});

test('requires a browser before creating the Supabase client', () => {
  const previousWindow = globalThis.window;
  Reflect.deleteProperty(globalThis, 'window');

  try {
    assert.throws(
      () => getBrowserSupabaseClient(),
      (error) => error instanceof SupabaseBrowserEnvironmentError,
    );
  } finally {
    if (previousWindow === undefined) Reflect.deleteProperty(globalThis, 'window');
    else globalThis.window = previousWindow;
  }
});

test('fails explicitly when public Supabase configuration is missing', () => {
  const previousWindow = globalThis.window;
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  globalThis.window = {};
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  try {
    assert.throws(
      () => getBrowserSupabaseClient(),
      (error) => error instanceof SupabaseBrowserConfigError,
    );
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
    if (previousWindow === undefined) Reflect.deleteProperty(globalThis, 'window');
    else globalThis.window = previousWindow;
  }
});

test('creates and reuses a browser client from public configuration only', () => {
  const previousWindow = globalThis.window;
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  globalThis.window = {};
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'public-example-key';

  try {
    const first = getBrowserSupabaseClient();
    const second = getBrowserSupabaseClient();

    assert.equal(first, second);
    assert.equal(first.supabaseUrl, 'https://example.supabase.co');
    assert.equal(typeof first.auth.setSession, 'function');
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
    if (previousWindow === undefined) Reflect.deleteProperty(globalThis, 'window');
    else globalThis.window = previousWindow;
  }
});

test('rejects a secret Supabase key configured for the browser', () => {
  const previousWindow = globalThis.window;
  const previousUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const previousKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  globalThis.window = {};
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_secret_not-for-browser';

  try {
    assert.throws(
      () => getBrowserSupabaseClient(),
      (error) => error instanceof SupabaseBrowserConfigError,
    );
  } finally {
    if (previousUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = previousUrl;
    if (previousKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = previousKey;
    if (previousWindow === undefined) Reflect.deleteProperty(globalThis, 'window');
    else globalThis.window = previousWindow;
  }
});
