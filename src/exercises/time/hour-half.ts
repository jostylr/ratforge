import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface HourHalfParams {
  hour: number;
  isHalf: boolean;
  displayTime: string;
}

export const hourHalfExercise: Exercise = {
  id: "time-hour-half",
  topic: "time",
  title: "Hour & Half-Hour",
  description: "Tell time to the hour and half-hour",
  difficulty: 1,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const hour = randomInt(1, 12, random);
    const isHalf = random() > 0.5;
    const displayTime = isHalf ? `${hour}:30` : `${hour}:00`;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { hour, isHalf, displayTime } as unknown as Record<string, unknown>,
      correctAnswer: displayTime,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as HourHalfParams;
    const answerStr = String(answer).trim();
    
    // Accept various formats
    const normalized = answerStr.replace(/\s/g, '');
    const expected = params.displayTime;
    
    if (normalized === expected || normalized === expected.replace(':00', '') || 
        (params.isHalf && normalized === `${params.hour}30`)) {
      return { correct: true, feedback: `Correct! The time is ${params.displayTime} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look at where the hands are pointing.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as HourHalfParams;
    
    // Calculate hand positions
    const hourAngle = (params.hour % 12) * 30 + (params.isHalf ? 15 : 0);
    const minuteAngle = params.isHalf ? 180 : 0;
    
    return `
      <div class="exercise-container" x-data="hourHalfExercise()" x-init="$nextTick(() => document.querySelector('.time-input')?.focus())">
        <div class="exercise-prompt">
          <h2>What time is it?</h2>
        </div>
        
        <div class="clock-container">
          <svg viewBox="0 0 200 200" class="analog-clock">
            <!-- Clock face -->
            <circle cx="100" cy="100" r="95" fill="white" stroke="var(--color-border)" stroke-width="4"/>
            
            <!-- Hour markers -->
            ${[...Array(12)].map((_, i) => {
              const angle = i * 30 - 90;
              const x = 100 + 80 * Math.cos(angle * Math.PI / 180);
              const y = 100 + 80 * Math.sin(angle * Math.PI / 180);
              return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="600">${i === 0 ? 12 : i}</text>`;
            }).join('')}
            
            <!-- Hour hand -->
            <line x1="100" y1="100" 
                  x2="${100 + 50 * Math.sin(hourAngle * Math.PI / 180)}" 
                  y2="${100 - 50 * Math.cos(hourAngle * Math.PI / 180)}" 
                  stroke="#333" stroke-width="6" stroke-linecap="round"/>
            
            <!-- Minute hand -->
            <line x1="100" y1="100" 
                  x2="${100 + 70 * Math.sin(minuteAngle * Math.PI / 180)}" 
                  y2="${100 - 70 * Math.cos(minuteAngle * Math.PI / 180)}" 
                  stroke="var(--color-primary)" stroke-width="4" stroke-linecap="round"/>
            
            <!-- Center dot -->
            <circle cx="100" cy="100" r="5" fill="#333"/>
          </svg>
        </div>
        
        <div class="answer-section">
          <input type="text" 
                 x-model="answer" 
                 placeholder="0:00"
                 class="time-input"
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/time-hour-half" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .clock-container {
          display: flex;
          justify-content: center;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .analog-clock {
          width: 250px;
          height: 250px;
        }
        .answer-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .time-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .time-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      </style>
      
      <script>
        function hourHalfExercise() {
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
              setTimeout(() => document.querySelector('.time-input')?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
