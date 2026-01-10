import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface EquivalentFractionParams {
  numerator1: number;
  denominator1: number;
  numerator2: number;
  denominator2: number;
  missingPart: 'numerator' | 'denominator';
  answer: number;
}

export const equivalentFractionExercise: Exercise = {
  id: "frac-equivalent",
  topic: "fractions",
  title: "Equivalent Fractions",
  description: "Find the missing number to make equivalent fractions",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Start with a simple fraction
    const numerator1 = randomInt(1, 5, random);
    const denominator1 = randomInt(2, 6, random);
    
    // Multiply by a factor to get equivalent fraction
    const factor = randomInt(2, 4, random);
    const numerator2 = numerator1 * factor;
    const denominator2 = denominator1 * factor;
    
    // Decide which part is missing
    const missingPart = random() > 0.5 ? 'numerator' : 'denominator';
    const answer = missingPart === 'numerator' ? numerator2 : denominator2;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { numerator1, denominator1, numerator2, denominator2, missingPart, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as EquivalentFractionParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.answer) {
      return { correct: true, feedback: `Correct! ${params.numerator1}/${params.denominator1} = ${params.numerator2}/${params.denominator2} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Think about what you multiply ${params.missingPart === 'numerator' ? params.numerator1 : params.denominator1} by to get the equivalent.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as EquivalentFractionParams;
    
    const num2Display = params.missingPart === 'numerator' ? '?' : params.numerator2;
    const den2Display = params.missingPart === 'denominator' ? '?' : params.denominator2;
    
    return `
      <div class="exercise-container" x-data="equivalentFractionExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Find the missing number</h2>
          <p class="exercise-hint">What number makes these fractions equal?</p>
        </div>
        
        <div class="fractions-display">
          <div class="fraction">
            <span class="numerator">${params.numerator1}</span>
            <span class="fraction-bar"></span>
            <span class="denominator">${params.denominator1}</span>
          </div>
          <span class="equals">=</span>
          <div class="fraction">
            <span class="numerator ${params.missingPart === 'numerator' ? 'missing' : ''}">${num2Display}</span>
            <span class="fraction-bar"></span>
            <span class="denominator ${params.missingPart === 'denominator' ? 'missing' : ''}">${den2Display}</span>
          </div>
        </div>
        
        <div class="answer-section">
          <label>Missing number:</label>
          <input type="number" 
                 x-model="answer" 
                 min="1" 
                 max="50"
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
            <a href="/practice/frac-equivalent" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .fractions-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .fraction {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 2rem;
          font-weight: 600;
        }
        .fraction-bar {
          width: 50px;
          height: 3px;
          background: currentColor;
          margin: 0.25rem 0;
        }
        .numerator, .denominator {
          min-width: 40px;
          text-align: center;
        }
        .missing {
          color: var(--color-primary);
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          padding: 0.25rem 0.5rem;
        }
        .equals {
          font-size: 2rem;
          font-weight: 600;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 80px;
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
        function equivalentFractionExercise() {
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
