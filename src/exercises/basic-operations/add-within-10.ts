import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface AddWithin10Params {
  num1: number;
  num2: number;
  sum: number;
}

export const addWithin10Exercise: Exercise = {
  id: "basic-add-10",
  topic: "basic-operations",
  title: "Adding to 10",
  description: "Visual addition with objects combining together",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const num1 = randomInt(1, 9, random);
    const maxNum2 = 10 - num1;
    const num2 = randomInt(1, Math.max(1, maxNum2), random);
    const sum = num1 + num2;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, sum } as unknown as Record<string, unknown>,
      correctAnswer: sum,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as AddWithin10Params;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.sum) {
      return { correct: true, feedback: `Correct! ${params.num1} + ${params.num2} = ${params.sum} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try counting all the dots together.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as AddWithin10Params;
    
    let dots1 = '';
    for (let i = 0; i < params.num1; i++) {
      dots1 += `<span class="dot blue">●</span>`;
    }
    
    let dots2 = '';
    for (let i = 0; i < params.num2; i++) {
      dots2 += `<span class="dot red">●</span>`;
    }
    
    return `
      <div class="exercise-container" x-data="addExercise()">
        <div class="exercise-prompt">
          <h2>${params.num1} + ${params.num2} = ?</h2>
        </div>
        
        <div class="addition-visual">
          <div class="addend-group">
            <div class="dots-row">${dots1}</div>
            <span class="addend-label">${params.num1}</span>
          </div>
          
          <div class="plus-sign">+</div>
          
          <div class="addend-group">
            <div class="dots-row">${dots2}</div>
            <span class="addend-label">${params.num2}</span>
          </div>
          
          <div class="equals-sign">=</div>
          
          <div class="answer-box">
            <input type="number" 
                   x-model="answer" 
                   min="0" 
                   max="20"
                   class="sum-input"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
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
            <a href="/practice/basic-add-10" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .addition-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .addend-group {
          text-align: center;
        }
        .dots-row {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
          min-height: 40px;
          align-items: center;
        }
        .dot {
          font-size: 2rem;
        }
        .dot.blue { color: #3b82f6; }
        .dot.red { color: #ef4444; }
        .addend-label {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .plus-sign, .equals-sign {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .sum-input {
          width: 80px;
          padding: 0.5rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .sum-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      </style>
      
      <script>
        function addExercise() {
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
