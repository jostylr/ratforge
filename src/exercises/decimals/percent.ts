import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface PercentParams {
  percent: number;
  wholeNumber: number;
  answer: number;
  questionType: 'findPercent' | 'percentOf';
}

export const percentExercise: Exercise = {
  id: "dec-percent",
  topic: "decimals",
  title: "Percentages",
  description: "Find percentages of numbers",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Use easy percentages
    const percents = [10, 20, 25, 50, 75, 100];
    const percent = percents[randomInt(0, percents.length - 1, random)]!;
    
    // Generate whole number that works nicely
    const multiplier = randomInt(2, 10, random);
    const wholeNumber = percent === 25 || percent === 75 ? multiplier * 4 : multiplier * 10;
    
    const answer = (percent * wholeNumber) / 100;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { percent, wholeNumber, answer, questionType: 'percentOf' } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as PercentParams;
    const answerNum = typeof answer === "number" ? answer : parseFloat(String(answer));
    
    if (Math.abs(answerNum - params.answer) < 0.01) {
      return { correct: true, feedback: `Correct! ${params.percent}% of ${params.wholeNumber} = ${params.answer} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. ${params.percent}% means ${params.percent}/100.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as PercentParams;
    
    return `
      <div class="exercise-container" x-data="percentExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Percentages</h2>
          <p class="exercise-hint">What is ${params.percent}% of ${params.wholeNumber}?</p>
        </div>
        
        <div class="problem-display">
          <span class="percent">${params.percent}%</span>
          <span class="of-text">of</span>
          <span class="whole-number">${params.wholeNumber}</span>
          <span class="equals">=</span>
          <input type="number" 
                 x-model="answer" 
                 x-ref="mainInput"
                 step="0.01"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        <div class="hint-box">
          <p><strong>Tips:</strong> 10% = divide by 10 | 50% = divide by 2 | 25% = divide by 4</p>
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
            <a href="/practice/dec-percent" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          gap: 1rem;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .percent {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .of-text {
          font-size: 1.5rem;
          color: var(--color-text-muted);
        }
        .whole-number {
          font-size: 2.5rem;
          font-weight: 700;
        }
        .equals {
          font-size: 1.75rem;
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
        .hint-box {
          padding: 0.75rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .hint-box p { margin: 0; }
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
      </style>
      
      <script>
        function percentExercise() {
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
