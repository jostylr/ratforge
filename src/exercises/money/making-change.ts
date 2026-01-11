import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MakingChangeParams {
  price: number;
  paid: number;
  change: number;
}

export const makingChangeExercise: Exercise = {
  id: "money-change",
  topic: "money",
  title: "Making Change",
  description: "Calculate the change from a purchase",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate price (in cents, convert to dollars for display)
    const priceOptions = [25, 35, 45, 50, 65, 75, 85, 99, 125, 150, 175, 199, 225, 250, 299, 350];
    const price = priceOptions[randomInt(0, priceOptions.length - 1, random)]!;
    
    // Paid amount (rounded up to next dollar or 5 dollars)
    const paidOptions = price < 100 ? [100] : price < 200 ? [200, 500] : price < 300 ? [300, 500] : [500];
    const paid = paidOptions[randomInt(0, paidOptions.length - 1, random)]!;
    
    const change = paid - price;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { price, paid, change } as unknown as Record<string, unknown>,
      correctAnswer: change,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MakingChangeParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.change) {
      const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
      return { correct: true, feedback: `Correct! ${formatMoney(params.paid)} - ${formatMoney(params.price)} = ${formatMoney(params.change)} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Subtract the price from the amount paid.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MakingChangeParams;
    
    const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
    
    return `
      <div class="exercise-container" x-data="makingChangeExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>How much change?</h2>
        </div>
        
        <div class="transaction-display">
          <div class="transaction-row">
            <span class="label">Price:</span>
            <span class="amount price">${formatMoney(params.price)}</span>
          </div>
          <div class="transaction-row">
            <span class="label">You pay:</span>
            <span class="amount paid">${formatMoney(params.paid)}</span>
          </div>
          <div class="transaction-row result">
            <span class="label">Change:</span>
            <span class="amount">?</span>
          </div>
        </div>
        
        <div class="answer-section">
          <span class="dollar-sign">$</span>
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="500"
                 step="1"
                 class="answer-input"
                 placeholder="cents"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="hint">(enter in cents, e.g. 75 for $0.75)</span>
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '7'" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '8'" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '9'" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '4'" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '5'" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '6'" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '1'" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '2'" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '3'" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="answer = ''" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '0'" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-enter" @click="checkAnswer()" :disabled="submitted || !answer">↵</button>
            </div>
          </div>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !answer">
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
            <a href="/practice/money-change" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .transaction-display {
          max-width: 300px;
          margin: 0 auto 1.5rem;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
        }
        .transaction-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          font-size: 1.25rem;
        }
        .transaction-row.result {
          border-top: 2px solid var(--color-border);
          margin-top: 0.5rem;
          padding-top: 1rem;
          font-weight: 600;
        }
        .amount {
          font-weight: 600;
        }
        .amount.price {
          color: #ef4444;
        }
        .amount.paid {
          color: #22c55e;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .dollar-sign {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .answer-input {
          width: 100px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .hint {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          width: 100%;
          text-align: center;
        }
        .numpad-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .numpad-toggle {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
        }
        .number-pad {
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
        }
        .pad-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .pad-btn {
          width: 55px;
          height: 45px;
          font-size: 1.25rem;
          font-weight: 600;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.15s;
        }
        .pad-btn:hover:not(:disabled) {
          background: var(--color-primary);
          color: white;
        }
        .pad-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pad-special { background: var(--color-bg); }
        .pad-enter { background: var(--color-primary); color: white; }
      </style>
      
      <script>
        function makingChangeExercise() {
          return {
            answer: '',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            async checkAnswer() {
              if (!this.answer) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: parseInt(this.answer)
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
              this.answer = '';
              setTimeout(() => document.querySelector('.answer-input')?.focus(), 50);
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The answer was: ' + this.correctAnswer + ' cents';
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
