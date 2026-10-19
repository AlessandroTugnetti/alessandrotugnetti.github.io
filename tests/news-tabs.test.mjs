import assert from "node:assert/strict";
import test from "node:test";
import { tabDestination, initNewsTabs } from "../assets/js/news-tabs.mjs";

test("News tab keyboard navigation wraps and supports Home and End", () => {
  assert.equal(tabDestination("ArrowRight", 6, 7), 0);
  assert.equal(tabDestination("ArrowLeft", 0, 7), 6);
  assert.equal(tabDestination("Home", 4, 7), 0);
  assert.equal(tabDestination("End", 1, 7), 6);
  assert.equal(tabDestination("Tab", 2, 7), null);
});

test("News activation keeps selection, hidden panels and keyboard focus synchronized", () => {
  const panels = [{ hidden: false }, { hidden: true }];
  const tabs = panels.map((_, index) => ({
    attributes: { "aria-controls": `panel-${index}`, "aria-selected": String(index === 0) },
    listeners: {},
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    getAttribute(name) {
      return this.attributes[name];
    },
    addEventListener(name, handler) {
      this.listeners[name] = handler;
    },
    focus() {
      this.focused = true;
    },
  }));
  const root = {
    querySelectorAll: () => [{ querySelectorAll: () => tabs }],
    getElementById: (id) => panels[Number(id.split("-")[1])],
  };
  initNewsTabs(root);
  tabs[1].listeners.click();
  assert.deepEqual(
    panels.map((p) => p.hidden),
    [true, false]
  );
  assert.equal(tabs[1].attributes["aria-selected"], "true");
  assert.equal(tabs[0].tabIndex, -1);
  let prevented = false;
  tabs[1].listeners.keydown({
    key: "ArrowRight",
    preventDefault() {
      prevented = true;
    },
  });
  assert(prevented);
  assert(tabs[0].focused);
  assert.equal(tabs[0].tabIndex, 0);
  assert.deepEqual(
    panels.map((p) => p.hidden),
    [false, true]
  );
});
