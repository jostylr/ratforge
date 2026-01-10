import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface NumberBondsParams {
  whole: number;
  part1: number;
  part2: number;
  missingPosition: 'whole' | 'part1' | 'part2';
}

export const numberBondsExercise: Exercise = {
  id: "basic-number-bonds",
  topic: "basic-operations",
  title: "Number Bonds",
  description: "Interactive number bond diagrams to 10",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const whole = randomInt(3, 10, random);
    const part1 = randomInt(1, whole - 1, random);
    const part2 = whole - part1;
    
    const positions: Array<'whole' | 'part1' | 'part2'> = ['whole', 'part1', 'part2'];
    const missingPosition = positions[randomInt(0, 2, random)]!;
    
    let correctAnswer: number;
    switch (missingPosition) {
      case 'whole': correctAnswer = whole; break;
      case 'part1': correctAnswer = part1; break;
      case 'part2': correctAnswer = part2; break;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { whole, part1, part2, missingPosition } as unknown as Record<string, unknown>,
      correctAnswer: correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const correctAnswer = instance.correctAnswer as number;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === correctAnswer) {
      return { correct: true, feedback: `Perfect! You found the missing number! 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Remember: the whole equals the sum of the parts.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as NumberBondsParams;
    
    const wholeDisplay = params.missingPosition === 'whole' ? '?' : params.whole;
    const part1Display = params.missingPosition === 'part1' ? '?' : params.part1;
    const part2Display = params.missingPosition === 'part2' ? '?' : params.part2;
    
    return `
      <div class="exercise-container" x-data="numberBonds()">
        <div class="exercise-prompt">
          <h2>Find the missing number!</h2>
          <p class="exercise-hint">The whole equals the sum of both parts.</p>
        </div>
        
        <div class="bond-diagram">
          <div class="bond-whole ${params.missingPosition === 'whole' ? 'missing' : ''}">
            ${params.missingPosition === 'whole' ? 
              `<input type="number" x-model="answer" class="bond-input" min="0" max="20" :disabled="submitted">` : 
              `<span class="bond-value">${wholeDisplay}</span>`
            }
          </div>
          
          <svg class="bond-lines" viewBox="0 0 200 60">
            <line x1="100" y1="0" x2="50" y2="60" stroke="currentColor" stroke-width="3"/>
            <line x1="100" y1="0" x2="150" y2="60" stroke="currentColor" stroke-width="3"/>
          </svg>
          
          <div class="bond-parts">
            <div class="bond-part ${params.missingPosition === 'part1' ? 'missing' : ''}">
              ${params.missingPosition === 'part1' ? 
                `<input type="number" x-model="answer" class="bond-input" min="0" max="20" :disabled="submitted">` : 
                `<span class="bond-value">${part1Display}</span>`
              }
            </div>
            <div class="bond-part ${params.missingPosition === 'part2' ? 'missing' : ''}">
              ${params.missingPosition === 'part2' ? 
                `<input type="number" x-model="answer" class="bond-input" min="0" max="20" :disabled="submitted">` : 
                `<span class="bond-value">${part2Display}</span>`
              }
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct">
              Try Again
            </button>
            <a href="/practice/basic-number-bonds" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .bond-diagram {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .bond-whole, .bond-part {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--color-surface);
          border: 3px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bond-whole.missing, .bond-part.missing {
          border-color: var(--color-primary);
          border-style: dashed;
        }
        .bond-value {
          font-size: 2rem;
          font-weight: 700;
        }
        .bond-input {
          width: 50px;
          height: 50px;
          font-size: 1.5rem;
          text-align: center;
          border: none;
          background: transparent;
          font-weight: 700;
        }
        .bond-input:focus {
          outline: none;
        }
        .bond-lines {
          width: 200px;
          height: 60px;
          color: var(--color-border);
          margin: -10px 0;
        }
        .bond-parts {
          display: flex;
          gap: 4rem;
        }
      </style>
      
      <script>
        function numberBonds() {
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
