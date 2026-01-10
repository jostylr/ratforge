import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface SharingParams {
  total: number;
  groups: number;
  perGroup: number;
  itemEmoji: string;
}

const items = ['🍪', '🍎', '⭐', '🎈', '🍬', '🎁'];

export const sharingExercise: Exercise = {
  id: "div-sharing",
  topic: "division",
  title: "Fair Sharing",
  description: "Divide items equally among groups",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const groups = randomInt(2, 5, random);
    const perGroup = randomInt(2, 6, random);
    const total = groups * perGroup;
    const itemEmoji = items[randomInt(0, items.length - 1, random)]!;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { total, groups, perGroup, itemEmoji } as unknown as Record<string, unknown>,
      correctAnswer: perGroup,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as SharingParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (answerNum === params.perGroup) {
      return { correct: true, feedback: `Correct! ${params.total} ÷ ${params.groups} = ${params.perGroup} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Share ${params.total} items equally among ${params.groups} friends.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as SharingParams;
    
    let totalItems = '';
    for (let i = 0; i < params.total; i++) {
      totalItems += `<span class="share-item">${params.itemEmoji}</span>`;
    }
    
    let groupBoxes = '';
    for (let g = 0; g < params.groups; g++) {
      groupBoxes += `
        <div class="group-box" data-group="${g}">
          <div class="group-items"></div>
          <div class="group-label">Friend ${g + 1}</div>
        </div>
      `;
    }
    
    return `
      <div class="exercise-container" x-data="sharingExercise()">
        <div class="exercise-prompt">
          <h2>Share ${params.total} items among ${params.groups} friends equally</h2>
          <p class="exercise-hint">How many does each friend get?</p>
        </div>
        
        <div class="sharing-area">
          <div class="items-pile">
            ${totalItems}
          </div>
          
          <div class="groups-row">
            ${groupBoxes}
          </div>
        </div>
        
        <div class="answer-section">
          <label>Each friend gets:</label>
          <input type="number" 
                 x-model="answer" 
                 min="1" 
                 max="50"
                 class="answer-input"
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
            <a href="/practice/div-sharing" class="btn btn-primary" x-show="correct">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .sharing-area {
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .items-pile {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          margin-bottom: 1rem;
          min-height: 60px;
        }
        .share-item {
          font-size: 2rem;
        }
        .groups-row {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .group-box {
          width: 100px;
          min-height: 100px;
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          text-align: center;
        }
        .group-items {
          min-height: 60px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25rem;
        }
        .group-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 0.5rem;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .answer-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        .answer-input {
          width: 100px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      </style>
      
      <script>
        function sharingExercise() {
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
