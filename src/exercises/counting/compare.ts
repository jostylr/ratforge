import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface CompareParams {
  leftCount: number;
  rightCount: number;
  leftEmoji: string;
  rightEmoji: string;
  correctAnswer: 'more' | 'less' | 'same';
}

const emojis = ['🔵', '🔴', '🟢', '🟡', '⭐', '❤️', '🍎', '🌸'];

export const compareQuantitiesExercise: Exercise = {
  id: "counting-compare",
  topic: "counting",
  title: "More, Less, Same",
  description: "Compare quantities between two groups",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const leftCount = randomInt(2, 10, random);
    
    // Generate right count with various relationships
    const relationship = randomInt(0, 2, random);
    let rightCount: number;
    let correctAnswer: 'more' | 'less' | 'same';
    
    if (relationship === 0) {
      rightCount = leftCount;
      correctAnswer = 'same';
    } else if (relationship === 1) {
      rightCount = leftCount + randomInt(1, 4, random);
      correctAnswer = 'less'; // left has less
    } else {
      rightCount = Math.max(1, leftCount - randomInt(1, 4, random));
      correctAnswer = rightCount < leftCount ? 'more' : 'same';
    }
    
    const leftEmoji = emojis[randomInt(0, emojis.length - 1, random)];
    let rightEmoji = emojis[randomInt(0, emojis.length - 1, random)];
    while (rightEmoji === leftEmoji) {
      rightEmoji = emojis[randomInt(0, emojis.length - 1, random)];
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        leftCount, 
        rightCount,
        leftEmoji,
        rightEmoji,
        correctAnswer
      } as unknown as Record<string, unknown>,
      correctAnswer: correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as CompareParams;
    
    if (answer === params.correctAnswer) {
      const messages = {
        'more': `Correct! The left group has more (${params.leftCount} vs ${params.rightCount})! 🎉`,
        'less': `Correct! The left group has less (${params.leftCount} vs ${params.rightCount})! 🎉`,
        'same': `Correct! Both groups have the same amount (${params.leftCount})! 🎉`
      };
      return { correct: true, feedback: messages[params.correctAnswer] };
    }
    
    return { correct: false, feedback: `Not quite. Count both groups: left has ${params.leftCount}, right has ${params.rightCount}.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as CompareParams;
    
    let leftItems = '';
    for (let i = 0; i < params.leftCount; i++) {
      leftItems += `<span class="compare-item">${params.leftEmoji}</span>`;
    }
    
    let rightItems = '';
    for (let i = 0; i < params.rightCount; i++) {
      rightItems += `<span class="compare-item">${params.rightEmoji}</span>`;
    }
    
    return `
      <div class="exercise-container" x-data="compareExercise()">
        <div class="exercise-prompt">
          <h2>Compare the groups!</h2>
          <p class="exercise-hint">Does the LEFT group have MORE, LESS, or the SAME as the right?</p>
        </div>
        
        <div class="compare-area">
          <div class="compare-group left-group">
            <div class="group-label">Left Group</div>
            <div class="items-container">${leftItems}</div>
          </div>
          
          <div class="compare-vs">VS</div>
          
          <div class="compare-group right-group">
            <div class="group-label">Right Group</div>
            <div class="items-container">${rightItems}</div>
          </div>
        </div>
        
        <div class="compare-buttons">
          <button type="button" 
                  class="compare-btn" 
                  @click="selectAnswer('more')" 
                  :class="{ selected: selectedAnswer === 'more' }"
                  :disabled="submitted">
            ➕ More
          </button>
          <button type="button" 
                  class="compare-btn" 
                  @click="selectAnswer('less')" 
                  :class="{ selected: selectedAnswer === 'less' }"
                  :disabled="submitted">
            ➖ Less
          </button>
          <button type="button" 
                  class="compare-btn" 
                  @click="selectAnswer('same')" 
                  :class="{ selected: selectedAnswer === 'same' }"
                  :disabled="submitted">
            🟰 Same
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct">
              Try Again
            </button>
            <a href="/practice/counting-compare" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .compare-area {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .compare-group {
          flex: 1;
          max-width: 200px;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          text-align: center;
        }
        .group-label {
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--color-text-muted);
        }
        .items-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25rem;
          min-height: 80px;
          align-items: center;
        }
        .compare-item {
          font-size: 1.75rem;
        }
        .compare-vs {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .compare-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .compare-btn {
          padding: 1rem 1.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .compare-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .compare-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .compare-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function compareExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
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
