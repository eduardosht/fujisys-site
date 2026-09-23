import assert from 'node:assert/strict';
import {
  buildMobileConfirmationUrl,
  classifyAuthCallback,
} from '../src/lib/auth-callback.ts';

assert.equal(
  classifyAuthCallback('?code=one-time-code', ''),
  'success',
);
assert.equal(
  classifyAuthCallback('', '#access_token=token&refresh_token=refresh&type=signup'),
  'success',
);
assert.equal(
  classifyAuthCallback('?error=access_denied&error_code=otp_expired', ''),
  'error',
);
assert.equal(classifyAuthCallback('', ''), 'direct');
assert.equal(
  buildMobileConfirmationUrl(
    '?code=one-time-code&redirect_to=https%3A%2F%2Fevil.example',
    '',
  ),
  'birthday://signup-confirmation?code=one-time-code',
);

console.log('auth callback helper contract: ok');
