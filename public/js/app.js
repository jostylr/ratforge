// RatForge - Client-side JavaScript

// Alpine.js component for Kitten Basket exercise
function kittenBasket(totalKittens, targetCount, positions) {
  return {
    targetCount: targetCount,
    kittens: [],
    submitted: false,
    correct: false,
    feedback: '',
    dashboardUrl: window.exerciseData?.dashboardUrl || '/',

    init() {
      // Initialize kittens from positions
      this.kittens = positions.map(pos => ({
        id: pos.id,
        x: pos.x,
        y: pos.y,
        inBasket: false
      }));
    },

    get inBasketCount() {
      return this.kittens.filter(k => k.inBasket).length;
    },

    toggleKitten(id) {
      if (this.submitted) return;
      
      const kitten = this.kittens.find(k => k.id === id);
      if (kitten) {
        kitten.inBasket = !kitten.inBasket;
      }
    },

    reset() {
      this.kittens.forEach(k => k.inBasket = false);
      this.submitted = false;
      this.correct = false;
      this.feedback = '';
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
        
        // Play sound effect
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
      // Sound effects - will be silent if files don't exist
      try {
        const audio = new Audio(`/sounds/${type}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(() => {}); // Ignore errors if sound fails
      } catch (e) {
        // Ignore sound errors
      }
    }
  };
}

// Make available globally for Alpine
window.kittenBasket = kittenBasket;
