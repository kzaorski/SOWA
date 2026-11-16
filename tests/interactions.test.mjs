import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

class Element {
  constructor() {
    this.attributes = {};
    this.listeners = {};
    this.hidden = false;
    this.children = [];
  }
  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }
  getAttribute(k) {
    return this.attributes[k];
  }
  addEventListener(k, fn) {
    this.listeners[k] = fn;
  }
  fire(k, event = {}) {
    this.listeners[k]?.(event);
  }
  focus() {
    this.focused = true;
  }
  append(child) {
    this.children.push(child);
  }
  replaceChildren(...children) {
    this.children = children;
  }
  closest(selector) {
    return selector === "a" ? this : null;
  }
}
function boot() {
  const toggle = new Element(),
    nav = new Element(),
    map = new Element(),
    load = new Element();
  const root = { classList: { add() {} } };
  const media = {
    matches: false,
    addEventListener(k, fn) {
      this.change = fn;
    },
  };
  const document = {
    documentElement: root,
    listeners: {},
    querySelector(s) {
      return (
        {
          "#menu-toggle": toggle,
          "#site-nav": nav,
          "#map-container": map,
          "#load-map": load,
        }[s] ?? null
      );
    },
    addEventListener(k, fn) {
      this.listeners[k] = fn;
    },
    createElement() {
      return new Element();
    },
  };
  const path = new URL("../assets/js/site.js", import.meta.url);
  assert.ok(existsSync(path), "Site interaction script must exist");
  vm.runInNewContext(readFileSync(path, "utf8"), {
    document,
    window: { matchMedia: () => media },
  });
  return { toggle, nav, map, load, document, media };
}
test("map makes no embed before consent and inserts a single accessible Google map after clicking", () => {
  const { map, load } = boot();
  assert.equal(map.children.length, 0);
  load.fire("click");
  assert.equal(map.children.length, 1);
  const iframe = map.children[0];
  assert.match(iframe.src, /^https:\/\/www\.google\.com\/maps\?/);
  assert.match(iframe.src, /53\.755473,20\.459818/);
  assert.ok(iframe.title);
  load.fire("click");
  assert.equal(map.children.length, 1);
});
test("choosing a navigation link closes the mobile menu", () => {
  const { toggle, nav } = boot();
  toggle.fire("click");
  nav.fire("click", { target: new Element() });
  assert.equal(nav.hidden, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
});
test("desktop navigation stays visible across viewport changes", () => {
  const { nav, media } = boot();
  media.matches = true;
  media.change?.();
  assert.equal(nav.hidden, false);
  media.matches = false;
  media.change?.();
  assert.equal(nav.hidden, true);
});
test("mobile menu opens on request and Escape closes it with restored focus", () => {
  const { toggle, nav, document } = boot();
  assert.equal(nav.hidden, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  toggle.fire("click");
  assert.equal(nav.hidden, false);
  assert.equal(toggle.getAttribute("aria-expanded"), "true");
  document.listeners.keydown({ key: "Escape" });
  assert.equal(nav.hidden, true);
  assert.equal(toggle.getAttribute("aria-expanded"), "false");
  assert.equal(toggle.focused, true);
});
