# Uniwerek – strona www (uniwerek.edu.pl)

Statyczna, jednostronicowa strona placówki opieki nad dziećmi „Uniwerek” (Olsztyn, Kortowo).
Bez frameworków, bez kroku budowania, bez zewnętrznych skryptów i fontów. Cel: rodzic w kilka sekund
widzi, co oferujemy, i może zadzwonić lub napisać.

## Uruchomienie lokalne

```sh
npm start            # python3 -m http.server 8080 → http://localhost:8080/
npm test             # node --test tests/  (Node ≥ 18, brak zależności)
```

Ścieżki zasobów są absolutne (`/assets/...`), więc stronę trzeba serwować z katalogu głównego
(domena `uniwerek.edu.pl` z `CNAME`, GitHub Pages) – otwarcie `index.html` przez `file://` nie załaduje CSS/obrazów.

## Struktura

| Ścieżka | Zawartość |
|---|---|
| `index.html` | cała treść + meta SEO + JSON-LD (`ChildCare`) |
| `assets/css/style.css` | jeden arkusz; kolory z logo (żółty `#f2c514`, niebieski `#1590cc` → ciemniejsze `#0a5f8f` / `#0d3d5c` na tekst, kontrast ≥ 6:1) |
| `assets/js/main.js` | menu mobilne (aria-expanded, Esc), podświetlenie sekcji, delikatne wejście sekcji (wyłączone przy `prefers-reduced-motion`), mapa ładowana po kliknięciu, rok w stopce |
| `assets/fonts/` | Fraunces (nagłówki) i Nunito (tekst), self-hosted WOFF2, latin + latin-ext (polskie znaki) |
| `assets/img/` | zdjęcia z oryginalnej strony przekonwertowane do WebP, logo (przezroczyste), ikony, `og-image.jpg` |
| `tools/og-image.html` | źródło grafiki OG (zrzut 1200×630 z przeglądarki) |
| `tests/site.test.mjs` | testy statyczne (fakty, SEO, a11y, zasoby, brak trackerów, waga) |
| `docs/screenshots/` | zrzuty desktop / tablet / mobile z weryfikacji |
| `404.html`, `sitemap.xml`, `robots.txt`, `site.webmanifest` | techniczne |
| `CNAME`, `google545fdee4dbd596a8.html`, `BingSiteAuth.xml` | bez zmian (domena i weryfikacja Search Console / Bing) |

## Zachowanie adresów

- Strona nadal jest jedną stroną pod `/`.
- Stare kotwice modali `#openModal1` (Dlaczego my), `#openModal2` (Kim jesteśmy), `#openModal3` (Jak pracujemy)
  prowadzą teraz do odpowiednich sekcji.
- Usunięto starą strukturę `css/`, `js/`, `images/` (jQuery, wow.js, parallax, cookiebar, Google Maps API z kluczem).
  Oryginalne pliki zostają w historii gita.

## Treść i fakty

Cała oferta, zajęcia, rytm dnia, dane kontaktowe i opisy pochodzą z poprzedniej wersji strony.
Niczego nie dodano: brak cen, opinii, liczb i obietnic. Poprawiono tylko literówki
(„Placówka powstał” → „powstała”, „indywidulne” → „indywidualne”) i adres e-mail zapisany jako `{małpka}` → `@`.
Test „nie wymyślamy cen, opinii ani liczb” pilnuje, żeby tak zostało.

## Prywatność

Brak analityki, trackerów i ciasteczek. Mapa Google (iframe) tworzona jest dopiero po kliknięciu „Pokaż mapę”;
bez JS działają zwykłe linki do Map Google i OpenStreetMap. Zakomentowane kody GA/GTM z poprzedniej wersji usunięto.

## Weryfikacja (2026-11-16)

- `npm test`: 16/16 testów przechodzi.
- axe-core (WCAG 2.0/2.1/2.2 A+AA + best-practice) w Chromium: 0 naruszeń na 1440, 820 i 390 px;
  `color-contrast` axe oznaczył jako „incomplete”, więc kontrasty policzono ręcznie (min. 6,14:1).
- Brak poziomego przewijania, brak błędów ładowania zasobów, fonty się ładują, menu mobilne działa z klawiatury (Esc zwraca fokus).
- Zrzuty: `docs/screenshots/`.

## Do ustalenia z właścicielem (nie wymyślone w kodzie)

1. Czy zdjęcia z poprzedniej strony przedstawiają dzieci placówki i czy są na nie zgody / licencje? Wyglądają na stockowe – w opisach alt nie nazywamy ich „naszymi dziećmi”; cztery mają tylko 270×180 px.
2. Dni pracy (oryginał podawał tylko „7.00–16.00”), zasady zapisów, opłaty, wolne miejsca – można dodać sekcję „Zapisy”.
3. Forma prawna / rejestr (żłobek, klub dziecięcy?) – w treści używamy sformułowania z oryginału: „placówka opieki nad dziećmi w wieku do lat 3”.
4. Zdjęcia wnętrza, ogrodu, zespołu i prawdziwe opinie rodziców (tylko za zgodą).
5. Formularz kontaktowy świadomie pominięty (wymagałby backendu i polityki prywatności); kontakt: telefon i e-mail.
