import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface SubtractWithin10Params {
  num1: number;
  num2: number;
  difference: number;
}

export const subtractWithin10Exercise: Exercise = {
  id: "basic-subtract-10",
  topic: "basic-operations",
  title: "Subtracting to 10",
  description: "Visual subtraction with objects being taken away",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const num1 = randomInt(3, 10, random);
    const num2 = randomInt(1, num1 - 1, random);
    const difference = num1 - num2;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, difference } as unknown as Record<string, unknown>,
      correctAnswer: difference,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as SubtractWithin10Params;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.difference) {
      return { correct: true, feedback: `Correct! ${params.num1} - ${params.num2} = ${params.difference} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Start with ${params.num1} and take away ${params.num2}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as SubtractWithin10Params;
    
    let dots = '';
    for (let i = 0; i < params.num1; i++) {
      const crossed = i >= params.difference;
      dots += `<span class="dot ${crossed ? 'crossed' : ''}" data-index="${i}">●</span>`;
    }
    
    return `
      <div class="exercise-container" x-data="subtractExercise()">
        <div class="exercise-prompt">
          <h2>${params.num1} - ${params.num2} = ?</h2>
          <p class="exercise-hint">Cross out ${params.num2} dots, then count what's left.</p>
        </div>
        
        <div class="subtraction-visual">
          <div class="dots-container">
            ${dots}
          </div>
        </div>
        
        <div class="answer-section">
          <label>How many are left?</label>
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="10"
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
            <a href="/practice/basic-subtract-10" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .subtraction-visual {
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .dots-container {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .dot {
          font-size: 2.5rem;
          color: #3b82f6;
          cursor: pointer;
          transition: all 0.2s;
        }
        .dot.crossed {
          color: #ef4444;
          text-decoration: line-through;
          opacity: 0.4;
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
        function subtractExercise() {
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
