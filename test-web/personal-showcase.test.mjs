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

test('Birthly showcase presents its card example semantically', () => {
  const contentPath = new URL('../src/components/pages/Content.tsx', import.meta.url);
  const content = readFileSync(contentPath, 'utf8');

  assert.match(content, /birthday-card-showcase/);
  assert.match(content, /id="birthday-card-title"/);
  assert.match(content, /foto/);
  assert.match(content, /mensagem/);
  assert.match(content, /assine/);
  assert.match(content, /assetPath\("\/birthday\/examples\/leandro-birthday-card\.jpeg"\)/);
  assert.match(content, /alt="Exemplo de cartão de aniversário do Birthly"/);
  assert.match(content, /<Reveal><section className="birthday-card-showcase\b/);

  const stage = content.match(/<div className="birthday-card-stage">([\s\S]*?)<\/div>/);
  assert.ok(stage, 'showcase image stage exists');
  assert.doesNotMatch(stage[1], /<h[1-6]\b/, 'image stage has no overlaid heading');
});

test('home copy speaks in the first person and invites collaboration', () => {
  const content = readFileSync(new URL('../src/components/pages/Content.tsx', import.meta.url), 'utf8');
  const home = content.match(/export function HomePage\(\) \{([\s\S]*?)export function BirthdayPage/);
  assert.ok(home, 'HomePage exists');
  assert.match(home[1], /Eu crio ferramentas para lembrar, organizar e aproximar\./);
  assert.match(home[1], /Algumas ideias começam numa necessidade minha\. Outras começam numa conversa\./);
  assert.match(home[1], /problema real/);
  assert.match(home[1], /construir (?:algo )?juntos/);
  assert.match(home[1], /<Reveal[^>]*delay=\{80\}[^>]*><section className="statement/);
  assert.match(home[1], /<Reveal[^>]*delay=\{160\}[^>]*><section className="section products/);
  assert.match(home[1], /<Reveal[^>]*delay=\{240\}[^>]*><section className="contact-panel/);
});

test('home and card showcase styles support wide, mobile, and reduced-motion layouts', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(css, /\.home-hero\s*\{[^}]*grid-template-columns:\s*minmax\(0,8fr\)\s+minmax\(300px,4fr\)/);
  assert.match(css, /\.birthday-card-showcase\s*\{[^}]*grid-template-columns:\s*[^;}]+/);
  assert.match(css, /\.birthday-card-image\s*\{[^}]*animation:\s*birthday-card-float\b/);
  assert.match(css, /@keyframes\s+birthday-card-float\s*\{/);

  assert.match(css, /@media\s*\(max-width:\s*850px\)\s*\{\s*\.home-hero\s*\{[^}]*grid-template-columns:\s*1fr[^}]*\}\s*\.birthday-card-showcase\s*\{[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /@media\s*\(max-width:\s*580px\)\s*\{\s*\.home-hero h1\s*\{[^}]*font-size:\s*clamp\(2\.6rem,11vw,3\.5rem\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{\s*\.birthday-card-image\s*\{[^}]*animation-duration:\s*\.01ms[^}]*animation-iteration-count:\s*1[^}]*transform:\s*none/);
});
