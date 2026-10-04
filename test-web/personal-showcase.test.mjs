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
  const componentPath = new URL('../src/components/BirthlyFeatureShowcase.tsx', import.meta.url);
  const content = readFileSync(contentPath, 'utf8');
  const component = readFileSync(componentPath, 'utf8');

  assert.match(content, /birthday-card-showcase/);
  assert.match(content, /<BirthlyFeatureShowcase\s*\/>/);
  assert.match(component, /id="birthday-card-title"/);
  assert.match(component, /foto/);
  assert.match(component, /mensagem/);
  assert.match(component, /assine/);
  assert.match(component, /assetPath\("\/birthday\/examples\/leandro-birthday-card\.jpeg"\)/);
  assert.match(component, /alt="Exemplo de cartão de aniversário do Birthly"/);
  assert.match(content, /<Reveal><section className="birthday-card-showcase\b/);

  assert.match(component, /birthday-card-stage/);
});

test('home copy speaks in the first person and invites collaboration', () => {
  const content = readFileSync(new URL('../src/components/pages/Content.tsx', import.meta.url), 'utf8');
  const home = content.match(/export function HomePage\(\) \{([\s\S]*?)export function BirthdayPage/);
  assert.ok(home, 'HomePage exists');
  assert.match(home[1], /Criar ferramentas para lembrar, organizar e aproximar\./);
  assert.match(home[1], /Algumas ideias começam numa necessidade\. Outras começam numa conversa\./);
  assert.match(home[1], /problema real/);
  assert.match(home[1], /construir (?:algo )?juntos/);
  assert.match(home[1], /href="#produtos">Conheça meus produtos/);
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
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^\n]*\.product-card:hover,\s*\.contact-panel:hover\s*\{\s*transform:\s*none!important/);
});

test('Birthly benefits use a clean featured-card layout', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

  assert.match(css, /\.benefit-grid\s*\{[^}]*grid-template-columns:minmax\(0,1\.2fr\) minmax\(0,1fr\)/);
  assert.match(css, /\.benefit-grid\s*\{[^}]*grid-template-rows:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.benefit-grid\s*\{[^}]*height:100vh[^}]*overflow:hidden/);
  assert.match(css, /\.benefit-grid \.benefit-reveal:first-child\s*\{[^}]*grid-row:1 \/ span 2/);
  assert.match(css, /\.benefit-grid \.benefit-reveal:nth-child\(2\)\s*\{[^}]*grid-column:2/);
  assert.match(css, /\.benefit-grid \.benefit-reveal:nth-child\(3\)\s*\{[^}]*grid-column:2/);
  assert.match(css, /\.benefit-grid \.benefit-reveal:first-child article\s*\{[^}]*background:var\(--birthday-soft\)/);
  assert.match(css, /@media\s*\(max-width:850px\)\s*\{[^}]*\.benefit-grid\s*\{[^}]*grid-template-columns:1fr[^}]*grid-template-rows:none[^}]*height:auto[^}]*overflow:visible/);
});

test('Birthly official links stay compact and vertically aligned', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

  assert.match(css, /\.birthday-page \.official-links\s*\{[^}]*min-height:0[^}]*align-items:center/);
  assert.match(css, /\.birthday-page \.official-links\s*\{[^}]*padding:clamp\(2rem,4vw,4rem\)/);
  assert.match(css, /@media\s*\(max-width:850px\)\s*\{[^}]*\.birthday-page \.official-links\s*\{[^}]*align-items:start[^}]*min-height:0/);
});

