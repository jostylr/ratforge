import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MultiplesParams {
  baseNumber: number;
  questionType: 'next' | 'isMultiple' | 'nthMultiple';
  checkValue?: number;
  position?: number;
  answer: number | boolean;
}

export const multiplesExercise: Exercise = {
  id: "mult-multiples",
  topic: "multiplication",
  title: "Multiples",
  description: "Identify multiples of numbers",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const baseNumber = randomInt(2, 9, random);
    const questionTypes: ('next' | 'isMultiple' | 'nthMultiple')[] = ['next', 'isMultiple', 'nthMultiple'];
    const questionType = questionTypes[randomInt(0, 2, random)]!;
    
    let checkValue: number | undefined;
    let position: number | undefined;
    let answer: number | boolean;
    
    if (questionType === 'next') {
      const startMultiple = randomInt(2, 8, random);
      checkValue = baseNumber * startMultiple;
      answer = baseNumber * (startMultiple + 1);
    } else if (questionType === 'isMultiple') {
      const isActualMultiple = randomInt(0, 1, random) === 0;
      if (isActualMultiple) {
        checkValue = baseNumber * randomInt(2, 10, random);
      } else {
        checkValue = baseNumber * randomInt(2, 10, random) + randomInt(1, baseNumber - 1, random);
      }
      answer = checkValue % baseNumber === 0;
    } else {
      position = randomInt(3, 10, random);
      answer = baseNumber * position;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { baseNumber, questionType, checkValue, position, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MultiplesParams;
    
    if (params.questionType === 'isMultiple') {
      const answerStr = String(answer).toLowerCase().trim();
      const isYes = answerStr === 'yes' || answerStr === 'true' || answerStr === 'y';
      const isNo = answerStr === 'no' || answerStr === 'false' || answerStr === 'n';
      
      if ((params.answer === true && isYes) || (params.answer === false && isNo)) {
        return { correct: true, feedback: `Correct! ${params.checkValue} ${params.answer ? 'is' : 'is not'} a multiple of ${params.baseNumber} 🎉` };
      }
    } else {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.answer) {
        return { correct: true, feedback: `Correct! 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Multiples are found by multiplying: ${params.baseNumber} × 1, ${params.baseNumber} × 2, ${params.baseNumber} × 3...` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MultiplesParams;
    
    let questionText = '';
    if (params.questionType === 'next') {
      questionText = `What is the next multiple of ${params.baseNumber} after ${params.checkValue}?`;
    } else if (params.questionType === 'isMultiple') {
      questionText = `Is ${params.checkValue} a multiple of ${params.baseNumber}?`;
    } else {
      questionText = `What is the ${params.position}${params.position === 3 ? 'rd' : 'th'} multiple of ${params.baseNumber}?`;
    }
    
    const isYesNo = params.questionType === 'isMultiple';
    
    return `
      <div class="exercise-container" x-data="multiplesExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Multiples</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="multiples-display">
          <p>First few multiples of ${params.baseNumber}:</p>
          <p class="multiples-list">${[1,2,3,4,5].map(n => params.baseNumber * n).join(', ')}...</p>
        </div>
        
        ${isYesNo ? `
        <div class="options-row">
          <button type="button" class="option-btn" @click="selectAnswer('yes')" :class="{ selected: selectedAnswer === 'yes' }" :disabled="submitted">
            Yes
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('no')" :class="{ selected: selectedAnswer === 'no' }" :disabled="submitted">
            No
          </button>
        </div>
        ` : `
        <div class="answer-section">
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
        `}

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || ${isYesNo ? '!selectedAnswer' : '!answer'}">
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
            <a href="/practice/mult-multiples" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .multiples-display {
          text-align: center;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .multiples-display p { margin: 0.25rem 0; }
        .multiples-list {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-primary);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 100px;
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
        function multiplesExercise() {
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
