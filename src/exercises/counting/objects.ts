import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ObjectCountParams {
  count: number;
  objectType: string;
  objectEmoji: string;
}

const objectTypes = [
  { name: 'apples', emoji: '🍎' },
  { name: 'stars', emoji: '⭐' },
  { name: 'hearts', emoji: '❤️' },
  { name: 'balls', emoji: '🔵' },
  { name: 'flowers', emoji: '🌸' },
  { name: 'fish', emoji: '🐟' },
  { name: 'butterflies', emoji: '🦋' },
  { name: 'birds', emoji: '🐦' },
];

export const countObjectsExercise: Exercise = {
  id: "counting-objects",
  topic: "counting",
  title: "Object Counting",
  description: "Count groups of objects accurately",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const count = randomInt(3, 15, random);
    const objType = objectTypes[randomInt(0, objectTypes.length - 1, random)]!;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        count, 
        objectType: objType.name,
        objectEmoji: objType.emoji
      } as unknown as Record<string, unknown>,
      correctAnswer: count,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ObjectCountParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.count) {
      return { correct: true, feedback: `Yes! There are exactly ${params.count} ${params.objectType}! 🎉` };
    }
    
    const diff = Math.abs(answerNum - params.count);
    if (diff === 1) {
      return { correct: false, feedback: "So close! Count one more time carefully." };
    }
    
    return { correct: false, feedback: `Not quite. Try counting each ${params.objectType.slice(0, -1)} one by one.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ObjectCountParams;
    
    let objects = '';
    for (let i = 0; i < params.count; i++) {
      objects += `<span class="count-object" data-index="${i}">${params.objectEmoji}</span>`;
    }
    
    return `
      <div class="exercise-container" x-data="countObjects()" x-init="init()">
        <div class="exercise-prompt">
          <h2>Count the ${params.objectType}!</h2>
          <p class="exercise-hint">Click each one as you count, then enter your answer.</p>
        </div>
        
        <div class="objects-area">
          <div class="objects-grid">
            ${objects}
          </div>
        </div>
        
        <div class="answer-section">
          <label>How many ${params.objectType} are there?</label>
          <div class="number-input-group">
            <input type="number" 
                   x-model="answer" 
                   x-ref="mainInput"
                   min="1" 
                   max="20" 
                   class="answer-input"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
          </div>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct">
              Try Again
            </button>
            <a href="/practice/counting-objects" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .objects-area {
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .objects-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          max-width: 400px;
          margin: 0 auto;
        }
        .count-object {
          font-size: 2.5rem;
          cursor: pointer;
          transition: transform 0.2s;
          user-select: none;
        }
        .count-object:hover {
          transform: scale(1.2);
        }
        .count-object.counted {
          opacity: 0.5;
          transform: scale(0.9);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .answer-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .number-input-group {
          display: flex;
          justify-content: center;
        }
        .answer-input {
          width: 100px;
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
        function countObjects() {
          return {
            answer: '',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            init() {
              this.$nextTick(() => this.$refs.mainInput?.focus());
              document.querySelectorAll('.count-object').forEach(obj => {
                obj.addEventListener('click', () => {
                  obj.classList.toggle('counted');
                });
              });
            },
            
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
                this.$nextTick(() => this.$refs.nextBtn?.focus());
              }
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              document.querySelectorAll('.count-object.counted').forEach(obj => {
                obj.classList.remove('counted');
              });
            }
          };
        }
      </script>
    `;
  },
};
