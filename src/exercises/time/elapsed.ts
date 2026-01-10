import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface ElapsedTimeParams {
  startHour: number;
  startMinute: number;
  elapsedMinutes: number;
  endHour: number;
  endMinute: number;
  questionType: 'find-end' | 'find-elapsed';
}

export const elapsedTimeExercise: Exercise = {
  id: "time-elapsed",
  topic: "time",
  title: "Elapsed Time",
  description: "Calculate elapsed time between two times",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const startHour = randomInt(1, 11, random);
    const startMinute = randomInt(0, 1, random) * 30; // 0 or 30
    const elapsedMinutes = randomInt(1, 4, random) * 30; // 30, 60, 90, or 120 minutes
    
    let totalMinutes = startHour * 60 + startMinute + elapsedMinutes;
    let endHour = Math.floor(totalMinutes / 60) % 12;
    if (endHour === 0) endHour = 12;
    const endMinute = totalMinutes % 60;
    
    const questionType = random() > 0.5 ? 'find-end' : 'find-elapsed';
    const correctAnswer = questionType === 'find-elapsed' ? elapsedMinutes : endHour * 100 + endMinute;
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { startHour, startMinute, elapsedMinutes, endHour, endMinute, questionType } as unknown as Record<string, unknown>,
      correctAnswer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as ElapsedTimeParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (params.questionType === 'find-elapsed') {
      if (answerNum === params.elapsedMinutes) {
        const hours = Math.floor(params.elapsedMinutes / 60);
        const mins = params.elapsedMinutes % 60;
        const timeStr = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}${mins > 0 ? ` and ${mins} minutes` : ''}` : `${mins} minutes`;
        return { correct: true, feedback: `Correct! ${timeStr} elapsed. 🎉` };
      }
    } else {
      const expectedAnswer = params.endHour * 100 + params.endMinute;
      if (answerNum === expectedAnswer || answerNum === params.endHour * 60 + params.endMinute) {
        return { correct: true, feedback: `Correct! The end time is ${params.endHour}:${String(params.endMinute).padStart(2, '0')}. 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Try counting the time on a clock.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as ElapsedTimeParams;
    
    const formatTime = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;
    const formatElapsed = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      if (h > 0 && m > 0) return `${h} hour${h > 1 ? 's' : ''} ${m} min`;
      if (h > 0) return `${h} hour${h > 1 ? 's' : ''}`;
      return `${m} minutes`;
    };
    
    const prompt = params.questionType === 'find-end'
      ? `Start: <strong>${formatTime(params.startHour, params.startMinute)}</strong><br>Time passed: <strong>${formatElapsed(params.elapsedMinutes)}</strong><br>End time: <strong>?</strong>`
      : `Start: <strong>${formatTime(params.startHour, params.startMinute)}</strong><br>End: <strong>${formatTime(params.endHour, params.endMinute)}</strong><br>Time passed: <strong>? minutes</strong>`;
    
    // Draw clock hands
    const startAngle = (params.startHour % 12) * 30 + params.startMinute * 0.5 - 90;
    const startMinAngle = params.startMinute * 6 - 90;
    
    return `
      <div class="exercise-container" x-data="elapsedTimeExercise()" x-init="$nextTick(() => document.querySelector('.answer-input')?.focus())">
        <div class="exercise-prompt">
          <h2>${params.questionType === 'find-end' ? 'What time will it be?' : 'How much time passed?'}</h2>
        </div>
        
        <div class="time-display">
          <div class="clock-visual">
            <svg viewBox="0 0 100 100" class="clock-svg">
              <circle cx="50" cy="50" r="45" fill="white" stroke="#333" stroke-width="2"/>
              ${[...Array(12)].map((_, i) => {
                const angle = (i * 30 - 60) * Math.PI / 180;
                const x = 50 + 38 * Math.cos(angle);
                const y = 50 + 38 * Math.sin(angle);
                return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="8" font-weight="600">${i + 1}</text>`;
              }).join('')}
              <line x1="50" y1="50" x2="${50 + 25 * Math.cos(startAngle * Math.PI / 180)}" y2="${50 + 25 * Math.sin(startAngle * Math.PI / 180)}" stroke="#333" stroke-width="3" stroke-linecap="round"/>
              <line x1="50" y1="50" x2="${50 + 35 * Math.cos(startMinAngle * Math.PI / 180)}" y2="${50 + 35 * Math.sin(startMinAngle * Math.PI / 180)}" stroke="#666" stroke-width="2" stroke-linecap="round"/>
              <circle cx="50" cy="50" r="3" fill="#333"/>
            </svg>
            <span class="clock-label">Start: ${formatTime(params.startHour, params.startMinute)}</span>
          </div>
          
          <div class="time-info">
            ${prompt}
          </div>
        </div>
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 min="0" 
                 max="1259"
                 class="answer-input"
                 placeholder="${params.questionType === 'find-elapsed' ? 'minutes' : 'e.g. 230'}"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="unit-label">${params.questionType === 'find-elapsed' ? 'minutes' : '(hour + minutes, e.g. 230 = 2:30)'}</span>
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
            <button class="btn btn-primary" @click="tryAgain()" x-show="!correct" x-ref="tryAgainBtn">
              Try Again
            </button>
            <a href="/practice/time-elapsed" class="btn btn-primary" x-show="correct" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .time-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .clock-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .clock-svg {
          width: 120px;
          height: 120px;
        }
        .clock-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .time-info {
          font-size: 1.1rem;
          line-height: 1.8;
          text-align: center;
        }
        .answer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 120px;
          padding: 0.75rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .unit-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
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
        function elapsedTimeExercise() {
          return {
            answer: '',
            showNumpad: true,
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
            }
          };
        }
      </script>
    `;
  },
};
