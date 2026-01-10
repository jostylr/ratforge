import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TimesTablesParams {
  num1: number;
  num2: number;
  product: number;
}

export const timesTablesExercise: Exercise = {
  id: "mult-tables",
  topic: "multiplication",
  title: "Times Tables",
  description: "Interactive multiplication table practice",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const num1 = randomInt(2, 12, random);
    const num2 = randomInt(2, 12, random);
    const product = num1 * num2;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, product } as unknown as Record<string, unknown>,
      correctAnswer: product,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TimesTablesParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.product) {
      return { correct: true, feedback: `Correct! ${params.num1} × ${params.num2} = ${params.product} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. ${params.num1} × ${params.num2} = ${params.product}` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TimesTablesParams;
    
    return `
      <div class="exercise-container" x-data="timesTablesExercise()">
        <div class="exercise-prompt">
          <div class="big-problem">
            <span class="num">${params.num1}</span>
            <span class="op">×</span>
            <span class="num">${params.num2}</span>
            <span class="eq">=</span>
            <input type="number" 
                   x-model="answer" 
                   class="inline-answer"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()"
                   autofocus>
          </div>
        </div>
        
        <div class="hint-area" x-show="showHint" x-cloak>
          <p>Hint: ${params.num1} × ${params.num2} is the same as adding ${params.num1} together ${params.num2} times.</p>
          <p>${Array(params.num2).fill(params.num1).join(' + ')} = ?</p>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-secondary" @click="showHint = !showHint" x-show="!submitted">
            <span x-text="showHint ? 'Hide Hint' : 'Show Hint'"></span>
          </button>
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
            <a href="/practice/mult-tables" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .big-problem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 3rem;
          font-weight: 700;
          padding: 2rem;
        }
        .big-problem .num {
          color: var(--color-primary);
        }
        .big-problem .op, .big-problem .eq {
          color: var(--color-text-muted);
        }
        .inline-answer {
          width: 120px;
          padding: 0.5rem;
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          border: 3px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .inline-answer:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .hint-area {
          background: var(--color-bg);
          padding: 1rem 1.5rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .hint-area p {
          margin: 0.5rem 0;
          font-family: monospace;
        }
      </style>
      
      <script>
        function timesTablesExercise() {
          return {
            answer: '',
            showHint: false,
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
              this.showHint = false;
            }
          };
        }
      </script>
    `;
  },
};
