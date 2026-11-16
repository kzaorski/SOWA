(function () {
  'use strict';

  // rok w stopce
  var year = document.getElementById('rok');
  if (year) year.textContent = new Date().getFullYear();

  // menu mobilne
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('menu');
  if (toggle && nav) {
    var mq = window.matchMedia('(max-width: 980px)');
    var setOpen = function (open, focusToggle) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      if (!open && focusToggle) toggle.focus();
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    var onMq = function () { if (!mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
  }

  // podświetlenie aktywnej sekcji w menu
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav ul a[href^="#"]'));
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = map[en.target.id];
        if (a) a.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    var start = document.getElementById('start');
    if (start) spy.observe(start);
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // delikatne pojawianie się sekcji (pomijane przy prefers-reduced-motion)
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.section .wrap > *, .site-footer .wrap');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  // mapa ładowana dopiero po kliknięciu (bez ciasteczek stron trzecich przed zgodą)
  var frame = document.querySelector('.map-frame');
  var btn = document.querySelector('.map-load');
  if (frame && btn) {
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = frame.getAttribute('data-map-src');
      iframe.title = 'Mapa Google: Uniwerek, ul. Michała Oczapowskiego 9, Olsztyn';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.setAttribute('allowfullscreen', '');
      frame.textContent = '';
      frame.appendChild(iframe);
    });
  }
})();
