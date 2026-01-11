import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface LongDivisionParams {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
}

export const longDivisionExercise: Exercise = {
  id: "div-long",
  topic: "division",
  title: "Long Division",
  description: "Divide larger numbers step by step",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const divisor = randomInt(2, 9, random);
    const quotient = randomInt(10, 25, random);
    const remainder = randomInt(0, divisor - 1, random);
    const dividend = divisor * quotient + remainder;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { dividend, divisor, quotient, remainder } as unknown as Record<string, unknown>,
      correctAnswer: remainder > 0 ? `${quotient}r${remainder}` : quotient,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as LongDivisionParams;
    const answerStr = String(answer).toLowerCase().replace(/\s+/g, '');
    
    // Parse answer
    let answerQuotient: number, answerRemainder = 0;
    
    if (answerStr.includes('r')) {
      const parts = answerStr.split('r');
      answerQuotient = parseInt(parts[0]!, 10);
      answerRemainder = parseInt(parts[1]!, 10);
    } else {
      answerQuotient = parseInt(answerStr, 10);
    }
    
    if (answerQuotient === params.quotient && answerRemainder === params.remainder) {
      const resultStr = params.remainder > 0 
        ? `${params.quotient} R ${params.remainder}`
        : `${params.quotient}`;
      return { correct: true, feedback: `Correct! ${params.dividend} ÷ ${params.divisor} = ${resultStr} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. How many times does ${params.divisor} go into ${params.dividend}?` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as LongDivisionParams;
    
    return `
      <div class="exercise-container" x-data="longDivisionExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Long Division</h2>
          <p class="exercise-hint">${params.dividend} ÷ ${params.divisor} = ?</p>
        </div>
        
        <div class="division-display">
          <div class="division-symbol">
            <span class="divisor">${params.divisor}</span>
            <div class="division-house">
              <span class="dividend">${params.dividend}</span>
            </div>
          </div>
        </div>
        
        <div class="answer-section">
          <label>Quotient:</label>
          <input type="number" 
                 x-model="quotientAnswer" 
                 x-ref="mainInput"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="$refs.remainderInput?.focus()">
          
          <label>Remainder:</label>
          <input type="number" 
                 x-model="remainderAnswer" 
                 x-ref="remainderInput"
                 class="answer-input small"
                 placeholder="0"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
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
              <button type="button" class="pad-btn pad-special" @click="switchField()" :disabled="submitted">R</button>
            </div>
          </div>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !quotientAnswer">
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
            <a href="/practice/div-long" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .division-display {
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .division-symbol {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 2.5rem;
          font-weight: 600;
        }
        .divisor {
          margin-top: 0.5rem;
        }
        .division-house {
          position: relative;
          padding: 0.25rem 1rem;
          border-top: 4px solid var(--color-text);
          border-left: 4px solid var(--color-text);
          border-top-left-radius: 10px;
        }
        .dividend {
          color: var(--color-primary);
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .answer-section label {
          font-weight: 500;
          margin-left: 1rem;
        }
        .answer-section label:first-child {
          margin-left: 0;
        }
        .answer-input {
          width: 80px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input.small {
          width: 60px;
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
      </style>
      
      <script>
        function longDivisionExercise() {
          return {
            quotientAnswer: '',
            remainderAnswer: '',
            activeField: 'quotient',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            addDigit(d) {
              if (this.activeField === 'quotient') {
                this.quotientAnswer = (this.quotientAnswer || '') + d;
              } else {
                this.remainderAnswer = (this.remainderAnswer || '') + d;
              }
            },
            
            clearCurrent() {
              if (this.activeField === 'quotient') {
                this.quotientAnswer = '';
              } else {
                this.remainderAnswer = '';
              }
            },
            
            switchField() {
              this.activeField = this.activeField === 'quotient' ? 'remainder' : 'quotient';
              if (this.activeField === 'quotient') {
                this.$refs.mainInput?.focus();
              } else {
                this.$refs.remainderInput?.focus();
              }
            },
            
            async checkAnswer() {
              if (!this.quotientAnswer) return;
              
              let answer = this.quotientAnswer;
              if (this.remainderAnswer && parseInt(this.remainderAnswer) > 0) {
                answer += 'r' + this.remainderAnswer;
              }
              
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
              this.quotientAnswer = '';
              this.remainderAnswer = '';
              this.activeField = 'quotient';
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
