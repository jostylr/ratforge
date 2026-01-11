import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface Shapes3DParams {
  shape: string;
  faces: number;
  edges: number;
  vertices: number;
  questionType: 'identify' | 'faces' | 'edges' | 'vertices';
  answer: string | number;
}

const shapes3D = [
  { name: 'cube', faces: 6, edges: 12, vertices: 8 },
  { name: 'rectangular prism', faces: 6, edges: 12, vertices: 8 },
  { name: 'sphere', faces: 1, edges: 0, vertices: 0 },
  { name: 'cylinder', faces: 3, edges: 2, vertices: 0 },
  { name: 'cone', faces: 2, edges: 1, vertices: 1 },
  { name: 'triangular prism', faces: 5, edges: 9, vertices: 6 },
  { name: 'pyramid', faces: 5, edges: 8, vertices: 5 },
];

function getShapeSVG(shapeName: string): string {
  const svgs: Record<string, string> = {
    'cube': `<svg viewBox="0 0 100 100"><polygon points="30,70 30,30 70,30 70,70" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><polygon points="30,30 50,15 90,15 70,30" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/><polygon points="70,30 90,15 90,55 70,70" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/></svg>`,
    'rectangular prism': `<svg viewBox="0 0 100 100"><polygon points="20,75 20,35 60,35 60,75" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><polygon points="20,35 35,20 95,20 60,35" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/><polygon points="60,35 95,20 95,60 60,75" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/></svg>`,
    'sphere': `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><ellipse cx="50" cy="50" rx="40" ry="10" fill="none" stroke="#1d4ed8" stroke-width="1" stroke-dasharray="4"/></svg>`,
    'cylinder': `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="25" rx="30" ry="10" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/><rect x="20" y="25" width="60" height="50" fill="#3b82f6" stroke="none"/><line x1="20" y1="25" x2="20" y2="75" stroke="#1d4ed8" stroke-width="2"/><line x1="80" y1="25" x2="80" y2="75" stroke="#1d4ed8" stroke-width="2"/><ellipse cx="50" cy="75" rx="30" ry="10" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/></svg>`,
    'cone': `<svg viewBox="0 0 100 100"><polygon points="50,15 20,75 80,75" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><ellipse cx="50" cy="75" rx="30" ry="10" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/></svg>`,
    'triangular prism': `<svg viewBox="0 0 100 100"><polygon points="25,75 50,35 75,75" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><polygon points="50,35 70,20 95,60 75,75" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/><polygon points="50,35 70,20 70,20" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2"/><line x1="75" y1="75" x2="95" y2="60" stroke="#1d4ed8" stroke-width="2"/></svg>`,
    'pyramid': `<svg viewBox="0 0 100 100"><polygon points="50,15 20,75 50,90 80,75" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2"/><polygon points="50,15 80,75 50,90" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/><line x1="50" y1="90" x2="50" y2="15" stroke="#1d4ed8" stroke-width="1" stroke-dasharray="3"/></svg>`,
  };
  return svgs[shapeName] || svgs['cube']!;
}

export const shapes3DExercise: Exercise = {
  id: "geometry-3d",
  topic: "geometry",
  title: "3D Shapes",
  description: "Identify 3D shapes and their properties",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const shapeData = shapes3D[randomInt(0, shapes3D.length - 1, random)]!;
    const questionTypes: ('identify' | 'faces' | 'edges' | 'vertices')[] = ['identify', 'faces', 'edges', 'vertices'];
    const questionType = questionTypes[randomInt(0, 3, random)]!;
    
    let answer: string | number;
    if (questionType === 'identify') {
      answer = shapeData.name;
    } else if (questionType === 'faces') {
      answer = shapeData.faces;
    } else if (questionType === 'edges') {
      answer = shapeData.edges;
    } else {
      answer = shapeData.vertices;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        shape: shapeData.name, 
        faces: shapeData.faces,
        edges: shapeData.edges,
        vertices: shapeData.vertices,
        questionType, 
        answer 
      } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as Shapes3DParams;
    
    if (params.questionType === 'identify') {
      const answerStr = String(answer).toLowerCase().trim();
      if (answerStr === params.shape.toLowerCase()) {
        return { correct: true, feedback: `Correct! This is a ${params.shape}. 🎉` };
      }
    } else {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.answer) {
        return { correct: true, feedback: `Correct! A ${params.shape} has ${params.answer} ${params.questionType}. 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Look at the shape carefully.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as Shapes3DParams;
    
    const questionText = params.questionType === 'identify' 
      ? 'What is the name of this 3D shape?'
      : `How many ${params.questionType} does this ${params.shape} have?`;
    
    return `
      <div class="exercise-container" x-data="shapes3DExercise()">
        <div class="exercise-prompt">
          <h2>3D Shapes</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="shape-display">
          ${getShapeSVG(params.shape)}
          ${params.questionType !== 'identify' ? `<p class="shape-name">${params.shape}</p>` : ''}
        </div>
        
        ${params.questionType === 'identify' ? `
          <div class="options-grid">
            ${shapes3D.map(s => `
              <button type="button" class="option-btn" @click="selectAnswer('${s.name}')" :class="{ selected: selectedAnswer === '${s.name}' }" :disabled="submitted">
                ${s.name}
              </button>
            `).join('')}
          </div>
        ` : `
          <div class="answer-section">
            <input type="number" 
                   x-model="answer" 
                   x-ref="mainInput"
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
                <button type="button" class="pad-btn pad-enter" @click="checkAnswer()" :disabled="submitted || !answer">↵</button>
              </div>
            </div>
          </div>
        `}

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || ${params.questionType === 'identify' ? '!selectedAnswer' : '!answer'}">
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
            <a href="/practice/geometry-3d" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
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
          text-align: center;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .shape-display svg {
          max-width: 150px;
          max-height: 150px;
        }
        .shape-name {
          margin: 0.5rem 0 0;
          font-weight: 600;
          text-transform: capitalize;
        }
        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          text-transform: capitalize;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
        }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 80px;
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
        .pad-enter { background: var(--color-primary); color: white; }
      </style>
      
      <script>
        function shapes3DExercise() {
          return {
            answer: '',
            selectedAnswer: null,
            showNumpad: true,
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
              const answerValue = this.answer || this.selectedAnswer;
              if (!answerValue) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: answerValue
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
