import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface FactFamilyParams {
  num1: number;
  num2: number;
  sum: number;
  missingFact: string;
  answer: number;
}

export const factFamilyExercise: Exercise = {
  id: "basic-fact-families",
  topic: "basic-operations",
  title: "Fact Families",
  description: "Complete the related addition and subtraction facts",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const num1 = randomInt(2, 9, random);
    const num2 = randomInt(1, 10 - num1, random);
    const sum = num1 + num2;
    
    // Four facts in a family:
    // num1 + num2 = sum
    // num2 + num1 = sum
    // sum - num1 = num2
    // sum - num2 = num1
    
    const factType = randomInt(0, 3, random);
    let missingFact: string, answer: number;
    
    if (factType === 0) {
      missingFact = `${num1} + ${num2} = ?`;
      answer = sum;
    } else if (factType === 1) {
      missingFact = `${num2} + ${num1} = ?`;
      answer = sum;
    } else if (factType === 2) {
      missingFact = `${sum} - ${num1} = ?`;
      answer = num2;
    } else {
      missingFact = `${sum} - ${num2} = ?`;
      answer = num1;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, sum, missingFact, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as FactFamilyParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.answer) {
      return { correct: true, feedback: `Correct! ${params.missingFact.replace('?', String(params.answer))} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Think about related facts with ${params.num1}, ${params.num2}, and ${params.sum}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as FactFamilyParams;
    
    return `
      <div class="exercise-container" x-data="factFamilyExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Fact Families</h2>
          <p class="exercise-hint">These numbers make a fact family: ${params.num1}, ${params.num2}, ${params.sum}</p>
        </div>
        
        <div class="fact-family-display">
          <div class="family-triangle">
            <div class="top-num">${params.sum}</div>
            <div class="bottom-nums">
              <span>${params.num1}</span>
              <span>${params.num2}</span>
            </div>
          </div>
          
          <div class="facts-list">
            <div class="fact">${params.num1} + ${params.num2} = ${params.sum}</div>
            <div class="fact">${params.num2} + ${params.num1} = ${params.sum}</div>
            <div class="fact">${params.sum} − ${params.num1} = ${params.num2}</div>
            <div class="fact">${params.sum} − ${params.num2} = ${params.num1}</div>
          </div>
        </div>
        
        <div class="question-box">
          <span class="question-text">${params.missingFact.replace('?', '')}</span>
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
            <a href="/practice/basic-fact-families" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .fact-family-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .family-triangle {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .top-num {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-primary);
          padding: 0.5rem 1.5rem;
          background: #e0f2fe;
          border-radius: var(--radius-md);
        }
        .bottom-nums {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }
        .bottom-nums span {
          font-size: 1.5rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
        }
        .facts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .fact {
          font-size: 1.1rem;
          padding: 0.25rem 0.5rem;
          color: var(--color-text-muted);
        }
        .question-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 60px;
          padding: 0.5rem;
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
        function factFamilyExercise() {
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
