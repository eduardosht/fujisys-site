import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import test from 'node:test';

test('personal showcase image and favicon assets meet their contracts', () => {
  const imagePath = new URL('../public/birthday/examples/leandro-birthday-card.jpeg', import.meta.url);
  const iconPath = new URL('../app/icon.svg', import.meta.url);

  assert.equal(existsSync(imagePath), true, 'birthday card image exists');
  assert.equal(statSync(imagePath).isFile(), true, 'birthday card image is a regular file');
  const image = readFileSync(imagePath);
  assert.ok(image.length > 0, 'birthday card image is non-empty');
  assert.deepEqual(image.subarray(0, 3), Buffer.from([0xff, 0xd8, 0xff]), 'birthday card image has JPEG signature');

  assert.equal(existsSync(iconPath), true, 'favicon exists');
  const icon = readFileSync(iconPath, 'utf8');
  assert.match(icon, /viewBox/);
  assert.match(icon, /#8d485a/i);
  assert.match(icon, /#fdc7cc/i);
});
