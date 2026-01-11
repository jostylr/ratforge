import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface OrdinalParams {
  position: number;
  ordinal: string;
  questionType: 'toOrdinal' | 'toNumber';
}

const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
                   'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 
                   'eighteenth', 'nineteenth', 'twentieth'];

const shortOrdinals = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th',
                        '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th'];

export const ordinalNumbersExercise: Exercise = {
  id: "counting-ordinal",
  topic: "counting",
  title: "Ordinal Numbers",
  description: "Learn position words like first, second, third",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const position = randomInt(1, 20, random);
    const ordinal = ordinals[position - 1]!;
    const questionType: 'toOrdinal' | 'toNumber' = randomInt(0, 1, random) === 0 ? 'toOrdinal' : 'toNumber';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { position, ordinal, questionType } as unknown as Record<string, unknown>,
      correctAnswer: questionType === 'toOrdinal' ? ordinal : position,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as OrdinalParams;
    
    if (params.questionType === 'toNumber') {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.position) {
        return { correct: true, feedback: `Correct! "${params.ordinal}" means position ${params.position}. 🎉` };
      }
    } else {
      const answerStr = String(answer).toLowerCase().trim();
      const shortForm = shortOrdinals[params.position - 1]?.toLowerCase();
      if (answerStr === params.ordinal || answerStr === shortForm) {
        return { correct: true, feedback: `Correct! Position ${params.position} is "${params.ordinal}". 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Try again!` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as OrdinalParams;
    
    const questionText = params.questionType === 'toNumber'
      ? `What position is "${params.ordinal}"?`
      : `What is the ordinal word for position ${params.position}?`;
    
    return `
      <div class="exercise-container" x-data="ordinalNumbersExercise()">
        <div class="exercise-prompt">
          <h2>Ordinal Numbers</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="visual-display">
          <div class="position-line">
            ${Array.from({length: 10}, (_, i) => `
              <div class="position-marker ${i + 1 === params.position && params.questionType === 'toNumber' ? 'highlighted' : ''}">
                ${i + 1}
              </div>
            `).join('')}
          </div>
        </div>
        
        ${params.questionType === 'toNumber' ? `
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 x-ref="mainInput"
                 class="answer-input"
                 min="1" max="20"
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
        <div class="options-grid">
          ${ordinals.slice(0, 10).map(ord => `
            <button type="button" class="option-btn" @click="selectAnswer('${ord}')" :class="{ selected: selectedAnswer === '${ord}' }" :disabled="submitted">
              ${ord}
            </button>
          `).join('')}
        </div>
        `}

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || ${params.questionType === 'toNumber' ? '!answer' : '!selectedAnswer'}">
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
            <a href="/practice/counting-ordinal" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .visual-display {
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        .position-line {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        .position-marker {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          font-weight: 600;
        }
        .position-marker.highlighted {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 80px;
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
        .options-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 0.5rem;
          font-size: 0.85rem;
          text-transform: capitalize;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
        function ordinalNumbersExercise() {
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
            
            selectAnswer(answer) {
              if (!this.submitted) {
                this.selectedAnswer = answer;
              }
            },
            
            async checkAnswer() {
              const answerValue = this.answer || this.selectedAnswer;
              if (!answerValue) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: answerValue
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
