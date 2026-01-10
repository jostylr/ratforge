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
      <div class="exercise-container" x-data="boxMethodExercise()" x-init="init()">
        <div class="exercise-prompt">
          <h2>${params.num1} × ${params.num2} = ?</h2>
          <p class="exercise-hint">Fill each box diagonally. Press <kbd>Enter</kbd> to move, <kbd>Space</kbd> for carry, <kbd>X</kbd> for borrow.</p>
        </div>
        
        <div class="box-method-container">
          <table class="box-grid">
            <tr>
              <th class="corner-cell">×</th>
              <th>${params.tens1 * 10}</th>
              <th>${params.ones1}</th>
            </tr>
            <tr>
              <th>${params.tens2 * 10}</th>
              <td class="box-cell" :class="{ active: currentCellIndex === 0, filled: cells[0] !== '' }" @click="focusCell(0)">
                <input type="text" 
                       x-model="cells[0]" 
                       x-ref="cell0"
                       class="cell-input"
                       :disabled="submitted"
                       @keydown="handleKeydown($event, 0)"
                       @focus="currentCellIndex = 0"
                       placeholder="${params.tens1}×${params.tens2}×100">
                <span class="cell-hint">×100</span>
              </td>
              <td class="box-cell" :class="{ active: currentCellIndex === 2, filled: cells[2] !== '' }" @click="focusCell(2)">
                <input type="text" 
                       x-model="cells[2]" 
                       x-ref="cell2"
                       class="cell-input"
                       :disabled="submitted"
                       @keydown="handleKeydown($event, 2)"
                       @focus="currentCellIndex = 2"
                       placeholder="${params.ones1}×${params.tens2}×10">
                <span class="cell-hint">×10</span>
              </td>
            </tr>
            <tr>
              <th>${params.ones2}</th>
              <td class="box-cell" :class="{ active: currentCellIndex === 1, filled: cells[1] !== '' }" @click="focusCell(1)">
                <input type="text" 
                       x-model="cells[1]" 
                       x-ref="cell1"
                       class="cell-input"
                       :disabled="submitted"
                       @keydown="handleKeydown($event, 1)"
                       @focus="currentCellIndex = 1"
                       placeholder="${params.tens1}×${params.ones2}×10">
                <span class="cell-hint">×10</span>
              </td>
              <td class="box-cell" :class="{ active: currentCellIndex === 3, filled: cells[3] !== '' }" @click="focusCell(3)">
                <input type="text" 
                       x-model="cells[3]" 
                       x-ref="cell3"
                       class="cell-input"
                       :disabled="submitted"
                       @keydown="handleKeydown($event, 3)"
                       @focus="currentCellIndex = 3"
                       placeholder="${params.ones1}×${params.ones2}">
                <span class="cell-hint">×1</span>
              </td>
            </tr>
          </table>
          
          <div class="carry-controls" x-show="showCarryControls">
            <button type="button" class="carry-btn" :class="{ active: carryActive }" @click="toggleCarry()">
              <kbd>Space</kbd> Carry +10
            </button>
            <button type="button" class="borrow-btn" :class="{ active: borrowActive }" @click="toggleBorrow()">
              <kbd>X</kbd> Borrow -10
            </button>
          </div>
          
          <div class="running-total">
            <span class="total-label">Running total:</span>
            <span class="total-value" x-text="runningTotal"></span>
          </div>
          
          <div class="final-answer" x-show="allFilled">
            <label>Final Answer:</label>
            <input type="text" 
                   x-model="answer" 
                   x-ref="answerInput"
                   class="sum-input"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
          </div>
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="appendDigit('7')" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="appendDigit('8')" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="appendDigit('9')" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="appendDigit('4')" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="appendDigit('5')" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="appendDigit('6')" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="appendDigit('1')" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="appendDigit('2')" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="appendDigit('3')" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="clearCurrent()" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="appendDigit('0')" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-enter" @click="moveNext()" :disabled="submitted">↵</button>
            </div>
          </div>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-secondary" @click="autoFill()" x-show="!allFilled && !submitted">
            Show Answers
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
          margin-bottom: 1rem;
        }
        .box-grid {
          margin: 0 auto 1rem;
          border-collapse: collapse;
        }
        .box-grid th, .box-grid td {
          border: 2px solid var(--color-border);
          padding: 0.5rem;
          text-align: center;
          font-size: 1.1rem;
        }
        .box-grid th {
          background: var(--color-surface);
          font-weight: 600;
          padding: 0.75rem 1rem;
        }
        .corner-cell {
          font-size: 1.5rem !important;
        }
        .box-cell {
          min-width: 120px;
          position: relative;
          background: white;
          transition: all 0.2s;
        }
        .box-cell.active {
          background: rgba(99, 102, 241, 0.1);
          border-color: var(--color-primary);
        }
        .box-cell.filled {
          background: rgba(34, 197, 94, 0.1);
        }
        .cell-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          border: none;
          background: transparent;
        }
        .cell-input:focus {
          outline: none;
        }
        .cell-input::placeholder {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          font-weight: 400;
        }
        .cell-hint {
          position: absolute;
          bottom: 2px;
          right: 4px;
          font-size: 0.65rem;
          color: var(--color-text-muted);
        }
        .carry-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .carry-btn, .borrow-btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
        }
        .carry-btn kbd, .borrow-btn kbd {
          background: var(--color-bg);
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          margin-right: 0.25rem;
        }
        .carry-btn.active {
          background: #22c55e;
          border-color: #22c55e;
          color: white;
        }
        .borrow-btn.active {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }
        .running-total {
          margin-bottom: 1rem;
          font-size: 1.125rem;
        }
        .total-label {
          color: var(--color-text-muted);
        }
        .total-value {
          font-weight: 700;
          color: var(--color-primary);
          margin-left: 0.5rem;
        }
        .final-answer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }
        .final-answer label {
          font-weight: 500;
        }
        .sum-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .sum-input:focus {
          outline: none;
          border-color: var(--color-primary);
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
        function boxMethodExercise() {
          return {
            // Diagonal order: topLeft(×100) → bottomLeft(×10) → topRight(×10) → bottomRight(×1)
            cellOrder: [0, 1, 2, 3], // indices in cells array
            cellNames: ['topLeft', 'bottomLeft', 'topRight', 'bottomRight'],
            cells: ['', '', '', ''], // [topLeft, bottomLeft, topRight, bottomRight]
            expectedValues: [${params.topLeft}, ${params.bottomLeft}, ${params.topRight}, ${params.bottomRight}],
            currentCellIndex: 0,
            answer: '',
            showNumpad: true,
            showCarryControls: true,
            carryActive: false,
            borrowActive: false,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            init() {
              this.$nextTick(() => this.$refs.cell0?.focus());
            },
            
            get allFilled() {
              return this.cells.every(c => c !== '');
            },
            
            get runningTotal() {
              return this.cells.reduce((sum, val) => sum + (parseInt(val) || 0), 0);
            },
            
            focusCell(index) {
              this.currentCellIndex = index;
              this.$refs['cell' + index]?.focus();
            },
            
            handleKeydown(e, cellIndex) {
              if (e.key === 'Enter') {
                e.preventDefault();
                this.moveNext();
              } else if (e.code === 'Space') {
                e.preventDefault();
                this.toggleCarry();
              } else if (e.key === 'x' || e.key === 'X') {
                e.preventDefault();
                this.toggleBorrow();
              }
            },
            
            moveNext() {
              if (this.currentCellIndex < 3) {
                this.currentCellIndex++;
                this.$refs['cell' + this.currentCellIndex]?.focus();
              } else if (this.allFilled) {
                this.$refs.answerInput?.focus();
              }
            },
            
            appendDigit(digit) {
              if (this.currentCellIndex <= 3 && !this.allFilled) {
                this.cells[this.currentCellIndex] += digit;
              } else if (this.allFilled) {
                this.answer += digit;
              }
            },
            
            clearCurrent() {
              if (this.currentCellIndex <= 3) {
                this.cells[this.currentCellIndex] = '';
              } else {
                this.answer = '';
              }
            },
            
            toggleCarry() {
              this.carryActive = !this.carryActive;
              this.borrowActive = false;
              if (this.carryActive && this.currentCellIndex <= 3) {
                const current = parseInt(this.cells[this.currentCellIndex]) || 0;
                this.cells[this.currentCellIndex] = String(current + 10);
              }
            },
            
            toggleBorrow() {
              this.borrowActive = !this.borrowActive;
              this.carryActive = false;
              if (this.borrowActive && this.currentCellIndex <= 3) {
                const current = parseInt(this.cells[this.currentCellIndex]) || 0;
                this.cells[this.currentCellIndex] = String(Math.max(0, current - 10));
              }
            },
            
            autoFill() {
              this.cells = this.expectedValues.map(String);
              this.$refs.answerInput?.focus();
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
              this.cells = ['', '', '', ''];
              this.currentCellIndex = 0;
              this.$nextTick(() => this.$refs.cell0?.focus());
            }
          };
        }
      </script>
    `;
  },
};
