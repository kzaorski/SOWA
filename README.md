# Uniwerek — klub dziecięcy w Olsztynie

Statyczna strona informacyjna: HTML, CSS i niewielki JavaScript. Bez procesu budowania, frameworków, zewnętrznych fontów i bibliotek. Gotowa do dotychczasowego hostingu statycznego.

## Podgląd lokalny

W katalogu projektu uruchom `python3 -m http.server 8080`, następnie otwórz http://localhost:8080.

## Edycja

- `index.html` — treści, dane kontaktowe, plan dnia i dane strukturalne dla wyszukiwarek.
- `assets/style.css` — wygląd i układ na telefonach oraz komputerach.
- `assets/main.js` — menu mobilne i mapa wczytywana na żądanie.
- `assets/logo.png` — dotychczasowe logo z przyciętymi pustymi marginesami.
- `images/` — dotychczasowe materiały fotograficzne.

Współrzędne: **53°45′21.5″N 20°27′35.6″E**, czyli **53.7559722222, 20.4598888889**. Mapa i trasa kierują do tego samego punktu. Google Maps jest wczytywane dopiero po kliknięciu „Pokaż mapę”; link do trasy działa również bez JavaScriptu.

Strona nie korzysta z analityki ani skryptów śledzących. Linki telefoniczne i pocztowe, treści oraz rozwijane opisy działają bez JavaScriptu. Przy wyłączonym JavaScripcie menu pozostaje widoczne.

Historyczne pliki w `css/` i `js/` zachowano, ale nowa strona ich nie wczytuje. Pliki weryfikacji domeny i konfiguracja hostingu pozostały bez zmian. Sam zapis plików nie publikuje witryny.
