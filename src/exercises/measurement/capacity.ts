import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface CapacityParams {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  answer: number;
}

const conversions: Record<string, Record<string, number>> = {
  'cups': { 'pints': 0.5, 'quarts': 0.25, 'gallons': 0.0625 },
  'pints': { 'cups': 2, 'quarts': 0.5, 'gallons': 0.125 },
  'quarts': { 'cups': 4, 'pints': 2, 'gallons': 0.25 },
  'gallons': { 'cups': 16, 'pints': 8, 'quarts': 4 },
};

export const capacityExercise: Exercise = {
  id: "measure-capacity",
  topic: "measurement",
  title: "Capacity",
  description: "Convert between cups, pints, quarts, and gallons",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const units = ['cups', 'pints', 'quarts', 'gallons'];
    const fromUnit = units[randomInt(0, 3, random)]!;
    const toOptions = Object.keys(conversions[fromUnit]!);
    const toUnit = toOptions[randomInt(0, toOptions.length - 1, random)]!;
    
    // Generate a value that results in a whole number conversion
    const conversionRate = conversions[fromUnit]![toUnit]!;
    let fromValue: number;
    
    if (conversionRate >= 1) {
      fromValue = randomInt(1, 5, random);
    } else {
      // Ensure whole number result
      const multiplier = Math.round(1 / conversionRate);
      fromValue = randomInt(1, 3, random) * multiplier;
    }
    
    const answer = fromValue * conversionRate;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { fromValue, fromUnit, toUnit, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as CapacityParams;
    const answerNum = typeof answer === "number" ? answer : parseFloat(String(answer));
    
    if (Math.abs(answerNum - params.answer) < 0.01) {
      return { correct: true, feedback: `Correct! ${params.fromValue} ${params.fromUnit} = ${params.answer} ${params.toUnit} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Think about how many ${params.toUnit} are in a ${params.fromUnit.slice(0, -1)}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as CapacityParams;
    
    return `
      <div class="exercise-container" x-data="capacityExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Convert the Measurement</h2>
        </div>
        
        <div class="conversion-display">
          <div class="conversion-problem">
            <span class="value">${params.fromValue}</span>
            <span class="unit">${params.fromUnit}</span>
            <span class="equals">=</span>
            <input type="number" 
                   x-model="answer" 
                   x-ref="mainInput"
                   class="answer-input"
                   step="0.5"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
            <span class="unit">${params.toUnit}</span>
          </div>
        </div>
        
        <div class="hint-box">
          <p><strong>Remember:</strong></p>
          <ul>
            <li>1 gallon = 4 quarts</li>
            <li>1 quart = 2 pints</li>
            <li>1 pint = 2 cups</li>
          </ul>
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
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '.'" :disabled="submitted">.</button>
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
            <a href="/practice/measure-capacity" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .conversion-problem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 1.5rem;
        }
        .value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .unit {
          font-weight: 500;
        }
        .equals {
          font-size: 2rem;
          margin: 0 0.5rem;
        }
        .answer-input {
          width: 80px;
          padding: 0.5rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .hint-box {
          padding: 1rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        .hint-box p {
          margin: 0 0 0.5rem;
        }
        .hint-box ul {
          margin: 0;
          padding-left: 1.25rem;
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
        function capacityExercise() {
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
                  answer: parseFloat(this.answer)
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
              setTimeout(() => this.$refs.mainInput?.focus(), 50);
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
