import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface DivisionFactsParams {
  dividend: number;
  divisor: number;
  quotient: number;
}

export const divisionFactsExercise: Exercise = {
  id: "div-facts",
  topic: "division",
  title: "Division Facts",
  description: "Practice basic division facts within 100",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const divisor = randomInt(2, 10, random);
    const quotient = randomInt(2, 10, random);
    const dividend = divisor * quotient;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { dividend, divisor, quotient } as unknown as Record<string, unknown>,
      correctAnswer: quotient,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as DivisionFactsParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.quotient) {
      return { correct: true, feedback: `Correct! ${params.dividend} ÷ ${params.divisor} = ${params.quotient} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Think: ${params.divisor} × ? = ${params.dividend}` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as DivisionFactsParams;
    
    return `
      <div class="exercise-container" x-data="divFactsExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <div class="big-problem">
            <span class="num">${params.dividend}</span>
            <span class="op">÷</span>
            <span class="num">${params.divisor}</span>
            <span class="eq">=</span>
            <input type="number" 
                   x-model="answer" 
                   x-ref="mainInput"
                   class="inline-answer"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
          </div>
        </div>
        
        <div class="related-fact" x-show="showHint" x-cloak>
          <p>Related multiplication fact:</p>
          <p class="fact">${params.divisor} × ? = ${params.dividend}</p>
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
          <button class="btn btn-secondary" @click="showHint = !showHint" x-show="!submitted">
            <span x-text="showHint ? 'Hide Hint' : 'Show Hint'"></span>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct && !givenUp" x-ref="tryAgainBtn">
              Try Again
            </button>
            <button class="btn btn-warning" @click="giveUp()" x-show="!correct && !givenUp && attempts >= 3">
              Give Up
            </button>
            <a href="/practice/div-facts" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .big-problem {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 3rem;
          font-weight: 700;
          padding: 2rem;
        }
        .big-problem .num {
          color: var(--color-primary);
        }
        .big-problem .op, .big-problem .eq {
          color: var(--color-text-muted);
        }
        .inline-answer {
          width: 100px;
          padding: 0.5rem;
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          border: 3px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .inline-answer:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .related-fact {
          text-align: center;
          background: var(--color-bg);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
        }
        .related-fact p {
          margin: 0.25rem 0;
        }
        .related-fact .fact {
          font-size: 1.25rem;
          font-weight: 600;
          font-family: monospace;
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
        function divFactsExercise() {
          return {
            answer: '',
            showNumpad: true,
            showHint: false,
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
              this.showHint = false;
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
