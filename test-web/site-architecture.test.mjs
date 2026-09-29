import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  INSTITUTIONAL_ROUTES,
  buildSiteRoute,
} from '../src/site/routes.ts';
import {
  BIRTHLY_PRODUCT,
  PRODUCT_CATALOG,
} from '../src/products/catalog.ts';
import { BIRTHLY_ROUTES } from '../src/products/birthly/routes.ts';

test('registers Birthly once with a unique typed product identity', () => {
  assert.equal(PRODUCT_CATALOG.length, 1);
  assert.equal(PRODUCT_CATALOG[0], BIRTHLY_PRODUCT);
  assert.equal(BIRTHLY_PRODUCT.id, 'birthly');
  assert.equal(BIRTHLY_PRODUCT.slug, 'birthly');

  const ids = PRODUCT_CATALOG.map((product) => product.id);
  const slugs = PRODUCT_CATALOG.map((product) => product.slug);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('exposes canonical Birthly routes and independent institutional routes', () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(BIRTHLY_ROUTES).map(([name, route]) => [name, route()])),
    {
      home: '/birthly/',
      privacy: '/birthly/privacy/',
      support: '/birthly/support/',
      confirmEmail: '/birthly/confirm-email/',
      resetPassword: '/birthly/reset-password/',
      openApp: '/birthly/open-app/',
    },
  );
  assert.equal(INSTITUTIONAL_ROUTES.privacy(), '/privacy/');
  assert.equal(INSTITUTIONAL_ROUTES.support(), '/support/');
  assert.notEqual(INSTITUTIONAL_ROUTES.privacy(), BIRTHLY_ROUTES.privacy());
  assert.notEqual(INSTITUTIONAL_ROUTES.support(), BIRTHLY_ROUTES.support());
});

test('normalizes route paths with a base path and trailing slash', () => {
  assert.equal(buildSiteRoute('/'), '/');
  assert.equal(buildSiteRoute('/privacy'), '/privacy/');
  assert.equal(buildSiteRoute('support/'), '/support/');

  const result = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--input-type=module',
      '-e',
      "import { buildSiteRoute } from './src/site/routes.ts'; console.log(buildSiteRoute('/birthly/privacy'));",
    ],
    {
      cwd: new URL('..', import.meta.url),
      env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '/preview/' },
      encoding: 'utf8',
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), '/preview/birthly/privacy/');
});
