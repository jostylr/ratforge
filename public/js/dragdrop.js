// RatForge - Reusable Drag & Drop Utility
// Supports: multi-select, touch, drop zones

window.DragDropManager = class DragDropManager {
  constructor(options = {}) {
    this.items = new Map(); // id -> { element, data, selected, inDropZone }
    this.dropZones = new Map(); // id -> { element, onDrop, accepts }
    this.selectedIds = new Set();
    this.isDragging = false;
    this.dragGhost = null;
    this.currentDropZone = null;
    
    this.onSelectionChange = options.onSelectionChange || (() => {});
    this.onDrop = options.onDrop || (() => {});
    this.onItemMove = options.onItemMove || (() => {});
    
    this._boundMouseMove = this._onMouseMove.bind(this);
    this._boundMouseUp = this._onMouseUp.bind(this);
    this._boundTouchMove = this._onTouchMove.bind(this);
    this._boundTouchEnd = this._onTouchEnd.bind(this);
    
    this.dragStartPos = { x: 0, y: 0 };
    this.lastPos = { x: 0, y: 0 };
    this.clickedWithoutDrag = false;
    this.onDoubleClick = options.onDoubleClick || null;
    this.defaultDropZone = options.defaultDropZone || null;
  }

  registerItem(id, element, data = {}) {
    const item = {
      element,
      data,
      selected: false,
      inDropZone: null,
      handlers: {}
    };
    this.items.set(id, item);
    
    // Mouse events
    item.handlers.mousedown = (e) => this._onItemMouseDown(e, id);
    item.handlers.dblclick = (e) => this._onItemDoubleClick(e, id);
    element.addEventListener('mousedown', item.handlers.mousedown);
    element.addEventListener('dblclick', item.handlers.dblclick);
    
    // Touch events
    item.handlers.touchstart = (e) => this._onItemTouchStart(e, id);
    element.addEventListener('touchstart', item.handlers.touchstart, { passive: false });
    
    return item;
  }

  registerDropZone(id, element, options = {}) {
    const zone = { 
      element, 
      accepts: options.accepts || (() => true),
      onEnter: options.onEnter || (() => {}),
      onLeave: options.onLeave || (() => {}),
      onDrop: options.onDrop || (() => {})
    };
    this.dropZones.set(id, zone);
    return zone;
  }

  selectItem(id, addToSelection = false) {
    if (!addToSelection) {
      this.clearSelection();
    }
    const item = this.items.get(id);
    if (item && !item.inDropZone) {
      item.selected = true;
      item.element.classList.add('dd-selected');
      this.selectedIds.add(id);
      this.onSelectionChange(Array.from(this.selectedIds));
    }
  }

  deselectItem(id) {
    const item = this.items.get(id);
    if (item) {
      item.selected = false;
      item.element.classList.remove('dd-selected');
      this.selectedIds.delete(id);
      this.onSelectionChange(Array.from(this.selectedIds));
    }
  }

  toggleSelection(id) {
    const item = this.items.get(id);
    if (item && item.selected) {
      this.deselectItem(id);
    } else {
      this.selectItem(id, true);
    }
  }

  clearSelection() {
    for (const id of this.selectedIds) {
      const item = this.items.get(id);
      if (item) {
        item.selected = false;
        item.element.classList.remove('dd-selected');
      }
    }
    this.selectedIds.clear();
    this.onSelectionChange([]);
  }

  getSelectedItems() {
    return Array.from(this.selectedIds).map(id => ({
      id,
      ...this.items.get(id)
    }));
  }

  moveItemToDropZone(itemId, zoneId) {
    const item = this.items.get(itemId);
    const zone = this.dropZones.get(zoneId);
    if (item && zone) {
      item.inDropZone = zoneId;
      item.selected = false;
      item.element.classList.remove('dd-selected');
      item.element.classList.add('dd-in-zone');
      this.selectedIds.delete(itemId);
      this.onItemMove(itemId, zoneId);
    }
  }

  removeItemFromDropZone(itemId) {
    const item = this.items.get(itemId);
    if (item && item.inDropZone) {
      item.inDropZone = null;
      item.element.classList.remove('dd-in-zone');
      this.onItemMove(itemId, null);
    }
  }

  _onItemDoubleClick(e, id) {
    e.preventDefault();
    e.stopPropagation();
    
    const item = this.items.get(id);
    if (!item || item.inDropZone) return;
    
    // Double-click transfers to default drop zone
    if (this.defaultDropZone && this.onDoubleClick) {
      // If item is selected, transfer all selected
      if (item.selected && this.selectedIds.size > 0) {
        const ids = Array.from(this.selectedIds);
        this.onDoubleClick(ids, this.defaultDropZone);
      } else {
        // Just transfer this one
        this.onDoubleClick([id], this.defaultDropZone);
      }
    }
  }

  _onItemMouseDown(e, id) {
    if (e.button !== 0) return; // Only left click
    
    const item = this.items.get(id);
    if (!item) return;
    if (item.inDropZone) {
      // Click on item in drop zone to remove it
      this.removeItemFromDropZone(id);
      e.preventDefault();
      return;
    }
    
    this.clickedWithoutDrag = true;
    this.clickedId = id;
    
    // If item is already selected, keep current selection for potential drag
    // If not selected, we'll handle selection on mouseup (click)
    if (item.selected) {
      // Keep selection, prepare for drag
    }
    
    this.dragStartPos = { x: e.clientX, y: e.clientY };
    this.lastPos = { x: e.clientX, y: e.clientY };
    
    // Start listening for drag
    document.addEventListener('mousemove', this._boundMouseMove);
    document.addEventListener('mouseup', this._boundMouseUp);
  }

  _onItemTouchStart(e, id) {
    const item = this.items.get(id);
    if (!item) return;
    
    if (item.inDropZone) {
      // Tap on item in drop zone to remove it
      this.removeItemFromDropZone(id);
      e.preventDefault();
      return;
    }
    
    const touch = e.touches[0];
    
    // If not selected, select only this one
    if (!item.selected) {
      this.selectItem(id, false);
    }
    
    this.dragStartPos = { x: touch.clientX, y: touch.clientY };
    this.lastPos = { x: touch.clientX, y: touch.clientY };
    
    document.addEventListener('touchmove', this._boundTouchMove, { passive: false });
    document.addEventListener('touchend', this._boundTouchEnd);
    
    e.preventDefault();
  }

  _onMouseMove(e) {
    const dx = e.clientX - this.dragStartPos.x;
    const dy = e.clientY - this.dragStartPos.y;
    
    // Start dragging after small threshold
    if (!this.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      this.clickedWithoutDrag = false; // We're dragging now
      
      // If the clicked item isn't selected, select it now for dragging
      if (this.clickedId !== undefined) {
        const item = this.items.get(this.clickedId);
        if (item && !item.selected) {
          this.selectItem(this.clickedId, true);
        }
      }
      
      this._startDrag();
    }
    
    if (this.isDragging) {
      this._updateDrag(e.clientX, e.clientY);
    }
  }

  _onTouchMove(e) {
    const touch = e.touches[0];
    const dx = touch.clientX - this.dragStartPos.x;
    const dy = touch.clientY - this.dragStartPos.y;
    
    if (!this.isDragging && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      this._startDrag();
    }
    
    if (this.isDragging) {
      this._updateDrag(touch.clientX, touch.clientY);
      e.preventDefault();
    }
  }

  _startDrag() {
    if (this.selectedIds.size === 0) return;
    
    this.isDragging = true;
    document.body.classList.add('dd-dragging');
    
    // Create ghost element showing count
    this.dragGhost = document.createElement('div');
    this.dragGhost.className = 'dd-ghost';
    this.dragGhost.innerHTML = `<span class="dd-ghost-count">${this.selectedIds.size}</span>`;
    document.body.appendChild(this.dragGhost);
    
    // Dim selected items
    for (const id of this.selectedIds) {
      const item = this.items.get(id);
      if (item) {
        item.element.classList.add('dd-dragging-item');
      }
    }
  }

  _updateDrag(clientX, clientY) {
    if (!this.dragGhost) return;
    
    this.lastPos = { x: clientX, y: clientY };
    this.dragGhost.style.left = clientX + 'px';
    this.dragGhost.style.top = clientY + 'px';
    
    // Check drop zones
    const newDropZone = this._findDropZoneAt(clientX, clientY);
    
    if (newDropZone !== this.currentDropZone) {
      if (this.currentDropZone) {
        const zone = this.dropZones.get(this.currentDropZone);
        if (zone) {
          zone.element.classList.remove('dd-zone-active');
          zone.onLeave();
        }
      }
      
      this.currentDropZone = newDropZone;
      
      if (this.currentDropZone) {
        const zone = this.dropZones.get(this.currentDropZone);
        if (zone) {
          zone.element.classList.add('dd-zone-active');
          zone.onEnter(this.selectedIds.size);
        }
      }
    }
  }

  _findDropZoneAt(x, y) {
    for (const [id, zone] of this.dropZones) {
      const rect = zone.element.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        if (this._zoneAcceptsSelection(zone)) {
          return id;
        }
      }
    }
    return null;
  }

  _zoneAcceptsSelection(zone) {
    if (!zone || typeof zone.accepts !== 'function') return true;
    for (const id of this.selectedIds) {
      const item = this.items.get(id);
      if (item && !zone.accepts(item)) {
        return false;
      }
    }
    return true;
  }

  _onMouseUp(e) {
    document.removeEventListener('mousemove', this._boundMouseMove);
    document.removeEventListener('mouseup', this._boundMouseUp);
    
    // If we didn't drag, treat as a click for selection
    if (this.clickedWithoutDrag && this.clickedId !== undefined) {
      const item = this.items.get(this.clickedId);
      if (item && !item.inDropZone) {
        // Toggle selection - always add to existing selection
        this.toggleSelection(this.clickedId);
      }
    }
    
    this.clickedWithoutDrag = false;
    this.clickedId = undefined;
    this._endDrag();
  }

  _onTouchEnd(e) {
    document.removeEventListener('touchmove', this._boundTouchMove);
    document.removeEventListener('touchend', this._boundTouchEnd);
    this._endDrag();
  }

  _endDrag() {
    if (!this.isDragging) return;
    
    // Remove ghost
    if (this.dragGhost) {
      this.dragGhost.remove();
      this.dragGhost = null;
    }
    
    // Handle drop
    let didDrop = false;
    if (this.currentDropZone) {
      const zone = this.dropZones.get(this.currentDropZone);
      const droppedIds = Array.from(this.selectedIds);
      
      for (const id of droppedIds) {
        this.moveItemToDropZone(id, this.currentDropZone);
      }
      
      if (zone) {
        zone.element.classList.remove('dd-zone-active');
        zone.onDrop(droppedIds);
      }
      
      this.onDrop(droppedIds, this.currentDropZone);
      didDrop = true;
    }
    
    // Clean up
    for (const id of this.selectedIds) {
      const item = this.items.get(id);
      if (item) {
        item.element.classList.remove('dd-dragging-item');
      }
    }
    
    this.isDragging = false;
    this.currentDropZone = null;
    document.body.classList.remove('dd-dragging');
    if (didDrop) {
      this.clearSelection();
    }
  }

  getItemsInZone(zoneId) {
    const items = [];
    for (const [id, item] of this.items) {
      if (item.inDropZone === zoneId) {
        items.push({ id, ...item });
      }
    }
    return items;
  }

  destroy() {
    document.removeEventListener('mousemove', this._boundMouseMove);
    document.removeEventListener('mouseup', this._boundMouseUp);
    document.removeEventListener('touchmove', this._boundTouchMove);
    document.removeEventListener('touchend', this._boundTouchEnd);
    for (const item of this.items.values()) {
      if (item.handlers) {
        item.element.removeEventListener('mousedown', item.handlers.mousedown);
        item.element.removeEventListener('dblclick', item.handlers.dblclick);
        item.element.removeEventListener('touchstart', item.handlers.touchstart);
      }
    }
    if (this.dragGhost) {
      this.dragGhost.remove();
    }
  }
};
