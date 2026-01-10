import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface RecognizeParams {
  targetNumber: number;
  displayType: 'dots' | 'fingers' | 'tally';
  options: number[];
}

export const recognizeNumbersExercise: Exercise = {
  id: "counting-recognize",
  topic: "counting",
  title: "Number Recognition",
  description: "Recognize numbers 1-20 from visual representations",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const targetNumber = randomInt(1, 20, random);
    const displayTypes: Array<'dots' | 'fingers' | 'tally'> = ['dots', 'fingers', 'tally'];
    const displayType = displayTypes[randomInt(0, 2, random)];
    
    // Generate 4 options including the correct answer
    const options = new Set<number>([targetNumber]);
    while (options.size < 4) {
      const offset = randomInt(-3, 3, random);
      const option = Math.max(1, Math.min(20, targetNumber + offset));
      options.add(option);
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        targetNumber, 
        displayType,
        options: Array.from(options).sort(() => random() - 0.5)
      } as unknown as Record<string, unknown>,
      correctAnswer: targetNumber,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as RecognizeParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.targetNumber) {
      return { correct: true, feedback: "Correct! Great number recognition! 🎉" };
    }
    
    return { correct: false, feedback: `Not quite. Count again carefully - there are ${params.targetNumber} items.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as RecognizeParams;
    
    const renderDots = (count: number) => {
      let dots = '';
      for (let i = 0; i < count; i++) {
        dots += `<span class="dot">●</span>`;
      }
      return `<div class="dots-container">${dots}</div>`;
    };
    
    const renderTally = (count: number) => {
      const groups = Math.floor(count / 5);
      const remainder = count % 5;
      let tally = '';
      for (let g = 0; g < groups; g++) {
        tally += '<span class="tally-group">||||̸</span> ';
      }
      for (let r = 0; r < remainder; r++) {
        tally += '<span class="tally-mark">|</span>';
      }
      return `<div class="tally-container">${tally}</div>`;
    };
    
    const renderFingers = (count: number) => {
      const hands = [];
      let remaining = count;
      while (remaining > 0) {
        const fingers = Math.min(remaining, 5);
        hands.push(`<span class="hand">${'☝️'.repeat(fingers)}</span>`);
        remaining -= fingers;
      }
      return `<div class="fingers-container">${hands.join(' ')}</div>`;
    };
    
    let visual = '';
    switch (params.displayType) {
      case 'dots': visual = renderDots(params.targetNumber); break;
      case 'tally': visual = renderTally(params.targetNumber); break;
      case 'fingers': visual = renderFingers(params.targetNumber); break;
    }
    
    const optionButtons = params.options.map(opt => 
      `<button type="button" class="option-btn" @click="selectAnswer(${opt})" :class="{ selected: selectedAnswer === ${opt} }">${opt}</button>`
    ).join('');
    
    return `
      <div class="exercise-container" x-data="recognizeExercise()">
        <div class="exercise-prompt">
          <h2>How many do you see?</h2>
        </div>
        
        <div class="visual-area">
          ${visual}
        </div>
        
        <div class="options-grid">
          ${optionButtons}
        </div>
        
        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || selectedAnswer === null">
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
            <a href="/practice/counting-recognize" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .visual-area {
          text-align: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dots-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          max-width: 300px;
        }
        .dot {
          font-size: 2rem;
          color: var(--color-primary);
        }
        .tally-container {
          font-size: 2.5rem;
          font-family: monospace;
          letter-spacing: 0.25rem;
        }
        .tally-group { margin-right: 1rem; }
        .fingers-container {
          font-size: 2rem;
        }
        .hand { margin: 0 0.5rem; }
        .options-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto 1.5rem;
        }
        .option-btn {
          padding: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover {
          border-color: var(--color-primary);
          background: var(--color-bg);
        }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
      </style>
      
      <script>
        function recognizeExercise() {
          return {
            selectedAnswer: null,
            submitted: false,
            correct: false,
            feedback: '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            selectAnswer(num) {
              if (!this.submitted) {
                this.selectedAnswer = num;
              }
            },
            
            async checkAnswer() {
              if (this.selectedAnswer === null) return;
              
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
