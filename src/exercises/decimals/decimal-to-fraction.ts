import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface DecimalToFractionParams {
  decimal: number;
  numerator: number;
  denominator: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export const decimalToFractionExercise: Exercise = {
  id: "dec-to-frac",
  topic: "decimals",
  title: "Decimal to Fraction",
  description: "Convert decimals to fractions",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate simple decimal to convert
    const type = randomInt(0, 2, random);
    let decimal: number, numerator: number, denominator: number;
    
    if (type === 0) {
      // Tenths
      numerator = randomInt(1, 9, random);
      denominator = 10;
      decimal = numerator / 10;
    } else if (type === 1) {
      // Hundredths
      numerator = randomInt(1, 99, random);
      denominator = 100;
      decimal = numerator / 100;
    } else {
      // Simple fractions (quarters, halves)
      const options = [
        { dec: 0.25, num: 1, den: 4 },
        { dec: 0.5, num: 1, den: 2 },
        { dec: 0.75, num: 3, den: 4 },
        { dec: 0.2, num: 1, den: 5 },
        { dec: 0.4, num: 2, den: 5 },
      ];
      const choice = options[randomInt(0, options.length - 1, random)]!;
      decimal = choice.dec;
      numerator = choice.num;
      denominator = choice.den;
    }
    
    // Simplify if needed
    const div = gcd(numerator, denominator);
    numerator = numerator / div;
    denominator = denominator / div;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { decimal, numerator, denominator } as unknown as Record<string, unknown>,
      correctAnswer: `${numerator}/${denominator}`,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as DecimalToFractionParams;
    const answerStr = String(answer).trim();
    
    const parts = answerStr.split('/');
    if (parts.length === 2) {
      let num = parseInt(parts[0]!, 10);
      let den = parseInt(parts[1]!, 10);
      
      // Simplify user's answer
      const div = gcd(num, den);
      num = num / div;
      den = den / div;
      
      if (num === params.numerator && den === params.denominator) {
        return { correct: true, feedback: `Correct! ${params.decimal} = ${params.numerator}/${params.denominator} 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Think about place value: tenths = /10, hundredths = /100` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as DecimalToFractionParams;
    
    return `
      <div class="exercise-container" x-data="decimalToFractionExercise()" x-init="$nextTick(() => $refs.numInput?.focus())">
        <div class="exercise-prompt">
          <h2>Convert to a Fraction</h2>
          <p class="exercise-hint">Simplify if possible</p>
        </div>
        
        <div class="conversion-display">
          <span class="decimal-value">${params.decimal}</span>
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
            <a href="/practice/dec-to-frac" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .conversion-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .decimal-value {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .equals {
          font-size: 2rem;
          font-weight: 600;
        }
        .fraction {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fraction-bar {
          width: 60px;
          height: 3px;
          background: var(--color-text);
          margin: 0.25rem 0;
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
        function decimalToFractionExercise() {
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
