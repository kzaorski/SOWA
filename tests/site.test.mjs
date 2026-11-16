// Testy statyczne strony – uruchamiane: npm test  (node --test tests/)
// Bez zależności; sprawdzają fakty, SEO, dostępność (statycznie) i spójność plików.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const html = read('index.html');
const css = read('assets/css/style.css');
const js = read('assets/js/main.js');
const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');

test('dane kontaktowe z oryginalnej strony są zachowane', () => {
  for (const f of ['+48 532 604 007', '+48 668 530 006', 'uniwerekolsztyn@gmail.com', 'Michała Oczapowskiego 9', '10-719', 'Olsztyn', '7.00–16.00', 'facebook.com/uniwerekolsztyn']) {
    assert.ok(text.includes(f), `brak: ${f}`);
  }
  assert.match(html, /href="tel:\+48532604007"/);
  assert.match(html, /href="tel:\+48668530006"/);
  assert.match(html, /href="mailto:uniwerekolsztyn@gmail\.com"/);
});

test('treść oferty, zajęć i osób z oryginału jest obecna', () => {
  for (const f of ['opiekę nad dziećmi'.replace('opiekę', 'Opiekę'), 'rozwój psychomotoryczny', 'normami fizjologicznymi',
    'Dwie rączki mam', 'Muzyka dla Smyka', 'Ciszki, syczki, szumki', 'Entliczek-pentliczek',
    'Anna Godlewska-Zaorska', 'Bernadetta Olender-Jermacz', 'Howarda Gardnera', 'FundaMentalnych',
    'Stowarzyszenia Oświata – Wychowanie – Aktywizacja „SOWA”', 'Uniwersytetu Warmińsko-Mazurskiego']) {
    assert.ok(text.includes(f), `brak: ${f}`);
  }
});

test('rytm dnia: 11 pozycji, pełne godziny 7.00–16.00', () => {
  const items = html.match(/<li><time>/g) || [];
  assert.equal(items.length, 11);
  assert.ok(html.includes('<time>7.00–7.30</time>') && html.includes('<time>15.30–16.00</time>'));
});

test('nie wymyślamy cen, opinii ani liczb', () => {
  assert.doesNotMatch(text, /\bzł\b|PLN|€|\bcennik\b|opinie rodziców|testimonial|\d+\s?%/i);
});

test('SEO: lang, title, description, canonical, OG, 1×h1', () => {
  assert.match(html, /<html lang="pl">/);
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  assert.ok(title.length >= 30 && title.length <= 75, `title ${title.length} znaków`);
  const desc = html.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.ok(desc.length >= 80 && desc.length <= 175, `description ${desc.length} znaków`);
  assert.match(html, /<link rel="canonical" href="https:\/\/uniwerek\.edu\.pl\/">/);
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'og:locale']) assert.ok(html.includes(`property="${p}"`), p);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
});

test('JSON-LD parsuje się i zgadza z danymi widocznymi na stronie', () => {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  const d = JSON.parse(m[1]);
  assert.equal(d['@type'], 'ChildCare');
  assert.equal(d.address.streetAddress, 'ul. Michała Oczapowskiego 9');
  assert.equal(d.address.postalCode, '10-719');
  assert.equal(d.telephone, '+48532604007');
  assert.equal(d.email, 'uniwerekolsztyn@gmail.com');
  assert.deepEqual([d.geo.latitude, d.geo.longitude], [53.7559722222, 20.4598888889]);
  assert.equal(d.priceRange, undefined, 'nie podajemy cen');
  assert.equal(d.aggregateRating, undefined, 'nie podajemy ocen');
  assert.equal(d.review, undefined);
});

test('nagłówki: brak przeskoków poziomów, h2 przed h3', () => {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((x) => +x[1]);
  let prev = 0;
  for (const l of levels) { assert.ok(l <= prev + 1, `skok ${prev}→${l}`); prev = l; }
});

test('id są unikalne, a kotwice # prowadzą do istniejących elementów (w tym stare #openModal1-3)', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]);
  assert.equal(new Set(ids).size, ids.length, 'zduplikowane id');
  for (const [, h] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(h), `martwa kotwica #${h}`);
  for (const old of ['openModal1', 'openModal2', 'openModal3']) assert.ok(ids.includes(old), old);
});

