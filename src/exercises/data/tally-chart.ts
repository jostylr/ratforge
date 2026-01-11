import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TallyChartParams {
  items: { name: string; count: number }[];
  question: string;
  questionType: 'count' | 'total' | 'most' | 'least';
  answer: number | string;
}

const categories = [
  { title: "Favorite Fruit", items: ["Apples", "Bananas", "Oranges", "Grapes"] },
  { title: "Favorite Sport", items: ["Soccer", "Basketball", "Baseball", "Tennis"] },
  { title: "Favorite Color", items: ["Red", "Blue", "Green", "Yellow"] },
  { title: "Pets at Home", items: ["Dogs", "Cats", "Fish", "Birds"] },
];

function renderTally(count: number): string {
  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  let result = '';
  for (let i = 0; i < groups; i++) {
    result += '<span class="tally-group">||||</span>';
  }
  for (let i = 0; i < remainder; i++) {
    result += '<span class="tally-mark">|</span>';
  }
  return result || '<span class="tally-none">-</span>';
}

export const tallyChartExercise: Exercise = {
  id: "data-tally",
  topic: "data",
  title: "Tally Charts",
  description: "Read and interpret tally charts",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const category = categories[randomInt(0, categories.length - 1, random)]!;
    const items = category.items.map(name => ({
      name,
      count: randomInt(1, 12, random)
    }));
    
    // Pick question type
    const questionType = ['count', 'total', 'most', 'least'][randomInt(0, 3, random)] as 'count' | 'total' | 'most' | 'least';
    
    let question: string, answer: number | string;
    
    if (questionType === 'count') {
      const itemIndex = randomInt(0, items.length - 1, random);
      question = `How many people chose ${items[itemIndex]!.name}?`;
      answer = items[itemIndex]!.count;
    } else if (questionType === 'total') {
      question = `How many people voted in total?`;
      answer = items.reduce((sum, item) => sum + item.count, 0);
    } else if (questionType === 'most') {
      question = `Which choice got the most votes?`;
      answer = items.reduce((max, item) => item.count > max.count ? item : max).name;
    } else {
      question = `Which choice got the fewest votes?`;
      answer = items.reduce((min, item) => item.count < min.count ? item : min).name;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { items, question, questionType, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TallyChartParams;
    
    if (params.questionType === 'count' || params.questionType === 'total') {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.answer) {
        return { correct: true, feedback: `Correct! The answer is ${params.answer}. 🎉` };
      }
    } else {
      const answerStr = String(answer).toLowerCase().trim();
      if (answerStr === String(params.answer).toLowerCase()) {
        return { correct: true, feedback: `Correct! ${params.answer} is the answer. 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Count the tally marks carefully.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TallyChartParams;
    const isNumericAnswer = params.questionType === 'count' || params.questionType === 'total';
    
    return `
      <div class="exercise-container" x-data="tallyChartExercise()" x-init="$nextTick(() => ${isNumericAnswer ? "document.querySelector('.answer-input')?.focus()" : ''})">
        <div class="exercise-prompt">
          <h2>Read the Tally Chart</h2>
        </div>
        
        <div class="tally-chart">
          <table>
            <thead>
              <tr>
                <th>Choice</th>
                <th>Tally</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              ${params.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="tally-cell">${renderTally(item.count)}</td>
                  <td class="count-cell">?</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="question-box">
          <p>${params.question}</p>
        </div>
        
        ${isNumericAnswer ? `
          <div class="answer-section">
            <input type="number" 
                   x-model="answer" 
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
        ` : `
          <div class="options-grid">
            ${params.items.map(item => `
              <button type="button" class="option-btn" @click="selectAnswer('${item.name}')" :class="{ selected: selectedAnswer === '${item.name}' }" :disabled="submitted">
                ${item.name}
              </button>
            `).join('')}
          </div>
        `}

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || ${isNumericAnswer ? '!answer' : '!selectedAnswer'}">
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
            <a href="/practice/data-tally" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .tally-chart {
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          padding: 1rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        .tally-chart table {
          width: 100%;
          border-collapse: collapse;
        }
        .tally-chart th, .tally-chart td {
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          text-align: left;
        }
        .tally-chart th {
          background: var(--color-surface);
          font-weight: 600;
        }
        .tally-cell {
          font-family: monospace;
          font-size: 1.25rem;
          letter-spacing: 2px;
        }
        .tally-group {
          text-decoration: line-through;
          margin-right: 0.5rem;
        }
        .tally-mark {
          margin-right: 2px;
        }
        .count-cell {
          color: var(--color-text-muted);
          font-style: italic;
        }
        .question-box {
          text-align: center;
          padding: 1rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
        }
        .question-box p {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 80px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .options-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
        function tallyChartExercise() {
          return {
            answer: '',
            selectedAnswer: null,
            showNumpad: true,
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(answer) {
              if (!this.submitted) {
                this.selectedAnswer = answer;
              }
            },
            
            async checkAnswer() {
              const answerValue = this.answer || this.selectedAnswer;
              if (!answerValue) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: answerValue
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
              this.selectedAnswer = null;
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
