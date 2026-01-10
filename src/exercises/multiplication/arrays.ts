import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ArraysParams {
  rows: number;
  cols: number;
  product: number;
}

export const arraysExercise: Exercise = {
  id: "mult-arrays",
  topic: "multiplication",
  title: "Array Builder",
  description: "Build and visualize multiplication arrays",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const rows = randomInt(2, 6, random);
    const cols = randomInt(2, 6, random);
    const product = rows * cols;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { rows, cols, product } as unknown as Record<string, unknown>,
      correctAnswer: product,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ArraysParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.product) {
      return { correct: true, feedback: `Correct! ${params.rows} × ${params.cols} = ${params.product} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Count all the squares in the ${params.rows} × ${params.cols} array.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ArraysParams;
    
    let grid = '';
    for (let r = 0; r < params.rows; r++) {
      for (let c = 0; c < params.cols; c++) {
        grid += `<div class="array-cell"></div>`;
      }
    }
    
    return `
      <div class="exercise-container" x-data="arraysExercise()">
        <div class="exercise-prompt">
          <h2>${params.rows} × ${params.cols} = ?</h2>
          <p class="exercise-hint">Count all the squares in the array, or use skip counting!</p>
        </div>
        
        <div class="array-container">
          <div class="array-grid" style="grid-template-columns: repeat(${params.cols}, 1fr);">
            ${grid}
          </div>
          <div class="array-labels">
            <span class="row-label">${params.rows} rows</span>
            <span class="col-label">${params.cols} columns</span>
          </div>
        </div>
        
        <div class="answer-section">
          <label>Total squares:</label>
          <input type="number" 
                 x-model="answer" 
                 min="1" 
                 max="100"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
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
            <a href="/practice/mult-arrays" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .array-container {
          text-align: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .array-grid {
          display: grid;
          gap: 4px;
          max-width: 300px;
          margin: 0 auto 1rem;
        }
        .array-cell {
          aspect-ratio: 1;
          background: var(--color-primary);
          border-radius: var(--radius-sm);
          min-width: 30px;
        }
        .array-labels {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.9rem;
          color: var(--color-text-muted);
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
      </style>
      
      <script>
        function arraysExercise() {
          return {
            answer: '',
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
            },
            
            tryAgain() {
              this.submitted = false;
              this.feedback = '';
              this.answer = '';
            }
          };
        }
      </script>
    `;
  },
};
