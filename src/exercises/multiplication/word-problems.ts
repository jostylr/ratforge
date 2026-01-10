import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MultWordProblemParams {
  scenario: string;
  num1: number;
  num2: number;
  product: number;
  itemName: string;
  groupName: string;
}

const scenarios = [
  { template: 'There are {num1} bags with {num2} {item} in each bag. How many {item} are there in total?', items: ['apples', 'oranges', 'candies', 'marbles'], groups: 'bags' },
  { template: '{num1} friends each have {num2} {item}. How many {item} do they have altogether?', items: ['stickers', 'pencils', 'toys', 'books'], groups: 'friends' },
  { template: 'A parking lot has {num1} rows with {num2} {item} in each row. How many {item} are there?', items: ['cars', 'bikes', 'scooters'], groups: 'rows' },
  { template: 'There are {num1} boxes. Each box has {num2} {item}. How many {item} in all?', items: ['crayons', 'cookies', 'balls'], groups: 'boxes' },
  { template: '{num1} teams are playing. Each team has {num2} {item}. How many {item} total?', items: ['players', 'uniforms', 'water bottles'], groups: 'teams' },
];

export const multWordProblemExercise: Exercise = {
  id: "mult-word-problems",
  topic: "multiplication",
  title: "Multiplication Word Problems",
  description: "Solve real-world multiplication problems",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const scenarioIndex = randomInt(0, scenarios.length - 1, random);
    const scenario = scenarios[scenarioIndex]!;
    const itemIndex = randomInt(0, scenario.items.length - 1, random);
    const itemName = scenario.items[itemIndex]!;
    
    const num1 = randomInt(2, 6, random);
    const num2 = randomInt(2, 9, random);
    const product = num1 * num2;
    
    const problemText = scenario.template
      .replace('{num1}', String(num1))
      .replace('{num2}', String(num2))
      .replace(/{item}/g, itemName);
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        scenario: problemText, 
        num1, 
        num2, 
        product,
        itemName,
        groupName: scenario.groups
      } as unknown as Record<string, unknown>,
      correctAnswer: product,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MultWordProblemParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.product) {
      return { correct: true, feedback: `Correct! ${params.num1} × ${params.num2} = ${params.product} ${params.itemName}! 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Think: ${params.num1} groups of ${params.num2}. What multiplication fact helps?` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MultWordProblemParams;
    
    return `
      <div class="exercise-container" x-data="multWordProblemExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Solve the Problem</h2>
        </div>
        
        <div class="problem-card">
          <p class="problem-text">${params.scenario}</p>
          <p class="hint-text">Hint: ${params.num1} × ${params.num2} = ?</p>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="100"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="unit-label">${params.itemName}</span>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/mult-word-problems" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .problem-card {
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .problem-text {
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        .hint-text {
          font-size: 1rem;
          color: var(--color-text-muted);
          font-style: italic;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
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
        .unit-label {
          font-size: 1rem;
          color: var(--color-text-muted);
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
        function multWordProblemExercise() {
          return {
            answer: '',
            showNumpad: true,
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
            }
          };
        }
      </script>
    `;
  },
};
