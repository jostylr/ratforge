import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface DivisibilityParams {
  number: number;
  divisor: number;
  isDivisible: boolean;
}

function isDivisibleBy(n: number, d: number): boolean {
  return n % d === 0;
}

export const divisibilityExercise: Exercise = {
  id: "div-divisibility",
  topic: "division",
  title: "Divisibility Rules",
  description: "Check if numbers are divisible",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const divisors = [2, 3, 5, 9, 10];
    const divisor = divisors[randomInt(0, divisors.length - 1, random)]!;
    
    // Generate a number that may or may not be divisible
    let number: number;
    const makeDivisible = randomInt(0, 1, random) === 0;
    
    if (makeDivisible) {
      number = randomInt(10, 50, random) * divisor;
    } else {
      number = randomInt(100, 500, random);
      // Make sure it's NOT divisible
      while (number % divisor === 0) {
        number++;
      }
    }
    
    const isDivisible = isDivisibleBy(number, divisor);
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, divisor, isDivisible } as unknown as Record<string, unknown>,
      correctAnswer: isDivisible ? 'yes' : 'no',
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as DivisibilityParams;
    const answerStr = String(answer).toLowerCase().trim();
    
    const isYes = answerStr === 'yes' || answerStr === 'true' || answerStr === 'y';
    const isNo = answerStr === 'no' || answerStr === 'false' || answerStr === 'n';
    
    if ((isYes && params.isDivisible) || (isNo && !params.isDivisible)) {
      return { correct: true, feedback: `Correct! ${params.number} is ${params.isDivisible ? '' : 'not '}divisible by ${params.divisor}. 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Check the divisibility rule for ${params.divisor}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as DivisibilityParams;
    
    const rules: Record<number, string> = {
      2: 'Last digit is even (0, 2, 4, 6, 8)',
      3: 'Sum of digits is divisible by 3',
      5: 'Last digit is 0 or 5',
      9: 'Sum of digits is divisible by 9',
      10: 'Last digit is 0',
    };
    
    return `
      <div class="exercise-container" x-data="divisibilityExercise()">
        <div class="exercise-prompt">
          <h2>Divisibility Rules</h2>
          <p class="exercise-hint">Is ${params.number} divisible by ${params.divisor}?</p>
        </div>
        
        <div class="number-display">
          <span class="big-number">${params.number}</span>
          <span class="divisor-label">÷ ${params.divisor}</span>
        </div>
        
        <div class="rule-hint">
          <p><strong>Rule for ${params.divisor}:</strong> ${rules[params.divisor]}</p>
        </div>
        
        <div class="options-row">
          <button type="button" class="option-btn yes" @click="selectAnswer('yes')" :class="{ selected: selectedAnswer === 'yes' }" :disabled="submitted">
            Yes, divisible
          </button>
          <button type="button" class="option-btn no" @click="selectAnswer('no')" :class="{ selected: selectedAnswer === 'no' }" :disabled="submitted">
            No, not divisible
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
            <a href="/practice/div-divisibility" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }
        .big-number {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .divisor-label {
          display: block;
          font-size: 1.5rem;
          color: var(--color-text-muted);
          margin-top: 0.5rem;
        }
        .rule-hint {
          padding: 0.75rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .rule-hint p {
          margin: 0;
        }
        .options-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 1rem 2rem;
          font-size: 1.1rem;
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
        .option-btn.yes.selected {
          background: #22c55e;
          border-color: #22c55e;
        }
        .option-btn.no.selected {
          background: #ef4444;
          border-color: #ef4444;
        }
      </style>
      
      <script>
        function divisibilityExercise() {
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
