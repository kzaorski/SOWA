# Uniwerek — strona statyczna

Strona placówki opieki nad dziećmi Uniwerek w Olsztynie (Kortowo), prowadzonej przez Stowarzyszenie SOWA. Redesign zachowuje treści, logo, zdjęcia i model hostingu statycznego. Bez backendu, bundlera i zależności uruchamianych w przeglądarce.

## Podgląd

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Otwórz <http://127.0.0.1:8765/>. Samo wyświetlanie strony nie wymaga Node ani instalacji npm.

## Pliki produkcyjne

- `index.html` — treści, semantyka i metadane SEO.
- `assets/css/site.css` — responsywny układ i style.
- `assets/js/site.js` — menu mobilne i mapa ładowana na żądanie.
- `assets/img/` — zoptymalizowane kopie oryginalnych zdjęć i logo.
- `assets/fonts/` — lokalne fonty Nunito (latin i latin-ext; licencja OFL obok fontów).
- `CNAME`, `google545fdee4dbd596a8.html`, `BingSiteAuth.xml` — zachowane ustawienia domeny i weryfikacji.
- `robots.txt`, `sitemap.xml` — indeksowanie.

Nie ma kroku budowania. Pliki testowe, `package*.json`, `playwright.config.mjs` i dokumentacja nie są wymagane do działania strony. Nie publikuj `node_modules`, `test-results` ani `playwright-report`.

## Testy lokalne

Node.js **22.12.0 lub nowszy** i npm są potrzebne wyłącznie do testów:

```sh
npm ci
npx playwright install chromium webkit
npm test
npm run test:e2e
```

Testy obejmują regresję merytorycznych treści ze starej strony, menu, mapę, działanie bez JavaScript, zasoby, metadane, szerokości mobilne oraz automatyczne reguły dostępności axe. Przeglądarki: Chromium desktop/mobile i WebKit desktop. Automatyczny wynik axe nie stanowi pełnego audytu WCAG.

Test mapy w Playwright kontroluje aktywację i adres iframe, podmieniając odpowiedź Google — nie jest testem działania zewnętrznego serwisu Google Maps. Nie wykonuje połączeń telefonicznych ani nie wysyła wiadomości.

## Treść i prywatność

Źródłem danych jest poprzednia wersja strony, nie aktualne potwierdzenie działalności. Przed publikacją właściciel powinien potwierdzić telefony, godziny, kadrę, zasady przyjęć oraz aktualność i prawa do użycia fotografii. Nie dodano cen, opinii, dni tygodnia ani innych niepotwierdzonych informacji.

Mapa Google łączy się z zewnętrznym dostawcą dopiero po świadomym kliknięciu. Fonty i zdjęcia są lokalne; brak analityki, zewnętrznych bibliotek i zapisu cookies przez kod strony. Korzystanie z linków zewnętrznych podlega zasadom ich dostawców.

## Bezpieczeństwo prac / publikacja

Prace wykonano na nowym branchu `redesign-uniwerek-gpt-515624b4-3c21-403d-ab8b-0c788f5371f9`, od commita `792ee4b`. Nie scalano ani nie publikowano zmian.

Zastane niezacommitowane zmiany (w tym pliki nieśledzone) zachowano osobno w stashu `f37ed32be0d85a676b48caaa74fcd68adf981924`, opis: `SOWA: preserved pre-existing work before GPT redesign`. Stash nie został zastosowany do redesignu ani usunięty. Nie stosuj go bezpośrednio na redesign — oba zestawy zmian przebudowują te same pliki.

Publikacja wymaga osobnej decyzji. Zachowano oryginalny plik `CNAME` bez zmian.
