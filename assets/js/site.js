(() => {
  "use strict";
  const toggle = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#site-nav");
  const desktop = window.matchMedia("(min-width: 960px)");
  if (toggle && nav) {
    document.documentElement.classList.add("js");
    const setMenu = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.hidden = !open;
    };
    setMenu(desktop.matches);
    desktop.addEventListener("change", () => setMenu(desktop.matches));
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a") && !desktop.matches) setMenu(false);
    });
    toggle.addEventListener("click", () =>
      setMenu(toggle.getAttribute("aria-expanded") !== "true"),
    );
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !desktop.matches && !nav.hidden) {
        setMenu(false);
        toggle.focus();
      }
    });
  }
  const map = document.querySelector("#map-container");
  const loadMap = document.querySelector("#load-map");
  if (map && loadMap) {
    let loaded = false;
    loadMap.addEventListener("click", () => {
      if (loaded) return;
      const frame = document.createElement("iframe");
      frame.title = "Uniwerek — lokalizacja w Kortowie na Mapach Google";
      frame.src =
        "https://www.google.com/maps?q=53.755473,20.459818&z=16&output=embed";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.allowFullscreen = true;
      map.replaceChildren(frame);
      loaded = true;
    });
  }
})();
