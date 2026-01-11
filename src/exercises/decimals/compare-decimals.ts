import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface CompareDecimalsParams {
  num1: number;
  num2: number;
  answer: 'greater' | 'less' | 'equal';
}

export const compareDecimalsExercise: Exercise = {
  id: "dec-compare",
  topic: "decimals",
  title: "Compare Decimals",
  description: "Compare decimal numbers using >, <, or =",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Generate decimals with 1 or 2 decimal places
    const num1 = Math.round(randomInt(1, 99, random)) / 10;
    
    // Sometimes make them equal, sometimes close
    const type = randomInt(0, 10, random);
    let num2: number;
    
    if (type < 2) {
      num2 = num1; // Equal
    } else if (type < 5) {
      // Tricky comparison (e.g., 0.5 vs 0.50 or 2.1 vs 2.10)
      num2 = Math.round(randomInt(1, 99, random)) / 10;
    } else {
      num2 = Math.round(randomInt(1, 99, random)) / 10;
    }
    
    let answer: 'greater' | 'less' | 'equal';
    if (num1 > num2) answer = 'greater';
    else if (num1 < num2) answer = 'less';
    else answer = 'equal';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { num1, num2, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as CompareDecimalsParams;
    const answerStr = String(answer).toLowerCase().trim();
    
    if (answerStr === params.answer) {
      const symbol = params.answer === 'greater' ? '>' : params.answer === 'less' ? '<' : '=';
      return { correct: true, feedback: `Correct! ${params.num1} ${symbol} ${params.num2} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Compare the whole number parts first, then the decimal parts.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as CompareDecimalsParams;
    
    return `
      <div class="exercise-container" x-data="compareDecimalsExercise()">
        <div class="exercise-prompt">
          <h2>Compare the Decimals</h2>
          <p class="exercise-hint">Which number is greater?</p>
        </div>
        
        <div class="comparison-display">
          <span class="compare-num">${params.num1}</span>
          <span class="compare-symbol" x-text="selectedAnswer === 'greater' ? '>' : selectedAnswer === 'less' ? '<' : selectedAnswer === 'equal' ? '=' : '?'">?</span>
          <span class="compare-num">${params.num2}</span>
        </div>
        
        <div class="options-grid">
          <button type="button" class="symbol-btn" @click="selectAnswer('greater')" :class="{ selected: selectedAnswer === 'greater' }" :disabled="submitted">
            <span class="symbol">&gt;</span>
            <span class="label">Greater than</span>
          </button>
          <button type="button" class="symbol-btn" @click="selectAnswer('less')" :class="{ selected: selectedAnswer === 'less' }" :disabled="submitted">
            <span class="symbol">&lt;</span>
            <span class="label">Less than</span>
          </button>
          <button type="button" class="symbol-btn" @click="selectAnswer('equal')" :class="{ selected: selectedAnswer === 'equal' }" :disabled="submitted">
            <span class="symbol">=</span>
            <span class="label">Equal to</span>
          </button>
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !selectedAnswer">
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
            <a href="/practice/dec-compare" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .comparison-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .compare-num {
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-text);
        }
        .compare-symbol {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-primary);
          min-width: 60px;
          text-align: center;
        }
        .options-grid {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .symbol-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 1.5rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }
        .symbol-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .symbol-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .symbol-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .symbol-btn .symbol {
          font-size: 2rem;
          font-weight: 700;
        }
        .symbol-btn .label {
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
      </style>
      
      <script>
        function compareDecimalsExercise() {
          return {
            selectedAnswer: null,
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
              if (!this.selectedAnswer) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: this.selectedAnswer
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
