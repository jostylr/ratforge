import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MixedNumberParams {
  wholeNumber: number;
  numerator: number;
  denominator: number;
  improperNumerator: number;
  conversionType: 'toImproper' | 'toMixed';
}

export const mixedNumberExercise: Exercise = {
  id: "frac-mixed",
  topic: "fractions",
  title: "Mixed Numbers",
  description: "Convert between mixed numbers and improper fractions",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const wholeNumber = randomInt(1, 5, random);
    const denominator = randomInt(2, 6, random);
    const numerator = randomInt(1, denominator - 1, random);
    const improperNumerator = wholeNumber * denominator + numerator;
    
    const conversionType = random() > 0.5 ? 'toImproper' : 'toMixed';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { wholeNumber, numerator, denominator, improperNumerator, conversionType } as unknown as Record<string, unknown>,
      correctAnswer: conversionType === 'toImproper' ? improperNumerator : wholeNumber,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MixedNumberParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    const expected = params.conversionType === 'toImproper' ? params.improperNumerator : params.wholeNumber;
    
    if (answerNum === expected) {
      if (params.conversionType === 'toImproper') {
        return { correct: true, feedback: `Correct! ${params.wholeNumber} ${params.numerator}/${params.denominator} = ${params.improperNumerator}/${params.denominator} 🎉` };
      } else {
        return { correct: true, feedback: `Correct! ${params.improperNumerator}/${params.denominator} = ${params.wholeNumber} ${params.numerator}/${params.denominator} 🎉` };
      }
    }
    
    if (params.conversionType === 'toImproper') {
      return { correct: false, feedback: `Not quite. Multiply the whole number by the denominator, then add the numerator.` };
    } else {
      return { correct: false, feedback: `Not quite. Divide ${params.improperNumerator} by ${params.denominator} to find the whole number.` };
    }
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MixedNumberParams;
    
    const isToImproper = params.conversionType === 'toImproper';
    
    return `
      <div class="exercise-container" x-data="mixedNumberExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>${isToImproper ? 'Convert to Improper Fraction' : 'Convert to Mixed Number'}</h2>
          <p class="exercise-hint">${isToImproper ? 
            'Multiply whole × denominator, then add numerator' : 
            'Divide numerator by denominator'}</p>
        </div>
        
        <div class="conversion-display">
          ${isToImproper ? `
            <div class="mixed-number">
              <span class="whole">${params.wholeNumber}</span>
              <div class="fraction">
                <span class="numerator">${params.numerator}</span>
                <span class="fraction-bar"></span>
                <span class="denominator">${params.denominator}</span>
              </div>
            </div>
            <span class="equals">=</span>
            <div class="fraction result">
              <input type="number" 
                     x-model="answer" 
                     class="answer-input"
                     :disabled="submitted"
                     @keyup.enter="checkAnswer()">
              <span class="fraction-bar"></span>
              <span class="denominator">${params.denominator}</span>
            </div>
          ` : `
            <div class="fraction">
              <span class="numerator">${params.improperNumerator}</span>
              <span class="fraction-bar"></span>
              <span class="denominator">${params.denominator}</span>
            </div>
            <span class="equals">=</span>
            <div class="mixed-number result">
              <input type="number" 
                     x-model="answer" 
                     class="answer-input whole-input"
                     :disabled="submitted"
                     @keyup.enter="checkAnswer()">
              <div class="fraction">
                <span class="numerator">${params.numerator}</span>
                <span class="fraction-bar"></span>
                <span class="denominator">${params.denominator}</span>
              </div>
            </div>
          `}
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
            <a href="/practice/frac-mixed" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .conversion-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .mixed-number {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mixed-number .whole {
          font-size: 2.5rem;
          font-weight: 700;
        }
        .fraction {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .fraction-bar {
          width: 40px;
          height: 3px;
          background: currentColor;
          margin: 0.15rem 0;
        }
        .equals {
          font-size: 2rem;
          font-weight: 600;
        }
        .answer-input {
          width: 50px;
          padding: 0.25rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          background: transparent;
        }
        .whole-input {
          font-size: 2.5rem;
          width: 60px;
        }
        .answer-input:focus {
          outline: none;
          border-style: solid;
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
        function mixedNumberExercise() {
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
