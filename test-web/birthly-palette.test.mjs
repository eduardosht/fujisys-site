import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const styles = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

test('Birthly uses the app identity palette for its product surfaces and actions', () => {
  assert.match(styles, /--birthday:#8d485a/);
  assert.match(styles, /--birthday-soft:#fdc7cc/);
  assert.match(styles, /--birthday-surface:#fff7f8/);
  assert.match(styles, /\.product-card\{[^}]*background:var\(--birthday-surface\)/);
  assert.match(styles, /\.coral-button\{background:var\(--birthday-soft\);color:var\(--birthday\)\}/);
  assert.match(styles, /\.confetti\{[^}]*background:var\(--birthday\)/);
});
