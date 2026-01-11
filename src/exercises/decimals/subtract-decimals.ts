import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface SubtractDecimalsParams {
  num1: number;
  num2: number;
  answer: number;
}

export const subtractDecimalsExercise: Exercise = {
  id: "dec-subtract",
  topic: "decimals",
  title: "Subtract Decimals",
  description: "Subtract decimal numbers",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate decimals with 1 decimal place
    const num1 = Math.round(randomInt(30, 99, random)) / 10;
    const num2 = Math.round(randomInt(10, Math.floor(num1 * 10) - 1, random)) / 10;
    const answer = Math.round((num1 - num2) * 10) / 10;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as SubtractDecimalsParams;
    const answerNum = typeof answer === "number" ? answer : parseFloat(String(answer));
    
    // Allow small floating point differences
    if (Math.abs(answerNum - params.answer) < 0.01) {
      return { correct: true, feedback: `Correct! ${params.num1} − ${params.num2} = ${params.answer} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Line up the decimal points and subtract.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as SubtractDecimalsParams;
    
    return `
      <div class="exercise-container" x-data="subtractDecimalsExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Subtract the Decimals</h2>
          <p class="exercise-hint">Line up the decimal points!</p>
        </div>
        
        <div class="problem-display">
          <div class="vertical-problem">
            <div class="number top-num">${params.num1.toFixed(1)}</div>
            <div class="number bottom-num">− ${params.num2.toFixed(1)}</div>
            <div class="problem-line"></div>
            <div class="answer-row">
              <input type="text" 
                     x-model="answer" 
                     x-ref="mainInput"
                     class="answer-input"
                     inputmode="decimal"
                     :disabled="submitted"
                     @keyup.enter="checkAnswer()">
            </div>
          </div>
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
            <button type="button" class="pad-btn pad-enter-full" @click="checkAnswer()" :disabled="submitted || !answer">Check ↵</button>
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
            <a href="/practice/dec-subtract" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          justify-content: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .vertical-problem {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: monospace;
        }
        .number {
          font-size: 2.5rem;
          font-weight: 600;
          padding: 0.25rem 0;
        }
        .problem-line {
          width: 100%;
          height: 4px;
          background: var(--color-text);
          margin: 0.5rem 0;
        }
        .answer-row {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .answer-input {
          width: 120px;
          padding: 0.5rem;
          font-size: 2.5rem;
          font-family: monospace;
          text-align: right;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          background: transparent;
        }
        .answer-input:focus {
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
        .pad-enter-full {
          width: 100%;
          margin-top: 0.5rem;
          background: var(--color-primary);
          color: white;
          height: 45px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
        }
      </style>
      
      <script>
        function subtractDecimalsExercise() {
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
