import { describe, it, expect, beforeEach } from "bun:test";

class FakeClassList {
  constructor() {
    this._set = new Set();
  }

  add(...classes) {
    for (const name of classes) {
      this._set.add(name);
    }
  }

  remove(...classes) {
    for (const name of classes) {
      this._set.delete(name);
    }
  }

  contains(name) {
    return this._set.has(name);
  }
}

class FakeElement {
  constructor() {
    this.classList = new FakeClassList();
    this.style = {};
    this._handlers = new Map();
    this._children = [];
    this.parent = null;
    this.rect = { left: 0, top: 0, right: 0, bottom: 0 };
  }

  addEventListener(type, handler) {
    this._handlers.set(type, handler);
  }

  removeEventListener(type, handler) {
    const current = this._handlers.get(type);
    if (current === handler) {
      this._handlers.delete(type);
    }
  }

  getBoundingClientRect() {
    return this.rect;
  }

  appendChild(child) {
    this._children.push(child);
    child.parent = this;
  }

  remove() {
    if (!this.parent) return;
    const index = this.parent._children.indexOf(this);
    if (index >= 0) {
      this.parent._children.splice(index, 1);
    }
    this.parent = null;
  }
}

class FakeDocument {
  constructor() {
    this.body = new FakeElement();
    this._handlers = new Map();
  }

  createElement() {
    return new FakeElement();
  }

  addEventListener(type, handler) {
    this._handlers.set(type, handler);
  }

  removeEventListener(type, handler) {
    const current = this._handlers.get(type);
    if (current === handler) {
      this._handlers.delete(type);
    }
  }
}

globalThis.window = {};
globalThis.document = new FakeDocument();
await import("../public/js/dragdrop.js");
const DragDropManager = globalThis.window.DragDropManager;

beforeEach(() => {
  globalThis.document = new FakeDocument();
});

describe("DragDropManager", () => {
  it("marks a zone as reject when accepts() fails", () => {
    const manager = new DragDropManager();
    const itemEl = new FakeElement();
    const zoneEl = new FakeElement();
    zoneEl.rect = { left: 0, top: 0, right: 100, bottom: 100 };

    manager.registerItem("item-1", itemEl, { value: 1 });
    manager.registerDropZone("zone-1", zoneEl, {
      accepts: () => false
    });

    manager.selectItem("item-1");
    manager._startDrag();
    manager._updateDrag(10, 10);

    expect(zoneEl.classList.contains("dd-zone-reject")).toBe(true);
    expect(zoneEl.classList.contains("dd-zone-active")).toBe(false);
  });

  it("clears selection after an accepted drop", () => {
    const manager = new DragDropManager();
    const itemEl = new FakeElement();
    const zoneEl = new FakeElement();
    zoneEl.rect = { left: 0, top: 0, right: 100, bottom: 100 };

    manager.registerItem("item-1", itemEl);
    manager.registerDropZone("zone-1", zoneEl, {
      accepts: () => true
    });

    manager.selectItem("item-1");
    manager._startDrag();
    manager._updateDrag(10, 10);
    manager._endDrag();

    expect(manager.selectedIds.size).toBe(0);
  });

  it("allows dragging items out of hybrid zones", () => {
    const manager = new DragDropManager();
    const itemEl = new FakeElement();
    const zoneEl = new FakeElement();
    zoneEl.rect = { left: 0, top: 0, right: 100, bottom: 100 };

    manager.registerItem("item-1", itemEl);
    manager.registerDropZone("zone-1", zoneEl, {
      mode: "hybrid"
    });

    manager.moveItemToDropZone("item-1", "zone-1");
    manager.selectItem("item-1");

    expect(manager.selectedIds.has("item-1")).toBe(true);

    manager._startDrag();
    manager._updateDrag(200, 200);
    manager._endDrag();

    expect(manager.items.get("item-1").inDropZone).toBe(null);
  });
});
