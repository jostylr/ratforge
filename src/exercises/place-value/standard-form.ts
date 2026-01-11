import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface StandardFormParams {
  number: number;
  expandedForm: string;
  wordForm: string;
  questionType: 'toStandard' | 'toExpanded' | 'toWord';
  answer: string | number;
}

function numberToWords(n: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  
  if (n < 10) return ones[n]!;
  if (n < 20) return teens[n - 10]!;
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return tens[t] + (o > 0 ? '-' + ones[o] : '');
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const remainder = n % 100;
    return ones[h] + ' hundred' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  }
  const th = Math.floor(n / 1000);
  const remainder = n % 1000;
  return numberToWords(th) + ' thousand' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
}

function numberToExpanded(n: number): string {
  const parts: string[] = [];
  if (n >= 1000) {
    const th = Math.floor(n / 1000) * 1000;
    parts.push(th.toString());
    n = n % 1000;
  }
  if (n >= 100) {
    const h = Math.floor(n / 100) * 100;
    parts.push(h.toString());
    n = n % 100;
  }
  if (n >= 10) {
    const t = Math.floor(n / 10) * 10;
    parts.push(t.toString());
    n = n % 10;
  }
  if (n > 0) {
    parts.push(n.toString());
  }
  return parts.join(' + ');
}

export const standardFormExercise: Exercise = {
  id: "place-standard",
  topic: "place-value",
  title: "Standard Form",
  description: "Convert between standard, expanded, and word form",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate a number between 100 and 9999
    const number = randomInt(100, 2000, random);
    const expandedForm = numberToExpanded(number);
    const wordForm = numberToWords(number);
    
    const questionTypes: ('toStandard' | 'toExpanded' | 'toWord')[] = ['toStandard', 'toExpanded', 'toWord'];
    const questionType = questionTypes[randomInt(0, 2, random)]!;
    
    let answer: string | number;
    if (questionType === 'toStandard') {
      answer = number;
    } else if (questionType === 'toExpanded') {
      answer = expandedForm;
    } else {
      answer = wordForm;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, expandedForm, wordForm, questionType, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as StandardFormParams;
    
    if (params.questionType === 'toStandard') {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer).replace(/,/g, ''), 10);
      if (answerNum === params.number) {
        return { correct: true, feedback: `Correct! ${params.expandedForm} = ${params.number} 🎉` };
      }
    } else {
      const answerStr = String(answer).toLowerCase().trim().replace(/\s+/g, ' ');
      const correctStr = String(params.answer).toLowerCase().trim().replace(/\s+/g, ' ');
      if (answerStr === correctStr || answerStr.replace(/-/g, ' ') === correctStr.replace(/-/g, ' ')) {
        return { correct: true, feedback: `Correct! 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Think about the place value of each digit.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as StandardFormParams;
    
    let questionText = '';
    let showValue = '';
    if (params.questionType === 'toStandard') {
      questionText = 'Write this number in standard form:';
      showValue = params.expandedForm;
    } else if (params.questionType === 'toExpanded') {
      questionText = 'Write this number in expanded form:';
      showValue = params.number.toLocaleString();
    } else {
      questionText = 'Write this number in word form:';
      showValue = params.number.toLocaleString();
    }
    
    return `
      <div class="exercise-container" x-data="standardFormExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Number Forms</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="number-display">
          <span class="show-value">${showValue}</span>
        </div>
        
        ${params.questionType === 'toStandard' ? `
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
        ` : `
        <div class="answer-section">
          <input type="text" 
                 x-model="answer" 
                 x-ref="mainInput"
                 class="answer-input wide"
                 placeholder="${params.questionType === 'toExpanded' ? 'e.g., 400 + 50 + 3' : 'e.g., four hundred fifty-three'}"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        `}

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
            <a href="/practice/place-standard" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .show-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 150px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input.wide {
          width: 100%;
          max-width: 400px;
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
        function standardFormExercise() {
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