test('Birthly card showcase cycles through push notification and shared card slides', () => {
  const componentPath = new URL('../src/components/BirthlyFeatureShowcase.tsx', import.meta.url);
  const contentPath = new URL('../src/components/pages/Content.tsx', import.meta.url);
  const cssPath = new URL('../app/globals.css', import.meta.url);
  const videoPath = new URL('../public/birthday/examples/push-notification.mp4', import.meta.url);

  assert.equal(existsSync(componentPath), true, 'dynamic showcase component exists');
  const component = readFileSync(componentPath, 'utf8');
  const content = readFileSync(contentPath, 'utf8');
  const css = readFileSync(cssPath, 'utf8');

  assert.match(component, /^"use client";/);
  assert.match(component, /useState/);
  assert.match(component, /useEffect/);
  assert.match(component, /8000/);
  assert.match(component, /isPaused/);
  assert.match(component, /onPointerDown/);
  assert.match(component, /onPointerUp/);
  assert.match(component, /progressbar/);
  assert.match(component, /aria-valuenow/);
  assert.match(component, /style=\{\{ width: progress \+ "%"/);
  assert.match(component, /push-notification\.mp4/);
  assert.match(component, /leandro-birthday-card\.jpeg/);
  assert.match(component, /autoPlay/);
  assert.match(component, /muted/);
  assert.match(component, /playsInline/);
  assert.match(component, /Cartões que guardam um momento\./);
  assert.match(component, /notifica/i);
  assert.doesNotMatch(component, /birthday-feature-indicator/);
  assert.match(content, /import \{ BirthlyFeatureShowcase \} from ["']\.\.\/BirthlyFeatureShowcase["']/);
  assert.match(content, /<BirthlyFeatureShowcase\s*\/>/);
  assert.match(css, /\.birthday-feature-media\s*\{/);
  assert.match(css, /\.birthday-feature-media\s*\{[^}]*width:auto[^}]*height:calc\(100vh/);
  assert.match(css, /\.birthday-feature-showcase-content\s*\{[^}]*height:100%[^}]*min-height:0/);
  assert.match(css, /\.birthday-card-stage\s*\{[^}]*height:calc\(100vh[^}]*min-height:0/);
  assert.doesNotMatch(css, /\.birthday-feature-indicator\s*\{/);
  assert.match(css, /\.birthday-feature-showcase-content\s*\{[^}]*grid-template-columns:minmax\(0,4fr\) minmax\(0,6fr\)/);
  assert.match(css, /\.birthday-feature-showcase-content\s*\{[^}]*width:100%/);
  assert.match(css, /@keyframes\s+birthday-feature-stage-drift\s*\{/);
  assert.match(css, /\.birthday-feature-progress\s*\{/);
  assert.match(css, /\.birthday-card-stage\.is-paused/);
  assert.match(css, /\.birthday-feature-copy h2\s*\{[^}]*font-size:clamp/);
  assert.match(css, /\.home-hero,[^{}]*\.birthday-page \.section,[^{}]*\{[^}]*min-height:100vh/);
  assert.match(css, /\.home-hero,[^{}]*\.birthday-page \.section,[^{}]*\{[^}]*scroll-snap-align:start/);
  assert.match(css, /html:has\(\.home-hero\),html:has\(\.birthday-page\)\s*\{[^}]*scroll-snap-type:\s*y\s+mandatory/);
  assert.match(css, /\.birthday-feature-controller\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.birthday-feature-controller\s*\{[^}]*left:\s*50%/);
  assert.match(css, /\.birthday-feature-controller\s*\{[^}]*width:100%/);
  assert.match(css, /\.birthday-feature-controller\s*\{[^}]*bottom:\s*(?:0|clamp)/);
  assert.match(css, /\.birthday-card-showcase\s*\{[^}]*height:100vh/);
  assert.match(css, /\.birthday-card-showcase\s*\{[^}]*grid-template-columns:1fr/);
  assert.doesNotMatch(css, /\.birthday-feature-showcase-content\{[^}]*position:relative/);
  assert.match(css, /@keyframes\s+birthday-feature-enter\s*\{/);

  assert.equal(existsSync(videoPath), true, 'push notification video exists');
  assert.ok(readFileSync(videoPath).includes(Buffer.from('ftyp')), 'push notification video is an MP4');
});
