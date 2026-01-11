import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface RoundingParams {
  number: number;
  roundTo: 'tens' | 'hundreds';
  answer: number;
}

export const roundingExercise: Exercise = {
  id: "place-rounding",
  topic: "place-value",
  title: "Rounding Numbers",
  description: "Round numbers to the nearest ten or hundred",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const roundTo = random() > 0.5 ? 'tens' : 'hundreds';
    let number: number, answer: number;
    
    if (roundTo === 'tens') {
      number = randomInt(12, 98, random);
      answer = Math.round(number / 10) * 10;
    } else {
      number = randomInt(120, 980, random);
      answer = Math.round(number / 100) * 100;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, roundTo, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as RoundingParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.answer) {
      return { correct: true, feedback: `Correct! ${params.number} rounds to ${params.answer} 🎉` };
    }
    
    const digit = params.roundTo === 'tens' ? params.number % 10 : Math.floor((params.number % 100) / 10) * 10;
    const hint = digit >= 5 ? 'rounds up' : 'rounds down';
    return { correct: false, feedback: `Not quite. Look at the ${params.roundTo === 'tens' ? 'ones' : 'tens'} digit - ${digit >= 50 || (params.roundTo === 'tens' && digit >= 5) ? '5 or more' : 'less than 5'} ${hint}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as RoundingParams;
    
    return `
      <div class="exercise-container" x-data="roundingExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Round to the nearest ${params.roundTo === 'tens' ? 'ten' : 'hundred'}</h2>
          <p class="exercise-hint">Look at the ${params.roundTo === 'tens' ? 'ones' : 'tens'} digit. 5 or more? Round up. Less than 5? Round down.</p>
        </div>
        
        <div class="number-display">
          <span class="big-number">${params.number}</span>
        </div>
        
        <div class="number-line">
          ${params.roundTo === 'tens' ? `
            <div class="line-container">
              <span class="endpoint">${Math.floor(params.number / 10) * 10}</span>
              <div class="line">
                <div class="marker" style="left: ${(params.number % 10) * 10}%"></div>
              </div>
              <span class="endpoint">${Math.ceil(params.number / 10) * 10}</span>
            </div>
          ` : `
            <div class="line-container">
              <span class="endpoint">${Math.floor(params.number / 100) * 100}</span>
              <div class="line">
                <div class="marker" style="left: ${(params.number % 100)}%"></div>
              </div>
              <span class="endpoint">${Math.ceil(params.number / 100) * 100}</span>
            </div>
          `}
        </div>
        
        <div class="answer-section">
          <label>Rounds to:</label>
          <input type="number" 
                 x-model="answer" 
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
            <a href="/practice/place-rounding" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          margin-bottom: 1rem;
        }
        .big-number {
          font-size: 4rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .number-line {
          padding: 1.5rem 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .line-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .endpoint {
          font-size: 1.25rem;
          font-weight: 600;
          min-width: 50px;
          text-align: center;
        }
        .line {
          flex: 1;
          height: 4px;
          background: var(--color-border);
          border-radius: 2px;
          position: relative;
        }
        .marker {
          position: absolute;
          top: -8px;
          width: 20px;
          height: 20px;
          background: var(--color-primary);
          border-radius: 50%;
          transform: translateX(-50%);
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }
        .answer-input {
          width: 120px;
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
        function roundingExercise() {
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
              this.feedback = 'The answer was: ' + this.correctAnswer;
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
