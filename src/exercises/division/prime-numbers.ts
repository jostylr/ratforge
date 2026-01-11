import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface PrimeNumbersParams {
  number: number;
  isPrime: boolean;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export const primeNumbersExercise: Exercise = {
  id: "div-prime",
  topic: "division",
  title: "Prime Numbers",
  description: "Identify prime and composite numbers",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Mix of prime and composite numbers
    const number = randomInt(2, 50, random);
    const prime = isPrime(number);
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, isPrime: prime } as unknown as Record<string, unknown>,
      correctAnswer: prime ? 'prime' : 'composite',
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as PrimeNumbersParams;
    const answerStr = String(answer).toLowerCase().trim();
    
    const isCorrectPrime = params.isPrime && (answerStr === 'prime' || answerStr === 'yes' || answerStr === 'true');
    const isCorrectComposite = !params.isPrime && (answerStr === 'composite' || answerStr === 'no' || answerStr === 'false');
    
    if (isCorrectPrime || isCorrectComposite) {
      const reason = params.isPrime 
        ? `${params.number} is only divisible by 1 and itself`
        : `${params.number} has more than two factors`;
      return { correct: true, feedback: `Correct! ${params.number} is ${params.isPrime ? 'prime' : 'composite'}. ${reason} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. A prime number has exactly two factors: 1 and itself.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as PrimeNumbersParams;
    
    return `
      <div class="exercise-container" x-data="primeNumbersExercise()">
        <div class="exercise-prompt">
          <h2>Prime or Composite?</h2>
          <p class="exercise-hint">Is this number prime or composite?</p>
        </div>
        
        <div class="number-display">
          <span class="big-number">${params.number}</span>
        </div>
        
        <div class="hint-box">
          <p><strong>Prime:</strong> Only divisible by 1 and itself (exactly 2 factors)</p>
          <p><strong>Composite:</strong> Has more than 2 factors</p>
        </div>
        
        <div class="options-row">
          <button type="button" class="option-btn" @click="selectAnswer('prime')" :class="{ selected: selectedAnswer === 'prime' }" :disabled="submitted">
            Prime
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('composite')" :class="{ selected: selectedAnswer === 'composite' }" :disabled="submitted">
            Composite
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
            <a href="/practice/div-prime" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }
        .big-number {
          font-size: 4rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .hint-box {
          padding: 0.75rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .hint-box p { margin: 0.25rem 0; }
        .options-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 1rem 2rem;
          font-size: 1.25rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
          min-width: 140px;
        }
        .option-btn:hover:not(:disabled) { border-color: var(--color-primary); }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      </style>
      
      <script>
        function primeNumbersExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(ans) {
              if (!this.submitted) {
                this.selectedAnswer = ans;
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
