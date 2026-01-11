import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface PerimeterParams {
  shape: 'rectangle' | 'square';
  width: number;
  height: number;
  perimeter: number;
}

export const perimeterExercise: Exercise = {
  id: "geometry-perimeter",
  topic: "geometry",
  title: "Find the Perimeter",
  description: "Calculate the perimeter of shapes",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const shape = random() > 0.5 ? 'rectangle' : 'square';
    let width: number, height: number;
    
    if (shape === 'square') {
      width = height = randomInt(2, 8, random);
    } else {
      width = randomInt(3, 10, random);
      height = randomInt(2, 8, random);
      // Make sure it's not a square
      if (width === height) height = width + randomInt(1, 3, random);
    }
    
    const perimeter = 2 * (width + height);
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { shape, width, height, perimeter } as unknown as Record<string, unknown>,
      correctAnswer: perimeter,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as PerimeterParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.perimeter) {
      return { correct: true, feedback: `Correct! Perimeter = ${params.width} + ${params.height} + ${params.width} + ${params.height} = ${params.perimeter} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Add all four sides together.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as PerimeterParams;
    
    // Scale for visual display
    const scale = 20;
    const svgWidth = params.width * scale + 60;
    const svgHeight = params.height * scale + 60;
    const rectX = 30;
    const rectY = 30;
    const rectWidth = params.width * scale;
    const rectHeight = params.height * scale;
    
    return `
      <div class="exercise-container" x-data="perimeterExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Find the Perimeter</h2>
          <p class="exercise-hint">Add all sides together. Perimeter = sum of all sides</p>
        </div>
        
        <div class="shape-display">
          <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="shape-svg">
            <rect x="${rectX}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" 
                  fill="#e0f2fe" stroke="#3b82f6" stroke-width="3"/>
            <!-- Labels -->
            <text x="${rectX + rectWidth/2}" y="${rectY - 8}" text-anchor="middle" font-size="14" font-weight="600">${params.width}</text>
            <text x="${rectX + rectWidth/2}" y="${rectY + rectHeight + 20}" text-anchor="middle" font-size="14" font-weight="600">${params.width}</text>
            <text x="${rectX - 12}" y="${rectY + rectHeight/2}" text-anchor="middle" font-size="14" font-weight="600">${params.height}</text>
            <text x="${rectX + rectWidth + 12}" y="${rectY + rectHeight/2}" text-anchor="middle" font-size="14" font-weight="600">${params.height}</text>
          </svg>
          <p class="shape-name">${params.shape === 'square' ? 'Square' : 'Rectangle'}</p>
        </div>
        
        <div class="answer-section">
          <label>Perimeter = </label>
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="100"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="unit">units</span>
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
            <a href="/practice/geometry-perimeter" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .shape-display {
          text-align: center;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .shape-svg {
          max-width: 300px;
          max-height: 250px;
        }
        .shape-name {
          margin: 0.5rem 0 0;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1.25rem;
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
        .unit {
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
        function perimeterExercise() {
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
