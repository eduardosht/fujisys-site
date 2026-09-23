import assert from 'node:assert/strict';
import {
  buildMobileConfirmationUrl,
  classifyAuthCallback,
  safeAuthErrorMessage,
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

for (const key of ['error', 'error_code', 'error_description']) {
  for (const [search, hash] of [
    [`?${key}=`, '#access_token=token&refresh_token=refresh&type=signup'],
    ['?code=code', `#${key}=untrusted-error`],
  ]) {
    assert.equal(classifyAuthCallback(search, hash), 'error');
    assert.equal(buildMobileConfirmationUrl(search, hash), null);
    assert.equal(safeAuthErrorMessage(search, hash),
      'Não foi possível confirmar seu e-mail. O link pode ter expirado ou já ter sido usado.');
  }
}
for (const search of ['', '?code=', '?access_token=', '?refresh_token=refresh', '?type=recovery']) {
  assert.equal(classifyAuthCallback(search, ''), 'direct');
  assert.equal(buildMobileConfirmationUrl(search, ''), null);
}
assert.equal(
  buildMobileConfirmationUrl('?redirect_to=https%3A%2F%2Fevil.test&arbitrary=discard',
    '#access_token=token&refresh_token=refresh&expires_in=3600&expires_at=1234567890&token_type=bearer&type=signup&token_hash=hash'),
  'birthday://signup-confirmation?access_token=token&refresh_token=refresh&expires_in=3600&expires_at=1234567890&token_type=bearer&type=signup&token_hash=hash',
);

console.log('auth callback helper contract: ok (34 assertions)');
