import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface BoxMethodParams {
  num1: number;
  num2: number;
  product: number;
  tens1: number;
  ones1: number;
  tens2: number;
  ones2: number;
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

export const boxMethodExercise: Exercise = {
  id: "mult-box-intro",
  topic: "multiplication",
  title: "Box Method Basics",
  description: "Learn the 2×2 box method for two-digit multiplication",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const tens1 = randomInt(2, 8, random);
    const ones1 = randomInt(1, 9, random);
    const tens2 = randomInt(2, 8, random);
    const ones2 = randomInt(1, 9, random);
    
    const num1 = tens1 * 10 + ones1;
    const num2 = tens2 * 10 + ones2;
    const product = num1 * num2;
    
    const topLeft = tens1 * 10 * tens2 * 10;
    const topRight = ones1 * tens2 * 10;
    const bottomLeft = tens1 * 10 * ones2;
    const bottomRight = ones1 * ones2;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        num1, num2, product,
        tens1, ones1, tens2, ones2,
        topLeft, topRight, bottomLeft, bottomRight
      } as unknown as Record<string, unknown>,
      correctAnswer: product,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as BoxMethodParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.product) {
      return { correct: true, feedback: `Excellent! ${params.num1} × ${params.num2} = ${params.product} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Add all four boxes: ${params.topLeft} + ${params.topRight} + ${params.bottomLeft} + ${params.bottomRight} = ${params.product}` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as BoxMethodParams;
    
    return `
      <div class="exercise-container" x-data="boxMethodExercise()">
        <div class="exercise-prompt">
          <h2>${params.num1} × ${params.num2} = ?</h2>
          <p class="exercise-hint">Use the box method: break each number into tens and ones!</p>
        </div>
        
        <div class="box-method-container">
          <table class="box-grid">
            <tr>
              <th></th>
              <th>${params.tens1 * 10}</th>
              <th>${params.ones1}</th>
            </tr>
            <tr>
              <th>${params.tens2 * 10}</th>
              <td class="box-cell" @click="fillCell('topLeft')">
                <span x-show="cells.topLeft !== null" x-text="cells.topLeft"></span>
                <span x-show="cells.topLeft === null" class="placeholder">?</span>
              </td>
              <td class="box-cell" @click="fillCell('topRight')">
                <span x-show="cells.topRight !== null" x-text="cells.topRight"></span>
                <span x-show="cells.topRight === null" class="placeholder">?</span>
              </td>
            </tr>
            <tr>
              <th>${params.ones2}</th>
              <td class="box-cell" @click="fillCell('bottomLeft')">
                <span x-show="cells.bottomLeft !== null" x-text="cells.bottomLeft"></span>
                <span x-show="cells.bottomLeft === null" class="placeholder">?</span>
              </td>
              <td class="box-cell" @click="fillCell('bottomRight')">
                <span x-show="cells.bottomRight !== null" x-text="cells.bottomRight"></span>
                <span x-show="cells.bottomRight === null" class="placeholder">?</span>
              </td>
            </tr>
          </table>
          
          <div class="box-sum" x-show="allFilled">
            <span x-text="cells.topLeft"></span> + 
            <span x-text="cells.topRight"></span> + 
            <span x-text="cells.bottomLeft"></span> + 
            <span x-text="cells.bottomRight"></span> = 
            <input type="number" x-model="answer" class="sum-input" :disabled="submitted">
          </div>
        </div>
        
        <div class="cell-input-modal" x-show="showCellInput" x-cloak @click.away="showCellInput = false">
          <div class="modal-content">
            <p x-text="cellPrompt"></p>
            <input type="number" 
                   x-model="cellValue" 
                   class="cell-input"
                   @keyup.enter="submitCellValue()"
                   x-ref="cellInput">
            <button class="btn btn-primary" @click="submitCellValue()">OK</button>
          </div>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-secondary" @click="autoFill()" x-show="!allFilled && !submitted">
            Show Filled Boxes
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
            <a href="/practice/mult-box-intro" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .box-method-container {
          text-align: center;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .box-grid {
          margin: 0 auto 1rem;
          border-collapse: collapse;
        }
        .box-grid th, .box-grid td {
          border: 2px solid var(--color-border);
          padding: 1rem 1.5rem;
          text-align: center;
          font-size: 1.25rem;
        }
        .box-grid th {
          background: var(--color-surface);
          font-weight: 600;
        }
        .box-cell {
          cursor: pointer;
          min-width: 80px;
          transition: background 0.2s;
        }
        .box-cell:hover {
          background: rgba(99, 102, 241, 0.1);
        }
        .placeholder {
          color: var(--color-text-muted);
          font-size: 1.5rem;
        }
        .box-sum {
          font-size: 1.25rem;
          margin-top: 1rem;
        }
        .sum-input {
          width: 100px;
          padding: 0.5rem;
          font-size: 1.25rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .cell-input-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .modal-content p {
          margin-bottom: 1rem;
          font-size: 1.125rem;
        }
        .cell-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          margin-right: 0.5rem;
        }
      </style>
      
      <script>
        function boxMethodExercise() {
          return {
            cells: {
              topLeft: null,
              topRight: null,
              bottomLeft: null,
              bottomRight: null
            },
            expectedValues: {
              topLeft: ${params.topLeft},
              topRight: ${params.topRight},
              bottomLeft: ${params.bottomLeft},
              bottomRight: ${params.bottomRight}
            },
            answer: '',
            showCellInput: false,
            currentCell: '',
            cellPrompt: '',
            cellValue: '',
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            get allFilled() {
              return this.cells.topLeft !== null && 
                     this.cells.topRight !== null && 
                     this.cells.bottomLeft !== null && 
                     this.cells.bottomRight !== null;
            },
            
            fillCell(cell) {
              if (this.submitted) return;
              this.currentCell = cell;
              const prompts = {
                topLeft: '${params.tens1 * 10} × ${params.tens2 * 10} = ?',
                topRight: '${params.ones1} × ${params.tens2 * 10} = ?',
                bottomLeft: '${params.tens1 * 10} × ${params.ones2} = ?',
                bottomRight: '${params.ones1} × ${params.ones2} = ?'
              };
              this.cellPrompt = prompts[cell];
              this.cellValue = '';
              this.showCellInput = true;
              this.$nextTick(() => this.$refs.cellInput?.focus());
            },
            
            submitCellValue() {
              const val = parseInt(this.cellValue);
              if (!isNaN(val)) {
                this.cells[this.currentCell] = val;
              }
              this.showCellInput = false;
            },
            
            autoFill() {
              this.cells = { ...this.expectedValues };
            },
            
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
              this.cells = { topLeft: null, topRight: null, bottomLeft: null, bottomRight: null };
            }
          };
        }
      </script>
    `;
  },
};
