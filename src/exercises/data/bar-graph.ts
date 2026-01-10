import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface BarGraphParams {
  items: Array<{ name: string; value: number; color: string }>;
  question: string;
  correctAnswer: number;
  questionType: 'max' | 'min' | 'specific' | 'total';
}

const itemSets = [
  { names: ['Apples', 'Oranges', 'Bananas', 'Grapes'], colors: ['#ef4444', '#f97316', '#eab308', '#a855f7'] },
  { names: ['Dogs', 'Cats', 'Fish', 'Birds'], colors: ['#8b4513', '#f97316', '#3b82f6', '#22c55e'] },
  { names: ['Red', 'Blue', 'Green', 'Yellow'], colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'] },
];

export const barGraphExercise: Exercise = {
  id: "data-bar-graph",
  topic: "data",
  title: "Reading Bar Graphs",
  description: "Learn to read and interpret bar graphs",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const itemSet = itemSets[randomInt(0, itemSets.length - 1, random)]!;
    const items = itemSet.names.map((name, i) => ({
      name,
      value: randomInt(1, 10, random),
      color: itemSet.colors[i]!
    }));
    
    const questionTypes: Array<'max' | 'min' | 'specific' | 'total'> = ['max', 'min', 'specific', 'total'];
    const questionType = questionTypes[randomInt(0, questionTypes.length - 1, random)]!;
    
    let question = '';
    let correctAnswer = 0;
    
    switch (questionType) {
      case 'max':
        question = 'Which item has the most?';
        correctAnswer = Math.max(...items.map(i => i.value));
        break;
      case 'min':
        question = 'Which item has the least?';
        correctAnswer = Math.min(...items.map(i => i.value));
        break;
      case 'specific':
        const targetItem = items[randomInt(0, items.length - 1, random)]!;
        question = `How many ${targetItem.name}?`;
        correctAnswer = targetItem.value;
        break;
      case 'total':
        question = 'What is the total of all items?';
        correctAnswer = items.reduce((sum, i) => sum + i.value, 0);
        break;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { items, question, correctAnswer, questionType } as unknown as Record<string, unknown>,
      correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as BarGraphParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.correctAnswer) {
      return { correct: true, feedback: `Correct! The answer is ${params.correctAnswer}. 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look carefully at the heights of the bars.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as BarGraphParams;
    const maxValue = Math.max(...params.items.map(i => i.value));
    
    const bars = params.items.map(item => `
      <div class="bar-column">
        <div class="bar" style="height: ${(item.value / maxValue) * 100}%; background: ${item.color};">
          <span class="bar-value">${item.value}</span>
        </div>
        <span class="bar-label">${item.name}</span>
      </div>
    `).join('');
    
    return `
      <div class="exercise-container" x-data="barGraphExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>${params.question}</h2>
        </div>
        
        <div class="graph-container">
          <div class="y-axis">
            ${[...Array(11)].map((_, i) => `<span class="y-label">${10 - i}</span>`).join('')}
          </div>
          <div class="bars-area">
            ${bars}
          </div>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="100"
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
            <a href="/practice/data-bar-graph" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .graph-container {
          display: flex;
          gap: 0.5rem;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          min-height: 250px;
        }
        .y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-right: 0.5rem;
          border-right: 2px solid var(--color-border);
        }
        .y-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .bars-area {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: flex-end;
          padding-bottom: 1.5rem;
          height: 200px;
        }
        .bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
        }
        .bar {
          width: 50px;
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          min-height: 25px;
        }
        .bar-value {
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          padding-top: 0.25rem;
        }
        .bar-label {
          font-size: 0.875rem;
          font-weight: 500;
          text-align: center;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
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
        function barGraphExercise() {
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
              setTimeout(() => document.querySelector('.answer-input')?.focus(), 50);
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
