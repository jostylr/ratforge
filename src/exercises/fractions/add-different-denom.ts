import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface AddDiffDenomParams {
  num1: number;
  den1: number;
  num2: number;
  den2: number;
  answerNum: number;
  answerDen: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

export const addDiffDenomExercise: Exercise = {
  id: "frac-add-diff",
  topic: "fractions",
  title: "Add Fractions (Different Denominators)",
  description: "Add fractions with unlike denominators",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Use denominators that have a simple LCD
    const denPairs = [[2, 4], [2, 6], [3, 6], [4, 8], [2, 3], [3, 4], [4, 6]];
    const [den1, den2] = denPairs[randomInt(0, denPairs.length - 1, random)]!;
    
    const num1 = randomInt(1, den1! - 1, random);
    const num2 = randomInt(1, den2! - 1, random);
    
    // Calculate answer
    const commonDen = lcm(den1!, den2!);
    const newNum1 = num1 * (commonDen / den1!);
    const newNum2 = num2 * (commonDen / den2!);
    let answerNum = newNum1 + newNum2;
    let answerDen = commonDen;
    
    // Simplify
    const divisor = gcd(answerNum, answerDen);
    answerNum = answerNum / divisor;
    answerDen = answerDen / divisor;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, den1, num2, den2, answerNum, answerDen } as unknown as Record<string, unknown>,
      correctAnswer: `${answerNum}/${answerDen}`,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as AddDiffDenomParams;
    const answerStr = String(answer).trim();
    
    const parts = answerStr.split('/');
    if (parts.length === 2) {
      let num = parseInt(parts[0]!, 10);
      let den = parseInt(parts[1]!, 10);
      
      // Simplify user's answer
      const div = gcd(num, den);
      num = num / div;
      den = den / div;
      
      if (num === params.answerNum && den === params.answerDen) {
        return { correct: true, feedback: `Correct! ${params.num1}/${params.den1} + ${params.num2}/${params.den2} = ${params.answerNum}/${params.answerDen} 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Find a common denominator first.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as AddDiffDenomParams;
    
    return `
      <div class="exercise-container" x-data="addDiffDenomExercise()" x-init="$nextTick(() => $refs.numInput?.focus())">
        <div class="exercise-prompt">
          <h2>Add Fractions</h2>
          <p class="exercise-hint">Find a common denominator</p>
        </div>
        
        <div class="fraction-problem">
          <div class="fraction">
            <span class="numerator">${params.num1}</span>
            <span class="fraction-bar"></span>
            <span class="denominator">${params.den1}</span>
          </div>
          <span class="operator">+</span>
          <div class="fraction">
            <span class="numerator">${params.num2}</span>
            <span class="fraction-bar"></span>
            <span class="denominator">${params.den2}</span>
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
            <a href="/practice/frac-add-diff" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .fraction-problem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .fraction {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .fraction .numerator, .fraction .denominator {
          font-size: 1.75rem;
          font-weight: 600;
        }
        .fraction-bar {
          width: 50px;
          height: 3px;
          background: var(--color-text);
          margin: 0.25rem 0;
        }
        .operator, .equals {
          font-size: 1.75rem;
          font-weight: 600;
        }
        .frac-input {
          width: 50px;
          padding: 0.25rem;
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
        function addDiffDenomExercise() {
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
