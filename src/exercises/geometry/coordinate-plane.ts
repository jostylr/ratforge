import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface CoordinatePlaneParams {
  x: number;
  y: number;
  questionType: 'identify' | 'plot';
}

export const coordinatePlaneExercise: Exercise = {
  id: "geometry-coords",
  topic: "geometry",
  title: "Coordinate Plane",
  description: "Plot and identify points on a coordinate grid",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const x = randomInt(0, 10, random);
    const y = randomInt(0, 10, random);
    const questionType: 'identify' | 'plot' = randomInt(0, 1, random) === 0 ? 'identify' : 'plot';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { x, y, questionType } as unknown as Record<string, unknown>,
      correctAnswer: `(${x},${y})`,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as CoordinatePlaneParams;
    const answerStr = String(answer).replace(/\s+/g, '');
    
    // Parse coordinate answer
    const match = answerStr.match(/\(?(\d+),(\d+)\)?/);
    if (match) {
      const ansX = parseInt(match[1]!, 10);
      const ansY = parseInt(match[2]!, 10);
      
      if (ansX === params.x && ansY === params.y) {
        return { correct: true, feedback: `Correct! The point is at (${params.x}, ${params.y}). 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Remember: (x, y) means go right x, then up y.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as CoordinatePlaneParams;
    
    const questionText = params.questionType === 'identify'
      ? 'What are the coordinates of the red point?'
      : `Where is the point (${params.x}, ${params.y})?`;
    
    // Generate grid lines
    const gridLines = [];
    for (let i = 0; i <= 10; i++) {
      gridLines.push(`<line x1="${i * 25 + 25}" y1="25" x2="${i * 25 + 25}" y2="275" stroke="#e5e7eb" stroke-width="1"/>`);
      gridLines.push(`<line x1="25" y1="${275 - i * 25}" x2="275" y2="${275 - i * 25}" stroke="#e5e7eb" stroke-width="1"/>`);
    }
    
    // Generate axis labels
    const xLabels = [];
    const yLabels = [];
    for (let i = 0; i <= 10; i++) {
      xLabels.push(`<text x="${i * 25 + 25}" y="295" text-anchor="middle" font-size="12" fill="#6b7280">${i}</text>`);
      yLabels.push(`<text x="12" y="${279 - i * 25}" text-anchor="middle" font-size="12" fill="#6b7280">${i}</text>`);
    }
    
    return `
      <div class="exercise-container" x-data="coordinatePlaneExercise()" x-init="$nextTick(() => $refs.xInput?.focus())">
        <div class="exercise-prompt">
          <h2>Coordinate Plane</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="grid-container">
          <svg viewBox="0 0 300 310" class="coordinate-grid">
            <!-- Grid lines -->
            ${gridLines.join('')}
            
            <!-- Axes -->
            <line x1="25" y1="275" x2="285" y2="275" stroke="#374151" stroke-width="2"/>
            <line x1="25" y1="275" x2="25" y2="15" stroke="#374151" stroke-width="2"/>
            
            <!-- Axis labels -->
            ${xLabels.join('')}
            ${yLabels.join('')}
            
            <!-- Point -->
            ${params.questionType === 'identify' ? `
              <circle cx="${params.x * 25 + 25}" cy="${275 - params.y * 25}" r="8" fill="#ef4444"/>
            ` : ''}
            
            <!-- Axis labels -->
            <text x="290" y="280" font-size="14" font-weight="600" fill="#374151">x</text>
            <text x="25" y="10" font-size="14" font-weight="600" fill="#374151">y</text>
          </svg>
        </div>
        
        <div class="answer-section">
          <span class="coord-label">(</span>
          <input type="number" 
                 x-model="answerX" 
                 x-ref="xInput"
                 class="coord-input"
                 min="0" max="10"
                 :disabled="submitted"
                 @keyup.enter="$refs.yInput?.focus()">
          <span class="coord-label">,</span>
          <input type="number" 
                 x-model="answerY" 
                 x-ref="yInput"
                 class="coord-input"
                 min="0" max="10"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="coord-label">)</span>
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="addDigit('7')" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="addDigit('8')" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="addDigit('9')" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="addDigit('4')" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="addDigit('5')" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="addDigit('6')" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="addDigit('1')" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="addDigit('2')" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="addDigit('3')" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="clearCurrent()" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="addDigit('0')" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-special" @click="switchField()" :disabled="submitted">↔</button>
            </div>
          </div>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || answerX === '' || answerY === ''">
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
            <a href="/practice/geometry-coords" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .grid-container {
          display: flex;
          justify-content: center;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .coordinate-grid {
          max-width: 300px;
          width: 100%;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .coord-label {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .coord-input {
          width: 50px;
          padding: 0.5rem;
          font-size: 1.25rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .coord-input:focus {
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
      </style>
      
      <script>
        function coordinatePlaneExercise() {
          return {
            answerX: '',
            answerY: '',
            activeField: 'x',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            addDigit(d) {
              if (this.activeField === 'x') {
                this.answerX = (this.answerX || '') + d;
              } else {
                this.answerY = (this.answerY || '') + d;
              }
            },
            
            clearCurrent() {
              if (this.activeField === 'x') {
                this.answerX = '';
              } else {
                this.answerY = '';
              }
            },
            
            switchField() {
              this.activeField = this.activeField === 'x' ? 'y' : 'x';
              if (this.activeField === 'x') {
                this.$refs.xInput?.focus();
              } else {
                this.$refs.yInput?.focus();
              }
            },
            
            async checkAnswer() {
              if (this.answerX === '' || this.answerY === '') return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: '(' + this.answerX + ',' + this.answerY + ')'
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
              this.answerX = '';
              this.answerY = '';
              this.activeField = 'x';
              setTimeout(() => this.$refs.xInput?.focus(), 50);
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
