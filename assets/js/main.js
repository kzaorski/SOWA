// Uniwerek – drobne usprawnienia interfejsu (bez zależności)
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Rok w stopce
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Cień nagłówka po przewinięciu
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobilne
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Okna dialogowe
  document.querySelectorAll('[data-dialog]').forEach((btn) => {
    const dlg = document.getElementById(btn.dataset.dialog);
    btn.addEventListener('click', () => dlg.showModal());
  });
  document.querySelectorAll('dialog').forEach((dlg) => {
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
  });

  // Adres e-mail składany w JS (ochrona przed botami)
  document.querySelectorAll('.js-email').forEach((el) => {
    const addr = `${el.dataset.user}@${el.dataset.domain}`;
    const a = document.createElement('a');
    a.href = `mailto:${addr}`;
    a.textContent = addr;
    el.replaceChildren(a);
  });

  // Mapa OpenStreetMap ładowana dopiero na żądanie
  const mapBtn = document.querySelector('[data-load-map]');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.title = 'Mapa dojazdu do Uniwerku';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer';
      iframe.src = 'https://www.openstreetmap.org/export/embed.html?bbox=20.4529%2C53.7529%2C20.4669%2C53.7591&layer=mapnik&marker=53.755972%2C20.459889';
      document.getElementById('map').replaceChildren(iframe);
    });
  }

  // Płynne pojawianie się elementów
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add('is-visible'));
  }
});
