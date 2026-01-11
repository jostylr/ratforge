import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface AnglesParams {
  angleType: 'right' | 'acute' | 'obtuse' | 'straight';
  degrees: number;
  answer: string;
}

export const anglesExercise: Exercise = {
  id: "geometry-angles",
  topic: "geometry",
  title: "Types of Angles",
  description: "Identify right, acute, obtuse, and straight angles",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const types: ('right' | 'acute' | 'obtuse' | 'straight')[] = ['right', 'acute', 'obtuse', 'straight'];
    const angleType = types[randomInt(0, 3, random)]!;
    
    let degrees: number;
    if (angleType === 'right') degrees = 90;
    else if (angleType === 'acute') degrees = randomInt(15, 85, random);
    else if (angleType === 'obtuse') degrees = randomInt(95, 170, random);
    else degrees = 180;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { angleType, degrees, answer: angleType } as unknown as Record<string, unknown>,
      correctAnswer: angleType,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as AnglesParams;
    const answerStr = String(answer).toLowerCase().trim();
    
    if (answerStr === params.angleType) {
      const descriptions: Record<string, string> = {
        right: 'exactly 90°',
        acute: 'less than 90°',
        obtuse: 'greater than 90° but less than 180°',
        straight: 'exactly 180°'
      };
      return { correct: true, feedback: `Correct! This is a ${params.angleType} angle (${descriptions[params.angleType]}) 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look at how open the angle is.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as AnglesParams;
    
    // Calculate end point for angle line
    const radians = params.degrees * Math.PI / 180;
    const x2 = 100 + 70 * Math.cos(radians);
    const y2 = 100 - 70 * Math.sin(radians);
    
    return `
      <div class="exercise-container" x-data="anglesExercise()">
        <div class="exercise-prompt">
          <h2>What type of angle is this?</h2>
        </div>
        
        <div class="angle-display">
          <svg viewBox="0 0 200 200" class="angle-svg">
            <!-- First ray (horizontal) -->
            <line x1="100" y1="100" x2="170" y2="100" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            <!-- Second ray -->
            <line x1="100" y1="100" x2="${x2}" y2="${y2}" stroke="#333" stroke-width="3" stroke-linecap="round"/>
            <!-- Arc to show angle -->
            ${params.degrees <= 180 ? `
              <path d="M 130 100 A 30 30 0 ${params.degrees > 180 ? 1 : 0} 0 ${100 + 30 * Math.cos(radians)} ${100 - 30 * Math.sin(radians)}" 
                    fill="none" stroke="#3b82f6" stroke-width="2"/>
            ` : ''}
            <!-- Vertex point -->
            <circle cx="100" cy="100" r="4" fill="#333"/>
            <!-- Right angle marker if applicable -->
            ${params.angleType === 'right' ? `
              <rect x="100" y="80" width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="2"/>
            ` : ''}
          </svg>
        </div>
        
        <div class="options-grid">
          <button type="button" class="option-btn" @click="selectAnswer('acute')" :class="{ selected: selectedAnswer === 'acute' }" :disabled="submitted">
            <span class="option-title">Acute</span>
            <span class="option-desc">Less than 90°</span>
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('right')" :class="{ selected: selectedAnswer === 'right' }" :disabled="submitted">
            <span class="option-title">Right</span>
            <span class="option-desc">Exactly 90°</span>
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('obtuse')" :class="{ selected: selectedAnswer === 'obtuse' }" :disabled="submitted">
            <span class="option-title">Obtuse</span>
            <span class="option-desc">90° to 180°</span>
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('straight')" :class="{ selected: selectedAnswer === 'straight' }" :disabled="submitted">
            <span class="option-title">Straight</span>
            <span class="option-desc">Exactly 180°</span>
          </button>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !selectedAnswer">
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
            <a href="/practice/geometry-angles" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .angle-display {
          text-align: center;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .angle-svg {
          max-width: 200px;
        }
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
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
        .option-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .option-desc {
          font-size: 0.75rem;
          opacity: 0.8;
        }
      </style>
      
      <script>
        function anglesExercise() {
          return {
            selectedAnswer: null,
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
              if (!this.selectedAnswer) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.selectedAnswer
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
