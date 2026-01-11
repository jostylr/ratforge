import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TimeConversionParams {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  answer: number;
}

const conversions: Record<string, Record<string, number>> = {
  'minutes': { 'seconds': 60, 'hours': 1/60 },
  'hours': { 'minutes': 60, 'days': 1/24 },
  'days': { 'hours': 24, 'weeks': 1/7 },
  'weeks': { 'days': 7 },
};

export const timeConversionExercise: Exercise = {
  id: "measure-time-convert",
  topic: "measurement",
  title: "Time Conversion",
  description: "Convert between time units",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Pick conversions that result in whole numbers
    const conversionTypes = [
      { from: 'minutes', to: 'seconds', mult: 60, values: [1, 2, 3, 5, 10] },
      { from: 'hours', to: 'minutes', mult: 60, values: [1, 2, 3, 4, 5] },
      { from: 'days', to: 'hours', mult: 24, values: [1, 2, 3, 4, 5] },
      { from: 'weeks', to: 'days', mult: 7, values: [1, 2, 3, 4] },
    ];
    
    const conv = conversionTypes[randomInt(0, conversionTypes.length - 1, random)]!;
    const fromValue = conv.values[randomInt(0, conv.values.length - 1, random)]!;
    const answer = fromValue * conv.mult;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { fromValue, fromUnit: conv.from, toUnit: conv.to, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TimeConversionParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.answer) {
      return { correct: true, feedback: `Correct! ${params.fromValue} ${params.fromUnit} = ${params.answer} ${params.toUnit} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Think about how many ${params.toUnit} are in 1 ${params.fromUnit.slice(0, -1)}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TimeConversionParams;
    
    return `
      <div class="exercise-container" x-data="timeConversionExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Time Conversion</h2>
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
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
            <span class="unit">${params.toUnit}</span>
          </div>
        </div>
        
        <div class="hint-box">
          <p><strong>Remember:</strong></p>
          <ul>
            <li>1 minute = 60 seconds</li>
            <li>1 hour = 60 minutes</li>
            <li>1 day = 24 hours</li>
            <li>1 week = 7 days</li>
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
            <a href="/practice/measure-time-convert" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          margin-bottom: 1rem;
        }
        .conversion-problem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 1.25rem;
        }
        .value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .unit { font-weight: 500; }
        .equals { font-size: 2rem; margin: 0 0.5rem; }
        .answer-input {
          width: 100px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus { outline: none; border-color: var(--color-primary); }
        .hint-box {
          padding: 1rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        .hint-box p { margin: 0 0 0.5rem; }
        .hint-box ul { margin: 0; padding-left: 1.25rem; }
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
        .pad-btn:hover:not(:disabled) { background: var(--color-primary); color: white; }
        .pad-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pad-special { background: var(--color-bg); }
        .pad-enter { background: var(--color-primary); color: white; }
      </style>
      
      <script>
        function timeConversionExercise() {
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
