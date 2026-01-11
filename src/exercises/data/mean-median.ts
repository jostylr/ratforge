import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface MeanMedianParams {
  numbers: number[];
  questionType: 'mean' | 'median' | 'range';
  answer: number;
}

export const meanMedianExercise: Exercise = {
  id: "data-mean-median",
  topic: "data",
  title: "Mean, Median, Range",
  description: "Find mean, median, and range of data",
  difficulty: 3,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate 5 numbers
    const numbers: number[] = [];
    for (let i = 0; i < 5; i++) {
      numbers.push(randomInt(1, 20, random));
    }
    numbers.sort((a, b) => a - b);
    
    const questionTypes: ('mean' | 'median' | 'range')[] = ['mean', 'median', 'range'];
    const questionType = questionTypes[randomInt(0, 2, random)]!;
    
    let answer: number;
    if (questionType === 'mean') {
      answer = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    } else if (questionType === 'median') {
      answer = numbers[Math.floor(numbers.length / 2)]!;
    } else {
      answer = numbers[numbers.length - 1]! - numbers[0]!;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { numbers, questionType, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as MeanMedianParams;
    const answerNum = typeof answer === "number" ? answer : parseFloat(String(answer));
    
    if (Math.abs(answerNum - params.answer) < 0.01) {
      const typeLabel = params.questionType === 'mean' ? 'mean (average)' 
        : params.questionType === 'median' ? 'median (middle)' : 'range';
      return { correct: true, feedback: `Correct! The ${typeLabel} is ${params.answer} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. ${
      params.questionType === 'mean' ? 'Add all numbers and divide by how many.' :
      params.questionType === 'median' ? 'Find the middle number when sorted.' :
      'Subtract the smallest from the largest.'
    }` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as MeanMedianParams;
    
    const questionText = params.questionType === 'mean' 
      ? 'Find the mean (average):'
      : params.questionType === 'median'
      ? 'Find the median (middle number):'
      : 'Find the range:';
    
    return `
      <div class="exercise-container" x-data="meanMedianExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Data Analysis</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="data-display">
          <div class="numbers-list">
            ${params.numbers.map(n => `<span class="data-point">${n}</span>`).join('')}
          </div>
        </div>
        
        <div class="hint-box">
          <p><strong>${params.questionType === 'mean' ? 'Mean' : params.questionType === 'median' ? 'Median' : 'Range'}:</strong> 
          ${params.questionType === 'mean' ? 'Add all numbers, then divide by how many numbers there are.' :
            params.questionType === 'median' ? 'The middle number when sorted in order.' :
            'Largest number minus smallest number.'}
          </p>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 x-ref="mainInput"
                 step="0.1"
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
            <a href="/practice/data-mean-median" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .data-display {
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1rem;
        }
        .numbers-list {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .data-point {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-md);
          font-size: 1.5rem;
          font-weight: 600;
        }
        .hint-box {
          padding: 0.75rem;
          background: #fef3c7;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .hint-box p {
          margin: 0;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 100px;
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
      </style>
      
      <script>
        function meanMedianExercise() {
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
                  answer: parseFloat(this.answer)
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
