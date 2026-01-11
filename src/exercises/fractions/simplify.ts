import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface SimplifyFractionParams {
  numerator: number;
  denominator: number;
  simplifiedNum: number;
  simplifiedDen: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export const simplifyFractionExercise: Exercise = {
  id: "frac-simplify",
  topic: "fractions",
  title: "Simplify Fractions",
  description: "Reduce fractions to lowest terms",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate a simplified fraction first, then multiply by a factor
    const simplifiedNum = randomInt(1, 6, random);
    const simplifiedDen = randomInt(simplifiedNum + 1, 12, random);
    const factor = randomInt(2, 4, random);
    
    const numerator = simplifiedNum * factor;
    const denominator = simplifiedDen * factor;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { numerator, denominator, simplifiedNum, simplifiedDen } as unknown as Record<string, unknown>,
      correctAnswer: `${simplifiedNum}/${simplifiedDen}`,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as SimplifyFractionParams;
    const answerStr = String(answer).trim();
    
    // Parse answer as fraction
    const parts = answerStr.split('/');
    if (parts.length === 2) {
      const num = parseInt(parts[0]!, 10);
      const den = parseInt(parts[1]!, 10);
      
      if (num === params.simplifiedNum && den === params.simplifiedDen) {
        return { correct: true, feedback: `Correct! ${params.numerator}/${params.denominator} = ${params.simplifiedNum}/${params.simplifiedDen} 🎉` };
      }
      
      // Check if equivalent but not fully simplified
      if (num * params.simplifiedDen === den * params.simplifiedNum && gcd(num, den) > 1) {
        return { correct: false, feedback: `Good fraction, but it can be simplified more!` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Find a number that divides both ${params.numerator} and ${params.denominator}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as SimplifyFractionParams;
    
    return `
      <div class="exercise-container" x-data="simplifyFractionExercise()" x-init="$nextTick(() => $refs.numInput?.focus())">
        <div class="exercise-prompt">
          <h2>Simplify the Fraction</h2>
          <p class="exercise-hint">Reduce to lowest terms</p>
        </div>
        
        <div class="fraction-display">
          <div class="fraction original">
            <span class="numerator">${params.numerator}</span>
            <span class="fraction-bar"></span>
            <span class="denominator">${params.denominator}</span>
          </div>
          <span class="equals">=</span>
          <div class="fraction answer-fraction">
            <input type="number" x-model="answerNum" x-ref="numInput" class="frac-input" :disabled="submitted" @keyup.enter="$refs.denInput?.focus()">
            <span class="fraction-bar"></span>
            <input type="number" x-model="answerDen" x-ref="denInput" class="frac-input" :disabled="submitted" @keyup.enter="checkAnswer()">
          </div>
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="addDigit('7')" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="addDigit('8')" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="addDigit('9')" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="addDigit('4')" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="addDigit('5')" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="addDigit('6')" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="addDigit('1')" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="addDigit('2')" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="addDigit('3')" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="clearCurrent()" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="addDigit('0')" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-special" @click="switchField()" :disabled="submitted">↓</button>
            </div>
          </div>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !answerNum || !answerDen">
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
            <a href="/practice/frac-simplify" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .fraction-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .fraction {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fraction .numerator, .fraction .denominator {
          font-size: 2rem;
          font-weight: 600;
        }
        .fraction-bar {
          width: 60px;
          height: 3px;
          background: var(--color-text);
          margin: 0.25rem 0;
        }
        .equals {
          font-size: 2rem;
          font-weight: 600;
        }
        .frac-input {
          width: 60px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          background: transparent;
        }
        .frac-input:focus {
          outline: none;
          border-style: solid;
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
      </style>
      
      <script>
        function simplifyFractionExercise() {
          return {
            answerNum: '',
            answerDen: '',
            activeField: 'num',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            addDigit(d) {
              if (this.activeField === 'num') {
                this.answerNum = (this.answerNum || '') + d;
              } else {
                this.answerDen = (this.answerDen || '') + d;
              }
            },
            
            clearCurrent() {
              if (this.activeField === 'num') {
                this.answerNum = '';
              } else {
                this.answerDen = '';
              }
            },
            
            switchField() {
              this.activeField = this.activeField === 'num' ? 'den' : 'num';
              if (this.activeField === 'num') {
                this.$refs.numInput?.focus();
              } else {
                this.$refs.denInput?.focus();
              }
            },
            
            async checkAnswer() {
              if (!this.answerNum || !this.answerDen) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.answerNum + '/' + this.answerDen
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
              this.answerNum = '';
              this.answerDen = '';
              this.activeField = 'num';
              setTimeout(() => this.$refs.numInput?.focus(), 50);
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
