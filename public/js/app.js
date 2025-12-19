// RatForge - Client-side JavaScript

// Alpine.js component for Kitten Basket exercise
window.kittenBasket = function() {
  const params = window.exerciseParams || { totalKittens: 0, targetCount: 0, positions: [] };
  
  return {
    targetCount: params.targetCount,
    totalKittens: params.totalKittens,
    kittens: params.positions.map(pos => ({
      id: pos.id,
      x: pos.x,
      y: pos.y,
      inBasket: false
    })),
    selectedCount: 0,
    submitted: false,
    correct: false,
    feedback: '',
    dashboardUrl: window.exerciseData?.dashboardUrl || '/',
    dragManager: null,

    init() {
      this.$nextTick(() => {
        this.setupDragDrop();
      });
    },

    setupDragDrop() {
      const self = this;
      
      this.dragManager = new DragDropManager({
        defaultDropZone: 'basket',
        onSelectionChange: (ids) => {
          self.selectedCount = ids.length;
        },
        onDrop: (ids, zoneId) => {
          if (zoneId === 'basket') {
            ids.forEach(id => {
              const kitten = self.kittens.find(k => k.id === id);
              if (kitten) kitten.inBasket = true;
            });
          }
        },
        onDoubleClick: (ids, zoneId) => {
          // Double-click transfers to basket
          if (zoneId === 'basket') {
            ids.forEach(id => {
              const kitten = self.kittens.find(k => k.id === id);
              if (kitten) {
                kitten.inBasket = true;
                self.dragManager.moveItemToDropZone(id, zoneId);
              }
            });
            self.dragManager.clearSelection();
          }
        },
        onItemMove: (id, zoneId) => {
          const kitten = self.kittens.find(k => k.id === id);
          if (kitten) {
            kitten.inBasket = zoneId === 'basket';
          }
        }
      });

      // Register kittens
      this.kittens.forEach(kitten => {
        const el = document.querySelector(`[data-kitten-id="${kitten.id}"]`);
        if (el) {
          this.dragManager.registerItem(kitten.id, el, { kitten });
        }
      });

      // Register basket as drop zone
      const basketEl = document.querySelector('.basket-drop-zone');
      if (basketEl) {
        this.dragManager.registerDropZone('basket', basketEl, {
          onEnter: (count) => {
            basketEl.classList.add('basket-hover');
          },
          onLeave: () => {
            basketEl.classList.remove('basket-hover');
          },
          onDrop: (ids) => {
            basketEl.classList.remove('basket-hover');
          }
        });
      }
    },

    get inBasketCount() {
      return this.kittens.filter(k => k.inBasket).length;
    },

    removeFromBasket(id) {
      if (this.submitted) return;
      const kitten = this.kittens.find(k => k.id === id);
      if (kitten) {
        kitten.inBasket = false;
        
        // After Alpine re-renders, re-register the kitten with its new DOM element
        this.$nextTick(() => {
          const el = document.querySelector(`[data-kitten-id="${id}"]`);
          if (el && this.dragManager) {
            this.dragManager.registerItem(id, el, { kitten });
          }
        });
      }
    },

    reset() {
      this.kittens.forEach(k => k.inBasket = false);
      this.submitted = false;
      this.correct = false;
      this.feedback = '';
      this.selectedCount = 0;
      
      // Re-setup drag drop
      if (this.dragManager) {
        this.dragManager.destroy();
      }
      this.$nextTick(() => {
        this.setupDragDrop();
      });
    },

    async checkAnswer() {
      if (this.submitted) return;
      
      const answer = this.inBasketCount;
      
      try {
        const response = await fetch('/api/exercise/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instanceId: window.exerciseData?.instanceId,
            exerciseId: window.exerciseData?.exerciseId,
            answer: answer
          })
        });
        
        const result = await response.json();
        this.submitted = true;
        this.correct = result.correct;
        this.feedback = result.feedback;
        
        this.playSound(result.correct ? 'correct' : 'incorrect');
        
      } catch (error) {
        console.error('Failed to submit answer:', error);
        this.feedback = 'Something went wrong. Please try again.';
      }
    },

    tryAgain() {
      this.reset();
    },

    playSound(type) {
      try {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch (e) {}
    }
  };
};
