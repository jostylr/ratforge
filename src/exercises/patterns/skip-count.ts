import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface SkipCountParams {
  skipBy: number;
  start: number;
  sequence: number[];
  missingIndex: number;
  missingValue: number;
}

export const skipCountExercise: Exercise = {
  id: "patterns-skip-2",
  topic: "patterns",
  title: "Count by 2s",
  description: "Skip counting by 2s on the number line",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const skipBy = 2;
    const start = randomInt(0, 4, random) * 2;
    const sequence: number[] = [];
    for (let i = 0; i < 6; i++) {
      sequence.push(start + i * skipBy);
    }
    
    const missingIndex = randomInt(2, 4, random);
    const missingValue = sequence[missingIndex]!;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { skipBy, start, sequence, missingIndex, missingValue } as unknown as Record<string, unknown>,
      correctAnswer: missingValue,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as SkipCountParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.missingValue) {
      return { correct: true, feedback: `Correct! Counting by ${params.skipBy}s: the missing number is ${params.missingValue} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Each number increases by ${params.skipBy}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as SkipCountParams;
    
    const sequenceDisplay = params.sequence.map((num, i) => {
      if (i === params.missingIndex) {
        return `<div class="seq-item missing"><input type="number" x-model="answer" class="seq-input" :disabled="submitted"></div>`;
      }
      return `<div class="seq-item">${num}</div>`;
    }).join('<span class="seq-arrow">→</span>');
    
    return `
      <div class="exercise-container" x-data="skipCountExercise()" x-init="$nextTick(() => document.querySelector('.seq-input')?.focus())">
        <div class="exercise-prompt">
          <h2>Count by ${params.skipBy}s</h2>
          <p class="exercise-hint">Find the missing number in the pattern.</p>
        </div>
        
        <div class="sequence-area">
          ${sequenceDisplay}
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
            <a href="/practice/patterns-skip-2" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .sequence-area {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .seq-item {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
          background: var(--color-surface);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .seq-item.missing {
          border-color: var(--color-primary);
          border-style: dashed;
          background: white;
        }
        .seq-input {
          width: 100%;
          height: 100%;
          border: none;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          background: transparent;
        }
        .seq-input:focus {
          outline: none;
        }
        .seq-arrow {
          font-size: 1.25rem;
          color: var(--color-text-muted);
        }
      </style>
      
      <script>
        function skipCountExercise() {
          return {
            answer: '',
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
            }
          };
        }
      </script>
    `;
  },
};
