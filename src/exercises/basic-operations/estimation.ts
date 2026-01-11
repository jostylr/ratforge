import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface EstimationParams {
  num1: number;
  num2: number;
  operation: '+' | '-' | '×';
  roundedNum1: number;
  roundedNum2: number;
  estimate: number;
  exact: number;
}

export const estimationExercise: Exercise = {
  id: "basic-estimate",
  topic: "basic-operations",
  title: "Estimation",
  description: "Round numbers to estimate answers",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const operations: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const operation = operations[randomInt(0, 2, random)]!;
    
    let num1: number, num2: number, roundedNum1: number, roundedNum2: number, estimate: number, exact: number;
    
    if (operation === '×') {
      num1 = randomInt(12, 49, random);
      num2 = randomInt(3, 9, random);
      roundedNum1 = Math.round(num1 / 10) * 10;
      roundedNum2 = num2;
      estimate = roundedNum1 * roundedNum2;
      exact = num1 * num2;
    } else {
      num1 = randomInt(100, 500, random);
      num2 = randomInt(50, 300, random);
      if (operation === '-' && num2 > num1) {
        [num1, num2] = [num2, num1];
      }
      roundedNum1 = Math.round(num1 / 100) * 100;
      roundedNum2 = Math.round(num2 / 100) * 100;
      estimate = operation === '+' ? roundedNum1 + roundedNum2 : roundedNum1 - roundedNum2;
      exact = operation === '+' ? num1 + num2 : num1 - num2;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, operation, roundedNum1, roundedNum2, estimate, exact } as unknown as Record<string, unknown>,
      correctAnswer: estimate,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as EstimationParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    // Accept the exact estimate or close estimates
    if (answerNum === params.estimate) {
      return { correct: true, feedback: `Correct! ${params.roundedNum1} ${params.operation} ${params.roundedNum2} ≈ ${params.estimate} 🎉` };
    }
    
    // Accept if within 10% of the exact answer as a reasonable estimate
    if (Math.abs(answerNum - params.exact) < params.exact * 0.1) {
      return { correct: true, feedback: `Good estimate! The exact answer is ${params.exact}. 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try rounding to make the math easier.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as EstimationParams;
    
    return `
      <div class="exercise-container" x-data="estimationExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Estimation</h2>
          <p class="exercise-hint">Round to estimate the answer</p>
        </div>
        
        <div class="problem-display">
          <span class="number">${params.num1}</span>
          <span class="operator">${params.operation}</span>
          <span class="number">${params.num2}</span>
          <span class="approx">≈</span>
          <span class="question">?</span>
        </div>
        
        <div class="hint-box">
          <p><strong>Tip:</strong> Round ${params.num1} to ${params.roundedNum1} and ${params.num2} to ${params.roundedNum2}</p>
        </div>
        
        <div class="answer-section">
          <label>Estimate:</label>
          <input type="number" 
                 x-model="answer" 
                 x-ref="mainInput"
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
            <a href="/practice/basic-estimate" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
        .number {
          font-size: 2rem;
          font-weight: 700;
        }
        .operator {
          font-size: 1.75rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .approx {
          font-size: 2rem;
          color: var(--color-primary);
        }
        .question {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
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
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .answer-section label { font-weight: 500; }
        .answer-input {
          width: 120px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus { outline: none; border-color: var(--color-primary); }
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
        function estimationExercise() {
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
