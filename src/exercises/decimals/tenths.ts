import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TenthsParams {
  tenths: number;
  decimal: string;
}

export const tenthsExercise: Exercise = {
  id: "dec-tenths",
  topic: "decimals",
  title: "Tenths",
  description: "Work with one decimal place: 0.1 to 0.9",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const tenths = randomInt(1, 9, random);
    const decimal = `0.${tenths}`;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { tenths, decimal } as unknown as Record<string, unknown>,
      correctAnswer: decimal,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TenthsParams;
    const answerStr = String(answer).trim();
    const answerNum = parseFloat(answerStr);
    const expectedNum = parseFloat(params.decimal);
    
    if (Math.abs(answerNum - expectedNum) < 0.001) {
      return { correct: true, feedback: `Correct! ${params.tenths} tenths = ${params.decimal} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. ${params.tenths} shaded columns = ${params.decimal}` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TenthsParams;
    
    let grid = '';
    for (let i = 0; i < 10; i++) {
      const isFilled = i < params.tenths;
      grid += `<div class="tenth-col ${isFilled ? 'filled' : ''}"></div>`;
    }
    
    return `
      <div class="exercise-container" x-data="tenthsExercise()">
        <div class="exercise-prompt">
          <h2>What decimal is shown?</h2>
          <p class="exercise-hint">${params.tenths} out of 10 columns are shaded.</p>
        </div>
        
        <div class="tenths-visual">
          <div class="tenths-grid">
            ${grid}
          </div>
          <div class="tenths-labels">
            <span>0</span>
            <span>0.5</span>
            <span>1</span>
          </div>
        </div>
        
        <div class="answer-section">
          <input type="text" 
                 x-model="answer" 
                 placeholder="0.?"
                 class="decimal-input"
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
            <a href="/practice/dec-tenths" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .tenths-visual {
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .tenths-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 2px;
          max-width: 400px;
          margin: 0 auto 0.5rem;
          height: 80px;
        }
        .tenth-col {
          background: white;
          border: 1px solid var(--color-border);
        }
        .tenth-col.filled {
          background: var(--color-primary);
        }
        .tenths-labels {
          display: flex;
          justify-content: space-between;
          max-width: 400px;
          margin: 0 auto;
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .decimal-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .decimal-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      </style>
      
      <script>
        function tenthsExercise() {
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
                  answer: this.answer
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
