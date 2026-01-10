import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MissingNumberParams {
  num1: number;
  num2: number;
  result: number;
  operation: '+' | '-';
  missingPosition: 'first' | 'second' | 'result';
  missingValue: number;
}

export const missingNumberExercise: Exercise = {
  id: "algebra-missing",
  topic: "algebra",
  title: "Find the Missing Number",
  description: "Solve for unknowns: ☐ + 5 = 12",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const operation = random() > 0.5 ? '+' : '-';
    let num1: number, num2: number, result: number;
    
    if (operation === '+') {
      num1 = randomInt(2, 10, random);
      num2 = randomInt(2, 10, random);
      result = num1 + num2;
    } else {
      result = randomInt(5, 15, random);
      num2 = randomInt(1, result - 1, random);
      num1 = result;
      result = num1 - num2;
    }
    
    const positions: Array<'first' | 'second' | 'result'> = ['first', 'second', 'result'];
    const missingPosition = positions[randomInt(0, 2, random)]!;
    
    let missingValue: number;
    switch (missingPosition) {
      case 'first': missingValue = operation === '+' ? num1 : num1; break;
      case 'second': missingValue = num2; break;
      case 'result': missingValue = operation === '+' ? result : result; break;
    }
    
    // Recalculate for subtraction
    if (operation === '-') {
      num1 = randomInt(8, 18, random);
      num2 = randomInt(2, num1 - 2, random);
      result = num1 - num2;
      switch (missingPosition) {
        case 'first': missingValue = num1; break;
        case 'second': missingValue = num2; break;
        case 'result': missingValue = result; break;
      }
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, result, operation, missingPosition, missingValue } as unknown as Record<string, unknown>,
      correctAnswer: missingValue,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MissingNumberParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.missingValue) {
      return { correct: true, feedback: `Correct! The missing number is ${params.missingValue} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try working backwards from what you know.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MissingNumberParams;
    
    const firstDisplay = params.missingPosition === 'first' ? 
      `<input type="number" x-model="answer" class="eq-input" :disabled="submitted">` : 
      `<span class="eq-num">${params.num1}</span>`;
    
    const secondDisplay = params.missingPosition === 'second' ? 
      `<input type="number" x-model="answer" class="eq-input" :disabled="submitted">` : 
      `<span class="eq-num">${params.num2}</span>`;
    
    const resultDisplay = params.missingPosition === 'result' ? 
      `<input type="number" x-model="answer" class="eq-input" :disabled="submitted">` : 
      `<span class="eq-num">${params.result}</span>`;
    
    return `
      <div class="exercise-container" x-data="missingNumberExercise()" x-init="$nextTick(() => document.querySelector('.eq-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Find the missing number!</h2>
        </div>
        
        <div class="equation-area">
          <div class="equation">
            ${firstDisplay}
            <span class="eq-op">${params.operation}</span>
            ${secondDisplay}
            <span class="eq-op">=</span>
            ${resultDisplay}
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
            <a href="/practice/algebra-missing" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .equation-area {
          display: flex;
          justify-content: center;
          padding: 3rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .equation {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 2.5rem;
        }
        .eq-num {
          font-weight: 700;
          color: var(--color-primary);
        }
        .eq-op {
          color: var(--color-text-muted);
        }
        .eq-input {
          width: 80px;
          height: 70px;
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          border: 3px dashed var(--color-primary);
          border-radius: var(--radius-md);
          background: white;
        }
        .eq-input:focus {
          outline: none;
          border-style: solid;
        }
      </style>
      
      <script>
        function missingNumberExercise() {
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
              if (result.correct) {
                this.$nextTick(() => this.$refs.nextBtn?.focus());
              }
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
