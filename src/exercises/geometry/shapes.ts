import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ShapesParams {
  shapeName: string;
  sides: number;
  shapeType: 'polygon' | 'circle';
  options: string[];
}

const shapes = [
  { name: 'triangle', sides: 3, type: 'polygon' as const },
  { name: 'square', sides: 4, type: 'polygon' as const },
  { name: 'rectangle', sides: 4, type: 'polygon' as const },
  { name: 'pentagon', sides: 5, type: 'polygon' as const },
  { name: 'hexagon', sides: 6, type: 'polygon' as const },
  { name: 'circle', sides: 0, type: 'circle' as const },
];

export const shapesExercise: Exercise = {
  id: "geometry-shapes",
  topic: "geometry",
  title: "Identify Shapes",
  description: "Learn to identify basic geometric shapes",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const shapeIndex = randomInt(0, shapes.length - 1, random);
    const correctShape = shapes[shapeIndex]!;
    
    // Generate options including the correct answer
    const options: string[] = [correctShape.name];
    const otherShapes = shapes.filter(s => s.name !== correctShape.name);
    while (options.length < 4 && otherShapes.length > 0) {
      const idx = randomInt(0, otherShapes.length - 1, random);
      const shape = otherShapes[idx];
      if (shape && !options.includes(shape.name)) {
        options.push(shape.name);
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
      params: { 
        shapeName: correctShape.name, 
        sides: correctShape.sides,
        shapeType: correctShape.type,
        options 
      } as unknown as Record<string, unknown>,
      correctAnswer: correctShape.name,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ShapesParams;
    const answerStr = String(answer).toLowerCase().trim();
    
    if (answerStr === params.shapeName) {
      const sidesText = params.sides > 0 ? ` It has ${params.sides} sides.` : '';
      return { correct: true, feedback: `Correct! This is a ${params.shapeName}.${sidesText} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look at the number of sides and the shape's properties.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ShapesParams;
    
    // Generate SVG for the shape
    let shapeSvg = '';
    switch (params.shapeName) {
      case 'triangle':
        shapeSvg = `<polygon points="100,20 180,160 20,160" fill="var(--color-primary)" stroke="var(--color-primary-dark)" stroke-width="3"/>`;
        break;
      case 'square':
        shapeSvg = `<rect x="30" y="30" width="140" height="140" fill="var(--color-primary)" stroke="var(--color-primary-dark)" stroke-width="3"/>`;
        break;
      case 'rectangle':
        shapeSvg = `<rect x="20" y="50" width="160" height="100" fill="var(--color-primary)" stroke="var(--color-primary-dark)" stroke-width="3"/>`;
        break;
      case 'pentagon':
        shapeSvg = `<polygon points="100,20 180,75 155,160 45,160 20,75" fill="var(--color-primary)" stroke="var(--color-primary-dark)" stroke-width="3"/>`;
        break;
      case 'hexagon':
        shapeSvg = `<polygon points="100,20 170,50 170,130 100,160 30,130 30,50" fill="var(--color-primary)" stroke="var(--color-primary-dark)" stroke-width="3"/>`;
        break;
      case 'circle':
        shapeSvg = `<circle cx="100" cy="100" r="80" fill="var(--color-primary)" stroke="var(--color-primary-dark)" stroke-width="3"/>`;
        break;
    }
    
    const optionButtons = params.options.map(opt => 
      `<button type="button" class="shape-option" @click="selectAnswer('${opt}')" :class="{ selected: selectedAnswer === '${opt}' }" :disabled="submitted">${opt.charAt(0).toUpperCase() + opt.slice(1)}</button>`
    ).join('');
    
    return `
      <div class="exercise-container" x-data="shapesExercise()">
        <div class="exercise-prompt">
          <h2>What shape is this?</h2>
        </div>
        
        <div class="shape-display">
          <svg viewBox="0 0 200 180" class="shape-svg">
            ${shapeSvg}
          </svg>
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
            <a href="/practice/geometry-shapes" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .shape-display {
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .shape-svg {
          width: 200px;
          height: 180px;
        }
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto 1.5rem;
        }
        .shape-option {
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 500;
          text-transform: capitalize;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .shape-option:hover:not(:disabled) {
          border-color: var(--color-primary);
          background: var(--color-bg);
        }
        .shape-option.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .shape-option:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function shapesExercise() {
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
