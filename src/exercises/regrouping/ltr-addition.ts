import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface LTRAdditionParams {
  num1: number;
  num2: number;
  sum: number;
  tensDigit1: number;
  onesDigit1: number;
  tensDigit2: number;
  onesDigit2: number;
  needsCarry: boolean;
}

export const ltrAdditionExercise: Exercise = {
  id: "regrouping-ltr-add",
  topic: "regrouping",
  title: "Left-to-Right Addition",
  description: "Abacus-style addition with carrying from left to right",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate two 2-digit numbers
    const num1 = randomInt(12, 89, random);
    const num2 = randomInt(12, 99 - Math.floor(num1 / 10) * 10, random);
    const sum = num1 + num2;
    
    const tensDigit1 = Math.floor(num1 / 10);
    const onesDigit1 = num1 % 10;
    const tensDigit2 = Math.floor(num2 / 10);
    const onesDigit2 = num2 % 10;
    
    const needsCarry = onesDigit1 + onesDigit2 >= 10;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        num1, num2, sum,
        tensDigit1, onesDigit1, tensDigit2, onesDigit2,
        needsCarry
      } as unknown as Record<string, unknown>,
      correctAnswer: sum,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as LTRAdditionParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.sum) {
      return { correct: true, feedback: `Excellent! ${params.num1} + ${params.num2} = ${params.sum} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try the left-to-right method step by step.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as LTRAdditionParams;
    
    const tensSum = params.tensDigit1 + params.tensDigit2;
    const onesSum = params.onesDigit1 + params.onesDigit2;
    const complement = 10 - params.onesDigit2;
    
    return `
      <div class="exercise-container" x-data="ltrAddition()">
        <div class="exercise-prompt">
          <h2>${params.num1} + ${params.num2} = ?</h2>
        </div>
        
        <div class="method-guide">
          <h3>Left-to-Right Method</h3>
          <div class="steps">
            <div class="step" :class="{ active: currentStep === 1, done: currentStep > 1 }">
              <span class="step-num">1</span>
              <span>Tens: ${params.tensDigit1}0 + ${params.tensDigit2}0 = ${tensSum}0</span>
            </div>
            <div class="step" :class="{ active: currentStep === 2, done: currentStep > 2 }">
              <span class="step-num">2</span>
              <span>Ones: ${params.onesDigit1} + ${params.onesDigit2} = ${onesSum} ${params.needsCarry ? '(≥10, need carry!)' : ''}</span>
            </div>
            ${params.needsCarry ? `
            <div class="step carry-step" :class="{ active: currentStep === 3, done: currentStep > 3 }">
              <span class="step-num">3</span>
              <span>Carry: complement of ${params.onesDigit2} is ${complement}, so ${params.onesDigit1} - ${complement} = ${params.onesDigit1 - complement + 10}</span>
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
                     class="digit-input">
            </div>
            <div class="carry-indicator" x-show="showCarry">
              <button type="button" 
                      class="carry-btn" 
                      :class="{ active: carryPressed }"
                      @click="toggleCarry()"
                      :disabled="submitted">
                ⬆️ Carry
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
          <p class="keyboard-hint">Type tens digit, press Space if carrying, then type ones digit</p>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct">
              Try Again
            </button>
            <a href="/practice/regrouping-ltr-add" class="btn btn-primary" x-show="correct">
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
          background: linear-gradient(135deg, #fff7ed, #fef3c7);
          border: 2px solid #f59e0b;
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
          background: rgba(245, 158, 11, 0.2);
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
        .carry-step {
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
        .carry-indicator {
          margin-bottom: 0.5rem;
        }
        .carry-btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
        }
        .carry-btn.active {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }
        .keyboard-hint {
          margin-top: 0.75rem;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
      </style>
      
      <script>
        function ltrAddition() {
          return {
            tensInput: '',
            onesInput: '',
            carryPressed: false,
            showCarry: false,
            currentStep: 1,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            onTensInput() {
              if (this.tensInput) {
                this.currentStep = 2;
                this.showCarry = true;
                this.$nextTick(() => {
                  this.$refs.onesInput?.focus();
                });
              }
            },
            
            toggleCarry() {
              this.carryPressed = !this.carryPressed;
              if (this.carryPressed) {
                this.currentStep = 3;
                // Increment tens by 1
                const t = parseInt(this.tensInput) || 0;
                this.tensInput = String(t + 1);
              }
            },
            
            init() {
              document.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && this.showCarry && !this.submitted) {
                  e.preventDefault();
                  this.toggleCarry();
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
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.tensInput = '';
              this.onesInput = '';
              this.carryPressed = false;
              this.showCarry = false;
              this.currentStep = 1;
            }
          };
        }
      </script>
    `;
  },
};
