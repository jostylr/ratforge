import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface OrderingParams {
  numbers: number[];
  direction: 'ascending' | 'descending';
  correctOrder: number[];
}

export const orderingExercise: Exercise = {
  id: "counting-ordering",
  topic: "counting",
  title: "Order Numbers",
  description: "Put numbers in order from least to greatest or greatest to least",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const direction = random() > 0.5 ? 'ascending' : 'descending';
    const count = randomInt(4, 5, random);
    
    // Generate unique numbers
    const numbers: number[] = [];
    while (numbers.length < count) {
      const num = randomInt(1, 50, random);
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    const correctOrder = [...numbers].sort((a, b) => 
      direction === 'ascending' ? a - b : b - a
    );
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { numbers, direction, correctOrder } as unknown as Record<string, unknown>,
      correctAnswer: correctOrder.join(','),
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as OrderingParams;
    const answerStr = String(answer).replace(/\s/g, '');
    const correctStr = params.correctOrder.join(',');
    
    if (answerStr === correctStr) {
      return { correct: true, feedback: `Perfect! ${params.correctOrder.join(' → ')} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. ${params.direction === 'ascending' ? 'Start with the smallest number.' : 'Start with the largest number.'}` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as OrderingParams;
    
    return `
      <div class="exercise-container" x-data="orderingExercise()">
        <div class="exercise-prompt">
          <h2>Put in order: ${params.direction === 'ascending' ? 'Least to Greatest' : 'Greatest to Least'}</h2>
          <p class="exercise-hint">Click the numbers in the correct order</p>
        </div>
        
        <div class="numbers-pool">
          <template x-for="num in availableNumbers" :key="num">
            <button type="button" class="number-chip" 
                    @click="selectNumber(num)"
                    :disabled="submitted">
              <span x-text="num"></span>
            </button>
          </template>
        </div>
        
        <div class="selected-area">
          <div class="selected-label">${params.direction === 'ascending' ? 'Smallest → Largest' : 'Largest → Smallest'}</div>
          <div class="selected-numbers">
            <template x-for="(num, index) in selectedNumbers" :key="index">
              <div class="selected-chip">
                <span x-text="num"></span>
                <button type="button" class="remove-btn" @click="removeNumber(index)" :disabled="submitted">×</button>
              </div>
            </template>
            <div class="placeholder" x-show="selectedNumbers.length < ${params.numbers.length}">
              <span x-text="'(' + (${params.numbers.length} - selectedNumbers.length) + ' more)'"></span>
            </div>
          </div>
        </div>
        
        <div class="controls-row">
          <button type="button" class="btn btn-secondary" @click="reset()" :disabled="submitted || selectedNumbers.length === 0">
            Start Over
          </button>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || selectedNumbers.length < ${params.numbers.length}">
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
            <a href="/practice/counting-ordering" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .numbers-pool {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .number-chip {
          width: 60px;
          height: 60px;
          font-size: 1.5rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .number-chip:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .number-chip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .selected-area {
          padding: 1.5rem;
          background: var(--color-surface);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }
        .selected-label {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin-bottom: 0.75rem;
          text-align: center;
        }
        .selected-numbers {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          min-height: 50px;
        }
        .selected-chip {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-md);
          font-size: 1.25rem;
          font-weight: 600;
        }
        .remove-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0 0.25rem;
          opacity: 0.7;
        }
        .remove-btn:hover:not(:disabled) {
          opacity: 1;
        }
        .placeholder {
          color: var(--color-text-muted);
          font-style: italic;
        }
        .controls-row {
          text-align: center;
          margin-bottom: 1rem;
        }
      </style>
      
      <script>
        function orderingExercise() {
          const allNumbers = ${JSON.stringify(params.numbers)};
          return {
            allNumbers: allNumbers,
            availableNumbers: [...allNumbers],
            selectedNumbers: [],
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectNumber(num) {
              this.selectedNumbers.push(num);
              this.availableNumbers = this.availableNumbers.filter(n => n !== num);
            },
            
            removeNumber(index) {
              const num = this.selectedNumbers.splice(index, 1)[0];
              this.availableNumbers.push(num);
            },
            
            reset() {
              this.selectedNumbers = [];
              this.availableNumbers = [...this.allNumbers];
            },
            
            async checkAnswer() {
              if (this.selectedNumbers.length < this.allNumbers.length) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.selectedNumbers.join(',')
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
              this.reset();
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The correct order was: ' + this.correctAnswer.split(',').join(' → ');
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
