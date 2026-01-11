import type { Exercise, ExerciseInstance, ValidationResult } from "../types";
import { createSeed, seededRandom, randomInt } from "../types";

export interface LineGraphParams {
  title: string;
  labels: string[];
  values: number[];
  questionType: 'read' | 'compare' | 'trend';
  questionIndex?: number;
  answer: number | string;
}

export const lineGraphExercise: Exercise = {
  id: "data-line-graph",
  topic: "data",
  title: "Line Graphs",
  description: "Read and interpret line graphs",
  difficulty: 2,

  generate(seed?: number): ExerciseInstance {
    const actualSeed = seed ?? createSeed();
    const random = seededRandom(actualSeed);
    
    const topics = [
      { title: 'Temperature Over a Week', labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], unit: '°F' },
      { title: 'Books Read Each Month', labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], unit: '' },
      { title: 'Plant Height Over Time', labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], unit: 'cm' },
    ];
    
    const topic = topics[randomInt(0, topics.length - 1, random)]!;
    const values = topic.labels.map(() => randomInt(10, 50, random));
    
    const questionTypes: ('read' | 'compare' | 'trend')[] = ['read', 'compare', 'trend'];
    const questionType = questionTypes[randomInt(0, 2, random)]!;
    
    let answer: number | string;
    let questionIndex: number | undefined;
    
    if (questionType === 'read') {
      questionIndex = randomInt(0, topic.labels.length - 1, random);
      answer = values[questionIndex]!;
    } else if (questionType === 'compare') {
      answer = Math.max(...values);
    } else {
      // trend - is it increasing or decreasing overall?
      const first = values[0]!;
      const last = values[values.length - 1]!;
      answer = last > first ? 'increasing' : last < first ? 'decreasing' : 'same';
    }
    
    return {
      id: `${this.id}-${actualSeed}`,
      exerciseId: this.id,
      seed: actualSeed,
      params: { title: topic.title, labels: topic.labels, values, questionType, questionIndex, answer } as unknown as Record<string, unknown>,
      correctAnswer: answer,
      createdAt: new Date().toISOString(),
    };
  },

  validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
    const params = instance.params as unknown as LineGraphParams;
    
    if (params.questionType === 'trend') {
      const answerStr = String(answer).toLowerCase().trim();
      if (answerStr === params.answer) {
        return { correct: true, feedback: `Correct! The trend is ${params.answer}. 🎉` };
      }
    } else {
      const answerNum = typeof answer === "number" ? answer : parseInt(String(answer), 10);
      if (answerNum === params.answer) {
        return { correct: true, feedback: `Correct! 🎉` };
      }
    }
    
    return { correct: false, feedback: `Not quite. Look at the graph carefully.` };
  },

  renderHTML(instance: ExerciseInstance): string {
    const params = instance.params as unknown as LineGraphParams;
    
    let questionText = '';
    if (params.questionType === 'read') {
      questionText = `What is the value for ${params.labels[params.questionIndex!]}?`;
    } else if (params.questionType === 'compare') {
      questionText = 'What is the highest value shown?';
    } else {
      questionText = 'Is the overall trend increasing, decreasing, or staying the same?';
    }
    
    // Generate SVG line graph
    const maxValue = Math.max(...params.values);
    const width = 300;
    const height = 200;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    const points = params.values.map((v, i) => {
      const x = padding + (i / (params.labels.length - 1)) * graphWidth;
      const y = height - padding - (v / maxValue) * graphHeight;
      return `${x},${y}`;
    }).join(' ');
    
    const dotsSvg = params.values.map((v, i) => {
      const x = padding + (i / (params.labels.length - 1)) * graphWidth;
      const y = height - padding - (v / maxValue) * graphHeight;
      return `<circle cx="${x}" cy="${y}" r="5" fill="#3b82f6"/>`;
    }).join('');
    
    const labelsSvg = params.labels.map((label, i) => {
      const x = padding + (i / (params.labels.length - 1)) * graphWidth;
      return `<text x="${x}" y="${height - 10}" text-anchor="middle" font-size="10" fill="#6b7280">${label}</text>`;
    }).join('');
    
    return `
      <div class="exercise-container" x-data="lineGraphExercise()">
        <div class="exercise-prompt">
          <h2>Line Graphs</h2>
          <p class="graph-title">${params.title}</p>
          <p class="exercise-hint">${questionText}</p>
        </div>
        
        <div class="graph-container">
          <svg viewBox="0 0 ${width} ${height}" class="line-graph">
            <!-- Grid lines -->
            ${[0, 0.25, 0.5, 0.75, 1].map(p => {
              const y = height - padding - p * graphHeight;
              const val = Math.round(p * maxValue);
              return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e5e7eb" stroke-width="1"/>
                      <text x="${padding - 5}" y="${y + 4}" text-anchor="end" font-size="10" fill="#6b7280">${val}</text>`;
            }).join('')}
            
            <!-- Line -->
            <polyline points="${points}" fill="none" stroke="#3b82f6" stroke-width="2"/>
            
            <!-- Dots -->
            ${dotsSvg}
            
            <!-- X-axis labels -->
            ${labelsSvg}
          </svg>
        </div>
        
        ${params.questionType === 'trend' ? `
        <div class="options-row">
          <button type="button" class="option-btn" @click="selectAnswer('increasing')" :class="{ selected: selectedAnswer === 'increasing' }" :disabled="submitted">
            📈 Increasing
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('decreasing')" :class="{ selected: selectedAnswer === 'decreasing' }" :disabled="submitted">
            📉 Decreasing
          </button>
          <button type="button" class="option-btn" @click="selectAnswer('same')" :class="{ selected: selectedAnswer === 'same' }" :disabled="submitted">
            ➡️ Same
          </button>
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
                  :disabled="submitted || ${params.questionType === 'trend' ? '!selectedAnswer' : '!answer'}">
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
            <a href="/practice/data-line-graph" class="btn btn-primary" x-show="correct || givenUp" x-ref="nextBtn">
              Next Exercise
            </a>
            <a :href="dashboardUrl" class="btn btn-secondary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
      
      <style>
        .graph-title {
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .graph-container {
          display: flex;
          justify-content: center;
          padding: 1rem;
          background: var(--color-bg);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .line-graph {
          max-width: 350px;
          width: 100%;
        }
        .options-row {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .option-btn {
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all 0.2s;
        }
        .option-btn:hover:not(:disabled) { border-color: var(--color-primary); }
        .option-btn.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: white;
        }
        .option-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .answer-section {
          text-align: center;
          margin-bottom: 1rem;
        }
        .answer-input {
          width: 100px;
          padding: 0.5rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .answer-input:focus { outline: none; border-color: var(--color-primary); }
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
        .pad-btn:hover:not(:disabled) { background: var(--color-primary); color: white; }
        .pad-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .pad-special { background: var(--color-bg); }
        .pad-enter { background: var(--color-primary); color: white; }
      </style>
      
      <script>
        function lineGraphExercise() {
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
            
            selectAnswer(ans) {
              if (!this.submitted) {
                this.selectedAnswer = ans;
              }
            },
            
            async checkAnswer() {
              const answerVal = this.answer || this.selectedAnswer;
              if (!answerVal) return;
              
              const response = await fetch('/api/exercise/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  instanceId: window.exerciseData.instanceId,
                  exerciseId: window.exerciseData.exerciseId,
                  answer: answerVal
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
