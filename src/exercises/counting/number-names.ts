import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface NumberNamesParams {
  number: number;
  numberWord: string;
  questionType: 'toWord' | 'toNumber';
}

const numberWords: Record<number, string> = {
  0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
  5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
  10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen',
  15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen',
  20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty',
  60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety'
};

function numberToWord(n: number): string {
  if (n <= 20) return numberWords[n]!;
  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    return ones === 0 ? numberWords[tens]! : `${numberWords[tens]}-${numberWords[ones]}`;
  }
  return String(n);
}

export const numberNamesExercise: Exercise = {
  id: "counting-names",
  topic: "counting",
  title: "Number Names",
  description: "Match numbers to their word names",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate a number 0-99
    const number = randomInt(0, 99, random);
    const numberWord = numberToWord(number);
    const questionType = random() > 0.5 ? 'toWord' : 'toNumber';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, numberWord, questionType } as unknown as Record<string, unknown>,
      correctAnswer: questionType === 'toWord' ? numberWord : number,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as NumberNamesParams;
    
    if (params.questionType === 'toWord') {
      const answerStr = String(answer).toLowerCase().trim().replace(/\s+/g, '-');
      const correctStr = params.numberWord.toLowerCase();
      if (answerStr === correctStr || answerStr.replace(/-/g, '') === correctStr.replace(/-/g, '')) {
        return { correct: true, feedback: `Correct! ${params.number} is "${params.numberWord}" 🎉` };
      }
    } else {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.number) {
        return { correct: true, feedback: `Correct! "${params.numberWord}" is ${params.number} 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Try again!` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as NumberNamesParams;
    const isToWord = params.questionType === 'toWord';
    
    return `
      <div class="exercise-container" x-data="numberNamesExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>${isToWord ? 'Write the Number Word' : 'Write the Number'}</h2>
        </div>
        
        <div class="number-display">
          ${isToWord ? `
            <span class="big-number">${params.number}</span>
            <p class="hint-text">Write this number as a word</p>
          ` : `
            <span class="big-word">"${params.numberWord}"</span>
            <p class="hint-text">Write this word as a number</p>
          `}
        </div>
        
        <div class="answer-section">
          <input type="${isToWord ? 'text' : 'number'}" 
                 x-model="answer" 
                 x-ref="mainInput"
                 class="answer-input ${isToWord ? 'text-input' : ''}"
                 placeholder="${isToWord ? 'Type the word...' : ''}"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        ${!isToWord ? `
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
        ` : ''}

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
            <a href="/practice/counting-names" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          margin-bottom: 1.5rem;
        }
        .big-number {
          font-size: 5rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .big-word {
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .hint-text {
          margin: 1rem 0 0;
          color: var(--color-text-muted);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 100px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input.text-input {
          width: 200px;
          font-size: 1.25rem;
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
        .pad-enter { background: var(--color-primary); color: white; }
      </style>
      
      <script>
        function numberNamesExercise() {
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
                  answer: this.answer
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
