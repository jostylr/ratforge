import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface LengthParams {
  objectName: string;
  objectEmoji: string;
  lengthInUnits: number;
  unit: 'inches' | 'centimeters';
  rulerMax: number;
}

const objects = [
  { name: 'pencil', emoji: '✏️' },
  { name: 'crayon', emoji: '🖍️' },
  { name: 'eraser', emoji: '🧽' },
  { name: 'paper clip', emoji: '📎' },
  { name: 'key', emoji: '🔑' },
  { name: 'leaf', emoji: '🍃' },
];

export const lengthExercise: Exercise = {
  id: "measure-length",
  topic: "measurement",
  title: "Measure Length",
  description: "Practice measuring objects with a ruler",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const objectIndex = randomInt(0, objects.length - 1, random);
    const object = objects[objectIndex]!;
    const unit = random() > 0.5 ? 'inches' : 'centimeters';
    const rulerMax = unit === 'inches' ? 6 : 15;
    const lengthInUnits = randomInt(1, rulerMax - 1, random);
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        objectName: object.name,
        objectEmoji: object.emoji,
        lengthInUnits,
        unit,
        rulerMax
      } as unknown as Record<string, unknown>,
      correctAnswer: lengthInUnits,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as LengthParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.lengthInUnits) {
      return { correct: true, feedback: `Correct! The ${params.objectName} is ${params.lengthInUnits} ${params.unit} long. 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Count the marks on the ruler carefully from 0 to where the ${params.objectName} ends.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as LengthParams;
    
    // Generate ruler marks
    const marks = [];
    for (let i = 0; i <= params.rulerMax; i++) {
      const isMajor = i % (params.unit === 'inches' ? 1 : 5) === 0;
      marks.push(`
        <div class="ruler-mark ${isMajor ? 'major' : 'minor'}">
          ${isMajor ? `<span class="mark-label">${i}</span>` : ''}
        </div>
      `);
    }
    
    // Calculate object width as percentage of ruler
    const objectWidthPercent = (params.lengthInUnits / params.rulerMax) * 100;
    
    return `
      <div class="exercise-container" x-data="lengthExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>How long is the ${params.objectName}?</h2>
          <p class="exercise-hint">Measure from 0 to the end of the object. Answer in ${params.unit}.</p>
        </div>
        
        <div class="measurement-area">
          <div class="object-to-measure" style="width: ${objectWidthPercent}%;">
            <span class="object-emoji">${params.objectEmoji}</span>
          </div>
          <div class="ruler">
            <div class="ruler-marks">
              ${marks.join('')}
            </div>
            <div class="ruler-unit">${params.unit}</div>
          </div>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="${params.rulerMax}"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="unit-label">${params.unit}</span>
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="answer = '7'" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="answer = '8'" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="answer = '9'" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="answer = '4'" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="answer = '5'" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="answer = '6'" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="answer = '1'" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="answer = '2'" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="answer = '3'" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="answer = ''" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="answer = '0'" :disabled="submitted">0</button>
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
            <a href="/practice/measure-length" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .measurement-area {
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .object-to-measure {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          margin-left: 0;
        }
        .object-emoji {
          font-size: 2.5rem;
        }
        .ruler {
          background: linear-gradient(to bottom, #f5deb3, #deb887);
          border: 2px solid #8b4513;
          border-radius: 4px;
          padding: 0.5rem 0;
          position: relative;
        }
        .ruler-marks {
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
        }
        .ruler-mark {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ruler-mark.major::before {
          content: '';
          width: 2px;
          height: 20px;
          background: #333;
        }
        .ruler-mark.minor::before {
          content: '';
          width: 1px;
          height: 10px;
          background: #666;
        }
        .mark-label {
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 2px;
        }
        .ruler-unit {
          position: absolute;
          right: 1rem;
          bottom: 0.25rem;
          font-size: 0.7rem;
          color: #666;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 80px;
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
        .unit-label {
          font-size: 1rem;
          color: var(--color-text-muted);
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
        function lengthExercise() {
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
