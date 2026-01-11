import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface RemainderParams {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export const remainderExercise: Exercise = {
  id: "div-remainders",
  topic: "division",
  title: "Division with Remainders",
  description: "Find the quotient and remainder",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const divisor = randomInt(2, 9, random);
    const quotient = randomInt(2, 9, random);
    const remainder = randomInt(1, divisor - 1, random);
    const dividend = divisor * quotient + remainder;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { dividend, divisor, quotient, remainder } as unknown as Record<string, unknown>,
      correctAnswer: `${quotient}r${remainder}`,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as RemainderParams;
    const answerStr = String(answer).toLowerCase().replace(/\s/g, '');
    
    // Accept formats: "5r2", "5 r 2", "5 R 2", etc.
    const match = answerStr.match(/^(\d+)r(\d+)$/);
    if (match) {
      const q = parseInt(match[1]!);
      const r = parseInt(match[2]!);
      if (q === params.quotient && r === params.remainder) {
        return { correct: true, feedback: `Correct! ${params.dividend} ÷ ${params.divisor} = ${params.quotient} R ${params.remainder} 🎉` };
      }
    }
    
    // Also accept just quotient if remainder is shown separately
    const numAnswer = parseInt(answerStr);
    if (numAnswer === params.quotient) {
      return { correct: false, feedback: `${params.quotient} is the quotient, but don't forget the remainder!` };
    }
    
    return { correct: false, feedback: `Not quite. ${params.divisor} goes into ${params.dividend} how many times with how much left over?` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as RemainderParams;
    
    return `
      <div class="exercise-container" x-data="remainderExercise()" x-init="$nextTick(() => $refs.quotientInput?.focus())">
        <div class="exercise-prompt">
          <h2>Divide with Remainder</h2>
          <p class="exercise-hint">How many times does ${params.divisor} go into ${params.dividend}? What's left over?</p>
        </div>
        
        <div class="problem-display">
          <span class="dividend">${params.dividend}</span>
          <span class="operator">÷</span>
          <span class="divisor">${params.divisor}</span>
          <span class="equals">=</span>
          <span class="answer-area">
            <input type="number" 
                   x-ref="quotientInput"
                   x-model="quotient" 
                   min="0" 
                   max="20"
                   class="answer-input quotient-input"
                   placeholder="?"
                   :disabled="submitted"
                   @keyup.enter="$refs.remainderInput.focus()">
            <span class="r-label">R</span>
            <input type="number" 
                   x-ref="remainderInput"
                   x-model="remainder" 
                   min="0" 
                   max="20"
                   class="answer-input remainder-input"
                   placeholder="?"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
          </span>
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="appendToActive('7')" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="appendToActive('8')" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="appendToActive('9')" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="appendToActive('4')" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="appendToActive('5')" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="appendToActive('6')" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="appendToActive('1')" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="appendToActive('2')" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="appendToActive('3')" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="clearActive()" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="appendToActive('0')" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-enter" @click="checkAnswer()" :disabled="submitted || !quotient || !remainder">↵</button>
            </div>
          </div>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !quotient || remainder === ''">
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
            <a href="/practice/div-remainders" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .problem-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .dividend, .divisor {
          font-size: 2.5rem;
          font-weight: 700;
        }
        .operator, .equals {
          font-size: 2rem;
          color: var(--color-text-muted);
        }
        .answer-area {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .answer-input {
          width: 50px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          background: transparent;
        }
        .answer-input:focus {
          outline: none;
          border-style: solid;
        }
        .r-label {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
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
        function remainderExercise() {
          return {
            quotient: '',
            remainder: '',
            activeField: 'quotient',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            appendToActive(digit) {
              const active = document.activeElement;
              if (active === this.$refs.quotientInput) {
                this.quotient = (this.quotient || '') + digit;
              } else if (active === this.$refs.remainderInput) {
                this.remainder = (this.remainder || '') + digit;
              } else {
                this.quotient = (this.quotient || '') + digit;
              }
            },
            
            clearActive() {
              const active = document.activeElement;
              if (active === this.$refs.remainderInput) {
                this.remainder = '';
              } else {
                this.quotient = '';
              }
            },
            
            async checkAnswer() {
              if (!this.quotient || this.remainder === '') return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.quotient + 'r' + this.remainder
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
              this.quotient = '';
              this.remainder = '';
              setTimeout(() => this.$refs.quotientInput?.focus(), 50);
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The answer was: ' + this.correctAnswer.replace('r', ' R ');
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
