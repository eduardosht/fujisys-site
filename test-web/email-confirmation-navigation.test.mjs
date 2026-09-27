import assert from 'node:assert/strict';
import test from 'node:test';

import {
  openBirthly,
  processConfirmationCallback,
} from '../src/lib/emailConfirmationNavigation.mjs';

const callbackPath = '/birthly/confirm-email/';

function browser(pathname, search = '', hash = '') {
  const events = [];
  const storage = new Map();
  return {
    location: {
      pathname,
      search,
      hash,
      assign(url) { events.push(['assign', url]); },
    },
    history: {
      state: null,
      replaceState(_state, _unused, path) { events.push(['replace', path]); },
    },
    sessionStorage: {
      setItem(key, value) { storage.set(key, value); events.push(['store', key, value]); },
      getItem(key) { return storage.get(key) ?? null; },
    },
    events,
    storage,
  };
}

test('callback parses the closed status and removes query and fragment without storing raw values', () => {
  const tab = browser(callbackPath, '?code=private-code', '#access_token=private-token');

  assert.deepEqual(processConfirmationCallback(tab, callbackPath), {
    status: 'success',
    path: callbackPath,
  });
  assert.deepEqual(tab.events, [['replace', callbackPath]]);
  assert.equal(tab.storage.size, 0);
});

test('an error overrides success and direct visits remain neutral', () => {
  const errorTab = browser(callbackPath, '?type=signup&error=denied', '#access_token=secret');
  assert.equal(processConfirmationCallback(errorTab, callbackPath)?.status, 'error');
  const directTab = browser(callbackPath);
  assert.equal(processConfirmationCallback(directTab, callbackPath)?.status, 'unknown');
});

test('callbacks on the fallback route are not processed or cleaned', () => {
  const tab = browser('/birthly/open-app/', '?type=signup', '#access_token=secret');

  assert.equal(processConfirmationCallback(tab, callbackPath), null);
  assert.deepEqual(tab.events, []);
});

test('the CTA cleans the URL before storing only the status and navigating', () => {
  const tab = browser(callbackPath, '?code=private-code', '#access_token=private-token');

  const url = openBirthly(tab, 'success', callbackPath);

  assert.deepEqual(tab.events.map(([event]) => event), ['replace', 'store', 'assign']);
  assert.equal(tab.events[0][1], callbackPath);
  assert.equal(tab.events[1][2], 'success');
  assert.equal(tab.storage.size, 1);
  assert.equal(tab.events[2][1], url);
  const target = new URL(url);
  assert.equal(target.protocol, 'birthday:');
  assert.equal(target.hostname, 'signup-confirmation');
  assert.deepEqual([...target.searchParams.keys()].sort(), ['confirmation_result', 'source']);
  assert.equal(target.searchParams.get('source'), 'email-confirmation');
  assert.equal(target.searchParams.get('confirmation_result'), 'success');
  assert.equal(url.includes('private-'), false);
});

test('a forged status is reduced to unknown before storage and navigation', () => {
  const tab = browser(callbackPath, '?confirmation_result=success');

  const url = openBirthly(tab, 'forged', callbackPath);

  assert.equal([...tab.storage.values()][0], 'unknown');
  assert.equal(new URL(url).searchParams.get('confirmation_result'), 'unknown');
});

test('the CTA does nothing outside the confirmation route', () => {
  const tab = browser('/birthly/open-app/', '?type=signup');

  assert.equal(openBirthly(tab, 'success', callbackPath), null);
  assert.deepEqual(tab.events, []);
});
