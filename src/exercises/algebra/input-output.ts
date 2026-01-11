import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface InputOutputParams {
  rule: string;
  inputs: number[];
  outputs: number[];
  missingIndex: number;
  missingIsInput: boolean;
  answer: number;
}

export const inputOutputExercise: Exercise = {
  id: "algebra-io",
  topic: "algebra",
  title: "Input/Output Tables",
  description: "Find the rule and missing values",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate a simple rule
    const ruleType = randomInt(0, 3, random);
    let rule: string;
    let operation: (x: number) => number;
    
    const addVal = randomInt(1, 10, random);
    const multVal = randomInt(2, 5, random);
    
    if (ruleType === 0) {
      rule = `+ ${addVal}`;
      operation = (x) => x + addVal;
    } else if (ruleType === 1) {
      rule = `- ${addVal}`;
      operation = (x) => x - addVal;
    } else if (ruleType === 2) {
      rule = `× ${multVal}`;
      operation = (x) => x * multVal;
    } else {
      rule = `× ${multVal} + ${addVal}`;
      operation = (x) => x * multVal + addVal;
    }
    
    // Generate input/output pairs
    const inputs: number[] = [];
    const outputs: number[] = [];
    for (let i = 0; i < 4; i++) {
      const input = randomInt(1, 10, random);
      inputs.push(input);
      outputs.push(operation(input));
    }
    
    // Pick which value is missing
    const missingIndex = randomInt(0, 3, random);
    const missingIsInput = randomInt(0, 1, random) === 0;
    const answer = missingIsInput ? inputs[missingIndex]! : outputs[missingIndex]!;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { rule, inputs, outputs, missingIndex, missingIsInput, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as InputOutputParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.answer) {
      return { correct: true, feedback: `Correct! The rule is: ${params.rule} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look for the pattern between inputs and outputs.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as InputOutputParams;
    
    return `
      <div class="exercise-container" x-data="inputOutputExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Input/Output Table</h2>
          <p class="exercise-hint">Find the missing value. What's the rule?</p>
        </div>
        
        <div class="table-container">
          <table class="io-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              ${params.inputs.map((input, i) => `
                <tr>
                  <td>${i === params.missingIndex && params.missingIsInput ? '<span class="missing">?</span>' : input}</td>
                  <td>${i === params.missingIndex && !params.missingIsInput ? '<span class="missing">?</span>' : params.outputs[i]}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="answer-section">
          <label>Missing value:</label>
          <input type="number" 
                 x-model="answer" 
                 x-ref="mainInput"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        <div class="numpad-section">
          <button type="button" class="numpad-toggle" @click="showNumpad = !showNumpad">
            <span x-text="showNumpad ? '⌨️ Hide Numpad' : '🔢 Show Numpad'"></span>
          </button>
          <div class="number-pad" x-show="showNumpad" x-cloak>
            <div class="pad-grid">
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '7'" :disabled="submitted">7</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '8'" :disabled="submitted">8</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '9'" :disabled="submitted">9</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '4'" :disabled="submitted">4</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '5'" :disabled="submitted">5</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '6'" :disabled="submitted">6</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '1'" :disabled="submitted">1</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '2'" :disabled="submitted">2</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '3'" :disabled="submitted">3</button>
              <button type="button" class="pad-btn pad-special" @click="answer = ''" :disabled="submitted">C</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '0'" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-enter" @click="checkAnswer()" :disabled="submitted || !answer">↵</button>
            </div>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct && !givenUp" x-ref="tryAgainBtn">
              Try Again
            </button>
            <button class="btn btn-warning" @click="giveUp()" x-show="!correct && !givenUp && attempts >= 3">
              Give Up
            </button>
            <a href="/practice/algebra-io" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .table-container {
          display: flex;
          justify-content: center;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .io-table {
          border-collapse: collapse;
          font-size: 1.25rem;
        }
        .io-table th, .io-table td {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--color-border);
          text-align: center;
        }
        .io-table th {
          background: var(--color-primary);
          color: white;
          font-weight: 600;
        }
        .io-table td {
          background: var(--color-surface);
        }
        .missing {
          color: var(--color-primary);
          font-weight: 700;
          font-size: 1.5rem;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .answer-section label {
          font-weight: 500;
        }
        .answer-input {
          width: 80px;
          padding: 0.5rem;
          font-size: 1.25rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
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
        function inputOutputExercise() {
          return {
            answer: '',
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
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
              this.answer = '';
              setTimeout(() => this.$refs.mainInput?.focus(), 50);
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
