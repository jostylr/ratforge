import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TensOnesParams {
  number: number;
  tens: number;
  ones: number;
  questionType: 'decompose' | 'compose';
}

export const tensOnesExercise: Exercise = {
  id: "basic-tens-ones",
  topic: "basic-operations",
  title: "Tens and Ones",
  description: "Break apart numbers into tens and ones",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const number = randomInt(11, 99, random);
    const tens = Math.floor(number / 10);
    const ones = number % 10;
    const questionType = random() > 0.5 ? 'decompose' : 'compose';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, tens, ones, questionType } as unknown as Record<string, unknown>,
      correctAnswer: questionType === 'decompose' ? tens : number,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TensOnesParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (params.questionType === 'decompose') {
      if (answerNum === params.tens) {
        return { correct: true, feedback: `Correct! ${params.number} = ${params.tens} tens and ${params.ones} ones 🎉` };
      }
    } else {
      if (answerNum === params.number) {
        return { correct: true, feedback: `Correct! ${params.tens} tens + ${params.ones} ones = ${params.number} 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Remember: 1 ten = 10 ones.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TensOnesParams;
    const isDecompose = params.questionType === 'decompose';
    
    return `
      <div class="exercise-container" x-data="tensOnesExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Tens and Ones</h2>
        </div>
        
        <div class="visual-blocks">
          ${isDecompose ? `
            <div class="number-display">${params.number}</div>
            <div class="blocks-visual">
              ${Array(params.tens).fill('<div class="ten-block"></div>').join('')}
              ${Array(params.ones).fill('<div class="one-block"></div>').join('')}
            </div>
          ` : `
            <div class="blocks-visual">
              ${Array(params.tens).fill('<div class="ten-block"></div>').join('')}
              <span class="plus">+</span>
              ${Array(params.ones).fill('<div class="one-block"></div>').join('')}
            </div>
          `}
        </div>
        
        <div class="question-box">
          ${isDecompose ? `
            <p>${params.number} = <input type="number" x-model="answer" class="answer-input inline" :disabled="submitted" @keyup.enter="checkAnswer()"> tens and ${params.ones} ones</p>
          ` : `
            <p>${params.tens} tens + ${params.ones} ones = <input type="number" x-model="answer" class="answer-input inline" :disabled="submitted" @keyup.enter="checkAnswer()"></p>
          `}
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
            <a href="/practice/basic-tens-ones" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .visual-blocks {
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .number-display {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }
        .blocks-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .ten-block {
          width: 20px;
          height: 80px;
          background: #3b82f6;
          border-radius: 4px;
        }
        .one-block {
          width: 20px;
          height: 20px;
          background: #22c55e;
          border-radius: 4px;
        }
        .plus {
          font-size: 2rem;
          font-weight: 600;
          margin: 0 1rem;
        }
        .question-box {
          text-align: center;
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .question-box p {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .answer-input.inline {
          width: 60px;
          padding: 0.25rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          background: transparent;
        }
        .answer-input:focus {
          outline: none;
          border-style: solid;
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
        function tensOnesExercise() {
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
