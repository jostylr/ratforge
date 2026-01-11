import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface SpinnerParams {
  sections: { color: string; count: number }[];
  totalSections: number;
  questionColor: string;
  probability: string;
  numerator: number;
  denominator: number;
}

const colors = [
  { name: "red", hex: "#ef4444" },
  { name: "blue", hex: "#3b82f6" },
  { name: "green", hex: "#22c55e" },
  { name: "yellow", hex: "#eab308" },
  { name: "purple", hex: "#a855f7" },
];

export const spinnerExercise: Exercise = {
  id: "prob-spinner",
  topic: "probability",
  title: "Spinner Probability",
  description: "Find the probability of landing on a color",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const numColors = randomInt(2, 4, random);
    const totalSections = [4, 6, 8][randomInt(0, 2, random)]!;
    
    // Distribute sections among colors
    const selectedColors = [...colors].sort(() => random() - 0.5).slice(0, numColors);
    const sections: { color: string; hex: string; count: number }[] = [];
    
    let remaining = totalSections;
    for (let i = 0; i < numColors - 1; i++) {
      const count = randomInt(1, remaining - (numColors - 1 - i), random);
      sections.push({ color: selectedColors[i]!.name, hex: selectedColors[i]!.hex, count });
      remaining -= count;
    }
    sections.push({ color: selectedColors[numColors - 1]!.name, hex: selectedColors[numColors - 1]!.hex, count: remaining });
    
    // Pick a question color
    const questionSection = sections[randomInt(0, sections.length - 1, random)]!;
    const numerator = questionSection.count;
    const denominator = totalSections;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        sections, 
        totalSections, 
        questionColor: questionSection.color,
        probability: `${numerator}/${denominator}`,
        numerator,
        denominator
      } as unknown as Record<string, unknown>,
      correctAnswer: numerator,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as SpinnerParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.numerator) {
      return { correct: true, feedback: `Correct! Probability of ${params.questionColor} is ${params.numerator}/${params.denominator} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Count how many ${params.questionColor} sections there are out of ${params.denominator} total.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as SpinnerParams;
    
    // Generate spinner SVG paths
    const sectionAngle = 360 / params.totalSections;
    let currentAngle = -90;
    const paths: string[] = [];
    
    for (const section of params.sections as any[]) {
      for (let i = 0; i < section.count; i++) {
        const startAngle = currentAngle;
        const endAngle = currentAngle + sectionAngle;
        
        const x1 = 100 + 80 * Math.cos(startAngle * Math.PI / 180);
        const y1 = 100 + 80 * Math.sin(startAngle * Math.PI / 180);
        const x2 = 100 + 80 * Math.cos(endAngle * Math.PI / 180);
        const y2 = 100 + 80 * Math.sin(endAngle * Math.PI / 180);
        
        const largeArc = sectionAngle > 180 ? 1 : 0;
        
        paths.push(`<path d="M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${section.hex}" stroke="white" stroke-width="2"/>`);
        
        currentAngle += sectionAngle;
      }
    }
    
    return `
      <div class="exercise-container" x-data="spinnerExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>What is the probability of landing on <span style="color: ${(params.sections as any[]).find(s => s.color === params.questionColor)?.hex}">${params.questionColor}</span>?</h2>
          <p class="exercise-hint">Enter the numerator (top number) of the fraction</p>
        </div>
        
        <div class="spinner-display">
          <svg viewBox="0 0 200 200" class="spinner-svg">
            ${paths.join('')}
            <!-- Pointer -->
            <polygon points="100,15 95,35 105,35" fill="#333"/>
            <!-- Center -->
            <circle cx="100" cy="100" r="10" fill="#333"/>
          </svg>
        </div>
        
        <div class="legend">
          ${(params.sections as any[]).map(s => `
            <div class="legend-item">
              <span class="color-box" style="background: ${s.hex}"></span>
              <span>${s.color}: ${s.count}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="answer-section">
          <div class="fraction-answer">
            <input type="number" 
                   x-model="answer" 
                   min="0"
                   class="answer-input"
                   :disabled="submitted"
                   @keyup.enter="checkAnswer()">
            <span class="fraction-bar"></span>
            <span class="denominator">${params.denominator}</span>
          </div>
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
            <a href="/practice/prob-spinner" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .spinner-display {
          text-align: center;
          padding: 1rem;
          margin-bottom: 1rem;
        }
        .spinner-svg {
          max-width: 200px;
        }
        .legend {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-md);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .color-box {
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        .answer-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .fraction-answer {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .fraction-bar {
          width: 50px;
          height: 3px;
          background: currentColor;
          margin: 0.25rem 0;
        }
        .answer-input {
          width: 50px;
          padding: 0.25rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px dashed var(--color-primary);
          border-radius: var(--radius-sm);
          background: transparent;
        }
        .answer-input:focus {
          outline: none;
          border-style: solid;
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
        function spinnerExercise() {
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
                  answer: parseInt(this.answer)
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
              setTimeout(() => document.querySelector('.answer-input')?.focus(), 50);
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The answer was: ' + this.correctAnswer + '/${params.denominator}';
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
