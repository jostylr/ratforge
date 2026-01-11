import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface PictographParams {
  title: string;
  items: { name: string; count: number; symbols: number }[];
  symbolValue: number;
  question: string;
  questionItem: string;
  answer: number;
}

const topics = [
  { title: "Favorite Fruits", items: ["Apples", "Bananas", "Oranges", "Grapes"], symbol: "🍎" },
  { title: "Pets at School", items: ["Dogs", "Cats", "Fish", "Birds"], symbol: "🐾" },
  { title: "Sports Played", items: ["Soccer", "Basketball", "Baseball", "Tennis"], symbol: "⚽" },
  { title: "Books Read", items: ["Fiction", "Non-fiction", "Comics", "Magazines"], symbol: "📚" },
];

export const pictographExercise: Exercise = {
  id: "data-pictograph",
  topic: "data",
  title: "Read Pictographs",
  description: "Interpret pictograph data",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const topic = topics[randomInt(0, topics.length - 1, random)]!;
    const symbolValue = [2, 5, 10][randomInt(0, 2, random)]!;
    
    const items = topic.items.map(name => {
      const symbols = randomInt(1, 6, random);
      return { name, count: symbols * symbolValue, symbols };
    });
    
    const questionItem = items[randomInt(0, items.length - 1, random)]!.name;
    const answer = items.find(i => i.name === questionItem)!.count;
    const question = `How many ${questionItem.toLowerCase()}?`;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        title: topic.title, 
        items, 
        symbolValue, 
        question, 
        questionItem, 
        answer 
      } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as PictographParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.answer) {
      const item = params.items.find(i => i.name === params.questionItem)!;
      return { correct: true, feedback: `Correct! ${item.symbols} symbols × ${params.symbolValue} = ${params.answer} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Remember each symbol = ${params.symbolValue}. Count the symbols and multiply.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as PictographParams;
    
    const rowsHTML = params.items.map(item => `
      <tr>
        <td class="item-name">${item.name}</td>
        <td class="symbols">${'⭐'.repeat(item.symbols)}</td>
      </tr>
    `).join('');
    
    return `
      <div class="exercise-container" x-data="pictographExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>${params.title}</h2>
        </div>
        
        <div class="pictograph-container">
          <table class="pictograph">
            ${rowsHTML}
          </table>
          <div class="key">
            <span class="key-symbol">⭐</span> = ${params.symbolValue}
          </div>
        </div>
        
        <div class="question-box">
          <p class="question">${params.question}</p>
        </div>
        
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
            <a href="/practice/data-pictograph" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .pictograph-container {
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .pictograph {
          width: 100%;
          border-collapse: collapse;
        }
        .pictograph tr {
          border-bottom: 1px solid var(--color-border);
        }
        .pictograph td {
          padding: 0.75rem;
        }
        .item-name {
          font-weight: 600;
          width: 120px;
        }
        .symbols {
          font-size: 1.5rem;
          letter-spacing: 0.25rem;
        }
        .key {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid var(--color-border);
          text-align: center;
          font-weight: 600;
        }
        .key-symbol {
          font-size: 1.5rem;
        }
        .question-box {
          text-align: center;
          margin-bottom: 1rem;
        }
        .question {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-primary);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 100px;
          padding: 0.75rem;
          font-size: 1.5rem;
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
        function pictographExercise() {
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
