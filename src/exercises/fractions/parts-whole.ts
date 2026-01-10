import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface PartsWholeParams {
  numerator: number;
  denominator: number;
  shapeType: 'circle' | 'rectangle';
}

export const partsWholeExercise: Exercise = {
  id: "frac-parts",
  topic: "fractions",
  title: "Understanding Fractions",
  description: "Learn fractions as parts of a whole",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const denominators = [2, 3, 4, 6, 8];
    const denominator = denominators[randomInt(0, denominators.length - 1, random)]!;
    const numerator = randomInt(1, denominator - 1, random);
    const shapeType = random() > 0.5 ? 'circle' : 'rectangle';
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { numerator, denominator, shapeType } as unknown as Record<string, unknown>,
      correctAnswer: `${numerator}/${denominator}`,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as PartsWholeParams;
    const expected = `${params.numerator}/${params.denominator}`;
    const answerStr = String(answer).replace(/\s/g, '');
    
    if (answerStr === expected) {
      return { correct: true, feedback: `Correct! ${params.numerator} out of ${params.denominator} parts = ${expected} 🎉` };
    }
    
    // Check for equivalent fractions
    const [ansNum, ansDen] = answerStr.split('/').map(Number);
    if (ansNum && ansDen && (ansNum / ansDen) === (params.numerator / params.denominator)) {
      return { correct: true, feedback: `Correct! ${answerStr} is equivalent to ${expected} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Count the shaded parts (${params.numerator}) over total parts (${params.denominator}).` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as PartsWholeParams;
    
    let shape = '';
    if (params.shapeType === 'circle') {
      // Create pie slices using SVG
      const sliceAngle = 360 / params.denominator;
      let slices = '';
      for (let i = 0; i < params.denominator; i++) {
        const startAngle = i * sliceAngle - 90;
        const endAngle = startAngle + sliceAngle;
        const isFilled = i < params.numerator;
        
        const x1 = 50 + 45 * Math.cos(startAngle * Math.PI / 180);
        const y1 = 50 + 45 * Math.sin(startAngle * Math.PI / 180);
        const x2 = 50 + 45 * Math.cos(endAngle * Math.PI / 180);
        const y2 = 50 + 45 * Math.sin(endAngle * Math.PI / 180);
        const largeArc = sliceAngle > 180 ? 1 : 0;
        
        slices += `<path d="M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z" 
                        fill="${isFilled ? 'var(--color-primary)' : 'white'}" 
                        stroke="var(--color-border)" 
                        stroke-width="2"/>`;
      }
      shape = `<svg viewBox="0 0 100 100" class="fraction-shape">${slices}</svg>`;
    } else {
      // Create rectangle grid
      let cells = '';
      for (let i = 0; i < params.denominator; i++) {
        const isFilled = i < params.numerator;
        cells += `<div class="rect-cell ${isFilled ? 'filled' : ''}"></div>`;
      }
      shape = `<div class="rect-grid" style="grid-template-columns: repeat(${Math.min(params.denominator, 4)}, 1fr);">${cells}</div>`;
    }
    
    return `
      <div class="exercise-container" x-data="partsWholeExercise()">
        <div class="exercise-prompt">
          <h2>What fraction is shaded?</h2>
          <p class="exercise-hint">Write as numerator/denominator (e.g., 1/4)</p>
        </div>
        
        <div class="fraction-visual">
          ${shape}
        </div>
        
        <div class="answer-section">
          <input type="text" 
                 x-model="answer" 
                 placeholder="?/?"
                 class="fraction-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
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
            <a href="/practice/frac-parts" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .fraction-visual {
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .fraction-shape {
          width: 200px;
          height: 200px;
        }
        .rect-grid {
          display: grid;
          gap: 4px;
          max-width: 300px;
        }
        .rect-cell {
          aspect-ratio: 1;
          min-width: 50px;
          background: white;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .rect-cell.filled {
          background: var(--color-primary);
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .fraction-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .fraction-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      </style>
      
      <script>
        function partsWholeExercise() {
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
                  answer: this.answer
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
