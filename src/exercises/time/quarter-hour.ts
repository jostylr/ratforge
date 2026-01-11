import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface QuarterHourParams {
  hour: number;
  minutes: number;
  displayHour: number;
  timeString: string;
}

export const quarterHourExercise: Exercise = {
  id: "time-quarter",
  topic: "time",
  title: "Quarter Hours",
  description: "Tell time to the quarter hour",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const hour = randomInt(1, 12, random);
    const minuteOptions = [0, 15, 30, 45];
    const minutes = minuteOptions[randomInt(0, 3, random)]!;
    
    const displayHour = minutes === 0 ? hour : hour;
    const timeString = `${hour}:${minutes.toString().padStart(2, '0')}`;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { hour, minutes, displayHour, timeString } as unknown as Record<string, unknown>,
      correctAnswer: timeString,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as QuarterHourParams;
    let answerStr = String(answer).trim();
    
    // Normalize answer format
    answerStr = answerStr.replace(/\s/g, '');
    
    // Accept various formats
    const patterns = [
      params.timeString,
      `${params.hour}:${params.minutes.toString().padStart(2, '0')}`,
      params.minutes === 0 ? `${params.hour}:00` : null,
      params.minutes === 0 ? `${params.hour}` : null,
    ].filter(Boolean);
    
    if (patterns.includes(answerStr)) {
      const timeWord = params.minutes === 0 ? "o'clock" : 
                       params.minutes === 15 ? "fifteen" :
                       params.minutes === 30 ? "thirty" : "forty-five";
      return { correct: true, feedback: `Correct! ${params.hour}:${params.minutes.toString().padStart(2, '0')} - ${timeWord} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look at where the hour and minute hands are pointing.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as QuarterHourParams;
    
    // Calculate hand positions
    const hourAngle = (params.hour % 12) * 30 + params.minutes * 0.5;
    const minuteAngle = params.minutes * 6;
    
    return `
      <div class="exercise-container" x-data="quarterHourExercise()" x-init="$nextTick(() => $refs.hourInput?.focus())">
        <div class="exercise-prompt">
          <h2>What time is it?</h2>
          <p class="exercise-hint">Read the clock and enter the time</p>
        </div>
        
        <div class="clock-display">
          <svg viewBox="0 0 200 200" class="clock-svg">
            <!-- Clock face -->
            <circle cx="100" cy="100" r="95" fill="white" stroke="#333" stroke-width="3"/>
            
            <!-- Hour markers -->
            ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
              const angle = (n * 30 - 90) * Math.PI / 180;
              const x = 100 + 75 * Math.cos(angle);
              const y = 100 + 75 * Math.sin(angle);
              return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="16" font-weight="600">${n}</text>`;
            }).join('')}
            
            <!-- Minute hand -->
            <line x1="100" y1="100" 
                  x2="${100 + 70 * Math.sin(minuteAngle * Math.PI / 180)}" 
                  y2="${100 - 70 * Math.cos(minuteAngle * Math.PI / 180)}" 
                  stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Hour hand -->
            <line x1="100" y1="100" 
                  x2="${100 + 45 * Math.sin(hourAngle * Math.PI / 180)}" 
                  y2="${100 - 45 * Math.cos(hourAngle * Math.PI / 180)}" 
                  stroke="#333" stroke-width="5" stroke-linecap="round"/>
            
            <!-- Center dot -->
            <circle cx="100" cy="100" r="5" fill="#333"/>
          </svg>
        </div>
        
        <div class="time-input-section">
          <input type="number" 
                 x-ref="hourInput"
                 x-model="hour" 
                 min="1" max="12"
                 class="time-input"
                 placeholder="H"
                 :disabled="submitted"
                 @keyup.enter="$refs.minuteInput.focus()">
          <span class="time-colon">:</span>
          <input type="number" 
                 x-ref="minuteInput"
                 x-model="minutes" 
                 min="0" max="59"
                 class="time-input"
                 placeholder="MM"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        <div class="quick-minutes">
          <button type="button" class="quick-btn" @click="minutes = '00'" :disabled="submitted">:00</button>
          <button type="button" class="quick-btn" @click="minutes = '15'" :disabled="submitted">:15</button>
          <button type="button" class="quick-btn" @click="minutes = '30'" :disabled="submitted">:30</button>
          <button type="button" class="quick-btn" @click="minutes = '45'" :disabled="submitted">:45</button>
        </div>

        <div class="exercise-controls">
          <button class="btn btn-primary btn-large"
                  @click="checkAnswer()"
                  :disabled="submitted || !hour || minutes === ''">
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
            <a href="/practice/time-quarter" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .clock-display {
          display: flex;
          justify-content: center;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .clock-svg {
          width: 200px;
          height: 200px;
        }
        .time-input-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        .time-input {
          width: 60px;
          padding: 0.5rem;
          font-size: 2rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .time-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .time-colon {
          font-size: 2rem;
          font-weight: 600;
        }
        .quick-minutes {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .quick-btn {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
        }
        .quick-btn:hover:not(:disabled) {
          background: var(--color-primary);
          color: white;
        }
        .quick-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>
      
      <script>
        function quarterHourExercise() {
          return {
            hour: '',
            minutes: '',
            submitted: false,
            correct: false,
            feedback: '',
            attempts: 0,
            givenUp: false,
            correctAnswer: window.exerciseData?.correctAnswer || '',
            dashboardUrl: window.exerciseData?.dashboardUrl || '/',
            
            async checkAnswer() {
              if (!this.hour || this.minutes === '') return;
              
              const timeStr = this.hour + ':' + this.minutes.toString().padStart(2, '0');
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: timeStr
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
              this.hour = '';
              this.minutes = '';
              setTimeout(() => this.$refs.hourInput?.focus(), 50);
            },
            
            giveUp() {
              this.givenUp = true;
              this.feedback = 'The time was: ' + this.correctAnswer;
              setTimeout(() => this.$refs.nextBtn?.focus(), 50);
            }
          };
        }
      </script>
    `;
  },
};
