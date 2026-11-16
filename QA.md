# Weryfikacja modernizacji Uniwerka

## Zakres

Nowy branch od `792ee4b`: `redesign-uniwerek-gpt-515624b4-3c21-403d-ab8b-0c788f5371f9`.

- Ciepły, jasny redesign responsywny, oryginalne logo i zdjęcia.
- Zachowane akapity merytoryczne, oferta, koncepcje, zajęcia, cały plan dnia i dane kontaktowe. Zmieniono jedynie dwie oczywiste literówki: „Placówka powstał” → „Placówka powstała”, „indywidulne” → „indywidualne”.
- Treści dawnych modali są teraz zwykłymi, dostępnymi sekcjami. Zachowano stare kotwice `openModal1/2/3`.
- Usunięte stare biblioteki jQuery, parallax, Font Awesome, cookiebar i martwy kod analityki. Zoptymalizowane obrazy WebP i lokalne fonty Nunito z licencją OFL.
- Metadane SEO, canonical, Open Graph, JSON-LD, HTTPS w sitemap/robots. Bez nowych, niepotwierdzonych informacji.
- Bez zmiany CNAME i plików weryfikacji domeny. Bez kroku build i bez backendu.

## Wykonane sprawdzenia

| Sprawdzenie | Wynik |
|---|---|
| Node: treść i interakcje | **56 zaliczonych, 0 błędów** |
| Playwright: Chromium desktop, Chromium mobile, WebKit desktop | **23 zaliczone, 4 pominięte, 0 błędów, 0 flaky** |
| Powód pominięć | Dwa testy wyłącznie menu mobilnego pomijane w dwóch projektach desktopowych |
| Automatyczne reguły axe WCAG 2.2 AA | Bez wykrytych naruszeń w testowanych widokach |
| Szerokości | 320, 390, 768, 1024 i 1440 px; bez poziomego przewijania |
| Klawiatura | Menu: Enter, Spacja, Tab, Escape i przywracanie fokusu |
| Bez JavaScript | Widoczna nawigacja, treść, kontakt i zewnętrzny link do mapy |
| Zasoby | Bez błędów HTTP/transportu, błędów JS i automatycznych żądań zewnętrznych |
| Obrazy | Poprawne proporcje zadeklarowane w HTML względem plików; lazy loading poza hero |
| Telefony | URI tel i JSON-LD zgodne z pełnymi, widocznymi numerami |
| Mapa | Brak iframe przed kliknięciem; po aktywacji rzeczywista odpowiedź Google Maps HTTP 200 |
| HTML | html-validate 11.21.1: poprawny; wyłączone jedynie 3 reguły formatowania w `.htmlvalidate.json` |
| JavaScript | `node --check assets/js/site.js`: poprawny |
| Zależności | `npm install`: 0 zgłoszonych podatności; brak zależności produkcyjnych |
| Diff | `git diff --cached --check`: poprawny |

## Lighthouse — lokalny pomiar mobilny

Lighthouse 13.6.0 na serwerze `python3 -m http.server`, Chromium headless, domyślna symulacja mobilna:

| Kategoria | Wynik |
|---|---:|
| Wydajność | 98/100 |
| Dostępność | 100/100 |
| Dobre praktyki | 100/100 |
| SEO | 100/100 |

FCP 0,9 s; LCP 2,4 s; TBT 0 ms; CLS 0. Łączna wielkość zasobów ujętych w pomiarze: 274 KiB.

To wynik laboratoryjny, nie pomiar produkcyjny ani gwarancja Core Web Vitals. Serwer lokalny nie zapewnia docelowego cache/compression; należy sprawdzić je po ewentualnej publikacji. Kod pozostawiono czytelny, bez bundlera.

## Ograniczenia i decyzje przed publikacją

- Automatyczne testy dostępności nie zastępują pełnego audytu WCAG ani testów czytnikami ekranu.
- WebKit testowano jako silnik Playwright, nie na fizycznym iPhonie ani w aplikacji Safari.
- Testy automatyczne mapy podmieniają odpowiedź Google; osobno wykonano próbę prawdziwego osadzenia, zakończoną HTTP 200.
- Nie wykonano połączeń telefonicznych ani nie wysłano e-maili; zweryfikowano poprawność odnośników.
- Właściciel powinien potwierdzić aktualność treści, kadrę, telefony, godziny, zasady przyjęć oraz prawa do zdjęć. Nie dopisano dni tygodnia, cennika ani opinii.
- Wersja nie została wysłana do zdalnego repozytorium ani opublikowana. Zastana praca jest zachowana osobno w stashu opisanym w README.
