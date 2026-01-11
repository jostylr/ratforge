import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MoneyWordProblemParams {
  scenario: string;
  answer: number;
  answerDisplay: string;
}

const scenarios = [
  { 
    template: '{name} has ${total}. They buy a toy for ${cost}. How much money do they have left?',
    type: 'subtraction',
    names: ['Emma', 'Noah', 'Olivia', 'Liam']
  },
  { 
    template: '{name} earns ${earn1} on Monday and ${earn2} on Tuesday. How much did they earn in total?',
    type: 'addition',
    names: ['Sophia', 'Mason', 'Ava', 'Ethan']
  },
  { 
    template: 'A book costs ${cost}. {name} has ${has}. How much more money do they need?',
    type: 'difference',
    names: ['Mia', 'Jacob', 'Isabella', 'Aiden']
  },
  { 
    template: '{name} buys {count} pencils. Each pencil costs ${unit}. How much do they spend in total?',
    type: 'multiplication',
    names: ['Charlotte', 'Lucas', 'Amelia', 'Henry']
  },
];

function formatMoney(cents: number): string {
  return '$' + (cents / 100).toFixed(2);
}

export const moneyWordProblemExercise: Exercise = {
  id: "money-word-problems",
  topic: "money",
  title: "Money Word Problems",
  description: "Solve money story problems",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const scenarioData = scenarios[randomInt(0, scenarios.length - 1, random)]!;
    const name = scenarioData.names[randomInt(0, scenarioData.names.length - 1, random)]!;
    
    let scenario: string, answer: number;
    
    if (scenarioData.type === 'subtraction') {
      const total = randomInt(5, 20, random) * 100; // $5-$20 in cents
      const cost = randomInt(1, Math.floor(total/100) - 1, random) * 100;
      answer = total - cost;
      scenario = scenarioData.template
        .replace('{name}', name)
        .replace('{total}', formatMoney(total))
        .replace('{cost}', formatMoney(cost));
    } else if (scenarioData.type === 'addition') {
      const earn1 = randomInt(3, 10, random) * 100;
      const earn2 = randomInt(3, 10, random) * 100;
      answer = earn1 + earn2;
      scenario = scenarioData.template
        .replace('{name}', name)
        .replace('{earn1}', formatMoney(earn1))
        .replace('{earn2}', formatMoney(earn2));
    } else if (scenarioData.type === 'difference') {
      const cost = randomInt(8, 15, random) * 100;
      const has = randomInt(3, Math.floor(cost/100) - 1, random) * 100;
      answer = cost - has;
      scenario = scenarioData.template
        .replace('{name}', name)
        .replace('{cost}', formatMoney(cost))
        .replace('{has}', formatMoney(has));
    } else {
      const count = randomInt(2, 5, random);
      const unit = randomInt(1, 3, random) * 25; // 25¢, 50¢, or 75¢
      answer = count * unit;
      scenario = scenarioData.template
        .replace('{name}', name)
        .replace('{count}', String(count))
        .replace('{unit}', formatMoney(unit));
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        scenario, 
        answer,
        answerDisplay: formatMoney(answer)
      } as unknown as Record<string, unknown>,
      correctAnswer: formatMoney(answer),
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MoneyWordProblemParams;
    
    // Parse answer - accept various formats
    let answerCents: number;
    const answerStr = String(answer).replace('$', '').trim();
    
    if (answerStr.includes('.')) {
      answerCents = Math.round(parseFloat(answerStr) * 100);
    } else {
      // Assume whole dollars if no decimal
      answerCents = parseInt(answerStr, 10) * 100;
    }
    
    if (answerCents === params.answer) {
      return { correct: true, feedback: `Correct! The answer is ${params.answerDisplay} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Read the problem carefully and try again.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MoneyWordProblemParams;
    
    return `
      <div class="exercise-container" x-data="moneyWordProblemExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Solve the Problem</h2>
        </div>
        
        <div class="problem-card">
          <p class="problem-text">${params.scenario}</p>
        </div>
        
        <div class="answer-section">
          <span class="dollar-sign">$</span>
          <input type="text" 
                 x-model="answer" 
                 x-ref="mainInput"
                 placeholder="0.00"
                 inputmode="decimal"
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
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '.'" :disabled="submitted">.</button>
            </div>
            <button type="button" class="pad-btn pad-enter-full" @click="checkAnswer()" :disabled="submitted || !answer">Check ↵</button>
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
            <a href="/practice/money-word-problems" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          margin: 0;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .dollar-sign {
          font-size: 2rem;
          font-weight: 600;
        }
        .answer-input {
          width: 120px;
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
        .pad-enter-full {
          width: 100%;
          margin-top: 0.5rem;
          background: var(--color-primary);
          color: white;
          height: 45px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
        }
      </style>
      
      <script>
        function moneyWordProblemExercise() {
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
                  answer: this.answer
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
