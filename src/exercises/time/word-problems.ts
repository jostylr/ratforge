import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TimeWordProblemParams {
  scenario: string;
  startTime: string;
  duration: number;
  answer: string;
  answerMinutes: number;
}

const scenarios = [
  { template: 'The movie starts at {start}. It is {duration} minutes long. What time does it end?', type: 'end' },
  { template: 'Soccer practice starts at {start} and lasts {duration} minutes. What time does it end?', type: 'end' },
  { template: 'The bus leaves at {start}. The ride takes {duration} minutes. What time do you arrive?', type: 'end' },
  { template: 'Lunch starts at {start} and lasts {duration} minutes. What time does lunch end?', type: 'end' },
];

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

export const timeWordProblemExercise: Exercise = {
  id: "time-word-problems",
  topic: "time",
  title: "Time Word Problems",
  description: "Solve time story problems",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const scenarioData = scenarios[randomInt(0, scenarios.length - 1, random)]!;
    
    // Generate start time (on the hour or half hour for simplicity)
    const startHour = randomInt(8, 16, random);
    const startMinute = [0, 30][randomInt(0, 1, random)]!;
    
    // Duration in multiples of 15 minutes
    const duration = [15, 30, 45, 60, 90][randomInt(0, 4, random)]!;
    
    // Calculate end time
    let endMinute = startMinute + duration;
    let endHour = startHour;
    while (endMinute >= 60) {
      endMinute -= 60;
      endHour++;
    }
    
    const startTime = formatTime(startHour, startMinute);
    const answer = formatTime(endHour, endMinute);
    
    const scenario = scenarioData.template
      .replace('{start}', startTime)
      .replace('{duration}', String(duration));
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { 
        scenario, 
        startTime, 
        duration, 
        answer,
        answerMinutes: endHour * 60 + endMinute
      } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TimeWordProblemParams;
    const answerStr = String(answer).toUpperCase().replace(/\s+/g, ' ').trim();
    const correctStr = params.answer.toUpperCase();
    
    // Parse the answer to compare times
    const parseTime = (str: string): number | null => {
      const match = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!match) return null;
      let hour = parseInt(match[1]!, 10);
      const minute = parseInt(match[2]!, 10);
      const period = match[3]?.toUpperCase();
      if (period === 'PM' && hour < 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return hour * 60 + minute;
    };
    
    const answerMins = parseTime(answerStr);
    if (answerMins === params.answerMinutes) {
      return { correct: true, feedback: `Correct! The answer is ${params.answer} 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Start at ${params.startTime} and add ${params.duration} minutes.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TimeWordProblemParams;
    
    return `
      <div class="exercise-container" x-data="timeWordProblemExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Solve the Problem</h2>
        </div>
        
        <div class="problem-card">
          <p class="problem-text">${params.scenario}</p>
        </div>
        
        <div class="answer-section">
          <label>Answer:</label>
          <input type="text" 
                 x-model="answer" 
                 x-ref="mainInput"
                 placeholder="e.g., 2:30 PM"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
        </div>
        
        <div class="time-helper">
          <p>Format: H:MM AM or H:MM PM</p>
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
            <a href="/practice/time-word-problems" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .problem-card {
          padding: 2rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .problem-text {
          font-size: 1.25rem;
          line-height: 1.6;
          margin: 0;
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .answer-input {
          width: 150px;
          padding: 0.75rem;
          font-size: 1.25rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }
        .time-helper {
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .time-helper p {
          margin: 0;
        }
      </style>
      
      <script>
        function timeWordProblemExercise() {
          return {
            answer: '',
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
                  answer: this.answer
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
              setTimeout(() => this.$refs.mainInput?.focus(), 50);
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
