import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface FactorsParams {
  number: number;
  factors: number[];
  questionType: 'list' | 'count' | 'checkFactor';
  checkValue?: number;
  isFactor?: boolean;
}

function getFactors(n: number): number[] {
  const factors: number[] = [];
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) factors.push(i);
  }
  return factors;
}

export const factorsExercise: Exercise = {
  id: "div-factors",
  topic: "division",
  title: "Factors",
  description: "Find factors of numbers",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const number = randomInt(12, 36, random);
    const factors = getFactors(number);
    
    const questionTypes: ('count' | 'checkFactor')[] = ['count', 'checkFactor'];
    const questionType = questionTypes[randomInt(0, 1, random)]!;
    
    let checkValue: number | undefined;
    let isFactor: boolean | undefined;
    let correctAnswer: number | string;
    
    if (questionType === 'count') {
      correctAnswer = factors.length;
    } else {
      checkValue = randomInt(2, 12, random);
      isFactor = number % checkValue === 0;
      correctAnswer = isFactor ? 'yes' : 'no';
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, factors, questionType, checkValue, isFactor } as unknown as Record<string, unknown>,
      correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as FactorsParams;
    
    if (params.questionType === 'count') {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.factors.length) {
        return { correct: true, feedback: `Correct! ${params.number} has ${params.factors.length} factors: ${params.factors.join(', ')} 🎉` };
      }
    } else {
      const answerStr = String(answer).toLowerCase().trim();
      const isYes = answerStr === 'yes' || answerStr === 'true' || answerStr === 'y';
      const isNo = answerStr === 'no' || answerStr === 'false' || answerStr === 'n';
      
      if ((params.isFactor && isYes) || (!params.isFactor && isNo)) {
        const reason = params.isFactor 
          ? `${params.number} ÷ ${params.checkValue} = ${params.number / params.checkValue!}`
          : `${params.number} ÷ ${params.checkValue} has a remainder`;
        return { correct: true, feedback: `Correct! ${reason} 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. A factor divides evenly with no remainder.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as FactorsParams;
    
    const isCount = params.questionType === 'count';
    
    return `
      <div class="exercise-container" x-data="factorsExercise()">
        <div class="exercise-prompt">
          <h2>Factors</h2>
          <p class="exercise-hint">${isCount 
            ? `How many factors does ${params.number} have?` 
            : `Is ${params.checkValue} a factor of ${params.number}?`}</p>
        </div>
        
        <div class="number-display">
          <span class="big-number">${params.number}</span>
        </div>
        
        <div class="hint-box">
          <p><strong>Tip:</strong> A factor is a number that divides evenly (no remainder)</p>
        </div>
        
        ${isCount ? `
        <div class="answer-section">
          <label>Number of factors:</label>
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
        ` : `
        <div class="options-row">
          <button type="button" class="option-btn" @click="selectAnswer('yes')" :class="{ selected: selectedAnswer === 'yes' }" :disabled="submitted">
            Yes
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('no')" :class="{ selected: selectedAnswer === 'no' }" :disabled="submitted">
            No
          </button>
        </div>
        `}

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || ${isCount ? '!answer' : '!selectedAnswer'}">
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
            <a href="/practice/div-factors" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          margin-bottom: 1rem;
        }
        .big-number {
          font-size: 4rem;
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
          width: 80px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus { outline: none; border-color: var(--color-primary); }
        .options-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 1rem 2rem;
          font-size: 1.25rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }
        .option-btn:hover:not(:disabled) { border-color: var(--color-primary); }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled { opacity: 0.6; cursor: not-allowed; }
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
        function factorsExercise() {
          return {
            answer: '',
            selectedAnswer: null,
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(ans) {
              if (!this.submitted) {
                this.selectedAnswer = ans;
              }
            },
            
            async checkAnswer() {
              const answerVal = this.answer || this.selectedAnswer;
              if (!answerVal) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: answerVal
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
              this.selectedAnswer = null;
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
