import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface TemperatureParams {
  temperature: number;
  scale: 'F' | 'C';
  questionType: 'read' | 'compare' | 'appropriate';
  answer: number | string;
  context?: string;
}

export const temperatureExercise: Exercise = {
  id: "measure-temp",
  topic: "measurement",
  title: "Temperature",
  description: "Read thermometers and understand temperature",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const questionType = randomInt(0, 2, random);
    let temperature: number, scale: 'F' | 'C', answer: number | string, context: string | undefined;
    
    if (questionType === 0) {
      // Read thermometer
      scale = randomInt(0, 1, random) === 0 ? 'F' : 'C';
      temperature = scale === 'F' ? randomInt(20, 100, random) : randomInt(-10, 40, random);
      // Round to nearest 5
      temperature = Math.round(temperature / 5) * 5;
      answer = temperature;
    } else if (questionType === 1) {
      // Compare temperatures
      scale = 'F';
      temperature = randomInt(30, 90, random);
      const temp2 = temperature + randomInt(-20, 20, random);
      context = `${temperature}°F vs ${temp2}°F`;
      answer = temperature > temp2 ? temperature : temp2;
    } else {
      // Appropriate temperature
      const scenarios = [
        { desc: 'a hot summer day', answerF: 90, answerC: 32 },
        { desc: 'freezing water', answerF: 32, answerC: 0 },
        { desc: 'a comfortable room', answerF: 70, answerC: 21 },
        { desc: 'a cold winter day', answerF: 30, answerC: -1 },
        { desc: 'boiling water', answerF: 212, answerC: 100 },
      ];
      const scenario = scenarios[randomInt(0, scenarios.length - 1, random)]!;
      scale = randomInt(0, 1, random) === 0 ? 'F' : 'C';
      temperature = scale === 'F' ? scenario.answerF : scenario.answerC;
      context = scenario.desc;
      answer = temperature;
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { temperature, scale, questionType: ['read', 'compare', 'appropriate'][questionType] as 'read' | 'compare' | 'appropriate', answer, context } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as TemperatureParams;
    const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
    
    if (params.questionType === 'appropriate') {
      // Allow some flexibility
      const correct = params.answer as number;
      if (Math.abs(answerNum - correct) <= 10) {
        return { correct: true, feedback: `Correct! About ${correct}°${params.scale} is right for ${params.context}. 🎉` };
      }
    } else if (answerNum === params.answer) {
      return { correct: true, feedback: `Correct! The temperature is ${params.answer}°${params.scale}. 🎉` };
    }
    
    return { correct: false, feedback: `Not quite. Look at the thermometer carefully.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as TemperatureParams;
    
    let questionText = '';
    if (params.questionType === 'read') {
      questionText = `What temperature does the thermometer show?`;
    } else if (params.questionType === 'compare') {
      questionText = `Which temperature is higher? ${params.context}`;
    } else {
      questionText = `What is a good temperature for ${params.context}? (°${params.scale})`;
    }
    
    // Generate thermometer SVG
    const minTemp = params.scale === 'F' ? 0 : -20;
    const maxTemp = params.scale === 'F' ? 120 : 50;
    const fillPercent = ((params.temperature - minTemp) / (maxTemp - minTemp)) * 100;
    
    return `
      <div class="exercise-container" x-data="temperatureExercise()" x-init="$nextTick(() => $refs.mainInput?.focus())">
        <div class="exercise-prompt">
          <h2>Temperature</h2>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        ${params.questionType === 'read' ? `
        <div class="thermometer-display">
          <svg viewBox="0 0 60 200" class="thermometer">
            <!-- Thermometer body -->
            <rect x="20" y="10" width="20" height="150" rx="10" fill="#e5e7eb" stroke="#6b7280" stroke-width="2"/>
            <!-- Mercury fill -->
            <rect x="22" y="${160 - fillPercent * 1.4}" width="16" height="${fillPercent * 1.4 + 10}" rx="8" fill="#ef4444"/>
            <!-- Bulb -->
            <circle cx="30" cy="175" r="18" fill="#ef4444" stroke="#6b7280" stroke-width="2"/>
            <!-- Scale marks -->
            ${[0, 25, 50, 75, 100].map(p => {
              const y = 150 - p * 1.4 + 10;
              const temp = Math.round(minTemp + (maxTemp - minTemp) * (p / 100));
              return `<line x1="42" y1="${y}" x2="50" y2="${y}" stroke="#6b7280" stroke-width="1"/>
                      <text x="52" y="${y + 4}" font-size="10" fill="#374151">${temp}°</text>`;
            }).join('')}
          </svg>
          <p class="scale-label">°${params.scale}</p>
        </div>
        ` : ''}
        
        <div class="answer-section">
          <input type="number" 
                 x-model="answer" 
                 x-ref="mainInput"
                 class="answer-input"
                 :disabled="submitted"
                 @keyup.enter="checkAnswer()">
          <span class="unit">°${params.scale}</span>
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
              <button type="button" class="pad-btn pad-special" @click="answer = answer?.startsWith('-') ? answer.slice(1) : '-' + (answer || '')" :disabled="submitted">±</button>
              <button type="button" class="pad-btn" @click="answer = (answer || '') + '0'" :disabled="submitted">0</button>
              <button type="button" class="pad-btn pad-special" @click="answer = ''" :disabled="submitted">C</button>
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
            <a href="/practice/measure-temp" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .thermometer-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .thermometer {
          height: 200px;
          width: auto;
        }
        .scale-label {
          margin-top: 0.5rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .answer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
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
        .unit {
          font-size: 1.5rem;
          font-weight: 600;
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
      </style>
      
      <script>
        function temperatureExercise() {
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
