import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ExpandedFormParams {
  number: number;
  hundreds: number;
  tens: number;
  ones: number;
  questionType: 'expand' | 'compose';
}

export const expandedFormExercise: Exercise = {
  id: "place-expanded",
  topic: "place-value",
  title: "Expanded Form",
  description: "Write numbers in expanded form and compose numbers",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const hundreds = randomInt(1, 9, random);
    const tens = randomInt(0, 9, random);
    const ones = randomInt(0, 9, random);
    const number = hundreds * 100 + tens * 10 + ones;
    
    const questionType = random() > 0.5 ? 'expand' : 'compose';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, hundreds, tens, ones, questionType } as unknown as Record<string, unknown>,
      correctAnswer: number,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ExpandedFormParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.number) {
      const expanded = `${params.hundreds} × 100 + ${params.tens} × 10 + ${params.ones} × 1`;
      return { correct: true, feedback: `Correct! ${params.number} = ${expanded} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Remember: hundreds place × 100 + tens place × 10 + ones place × 1` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ExpandedFormParams;
    
    const prompt = params.questionType === 'compose'
      ? `<p class="expanded-form">${params.hundreds} × 100 + ${params.tens} × 10 + ${params.ones} × 1 = <span class="missing">?</span></p>`
      : `<p class="standard-form">${params.number} = <span class="missing">?</span> × 100 + <span class="missing">?</span> × 10 + <span class="missing">?</span></p>`;
    
    const answerLabel = params.questionType === 'compose' 
      ? 'What number does this equal?' 
      : 'What is the standard form?';
    
    return `
      <div class="exercise-container" x-data="expandedFormExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>${params.questionType === 'compose' ? 'Write the Number' : 'Expanded Form'}</h2>
          <p class="exercise-hint">${answerLabel}</p>
        </div>
        
        <div class="form-display">
          ${prompt}
        </div>
        
        <div class="place-value-visual">
          <div class="pv-column">
            <span class="pv-label">Hundreds</span>
            <div class="pv-blocks hundreds">
              ${Array(params.hundreds).fill('<span class="block hundred">100</span>').join('')}
            </div>
          </div>
          <div class="pv-column">
            <span class="pv-label">Tens</span>
            <div class="pv-blocks tens">
              ${Array(params.tens).fill('<span class="block ten">10</span>').join('')}
            </div>
          </div>
          <div class="pv-column">
            <span class="pv-label">Ones</span>
            <div class="pv-blocks ones">
              ${Array(params.ones).fill('<span class="block one">1</span>').join('')}
            </div>
          </div>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="999"
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/place-expanded" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .form-display {
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
          text-align: center;
        }
        .expanded-form, .standard-form {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        .missing {
          display: inline-block;
          width: 40px;
          height: 40px;
          line-height: 40px;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          color: var(--color-primary);
        }
        .place-value-visual {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          padding: 1rem;
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .pv-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 80px;
        }
        .pv-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }
        .pv-blocks {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          justify-content: center;
          min-height: 30px;
        }
        .block {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          font-weight: 600;
          color: white;
          border-radius: 2px;
        }
        .block.hundred {
          width: 30px;
          height: 30px;
          background: #ef4444;
        }
        .block.ten {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          font-size: 0.5rem;
        }
        .block.one {
          width: 14px;
          height: 14px;
          background: #22c55e;
          font-size: 0.4rem;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
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
        function expandedFormExercise() {
          return {
            answer: '',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
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
            }
          };
        }
      </script>
    `;
  },
};
