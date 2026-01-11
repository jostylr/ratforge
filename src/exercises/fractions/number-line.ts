import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface FractionLineParams {
  numerator: number;
  denominator: number;
  questionType: 'identify' | 'locate';
}

export const fractionNumberLineExercise: Exercise = {
  id: "frac-number-line",
  topic: "fractions",
  title: "Fractions on Number Line",
  description: "Locate and identify fractions on a number line",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const denominator = [2, 3, 4, 5, 6, 8][randomInt(0, 5, random)]!;
    const numerator = randomInt(1, denominator - 1, random);
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { numerator, denominator, questionType: 'identify' } as unknown as Record<string, unknown>,
      correctAnswer: numerator,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as FractionLineParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.numerator) {
      return { correct: true, feedback: `Correct! The point is at ${params.numerator}/${params.denominator} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Count how many equal parts from 0 to the dot.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as FractionLineParams;
    
    // Calculate position as percentage
    const position = (params.numerator / params.denominator) * 100;
    
    // Generate tick marks
    const ticks = [];
    for (let i = 0; i <= params.denominator; i++) {
      ticks.push({
        position: (i / params.denominator) * 100,
        label: i === 0 ? '0' : i === params.denominator ? '1' : ''
      });
    }
    
    return `
      <div class="exercise-container" x-data="fractionLineExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>What fraction is shown?</h2>
          <p class="exercise-hint">The line is divided into ${params.denominator} equal parts</p>
        </div>
        
        <div class="number-line-container">
          <div class="number-line">
            ${ticks.map(t => `
              <div class="tick" style="left: ${t.position}%">
                <div class="tick-mark"></div>
                <span class="tick-label">${t.label}</span>
              </div>
            `).join('')}
            <div class="point" style="left: ${position}%">
              <div class="point-dot"></div>
              <span class="point-arrow">▼</span>
            </div>
          </div>
        </div>
        
        <div class="answer-section">
          <div class="fraction-answer">
            <input type="number" 
                   x-model="answer" 
                   min="0"
                   max="${params.denominator}"
                   class="answer-input"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
            <span class="fraction-bar"></span>
            <span class="denominator">${params.denominator}</span>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct && !givenUp" x-ref="tryAgainBtn">
              Try Again
            </button>
            <button class="btn btn-warning" @click="giveUp()" x-show="!correct && !givenUp && attempts >= 3">
              Give Up
            </button>
            <a href="/practice/frac-number-line" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .number-line-container {
          padding: 3rem 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .number-line {
          position: relative;
          height: 4px;
          background: var(--color-text);
          border-radius: 2px;
        }
        .tick {
          position: absolute;
          transform: translateX(-50%);
        }
        .tick-mark {
          width: 2px;
          height: 20px;
          background: var(--color-text);
          margin-top: -8px;
        }
        .tick-label {
          position: absolute;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          font-weight: 600;
        }
        .point {
          position: absolute;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .point-arrow {
          color: var(--color-primary);
          font-size: 1.5rem;
          margin-top: -2rem;
        }
        .point-dot {
          width: 14px;
          height: 14px;
          background: var(--color-primary);
          border-radius: 50%;
          margin-top: -5px;
        }
        .answer-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .fraction-answer {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .fraction-bar {
          width: 50px;
          height: 3px;
          background: currentColor;
          margin: 0.25rem 0;
        }
        .answer-input {
          width: 50px;
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
        function fractionLineExercise() {
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
              this.feedback = 'The answer was: ' + this.correctAnswer + '/${params.denominator}';
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
