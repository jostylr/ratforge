import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface OddEvenParams {
  number: number;
  isOdd: boolean;
}

export const oddEvenExercise: Exercise = {
  id: "counting-odd-even",
  topic: "counting",
  title: "Odd or Even",
  description: "Identify whether a number is odd or even",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const number = randomInt(1, 20, random);
    const isOdd = number % 2 === 1;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, isOdd } as unknown as Record<string, unknown>,
      correctAnswer: isOdd ? 'odd' : 'even',
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as OddEvenParams;
    const answerStr = String(answer).toLowerCase().trim();
    const correct = (params.isOdd && answerStr === 'odd') || (!params.isOdd && answerStr === 'even');
    
    if (correct) {
      const explanation = params.isOdd 
        ? `${params.number} is odd because it can't be split into 2 equal groups.`
        : `${params.number} is even because it can be split into 2 equal groups.`;
      return { correct: true, feedback: `Correct! ${explanation} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try dividing ${params.number} by 2. Is there a remainder?` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as OddEvenParams;
    
    // Visual representation with dots
    const dotsHTML = Array(params.number).fill(0).map((_, i) => 
      `<span class="dot" style="background: ${i % 2 === 0 ? '#3b82f6' : '#ef4444'}"></span>`
    ).join('');
    
    return `
      <div class="exercise-container" x-data="oddEvenExercise()">
        <div class="exercise-prompt">
          <h2>Is this number odd or even?</h2>
        </div>
        
        <div class="number-display">
          <span class="big-number">${params.number}</span>
        </div>
        
        <div class="dots-visual">
          <div class="dots-row">${dotsHTML}</div>
          <p class="dots-hint">Can these be split into 2 equal groups?</p>
        </div>
        
        <div class="options-grid">
          <button type="button" class="option-btn" @click="selectAnswer('odd')" :class="{ selected: selectedAnswer === 'odd' }" :disabled="submitted">
            Odd
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('even')" :class="{ selected: selectedAnswer === 'even' }" :disabled="submitted">
            Even
          </button>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !selectedAnswer">
            Check Answer
          </button>
        </div>

        <div class="feedback-area" x-show="feedback" x-cloak>
          <div class="alert" :class="correct ? 'alert-success' : 'alert-error'">
            <span x-text="feedback"></span>
          </div>
          
          <div class="next-actions" x-show="submitted">
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct && !givenUp" x-ref="tryAgainBtn">
              Try Again
            </button>
            <button class="btn btn-warning" @click="giveUp()" x-show="!correct && !givenUp && attempts >= 3">
              Give Up
            </button>
            <a href="/practice/counting-odd-even" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .number-display {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .big-number {
          font-size: 5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .dots-visual {
          text-align: center;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .dots-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: inline-block;
        }
        .dots-hint {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin: 0.5rem 0 0;
        }
        .options-grid {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 1rem 3rem;
          font-size: 1.25rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function oddEvenExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(answer) {
              if (!this.submitted) {
                this.selectedAnswer = answer;
              }
            },
            
            async checkAnswer() {
              if (!this.selectedAnswer) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.selectedAnswer
                })
              });
              
              const result = await response.json();
              this.correct = result.correct;
              this.feedback = result.feedback;
              this.submitted = true;
              this.attempts++;
              if (result.correct) {
                setTimeout(() => this.$refs.nextBtn?.focus(), 50);
              } else {
                setTimeout(() => this.$refs.tryAgainBtn?.focus(), 50);
              }
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.selectedAnswer = null;
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The answer was: ' + this.correctAnswer;
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
