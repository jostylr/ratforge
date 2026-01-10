import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ShapePatternParams {
  pattern: string[];
  missingIndex: number;
  correctAnswer: string;
  options: string[];
}

const shapes = ['🔴', '🔵', '🟢', '🟡', '⭐', '🔷', '🔶', '💜'];

export const shapePatternExercise: Exercise = {
  id: "patterns-shapes",
  topic: "patterns",
  title: "Shape Patterns",
  description: "Identify the missing shape in a pattern",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    // Select 2-3 shapes for the pattern
    const numShapes = randomInt(2, 3, random);
    const selectedShapes: string[] = [];
    const availableShapes = [...shapes];
    
    for (let i = 0; i < numShapes; i++) {
      const idx = randomInt(0, availableShapes.length - 1, random);
      selectedShapes.push(availableShapes[idx]!);
      availableShapes.splice(idx, 1);
    }
    
    // Create pattern with 6-8 elements
    const patternLength = randomInt(6, 8, random);
    const pattern: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      pattern.push(selectedShapes[i % numShapes]!);
    }
    
    // Choose a position to be missing (not first or last)
    const missingIndex = randomInt(2, patternLength - 2, random);
    const correctAnswer = pattern[missingIndex]!;
    
    // Generate options including correct answer
    const options = [correctAnswer];
    for (const shape of shapes) {
      if (!options.includes(shape) && options.length < 4) {
        options.push(shape);
      }
    }
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const temp = options[i]!;
      options[i] = options[j]!;
      options[j] = temp;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { pattern, missingIndex, correctAnswer, options } as unknown as Record<string, unknown>,
      correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ShapePatternParams;
    const answerStr = String(answer).trim();
    
    if (answerStr === params.correctAnswer) {
      return { correct: true, feedback: `Correct! The pattern repeats: ${params.pattern.slice(0, 3).join(' ')}... 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look at the pattern carefully and find what repeats.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ShapePatternParams;
    
    const patternDisplay = params.pattern.map((shape, i) => {
      if (i === params.missingIndex) {
        return `<span class="pattern-item missing">?</span>`;
      }
      return `<span class="pattern-item">${shape}</span>`;
    }).join('');
    
    const optionButtons = params.options.map(opt => 
      `<button type="button" class="shape-option" @click="selectAnswer('${opt}')" :class="{ selected: selectedAnswer === '${opt}' }" :disabled="submitted">${opt}</button>`
    ).join('');
    
    return `
      <div class="exercise-container" x-data="shapePatternExercise()">
        <div class="exercise-prompt">
          <h2>What shape is missing?</h2>
          <p class="exercise-hint">Find the pattern and fill in the missing shape.</p>
        </div>
        
        <div class="pattern-display">
          ${patternDisplay}
        </div>
        
        <div class="options-grid">
          ${optionButtons}
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
            <a href="/practice/patterns-shapes" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .pattern-display {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .pattern-item {
          font-size: 2.5rem;
          padding: 0.25rem;
        }
        .pattern-item.missing {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px dashed var(--color-primary);
          border-radius: var(--radius-md);
          font-size: 2rem;
          color: var(--color-primary);
          background: rgba(59, 130, 246, 0.1);
        }
        .options-grid {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .shape-option {
          width: 70px;
          height: 70px;
          font-size: 2rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .shape-option:hover:not(:disabled) {
          border-color: var(--color-primary);
          transform: scale(1.05);
        }
        .shape-option.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        .shape-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function shapePatternExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(shape) {
              if (!this.submitted) {
                this.selectedAnswer = shape;
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
