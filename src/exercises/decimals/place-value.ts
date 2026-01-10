import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface DecimalPlaceValueParams {
  number: number;
  questionType: 'identify' | 'compose';
  targetPlace: 'ones' | 'tenths' | 'hundredths';
  correctAnswer: number;
}

export const decimalPlaceValueExercise: Exercise = {
  id: "dec-place-value",
  topic: "decimals",
  title: "Decimal Place Value",
  description: "Understand place value in decimal numbers",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate a decimal number with 1-2 decimal places
    const ones = randomInt(0, 9, random);
    const tenths = randomInt(0, 9, random);
    const hundredths = randomInt(0, 9, random);
    const number = ones + tenths / 10 + hundredths / 100;
    
    const places: Array<'ones' | 'tenths' | 'hundredths'> = ['ones', 'tenths', 'hundredths'];
    const targetPlace = places[randomInt(0, places.length - 1, random)]!;
    
    let correctAnswer: number;
    switch (targetPlace) {
      case 'ones': correctAnswer = ones; break;
      case 'tenths': correctAnswer = tenths; break;
      case 'hundredths': correctAnswer = hundredths; break;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        number, 
        questionType: 'identify', 
        targetPlace, 
        correctAnswer 
      } as unknown as Record<string, unknown>,
      correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as DecimalPlaceValueParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.correctAnswer) {
      return { correct: true, feedback: `Correct! The digit in the ${params.targetPlace} place is ${params.correctAnswer}. 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look carefully at the ${params.targetPlace} place.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as DecimalPlaceValueParams;
    const numberStr = params.number.toFixed(2);
    
    return `
      <div class="exercise-container" x-data="decPlaceValueExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>What digit is in the ${params.targetPlace} place?</h2>
        </div>
        
        <div class="number-display">
          <div class="place-value-chart">
            <div class="place-column">
              <span class="place-label">Ones</span>
              <span class="digit ${params.targetPlace === 'ones' ? 'highlighted' : ''}">${numberStr[0]}</span>
            </div>
            <div class="decimal-point">.</div>
            <div class="place-column">
              <span class="place-label">Tenths</span>
              <span class="digit ${params.targetPlace === 'tenths' ? 'highlighted' : ''}">${numberStr[2]}</span>
            </div>
            <div class="place-column">
              <span class="place-label">Hundredths</span>
              <span class="digit ${params.targetPlace === 'hundredths' ? 'highlighted' : ''}">${numberStr[3]}</span>
            </div>
          </div>
          <div class="number-full">${numberStr}</div>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="9"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="answer = '7'" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="answer = '8'" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="answer = '9'" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="answer = '4'" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="answer = '5'" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="answer = '6'" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="answer = '1'" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="answer = '2'" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="answer = '3'" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="answer = ''" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="answer = '0'" :disabled="submitted">0</button>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/dec-place-value" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
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
          margin-bottom: 1.5rem;
        }
        .place-value-chart {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .place-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .place-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }
        .digit {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
        }
        .digit.highlighted {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .decimal-point {
          font-size: 2rem;
          font-weight: bold;
          padding-bottom: 0.25rem;
        }
        .number-full {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 80px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
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
        function decPlaceValueExercise() {
          return {
            answer: '',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
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
            }
          };
        }
      </script>
    `;
  },
};
