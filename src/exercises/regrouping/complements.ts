import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ComplementsParams {
  number: number;
  complement: number;
}

export const complementsExercise: Exercise = {
  id: "regrouping-complements",
  topic: "regrouping",
  title: "Complements to 10",
  description: "Instantly find what number adds to 10 (critical skill!)",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const number = randomInt(1, 9, random);
    const complement = 10 - number;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { number, complement } as unknown as Record<string, unknown>,
      correctAnswer: complement,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ComplementsParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.complement) {
      return { correct: true, feedback: `Correct! ${params.number} + ${params.complement} = 10 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. What plus ${params.number} equals 10?` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ComplementsParams;
    
    // Visual ten-frame
    let tenFrame = '';
    for (let i = 0; i < 10; i++) {
      const filled = i < params.number;
      tenFrame += `<div class="ten-frame-cell ${filled ? 'filled' : 'empty'}"></div>`;
    }
    
    return `
      <div class="exercise-container" x-data="complementsExercise()">
        <div class="exercise-prompt">
          <h2>${params.number} + ? = 10</h2>
          <p class="exercise-hint">Find the complement to 10. This skill is essential for regrouping!</p>
        </div>
        
        <div class="ten-frame-container">
          <div class="ten-frame">
            ${tenFrame}
          </div>
          <p class="ten-frame-label">${params.number} filled, how many empty?</p>
        </div>
        
        <div class="quick-answer">
          <div class="number-buttons">
            ${[1,2,3,4,5,6,7,8,9].map(n => 
              `<button type="button" class="num-btn" @click="selectAnswer(${n})" :class="{ selected: answer === ${n} }" :disabled="submitted">${n}</button>`
            ).join('')}
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
            <a href="/practice/regrouping-complements" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .ten-frame-container {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .ten-frame {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          max-width: 250px;
          margin: 0 auto 0.5rem;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
        }
        .ten-frame-cell {
          aspect-ratio: 1;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
        }
        .ten-frame-cell.filled {
          background: var(--color-primary);
          border-color: var(--color-primary);
        }
        .ten-frame-cell.empty {
          background: white;
          border-style: dashed;
        }
        .ten-frame-label {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .quick-answer {
          margin-bottom: 1.5rem;
        }
        .number-buttons {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .num-btn {
          width: 50px;
          height: 50px;
          font-size: 1.5rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.15s;
        }
        .num-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .num-btn.selected {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }
        .num-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function complementsExercise() {
          return {
            answer: null,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(num) {
              if (!this.submitted) {
                this.answer = num;
              }
            },
            
            async checkAnswer() {
              if (this.answer === null) return;
              
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
              if (result.correct) {
                this.$nextTick(() => this.$refs.nextBtn?.focus());
              }
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.answer = null;
            }
          };
        }
      </script>
    `;
  },
};