test('obrazy: alt, width/height, lazy poza hero', () => {
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((x) => x[0]);
  assert.ok(imgs.length >= 11);
  for (const i of imgs) {
    assert.match(i, /\salt="[^"]+"/, i);
    assert.match(i, /\swidth="\d+"/, i);
    assert.match(i, /\sheight="\d+"/, i);
  }
  const hero = imgs.find((i) => i.includes('hero.webp'));
  assert.ok(hero.includes('fetchpriority="high"') && !hero.includes('lazy'));
});

test('lokalne zasoby istnieją (href/src/preload/manifest/CSS url())', () => {
  const refs = new Set();
  for (const [, u] of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) refs.add(u);
  for (const [, u] of css.matchAll(/url\("?(\/[^")]+)"?\)/g)) refs.add(u);
  const man = JSON.parse(read('site.webmanifest'));
  man.icons.forEach((i) => refs.add(i.src));
  for (const u of refs) {
    if (u === '/') continue;
    assert.ok(existsSync(join(root, u)), `brak pliku ${u}`);
  }
  assert.ok(refs.size > 15);
});

test('brak trackerów, zewnętrznych skryptów i fontów; mapa tylko po kliknięciu', () => {
  assert.doesNotMatch(html, /googletagmanager|google-analytics|gtag\(|facebook\.net|hotjar|fbq\(|cookiebar/i);
  const scripts = [...html.matchAll(/<script\b[^>]*\ssrc="([^"]+)"/g)].map((x) => x[1]);
  assert.deepEqual(scripts, ['/assets/js/main.js']);
  assert.doesNotMatch(html + css, /fonts\.googleapis|cdn\.jsdelivr|bootstrapcdn|jquery/i);
  assert.doesNotMatch(html, /<iframe/i, 'iframe mapy ma być tworzony dopiero po kliknięciu');
  assert.match(js, /createElement\('iframe'\)/);
});

test('dostępność: skip-link, nawigacja z etykietą, przycisk menu z aria-expanded, reduced-motion, focus-visible', () => {
  assert.match(html, /class="skip-link" href="#tresc"/);
  assert.match(html, /<main id="tresc">/);
  assert.match(html, /<nav class="nav" id="menu" aria-label="[^"]+"/);
  assert.match(html, /<button class="nav-toggle"[^>]*aria-expanded="false"[^>]*aria-controls="menu"/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(js, /Escape/);
  // linki otwierane w nowej karcie mają informację dla czytników ekranu
  for (const [a] of html.matchAll(/<a\b[^>]*target="_blank"[\s\S]*?<\/a>/g)) {
    assert.match(a, /rel="noopener"/);
    assert.match(a, /visually-hidden/);
  }
  assert.match(css, /min-height: 48px/);
});

test('viewport bez blokady zoomu', () => {
  const v = html.match(/<meta name="viewport" content="([^"]+)"/)[1];
  assert.doesNotMatch(v, /user-scalable=no|maximum-scale/);
});

test('sitemap, robots, CNAME, pliki weryfikacyjne i 404', () => {
  assert.match(read('sitemap.xml'), /<loc>https:\/\/uniwerek\.edu\.pl\/<\/loc>/);
  assert.match(read('robots.txt'), /Sitemap: https:\/\/uniwerek\.edu\.pl\/sitemap\.xml/);
  assert.equal(read('CNAME').trim().split('\n')[0], 'uniwerek.edu.pl');
  assert.ok(existsSync(join(root, 'google545fdee4dbd596a8.html')));
  assert.ok(existsSync(join(root, 'BingSiteAuth.xml')));
  assert.match(read('404.html'), /noindex/);
  assert.ok(existsSync(join(root, 'favicon.ico')));
});

test('og-image ma 1200×630 i rozsądną wagę', () => {
  const buf = readFileSync(join(root, 'assets/img/og-image.jpg'));
  // SOF0/SOF2 → wysokość, szerokość
  let i = 2, w = 0, h = 0;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xc0 || m === 0xc2) { h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break; }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  assert.deepEqual([w, h], [1200, 630]);
  assert.ok(buf.length < 300_000);
});

test('waga strony: HTML+CSS+JS < 60 KB, obrazy webp < 80 KB każdy', () => {
  const size = (p) => statSync(join(root, p)).size;
  assert.ok(size('index.html') + size('assets/css/style.css') + size('assets/js/main.js') < 60_000);
  for (const f of readdirSync(join(root, 'assets/img')).filter((f) => f.endsWith('.webp'))) {
    assert.ok(size(`assets/img/${f}`) < 80_000, f);
  }
});
