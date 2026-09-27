import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildConfirmationResultUrl,
  parseConfirmationResult,
  sanitizeCallbackUrl,
} from '../src/lib/emailConfirmation.mjs';

test('signup type in the query or fragment signals success', () => {
  assert.deepEqual(parseConfirmationResult('?type=signup', ''), { status: 'success' });
  assert.deepEqual(parseConfirmationResult('', '#type=signup'), { status: 'success' });
});

test('an access token in the fragment signals success', () => {
  assert.deepEqual(parseConfirmationResult('', '#access_token=secret&refresh_token=other'), { status: 'success' });
});

test('a nonempty PKCE code signals success', () => {
  assert.deepEqual(parseConfirmationResult('?code=abc123', ''), { status: 'success' });
});

test('any error field takes precedence over success markers', () => {
  assert.deepEqual(parseConfirmationResult('?type=signup&error=', '#access_token=secret'), { status: 'error' });
  assert.deepEqual(parseConfirmationResult('?code=abc123', '#error_description=Expired'), { status: 'error' });
  assert.deepEqual(parseConfirmationResult('?error_code=otp_expired', ''), { status: 'error' });
});

test('empty PKCE code and access token do not signal success', () => {
  assert.deepEqual(parseConfirmationResult('?code=', '#access_token='), { status: 'unknown' });
});

test('direct visits and empty parameters remain unknown', () => {
  assert.deepEqual(parseConfirmationResult('', ''), { status: 'unknown' });
  assert.deepEqual(parseConfirmationResult('?', '#'), { status: 'unknown' });
  assert.deepEqual(parseConfirmationResult('?type=&code=&other=value', '#refresh_token=secret'), { status: 'unknown' });
  assert.deepEqual(parseConfirmationResult('?type=recovery', ''), { status: 'unknown' });
});

test('sanitizing the callback removes query and fragment', () => {
  assert.equal(
    sanitizeCallbackUrl('/birthly/confirm-email/?code=secret#access_token=secret'),
    '/birthly/confirm-email/',
  );
});

test('CTA URLs contain only a permitted confirmation result', () => {
  assert.equal(buildConfirmationResultUrl('/birthly/open-app/', 'success'), '/birthly/open-app/?confirmation_result=success');
  assert.equal(buildConfirmationResultUrl('/birthly/open-app/', 'error'), '/birthly/open-app/?confirmation_result=error');
  assert.equal(buildConfirmationResultUrl('/birthly/open-app/', 'unknown'), '/birthly/open-app/?confirmation_result=unknown');
  assert.equal(
    buildConfirmationResultUrl('/birthly/open-app/?code=secret#access_token=secret', 'success'),
    '/birthly/open-app/?confirmation_result=success',
  );
  assert.equal(buildConfirmationResultUrl('/birthly/open-app/', 'forged'), '/birthly/open-app/?confirmation_result=unknown');
});
