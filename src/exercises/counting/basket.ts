import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface BasketParams {
  totalKittens: number;
  targetCount: number;
  kittenPositions: Array<{ id: number; x: number; y: number }>;
}

export const kittenBasketExercise: Exercise = {
  id: "counting-basket",
  topic: "counting",
  title: "Kittens in a Basket",
  description: "Practice counting by putting the right number of kittens in a basket",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const totalKittens = randomInt(6, 12, random);
    const targetCount = randomInt(2, totalKittens - 2, random);
    
    // Generate random positions for kittens (percentage-based for responsive)
    const kittenPositions: Array<{ id: number; x: number; y: number }> = [];
    for (let i = 0; i < totalKittens; i++) {
      kittenPositions.push({
        id: i,
        x: randomInt(5, 60, random),  // Left side of play area
        y: randomInt(10, 80, random),
      });
    }

    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { totalKittens, targetCount, kittenPositions } as unknown as Record<string, unknown>,
      correctAnswer: targetCount,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as BasketParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.targetCount) {
      return { correct: true, feedback: "Perfect! You counted correctly! 🎉" };
    }
    
    if (answerNum < params.targetCount) {
      return { correct: false, feedback: `Not quite - you need ${params.targetCount - answerNum} more kitten${params.targetCount - answerNum > 1 ? "s" : ""}!` };
    }
    
    return { correct: false, feedback: `Too many! Take ${answerNum - params.targetCount} kitten${answerNum - params.targetCount > 1 ? "s" : ""} out.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as BasketParams;
    const kittensJSON = JSON.stringify(params.kittenPositions);
    
    return `
      <div class="exercise-container" 
           x-data="kittenBasket(${params.totalKittens}, ${params.targetCount}, ${kittensJSON})"
           x-init="init()">
        
        <div class="exercise-prompt">
          <h2>Put <span class="target-number" x-text="targetCount"></span> kittens in the basket!</h2>
          <p class="exercise-hint">Click on kittens to add them to the basket. Click again to remove.</p>
        </div>

        <div class="play-area">
          <div class="kittens-area">
            <template x-for="kitten in kittens" :key="kitten.id">
              <button class="kitten-btn"
                      :class="{ 'in-basket': kitten.inBasket }"
                      :style="{ left: kitten.x + '%', top: kitten.y + '%' }"
                      @click="toggleKitten(kitten.id)"
                      :disabled="submitted">
                <svg class="kitten-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="50" cy="65" rx="30" ry="25" fill="#f4a460"/>
                  <circle cx="50" cy="35" r="25" fill="#f4a460"/>
                  <polygon points="30,20 25,0 40,15" fill="#f4a460"/>
                  <polygon points="70,20 75,0 60,15" fill="#f4a460"/>
                  <polygon points="30,18 27,5 38,14" fill="#ffb6c1"/>
                  <polygon points="70,18 73,5 62,14" fill="#ffb6c1"/>
                  <circle cx="40" cy="32" r="5" fill="#333"/>
                  <circle cx="60" cy="32" r="5" fill="#333"/>
                  <circle cx="42" cy="30" r="2" fill="#fff"/>
                  <circle cx="62" cy="30" r="2" fill="#fff"/>
                  <ellipse cx="50" cy="42" rx="4" ry="3" fill="#ffb6c1"/>
                  <path d="M 46 45 Q 50 50 54 45" stroke="#333" fill="none" stroke-width="1.5"/>
                  <line x1="25" y1="38" x2="10" y2="35" stroke="#333" stroke-width="1"/>
                  <line x1="25" y1="42" x2="10" y2="42" stroke="#333" stroke-width="1"/>
                  <line x1="25" y1="46" x2="10" y2="49" stroke="#333" stroke-width="1"/>
                  <line x1="75" y1="38" x2="90" y2="35" stroke="#333" stroke-width="1"/>
                  <line x1="75" y1="42" x2="90" y2="42" stroke="#333" stroke-width="1"/>
                  <line x1="75" y1="46" x2="90" y2="49" stroke="#333" stroke-width="1"/>
                  <ellipse cx="35" cy="80" rx="8" ry="6" fill="#f4a460"/>
                  <ellipse cx="65" cy="80" rx="8" ry="6" fill="#f4a460"/>
                  <path d="M 80 60 Q 95 55 90 75 Q 85 90 75 85" fill="#f4a460"/>
                </svg>
              </button>
            </template>
          </div>

          <div class="basket-area">
            <div class="basket">
              <svg class="basket-icon" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                <path d="M 10 30 L 20 75 L 100 75 L 110 30 Z" fill="#8b4513" stroke="#5d3a1a" stroke-width="2"/>
                <path d="M 10 30 L 110 30" stroke="#5d3a1a" stroke-width="3"/>
                <line x1="30" y1="30" x2="35" y2="75" stroke="#5d3a1a" stroke-width="1.5"/>
                <line x1="50" y1="30" x2="52" y2="75" stroke="#5d3a1a" stroke-width="1.5"/>
                <line x1="70" y1="30" x2="68" y2="75" stroke="#5d3a1a" stroke-width="1.5"/>
                <line x1="90" y1="30" x2="85" y2="75" stroke="#5d3a1a" stroke-width="1.5"/>
                <path d="M 20 30 Q 60 0 100 30" fill="none" stroke="#8b4513" stroke-width="4"/>
              </svg>
              <div class="basket-count">
                <span x-text="inBasketCount"></span> kitten<span x-show="inBasketCount !== 1">s</span>
              </div>
            </div>
          </div>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || inBasketCount === 0">
            Check Answer
          </button>
          
          <button class="btn btn-secondary"
                  @click="reset()"
                  x-show="!submitted">
            Start Over
          </button>
        </div>

        <div class="feedback-area" x-show="feedback" x-cloak>
          <div class="alert" :class="correct ? 'alert-success' : 'alert-error'">
            <span x-text="feedback"></span>
          </div>
          
          <div class="next-actions" x-show="submitted">
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct">
              Try Again
            </button>
            <a href="" class="btn btn-primary" x-show="correct" 
               :href="'/practice/counting/basket?new=1'">
              Next Exercise
            </a>
            <a href="" class="btn btn-secondary" :href="dashboardUrl">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    `;
  },
};
