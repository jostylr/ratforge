import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface FractionCompareParams {
  frac1Num: number;
  frac1Den: number;
  frac2Num: number;
  frac2Den: number;
  correctAnswer: '<' | '>' | '=';
}

export const fractionCompareExercise: Exercise = {
  id: "frac-compare",
  topic: "fractions",
  title: "Compare Fractions",
  description: "Compare two fractions to determine which is larger",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Use common denominators for easier comparison at this level
    const denominators = [2, 3, 4, 6, 8];
    const den1 = denominators[randomInt(0, denominators.length - 1, random)]!;
    const den2 = denominators[randomInt(0, denominators.length - 1, random)]!;
    const num1 = randomInt(1, den1 - 1, random);
    const num2 = randomInt(1, den2 - 1, random);
    
    // Calculate decimal values for comparison
    const val1 = num1 / den1;
    const val2 = num2 / den2;
    
    let correctAnswer: '<' | '>' | '=';
    if (Math.abs(val1 - val2) < 0.001) {
      correctAnswer = '=';
    } else if (val1 < val2) {
      correctAnswer = '<';
    } else {
      correctAnswer = '>';
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        frac1Num: num1, 
        frac1Den: den1, 
        frac2Num: num2, 
        frac2Den: den2, 
        correctAnswer 
      } as unknown as Record<string, unknown>,
      correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as FractionCompareParams;
    const answerStr = String(answer).trim();
    
    if (answerStr === params.correctAnswer) {
      const explanation = params.correctAnswer === '=' 
        ? 'They are equal!' 
        : `${params.frac1Num}/${params.frac1Den} is ${params.correctAnswer === '<' ? 'less than' : 'greater than'} ${params.frac2Num}/${params.frac2Den}`;
      return { correct: true, feedback: `Correct! ${explanation} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Try finding a common denominator or visualizing the fractions.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as FractionCompareParams;
    
    // Create visual fraction bars
    const frac1Parts = Array(params.frac1Den).fill(0).map((_, i) => 
      `<div class="frac-part ${i < params.frac1Num ? 'filled' : ''}"></div>`
    ).join('');
    
    const frac2Parts = Array(params.frac2Den).fill(0).map((_, i) => 
      `<div class="frac-part ${i < params.frac2Num ? 'filled' : ''}"></div>`
    ).join('');
    
    return `
      <div class="exercise-container" x-data="fracCompareExercise()">
        <div class="exercise-prompt">
          <h2>Compare the fractions</h2>
          <p class="exercise-hint">Which symbol makes the statement true?</p>
        </div>
        
        <div class="fractions-display">
          <div class="fraction-box">
            <div class="fraction-bar" style="grid-template-columns: repeat(${params.frac1Den}, 1fr);">
              ${frac1Parts}
            </div>
            <div class="fraction-text">
              <span class="numerator">${params.frac1Num}</span>
              <span class="fraction-line"></span>
              <span class="denominator">${params.frac1Den}</span>
            </div>
          </div>
          
          <div class="comparison-symbol">
            <span x-text="selectedAnswer || '?'" class="symbol-display"></span>
          </div>
          
          <div class="fraction-box">
            <div class="fraction-bar" style="grid-template-columns: repeat(${params.frac2Den}, 1fr);">
              ${frac2Parts}
            </div>
            <div class="fraction-text">
              <span class="numerator">${params.frac2Num}</span>
              <span class="fraction-line"></span>
              <span class="denominator">${params.frac2Den}</span>
            </div>
          </div>
        </div>
        
        <div class="options-grid">
          <button type="button" class="compare-option" @click="selectAnswer('<')" :class="{ selected: selectedAnswer === '<' }" :disabled="submitted">&lt;</button>
          <button type="button" class="compare-option" @click="selectAnswer('=')" :class="{ selected: selectedAnswer === '=' }" :disabled="submitted">=</button>
          <button type="button" class="compare-option" @click="selectAnswer('>')" :class="{ selected: selectedAnswer === '>' }" :disabled="submitted">&gt;</button>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/frac-compare" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
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
        .fraction-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .fraction-bar {
          display: grid;
          gap: 2px;
          width: 120px;
          height: 30px;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .frac-part {
          background: var(--color-surface);
        }
        .frac-part.filled {
          background: var(--color-primary);
        }
        .fraction-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .fraction-line {
          width: 30px;
          height: 3px;
          background: currentColor;
          margin: 2px 0;
        }
        .comparison-symbol {
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--color-primary);
          min-width: 50px;
          text-align: center;
        }
        .symbol-display {
          display: block;
        }
        .options-grid {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .compare-option {
          width: 60px;
          height: 60px;
          font-size: 2rem;
          font-weight: bold;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .compare-option:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--color-bg);
        }
        .compare-option.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .compare-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function fracCompareExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(symbol) {
              if (!this.submitted) {
                this.selectedAnswer = symbol;
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
            }
          };
        }
      </script>
    `;
  },
};
