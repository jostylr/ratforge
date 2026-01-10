import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface LTRSubtractionParams {
  num1: number;
  num2: number;
  difference: number;
  tensDigit1: number;
  onesDigit1: number;
  tensDigit2: number;
  onesDigit2: number;
  needsBorrow: boolean;
}

export const ltrSubtractionExercise: Exercise = {
  id: "regrouping-ltr-sub",
  topic: "regrouping",
  title: "Left-to-Right Subtraction",
  description: "Abacus-style subtraction with borrowing from left to right",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate two 2-digit numbers where num1 > num2
    const num1 = randomInt(23, 99, random);
    const num2 = randomInt(11, num1 - 5, random);
    const difference = num1 - num2;
    
    const tensDigit1 = Math.floor(num1 / 10);
    const onesDigit1 = num1 % 10;
    const tensDigit2 = Math.floor(num2 / 10);
    const onesDigit2 = num2 % 10;
    
    const needsBorrow = onesDigit1 < onesDigit2;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        num1, num2, difference,
        tensDigit1, onesDigit1, tensDigit2, onesDigit2,
        needsBorrow
      } as unknown as Record<string, unknown>,
      correctAnswer: difference,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as LTRSubtractionParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.difference) {
      return { correct: true, feedback: `Excellent! ${params.num1} - ${params.num2} = ${params.difference} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try the left-to-right method step by step.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as LTRSubtractionParams;
    
    const tensDiff = params.tensDigit1 - params.tensDigit2;
    const complement = 10 - params.onesDigit2;
    const onesResult = params.needsBorrow ? params.onesDigit1 + complement : params.onesDigit1 - params.onesDigit2;
    
    return `
      <div class="exercise-container" x-data="ltrSubtraction()">
        <div class="exercise-prompt">
          <h2>${params.num1} - ${params.num2} = ?</h2>
        </div>
        
        <div class="method-guide">
          <h3>Left-to-Right Subtraction</h3>
          <div class="steps">
            <div class="step" :class="{ active: currentStep === 1, done: currentStep > 1 }">
              <span class="step-num">1</span>
              <span>Tens: ${params.tensDigit1}0 - ${params.tensDigit2}0 = ${tensDiff}0</span>
            </div>
            <div class="step" :class="{ active: currentStep === 2, done: currentStep > 2 }">
              <span class="step-num">2</span>
              <span>Ones: ${params.onesDigit1} - ${params.onesDigit2} ${params.needsBorrow ? '(need to borrow!)' : `= ${onesResult}`}</span>
            </div>
            ${params.needsBorrow ? `
            <div class="step borrow-step" :class="{ active: currentStep === 3, done: currentStep > 3 }">
              <span class="step-num">3</span>
              <span>Borrow: complement of ${params.onesDigit2} is ${complement}, so ${params.onesDigit1} + ${complement} = ${onesResult}</span>
            </div>
            ` : ''}
          </div>
        </div>
        
        <div class="input-area">
          <div class="digit-entry">
            <div class="digit-box">
              <label>Tens</label>
              <input type="text" 
                     maxlength="1" 
                     x-model="tensInput"
                     @input="onTensInput()"
                     :disabled="submitted"
                     class="digit-input"
                     autofocus>
            </div>
            <div class="borrow-indicator" x-show="showBorrow">
              <button type="button" 
                      class="borrow-btn" 
                      :class="{ active: borrowPressed }"
                      @click="toggleBorrow()"
                      :disabled="submitted">
                ⬇️ Borrow (x)
              </button>
            </div>
            <div class="digit-box">
              <label>Ones</label>
              <input type="text" 
                     maxlength="1" 
                     x-model="onesInput"
                     :disabled="submitted"
                     class="digit-input"
                     x-ref="onesInput">
            </div>
          </div>
          <p class="keyboard-hint">Type tens digit, press X if borrowing, then type ones digit</p>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !tensInput || !onesInput">
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
            <a href="/practice/regrouping-ltr-sub" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .method-guide {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          border: 2px solid #3b82f6;
          border-radius: var(--radius-lg);
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
        }
        .method-guide h3 {
          margin: 0 0 0.75rem;
          font-size: 1rem;
        }
        .steps {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          opacity: 0.5;
          transition: all 0.3s;
        }
        .step.active {
          opacity: 1;
          background: rgba(59, 130, 246, 0.2);
        }
        .step.done {
          opacity: 1;
        }
        .step-num {
          width: 24px;
          height: 24px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .borrow-step {
          background: rgba(239, 68, 68, 0.1);
          border: 1px dashed #ef4444;
        }
        .input-area {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .digit-entry {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 1rem;
        }
        .digit-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .digit-box label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-bottom: 0.25rem;
        }
        .digit-input {
          width: 60px;
          height: 60px;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .digit-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .borrow-indicator {
          margin-bottom: 0.5rem;
        }
        .borrow-btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
        }
        .borrow-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        .keyboard-hint {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
      </style>
      
      <script>
        function ltrSubtraction() {
          return {
            tensInput: '',
            onesInput: '',
            borrowPressed: false,
            showBorrow: false,
            currentStep: 1,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            onTensInput() {
              if (this.tensInput) {
                this.currentStep = 2;
                this.showBorrow = true;
                this.$nextTick(() => {
                  this.$refs.onesInput?.focus();
                });
              }
            },
            
            toggleBorrow() {
              this.borrowPressed = !this.borrowPressed;
              if (this.borrowPressed) {
                this.currentStep = 3;
                // Decrement tens by 1
                const t = parseInt(this.tensInput) || 0;
                this.tensInput = String(Math.max(0, t - 1));
              }
            },
            
            init() {
              document.addEventListener('keydown', (e) => {
                if ((e.key === 'x' || e.key === 'X') && this.showBorrow && !this.submitted) {
                  e.preventDefault();
                  this.toggleBorrow();
                }
              });
            },
            
            async checkAnswer() {
              const answer = parseInt(this.tensInput + this.onesInput);
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: answer
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
              this.tensInput = '';
              this.onesInput = '';
              this.borrowPressed = false;
              this.showBorrow = false;
              this.currentStep = 1;
            }
          };
        }
      </script>
    `;
  },
};
