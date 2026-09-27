import assert from 'node:assert/strict';
import test from 'node:test';

import { CONFIRMATION_RESULT_STORAGE_KEY } from '../src/lib/emailConfirmationNavigation.mjs';
import {
  buildFallbackAppUrl,
  confirmationReturnPath,
  consumeFallbackResult,
  configuredStoreLinks,
} from '../src/lib/openAppNavigation.mjs';

function storage(initial) {
  const values = new Map(initial ? [[CONFIRMATION_RESULT_STORAGE_KEY, initial]] : []);
  return {
    values,
    getItem(key) { return values.get(key) ?? null; },
    removeItem(key) { values.delete(key); },
  };
}

test('fallback consumes a saved closed result exactly once', () => {
  for (const status of ['success', 'error', 'unknown']) {
    const tab = storage(status);
    assert.equal(consumeFallbackResult(tab), status);
    assert.equal(tab.values.size, 0);
    assert.equal(consumeFallbackResult(tab), 'unknown');
  }
});

test('forged or unavailable storage never claims a successful confirmation', () => {
  const forged = storage('success&code=private');
  assert.equal(consumeFallbackResult(forged), 'unknown');
  assert.equal(forged.values.size, 0);
  assert.equal(consumeFallbackResult({ getItem() { throw new Error('blocked'); }, removeItem() {} }), 'unknown');
});

test('explicit app target contains only the closed result and fixed source marker', () => {
  for (const status of ['success', 'error', 'unknown', 'forged']) {
    const target = new URL(buildFallbackAppUrl(status));
    assert.equal(target.protocol, 'birthday:');
    assert.equal(target.hostname, 'signup-confirmation');
    assert.deepEqual([...target.searchParams.keys()].sort(), ['confirmation_result', 'source']);
    assert.equal(target.searchParams.get('source'), 'email-confirmation');
    assert.equal(target.searchParams.get('confirmation_result'), status === 'forged' ? 'unknown' : status);
  }
});

test('web return stays on the clean confirmation route, including a base path', () => {
  assert.equal(confirmationReturnPath('', '/birthly/confirm-email/'), '/birthly/confirm-email/');
  assert.equal(confirmationReturnPath('/preview', '/birthly/confirm-email/'), '/preview/birthly/confirm-email/');
});

test('store links are absent until valid public HTTPS destinations are configured', () => {
  assert.deepEqual(configuredStoreLinks(undefined, ''), []);
  assert.deepEqual(configuredStoreLinks('javascript:alert(1)', 'http://example.com/app'), []);
  assert.deepEqual(configuredStoreLinks('https://apps.apple.com/app/birthly', 'https://play.google.com/store/apps/details?id=birthly'), [
    { label: 'App Store', href: 'https://apps.apple.com/app/birthly' },
    { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=birthly' },
  ]);
});
