'use strict';
document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nawigacja');
function closeMenu() {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.hidden = false;
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
const mapButton = document.querySelector('#load-map');
mapButton.hidden = false;
mapButton.addEventListener('click', () => {
  const frame = document.createElement('iframe');
  frame.title = 'Uniwerek — mapa lokalizacji w Kortowie';
  frame.src = 'https://maps.google.com/maps?q=53.7559722222,20.4598888889&z=17&output=embed';
  frame.referrerPolicy = 'no-referrer-when-downgrade';
  frame.allowFullscreen = true;
  frame.tabIndex = 0;
  document.querySelector('#mapa').replaceWith(frame);
  frame.focus();
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
